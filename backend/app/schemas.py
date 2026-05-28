from pydantic import BaseModel, Field
from typing import Any, Optional


class MacroDict(BaseModel):
    protein_g: float
    carbs_g: float
    fat_g: float


class UserContextRequest(BaseModel):
    calorie_target: float
    calories_consumed_today: float
    macro_targets: MacroDict
    macros_consumed_today: MacroDict
    goal: str = Field(..., examples=["muscle_gain", "weight_loss", "maintenance"])
    conditions: list[str] = Field(default_factory=list)
    preferences: list[str] = Field(default_factory=list)
    candidate_foods: Optional[list[dict[str, Any]]] = None


class NutritionSnapshot(BaseModel):
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float


class ScoreBreakdown(BaseModel):
    calorie_fit_score: float
    protein_score: float
    macro_balance_score: float
    goal_alignment_score: float
    preference_match_score: Optional[float] = None


class RecommendationResponse(BaseModel):
    food_id: int
    food_name: str
    category: Optional[str] = None
    score: float
    rank: int
    explanation: str
    nutrition_snapshot: NutritionSnapshot
    score_breakdown: ScoreBreakdown
    flags: list[str]
