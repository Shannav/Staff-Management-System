import secrets
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any, Literal

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from retailvision.core.config import get_settings

ALGORITHM = "HS256"
bearer_scheme = HTTPBearer(auto_error=False)


class Principal(BaseModel):
    subject: str
    role: Literal["Admin", "Manager", "Viewer"]


def verify_bootstrap_password(email: str, password: str) -> bool:
    settings = get_settings()
    if not settings.bootstrap_admin_email or not settings.bootstrap_admin_password:
        return False
    return secrets.compare_digest(email.casefold(), settings.bootstrap_admin_email.casefold()) and (
        secrets.compare_digest(password, settings.bootstrap_admin_password)
    )


def create_access_token(subject: str, role: str) -> str:
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "role": role,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_minutes),
    }
    return jwt.encode(payload, settings.signing_key, algorithm=ALGORITHM)


async def get_current_principal(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> Principal:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(
            credentials.credentials,
            get_settings().signing_key,
            algorithms=[ALGORITHM],
        )
        subject = payload.get("sub")
        role = payload.get("role")
        if not isinstance(subject, str) or role not in {"Admin", "Manager", "Viewer"}:
            raise ValueError("Invalid token claims")
        return Principal(subject=subject, role=role)
    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        ) from None


def require_roles(
    *roles: str,
) -> Callable[..., Coroutine[Any, Any, Principal]]:
    async def dependency(
        principal: Annotated[Principal, Depends(get_current_principal)],
    ) -> Principal:
        if principal.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return principal

    return dependency
