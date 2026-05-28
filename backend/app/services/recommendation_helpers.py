"""
Helpers for the Recommendation Engine.
Handles food filtering, scoring sub-components, flag generation, and explanation generation.
"""

from __future__ import annotations
from typing import Any

from app.schemas import UserContextRequest
from app.constants import (
    MEAT_CATEGORIES,
    DAIRY_EGG_CATEGORIES,
    SUGARY_CATEGORIES,
    HIGH_SODIUM_CATEGORIES,
    GLUTEN_CATEGORIES,
    MEAT_KEYWORDS,
)


def _name_contains_meat(name: str) -> bool:
    lower = name.lower()
    return any(kw in lower for kw in MEAT_KEYWORDS)


# ---------------------------------------------------------------------------
# Public: filter_unsafe_foods
# ---------------------------------------------------------------------------

def filter_unsafe_foods(foods: list[dict], user_context: UserContextRequest) -> list[dict]:
    """
    Remove foods that are unsafe or incompatible with the user's conditions
    and dietary preferences.

    Parameters
    ----------
    foods : list[dict]
        Full candidate food list.
    user_context : UserContextRequest
        User profile containing ``conditions`` and ``preferences`` lists.

    Returns
    -------
    list[dict]
        Filtered list of safe foods.
    """
    conditions: list[str] = [c.lower() for c in user_context.conditions]
    preferences: list[str] = [p.lower() for p in user_context.preferences]

    is_diabetic = "type2_diabetes" in conditions or "diabetes" in conditions
    is_hypertensive = "hypertension" in conditions
    is_celiac = "celiac" in conditions
    is_vegan = "vegan" in preferences
    is_vegetarian = "vegetarian" in preferences
    is_gluten_free = "gluten_free" in preferences or is_celiac

    result: list[dict] = []
    for food in foods:
        cat = food.get("category", "").lower()
        name = food.get("name", "")

        # --- Diabetes ---
        if is_diabetic:
            if cat in SUGARY_CATEGORIES or _is_sugary_by_name(name):
                continue

        # --- Hypertension ---
        if is_hypertensive:
            if cat in HIGH_SODIUM_CATEGORIES or _is_high_sodium_by_name(name):
                continue

        # --- Celiac / gluten-free ---
        if is_gluten_free:
            if cat in GLUTEN_CATEGORIES or _contains_gluten_by_name(name):
                continue

        # --- Vegetarian and Vegan Shared (No Meat) ---
        if is_vegan or is_vegetarian:
            # Reject if category is explicitly meat (but allow specialty dishes to be checked by name)
            if cat in MEAT_CATEGORIES and cat != "specialty_dish":
                continue
            
            # Reject if the name contains any meat/seafood keywords (catches ultra_processed meat, snacks, etc)
            if _name_contains_meat(name):
                continue

        # --- Vegan Strict (No Dairy/Eggs) ---
        if is_vegan:
            if cat in DAIRY_EGG_CATEGORIES:
                continue
            if _is_dairy_or_egg_by_name(name):
                continue

        result.append(food)

    return result

def _is_dairy_or_egg_by_name(name: str) -> bool:
    keywords = ("milk", "cheese", "dairy", "yogurt", "butter", "ghee", "egg", "omelet", "whey", "casein", "cream", "gelatin")
    lower = name.lower()
    return any(k in lower for k in keywords)


def _is_sugary_by_name(name: str) -> bool:
    keywords = ("cola", "soda", "donut", "doughnut", "candy", "chocolate",
                 "cake", "cookie", "biscuit", "syrup", "ice cream", "latte",
                 "smoothie", "juice", "sweet", "glazed", "dessert")
    lower = name.lower()
    return any(k in lower for k in keywords)


def _is_high_sodium_by_name(name: str) -> bool:
    keywords = ("ramen", "instant noodle", "pretzel", "pickle", "soy sauce",
                 "processed", "salted", "smoked", "pepperoni", "deli", "bacon",
                 "ham", "hot dog", "sausage", "canned soup")
    lower = name.lower()
    return any(k in lower for k in keywords)


def _contains_gluten_by_name(name: str) -> bool:
    keywords = ("bread", "pasta", "noodle", "flour", "wheat", "barley",
                 "rye", "sourdough", "pita", "wrap", "tortilla", "cracker",
                 "biscuit", "cake", "cookie", "ramen", "couscous")
    lower = name.lower()
    return any(k in lower for k in keywords)


# ---------------------------------------------------------------------------
# Public: score_food
# ---------------------------------------------------------------------------

