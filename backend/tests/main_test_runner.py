"""
Main Test Runner

Runs get_recommendations on 3 mock users and prints results clearly.

Usage:
    python main_test_runner.py
"""

from __future__ import annotations

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mock_user_contexts import mock_user_contexts
from app.services.recommendation_service import get_recommendations
from app.schemas import UserContextRequest, RecommendationResponse

# ---------------------------------------------------------------------------
# Select 3 representative users
# ---------------------------------------------------------------------------

DEMO_INDICES = [0, 1, 2]  # muscle_gain | weight_loss (obesity) | maintenance (diabetes)

SEP = "=" * 72


def _print_user_summary(ctx: dict, index: int) -> None:
    print(f"\n{'-'*72}")
    print(f"  USER {index + 1}  |  Goal: {ctx['goal'].upper()}")
    print(f"  Conditions : {ctx.get('conditions') or ['None']}")
    print(f"  Preferences: {ctx.get('preferences') or ['None']}")
    remaining = ctx["calorie_target"] - ctx["calories_consumed_today"]
    print(f"  Calories   : {ctx['calories_consumed_today']} consumed / {ctx['calorie_target']} target  ({remaining} remaining)")
    print(f"{'-'*72}")


def _print_recommendation(rec: RecommendationResponse) -> None:
    ns = rec.nutrition_snapshot
    flags = ", ".join(rec.flags) if rec.flags else "-"
    print(
        f"  #{rec.rank:>2}  [{rec.score:.3f}]  {rec.food_name}\n"
        f"       kcal:{ns.calories:.0f}  protein:{ns.protein_g:.1f}g  "
        f"carbs:{ns.carbs_g:.1f}g  fat:{ns.fat_g:.1f}g\n"
        f"       Flags : {flags}\n"
        f"       Why   : {rec.explanation}\n"
    )


def main() -> None:
    print(f"\n{SEP}")
    print("  AI NUTRITION RECOMMENDATION SYSTEM - DEMO TEST RUNNER")
    print(f"{SEP}")

    for idx in DEMO_INDICES:
        ctx = mock_user_contexts[idx]
        _print_user_summary(ctx, idx)

        req = UserContextRequest(**ctx)
        try:
            recs = get_recommendations(req, top_n=5)
        except Exception as exc:
            print(f"  ERROR: {exc}\n")
            continue

        if not recs:
            print("  No recommendations generated (all foods filtered).\n")
            continue

        print(f"  Top {len(recs)} Recommendations:\n")
        for rec in recs:
            _print_recommendation(rec)

    print(f"{SEP}\n  Done.\n{SEP}\n")


if __name__ == "__main__":
    main()
