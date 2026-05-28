"""
Tests for the Recommendation Service.

Run:
    pytest tests/test_recommendation_service.py -v
"""

from __future__ import annotations

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from pydantic import ValidationError

from mock_user_contexts import mock_user_contexts
from app.services.recommendation_service import get_recommendations
from app.schemas import UserContextRequest, RecommendationResponse

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _ctx_by_goal(goal: str) -> UserContextRequest:
    for ctx in mock_user_contexts:
        if ctx["goal"] == goal:
            return UserContextRequest(**ctx)
    raise ValueError(f"No mock user with goal={goal}")


def _ctx_by_condition(condition: str) -> UserContextRequest:
    for ctx in mock_user_contexts:
        if condition in ctx.get("conditions", []):
            return UserContextRequest(**ctx)
    raise ValueError(f"No mock user with condition={condition}")


def _ctx_by_preference(pref: str) -> UserContextRequest:
    for ctx in mock_user_contexts:
        if pref in ctx.get("preferences", []):
            return UserContextRequest(**ctx)
    raise ValueError(f"No mock user with preference={pref}")


# ---------------------------------------------------------------------------
# Basic contract tests
# ---------------------------------------------------------------------------

class TestBasicContract:
    def test_returns_list(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx)
        assert isinstance(result, list)

    def test_returns_at_most_top_n(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx, top_n=5)
        assert len(result) <= 5

    def test_output_keys_present(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx, top_n=3)
        for rec in result:
            assert isinstance(rec, RecommendationResponse)

    def test_ranks_are_sequential(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx, top_n=5)
        ranks = [r.rank for r in result]
        assert ranks == list(range(1, len(ranks) + 1))

    def test_scores_descending(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx, top_n=10)
        scores = [r.score for r in result]
        assert scores == sorted(scores, reverse=True)

    def test_scores_between_0_and_1(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx, top_n=10)
        for rec in result:
            assert 0.0 <= rec.score <= 1.0, f"Score out of range: {rec.score}"

    def test_nutrition_snapshot_non_negative(self):
        ctx = UserContextRequest(**mock_user_contexts[0])
        result = get_recommendations(ctx, top_n=10)
        for rec in result:
            ns = rec.nutrition_snapshot
            assert ns.calories >= 0
            assert ns.protein_g >= 0
            assert ns.carbs_g >= 0
            assert ns.fat_g >= 0


# ---------------------------------------------------------------------------
# Dietary restriction tests
# ---------------------------------------------------------------------------

class TestDietaryFilters:

    SUGARY_KEYWORDS = (
        "cola", "soda", "donut", "doughnut", "candy", "chocolate",
        "cake", "cookie", "syrup", "ice cream", "sweet", "glazed",
        "sugary", "dessert", "latte",
    )

    MEAT_KEYWORDS = (
        "chicken", "beef", "pork", "turkey", "lamb", "duck", "venison",
        "fish", "salmon", "tuna", "prawn", "lobster", "crab", "seafood",
        "squid", "mussel", "oyster", "scallop", "anchovy", "liver",
        "kofta", "sausage", "ham", "bacon",
    )

    DAIRY_EGG_KEYWORDS = (
        "milk", "cheese", "yogurt", "butter", "cream", "egg", "whey",
        "cottage cheese", "kefir",
    )

    def test_diabetes_no_sugary_foods(self):
        ctx = _ctx_by_condition("type2_diabetes")
        results = get_recommendations(ctx, top_n=50)
        for rec in results:
            name_lower = rec.food_name.lower()
            for kw in self.SUGARY_KEYWORDS:
                assert kw not in name_lower, (
                    f"Sugary food slipped through for diabetic user: {rec.food_name}"
                )

    def test_vegan_no_meat(self):
        ctx = _ctx_by_preference("vegan")
        results = get_recommendations(ctx, top_n=50)
        for rec in results:
            name_lower = rec.food_name.lower()
            for kw in self.MEAT_KEYWORDS:
                assert kw not in name_lower, (
                    f"Meat food slipped through for vegan user: {rec.food_name}"
                )

    def test_vegan_no_dairy(self):
        ctx = _ctx_by_preference("vegan")
        results = get_recommendations(ctx, top_n=50)
        for rec in results:
            name_lower = rec.food_name.lower()
            for kw in ("cheddar", "butter", "kefir", "whey"):
                assert kw not in name_lower, (
                    f"Dairy food slipped through for vegan user: {rec.food_name}"
                )

    def test_hypertension_no_fast_food(self):
        ctx = _ctx_by_condition("hypertension")
        results = get_recommendations(ctx, top_n=50)
        for rec in results:
            name_lower = rec.food_name.lower()
            for kw in ("ramen", "instant noodle", "big mac", "burger king"):
                assert kw not in name_lower, (
                    f"High-sodium fast food slipped through: {rec.food_name}"
                )