def score_food(food: dict, user_context: UserContextRequest) -> tuple[float, dict[str, float]]:
    """
    Score a food item against the user's remaining nutritional needs.

    Returns
    -------
    tuple[float, dict]
        (composite_score, breakdown) where composite_score ∈ [0, 1]
        and breakdown contains each sub-score.
    """
    calorie_target: float = float(user_context.calorie_target)
    calories_consumed: float = float(user_context.calories_consumed_today)
    macro_targets = user_context.macro_targets
    macros_consumed = user_context.macros_consumed_today
    goal: str = user_context.goal.lower()

    remaining_calories = max(calorie_target - calories_consumed, 0)

    protein_target_left = max(
        float(macro_targets.protein_g) - float(macros_consumed.protein_g), 0
    )
    carbs_target_left = max(
        float(macro_targets.carbs_g) - float(macros_consumed.carbs_g), 0
    )
    fat_target_left = max(
        float(macro_targets.fat_g) - float(macros_consumed.fat_g), 0
    )

    food_calories: float = float(food.get("calories", 0))
    food_protein: float = float(food.get("protein_g", 0))
    food_carbs: float = float(food.get("carbs_g", 0))
    food_fat: float = float(food.get("fat_g", 0))

    # ── 1. Calorie fit score ─────────────────────────────────────────────
    if remaining_calories <= 0:
        calorie_fit_score = max(0.0, 1.0 - food_calories / 200.0)
    else:
        ratio = food_calories / remaining_calories
        # Ideal ratio window: 0.10 – 0.40 of remaining calories
        if 0.10 <= ratio <= 0.40:
            calorie_fit_score = 1.0
        elif ratio < 0.10:
            calorie_fit_score = ratio / 0.10
        else:
            calorie_fit_score = max(0.0, 1.0 - (ratio - 0.40) / 0.60)

    # ── 2. Protein score ─────────────────────────────────────────────────
    if protein_target_left <= 0:
        protein_score = max(0.0, 1.0 - food_protein / 30.0)
    else:
        protein_ratio = food_protein / protein_target_left
        if 0.10 <= protein_ratio <= 0.60:
            protein_score = 1.0
        elif protein_ratio < 0.10:
            protein_score = protein_ratio / 0.10
        else:
            protein_score = max(0.0, 1.0 - (protein_ratio - 0.60) / 0.40)

    # ── 3. Macro balance score ───────────────────────────────────────────
    macro_scores: list[float] = []
    for food_val, target_left in (
        (food_carbs, carbs_target_left),
        (food_fat, fat_target_left),
    ):
        if target_left <= 0:
            macro_scores.append(max(0.0, 1.0 - food_val / 50.0))
        else:
            r = food_val / target_left
            if r <= 0.50:
                macro_scores.append(1.0)
            else:
                macro_scores.append(max(0.0, 1.0 - (r - 0.50) / 0.50))

    macro_balance_score = sum(macro_scores) / len(macro_scores)

    # ── 4. Goal alignment score ──────────────────────────────────────────
    goal_alignment_score = _goal_alignment(food, goal)

    # ── 5. Preference match score ────────────────────────────────────────
    preference_match_score = _preference_match(food, user_context.preferences)

    # ── Weighted composite ───────────────────────────────────────────────
    weights = {
        "calorie_fit": 0.25,
        "protein": 0.25,
        "macro_balance": 0.20,
        "goal_alignment": 0.15,
        "preference_match": 0.15,
    }

    composite = (
        weights["calorie_fit"] * calorie_fit_score
        + weights["protein"] * protein_score
        + weights["macro_balance"] * macro_balance_score
        + weights["goal_alignment"] * goal_alignment_score
        + weights["preference_match"] * preference_match_score
    )

    breakdown = {
        "calorie_fit_score": round(calorie_fit_score, 4),
        "protein_score": round(protein_score, 4),
        "macro_balance_score": round(macro_balance_score, 4),
        "goal_alignment_score": round(goal_alignment_score, 4),
        "preference_match_score": round(preference_match_score, 4),
    }

    return round(composite, 4), breakdown


def _goal_alignment(food: dict, goal: str) -> float:
    cat = food.get("category", "").lower()
    protein = float(food.get("protein_g", 0))
    calories = float(food.get("calories", 1))
    carbs = float(food.get("carbs_g", 0))
    fat = float(food.get("fat_g", 0))
    protein_density = protein / max(calories, 1) * 100  # g protein per 100 kcal

    if goal == "muscle_gain":
        # Prefer high protein density, penalise fast food / snacks
        if cat in ("fast_food", "sugary_drinks", "ultra_processed"):
            return 0.2
        if protein_density >= 20:
            return 1.0
        if protein_density >= 10:
            return 0.7
        return 0.4

    elif goal == "weight_loss":
        # Prefer low calorie, high volume / fibre
        if cat in ("fast_food", "sugary_drinks", "ultra_processed", "snacks"):
            return 0.1
        if calories <= 100:
            return 1.0
        if calories <= 200:
            return 0.7
        return 0.4

    elif goal == "maintenance":
        # Balanced; penalise extremes
        if cat in ("fast_food", "sugary_drinks"):
            return 0.2
        if 100 <= calories <= 300:
            return 1.0
        return 0.6

    return 0.5  # default


