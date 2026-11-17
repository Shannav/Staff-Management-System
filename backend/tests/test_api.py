import asyncio

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from retailvision.api.main import app
from retailvision.core.config import Settings, get_settings
from retailvision.core.security import Principal, require_roles

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_login_requires_configured_bootstrap_credentials() -> None:
    settings = get_settings()
    if settings.bootstrap_admin_email and settings.bootstrap_admin_password:
        response = client.post(
            "/api/v1/auth/token",
            json={"email": "wrong@example.com", "password": "wrong"},
        )
        assert response.status_code == 401
    else:
        response = client.post(
            "/api/v1/auth/token",
            json={"email": "admin@example.com", "password": "anything"},
        )
        assert response.status_code == 401


def test_me_requires_bearer_token() -> None:
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_bootstrap_login_issues_usable_token(monkeypatch: pytest.MonkeyPatch) -> None:
    settings = Settings(
        app_secret_key="test-signing-key-with-at-least-32-characters",
        bootstrap_admin_email="admin@example.com",
        bootstrap_admin_password="test-password",
    )
    monkeypatch.setattr("retailvision.core.security.get_settings", lambda: settings)

    response = client.post(
        "/api/v1/auth/token",
        json={"email": "admin@example.com", "password": "test-password"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]

    profile = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert profile.status_code == 200
    assert profile.json() == {"email": "admin@example.com", "role": "Admin"}


def test_role_guard_rejects_viewer_from_admin_action() -> None:
    guard = require_roles("Admin")
    viewer = Principal(subject="viewer@example.com", role="Viewer")

    with pytest.raises(HTTPException) as error:
        asyncio.run(guard(viewer))
    assert error.value.status_code == 403


def test_production_requires_configured_signing_secret() -> None:
    with pytest.raises(ValueError, match="APP_SECRET_KEY must be configured"):
        Settings(app_env="production")