# ---------------------------------------------------------------------------
# Goal alignment tests
# ---------------------------------------------------------------------------

class TestGoalAlignment:

    def test_muscle_gain_top_result_is_high_protein(self):
        ctx = _ctx_by_goal("muscle_gain")
        results = get_recommendations(ctx, top_n=10)
        assert results, "Expected at least one recommendation"
        top_protein = results[0].nutrition_snapshot.protein_g
        # Top recommendation should have meaningful protein
        assert top_protein >= 10, (
            f"Top recommendation for muscle_gain has low protein: {top_protein}g"
        )

    def test_muscle_gain_top3_avg_protein_higher_than_bottom3(self):
        ctx = _ctx_by_goal("muscle_gain")
        results = get_recommendations(ctx, top_n=10)
        if len(results) < 6:
            pytest.skip("Not enough results to compare top 3 vs bottom 3")
        top3_avg = sum(r.nutrition_snapshot.protein_g for r in results[:3]) / 3
        bot3_avg = sum(r.nutrition_snapshot.protein_g for r in results[-3:]) / 3
        assert top3_avg >= bot3_avg, (
            f"Top-3 avg protein ({top3_avg:.1f}g) should be ≥ bottom-3 avg ({bot3_avg:.1f}g)"
        )

    def test_weight_loss_top_result_is_reasonable_calories(self):
        ctx = _ctx_by_condition("obesity")
        results = get_recommendations(ctx, top_n=10)
        assert results, "Expected at least one recommendation"
        top_cal = results[0].nutrition_snapshot.calories
        assert top_cal <= 400, (
            f"Top weight-loss recommendation is too high in calories: {top_cal}"
        )


# ---------------------------------------------------------------------------
# Input validation tests
# ---------------------------------------------------------------------------

class TestValidation:

    def test_missing_required_key_raises(self):
        ctx = {k: v for k, v in mock_user_contexts[0].items() if k != "calorie_target"}
        with pytest.raises(ValidationError):
            UserContextRequest(**ctx)

    def test_empty_candidate_foods_falls_back_to_global(self):
        """Empty list is falsy → service falls back to global candidate pool."""
        ctx = {**mock_user_contexts[0], "candidate_foods": []}
        req = UserContextRequest(**ctx)
        result = get_recommendations(req)
        # Should still return results from the global candidate_foods list
        assert isinstance(result, list)
        assert len(result) > 0

    def test_all_filtered_returns_empty(self):
        """If all candidates are filtered, return empty gracefully."""
        ctx = {
            **mock_user_contexts[0],
            "candidate_foods": [
                {"id": 999, "name": "Glazed Donut", "calories": 300,
                 "protein_g": 3, "carbs_g": 40, "fat_g": 15,
                 "category": "sugary_drinks"},
            ],
            "conditions": ["type2_diabetes"],
        }
        req = UserContextRequest(**ctx)
        result = get_recommendations(req)
        assert result == []
