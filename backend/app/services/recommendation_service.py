"""
Recommendation Service — Core module.

Entry point: get_recommendations(user_context)
"""

from __future__ import annotations

import sys
import os
import logging

logger = logging.getLogger(__name__)

# Allow imports from the project root regardless of working directory
_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from app.data.candidate_foods import candidate_foods as _GLOBAL_CANDIDATE_FOODS
from app.services.recommendation_helpers import (
    filter_unsafe_foods,
    score_food,
    generate_flags,
    generate_explanation,
)
from app.schemas import UserContextRequest, RecommendationResponse, NutritionSnapshot, ScoreBreakdown


def get_recommendations(user_context: UserContextRequest) -> list[RecommendationResponse]:
    """
    Generate ranked food recommendations for a given user context.

    Parameters
    ----------
    user_context : dict
        Must contain:
            - calorie_target (int/float)
            - calories_consumed_today (int/float)
            - macro_targets (dict: protein_g, carbs_g, fat_g)
            - macros_consumed_today (dict: protein_g, carbs_g, fat_g)
            - goal (str): "muscle_gain" | "weight_loss" | "maintenance"
            - conditions (list[str])
            - preferences (list[str])
            - candidate_foods (list[dict], optional – falls back to global list)

    Returns
    -------
    list[dict]
        Ranked recommendation objects, each structured as:
        {
            "food_id": int,
            "food_name": str,
            "score": float,
            "rank": int,
            "explanation": str,
            "nutrition_snapshot": {
                "calories": float,
                "protein_g": float,
                "carbs_g": float,
                "fat_g": float,
            },
            "flags": list[str],
        }

    Raises
    ------
    ValueError
        If user_context is missing required keys or contains invalid types.
    """
    # Step 1: resolve candidate pool
    candidate_pool: list[dict] = user_context.candidate_foods or _GLOBAL_CANDIDATE_FOODS
    if not candidate_pool:
        return []

    # Step 2: filter unsafe / incompatible foods
    safe_foods = filter_unsafe_foods(candidate_pool, user_context)

    if not safe_foods:
        return []

    # Step 3 + 4: score each food and generate explanation
    scored: list[tuple[float, dict, dict]] = []
    MIN_SCORE_THRESHOLD = 0.75  # Minimum 75% match quality to prevent hallucinations

    for food in safe_foods:
        try:
            composite, breakdown = score_food(food, user_context)
            if composite >= MIN_SCORE_THRESHOLD:
                flags = generate_flags(food, user_context)
                explanation = generate_explanation(food, breakdown, user_context)
                scored.append((composite, food, breakdown, flags, explanation))  # type: ignore[arg-type]
        except Exception as exc:
            logger.warning("Error scoring food %s: %s", food.get("name"), exc, exc_info=True)
            continue

    # Sort descending by composite score
    scored.sort(key=lambda x: x[0], reverse=True)

    # Step 5: build output objects
    recommendations: list[RecommendationResponse] = []
    for rank, (composite, food, breakdown, flags, explanation) in enumerate(
        scored, start=1
    ):
        recommendations.append(RecommendationResponse(
            food_id=food.get("id"),
            food_name=food.get("name"),
            category=food.get("category", ""),
            score=composite,
            rank=rank,
            explanation=explanation,
            nutrition_snapshot=NutritionSnapshot(
                calories=float(food.get("calories", 0)),
                protein_g=float(food.get("protein_g", 0)),
                carbs_g=float(food.get("carbs_g", 0)),
                fat_g=float(food.get("fat_g", 0)),
            ),
            score_breakdown=ScoreBreakdown(**breakdown),
            flags=flags,
        ))

    return recommendations


