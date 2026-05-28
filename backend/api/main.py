"""
FastAPI — AI Nutrition Recommendation API

Run:
    uvicorn api.main:app --reload
"""

from __future__ import annotations

import sys
import os

_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from typing import Any, Optional

from mock_user_contexts import mock_user_contexts
from app.services.recommendation_service import get_recommendations
from app.schemas import UserContextRequest, RecommendationResponse

app = FastAPI(
    title="AI Nutrition Recommendation API",
    description="Returns personalised food recommendations based on user nutritional context.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models are now imported from app.schemas

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
def read_root():
    """Redirect to API documentation."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["System"])
def health_check() -> dict:
    """Returns API health status."""
    return {"status": "ok"}


@app.get("/recommendations", tags=["Recommendations"])
async def get_mock_recommendations(
    user_index: int = Query(default=0, ge=0, description="Index into mock_user_contexts (0–4)"),
    top_n: int = Query(default=50, ge=1, le=100, description="Maximum recommendations (performance cap)"),
) -> dict:
    """
    Returns recommendations for a pre-built mock user context.

    - **user_index**: 0–4 (selects from mock_user_contexts)
    """
    if user_index >= len(mock_user_contexts):
        raise HTTPException(
            status_code=404,
            detail=f"user_index {user_index} is out of range. "
                   f"Valid range: 0–{len(mock_user_contexts) - 1}.",
        )
    ctx_dict = mock_user_contexts[user_index]
    ctx = UserContextRequest(**ctx_dict)
    try:
        results = await run_in_threadpool(get_recommendations, ctx)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "user_index": user_index,
        "goal": ctx.goal,
        "conditions": ctx.conditions,
        "preferences": ctx.preferences,
        "recommendations": [r.model_dump() for r in results],
    }


@app.post("/recommendations", tags=["Recommendations"])
async def post_recommendations(
    body: UserContextRequest,
) -> dict:
    """
    Returns recommendations for a custom user context supplied in the request body.
    """
    try:
        results = await run_in_threadpool(get_recommendations, body)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "goal": body.goal,
        "conditions": body.conditions,
        "preferences": body.preferences,
        "recommendations": [r.model_dump() for r in results],
    }