def _preference_match(food: dict, preferences: list[str]) -> float:
    if not preferences:
        return 0.5  # Neutral

    score = 0.0
    matches = 0
    cat = food.get("category", "").lower()
    protein = float(food.get("protein_g", 0))
    calories = float(food.get("calories", 1))
    carbs = float(food.get("carbs_g", 0))
    fat = float(food.get("fat_g", 0))

    for pref in preferences:
        p = pref.lower()
        if p == "high_protein" and (protein / max(calories, 1) * 100 >= 20):
            matches += 1
        elif p == "low_calorie" and calories <= 150:
            matches += 1
        elif p == "low_carb" and carbs <= 10:
            matches += 1
        elif p == "low_fat" and fat <= 5:
            matches += 1
        elif p == "high_fiber" and cat in ("vegetables", "fruits", "carbs_legumes", "carbs_grains"):
             matches += 1
        elif p in ("vegan", "vegetarian", "gluten_free", "low_sodium", "low_sugar", "low_glycemic", "meal_prep_friendly"):
             matches += 1

    if len(preferences) > 0:
        return min(1.0, 0.5 + (matches / len(preferences)) * 0.5)
    return 0.5


# ---------------------------------------------------------------------------
# Public: generate_flags
# ---------------------------------------------------------------------------

def generate_flags(food: dict, user_context: UserContextRequest) -> list[str]:
    """Return a list of descriptive flags for a food item."""
    flags: list[str] = []
    cat = food.get("category", "").lower()
    protein = float(food.get("protein_g", 0))
    calories = float(food.get("calories", 1))
    carbs = float(food.get("carbs_g", 0))
    fat = float(food.get("fat_g", 0))
    goal = user_context.goal.lower()

    if protein / max(calories, 1) * 100 >= 20:
        flags.append("high_protein")
    if calories <= 100:
        flags.append("low_calorie")
    if carbs <= 5:
        flags.append("low_carb")
    if fat <= 3:
        flags.append("low_fat")
    if cat in ("vegetables", "fruits"):
        flags.append("whole_food")
    if cat in ("fast_food", "ultra_processed", "sugary_drinks"):
        flags.append("limit_recommended")
    if goal == "muscle_gain" and protein >= 20:
        flags.append("muscle_gain_friendly")
    if goal == "weight_loss" and calories <= 150:
        flags.append("weight_loss_friendly")

    return flags


# ---------------------------------------------------------------------------
# Public: generate_explanation
# ---------------------------------------------------------------------------

def generate_explanation(food: dict, breakdown: dict[str, float], user_context: UserContextRequest) -> str:
    """
    Generate a human-readable explanation based on the dominant scoring factor.
    """
    goal: str = user_context.goal.lower()
    food_name: str = food.get("name", "this food")

    # Find the strongest factor (excluding goal_alignment which is always small)
    primary_factors = {
        k: v for k, v in breakdown.items() if k != "goal_alignment_score"
    }
    dominant = max(primary_factors, key=lambda k: primary_factors[k])
    dominant_score = primary_factors[dominant]

    protein = float(food.get("protein_g", 0))
    calories = float(food.get("calories", 0))
    carbs = float(food.get("carbs_g", 0))
    fat = float(food.get("fat_g", 0))

    remaining_calories = max(
        float(user_context.calorie_target)
        - float(user_context.calories_consumed_today),
        0,
    )
    protein_left = max(
        float(user_context.macro_targets.protein_g)
        - float(user_context.macros_consumed_today.protein_g),
        0,
    )

    if dominant == "protein_score" and dominant_score >= 0.7:
        pct = int(protein / max(protein_left, 1) * 100)
        return (
            f"{food_name} provides {protein:.1f}g of protein, covering ~{pct}% "
            f"of your remaining protein target - ideal for your {goal.replace('_', ' ')} goal."
        )

    if dominant == "calorie_fit_score" and dominant_score >= 0.7:
        return (
            f"With {calories:.0f} kcal, {food_name} fits well within your "
            f"remaining {remaining_calories:.0f} kcal budget for today."
        )

    if dominant == "macro_balance_score" and dominant_score >= 0.7:
        return (
            f"{food_name} offers a balanced macro profile "
            f"({protein:.1f}g protein, {carbs:.1f}g carbs, {fat:.1f}g fat) "
            f"that aligns with your remaining targets."
        )

    if dominant == "preference_match_score" and dominant_score >= 0.7:
        prefs_str = ", ".join(user_context.preferences).replace("_", " ")
        return (
            f"{food_name} is an excellent match for your dietary preferences ({prefs_str})."
        )

    # Fallback: composite summary
    goal_label = goal.replace("_", " ").title()
    return (
        f"{food_name} scores well overall for your {goal_label} goal, "
        f"providing {protein:.1f}g protein and {calories:.0f} kcal per serving."
    )
