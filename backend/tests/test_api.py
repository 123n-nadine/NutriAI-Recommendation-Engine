import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from api.main import app
from mock_user_contexts import mock_user_contexts

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_mock_recommendations():
    response = client.get("/recommendations?user_index=0&top_n=5")
    assert response.status_code == 200
    data = response.json()
    assert data["user_index"] == 0
    assert data["top_n"] == 5
    assert len(data["recommendations"]) <= 5

def test_get_mock_recommendations_invalid_index():
    response = client.get("/recommendations?user_index=99")
    assert response.status_code == 404

def test_post_recommendations():
    ctx = mock_user_contexts[0]
    response = client.post("/recommendations?top_n=3", json=ctx)
    assert response.status_code == 200
    data = response.json()
    assert data["goal"] == ctx["goal"]
    assert data["top_n"] == 3
    assert len(data["recommendations"]) <= 3

def test_post_recommendations_invalid_body():
    ctx = mock_user_contexts[0].copy()
    del ctx["calorie_target"]
    response = client.post("/recommendations?top_n=3", json=ctx)
    assert response.status_code == 422
