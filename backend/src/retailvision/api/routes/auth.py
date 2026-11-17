from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from retailvision.core.security import (
    Principal,
    create_access_token,
    get_current_principal,
    verify_bootstrap_password,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


class PrincipalResponse(BaseModel):
    email: str
    role: Literal["Admin", "Manager", "Viewer"]


@router.post("/token", response_model=TokenResponse)
async def login(request: LoginRequest) -> TokenResponse:
    if not verify_bootstrap_password(str(request.email), request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(access_token=create_access_token(str(request.email), "Admin"))


@router.get("/me", response_model=PrincipalResponse)
async def read_current_user(
    principal: Annotated[Principal, Depends(get_current_principal)],
) -> PrincipalResponse:
    return PrincipalResponse(email=principal.subject, role=principal.role)
