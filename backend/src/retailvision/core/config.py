import secrets
from functools import lru_cache
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: Literal["development", "test", "production"] = "development"
    app_secret_key: str | None = None
    bootstrap_admin_email: str | None = None
    bootstrap_admin_password: str | None = None
    database_url: str = "postgresql+psycopg://retailvision@localhost:5432/retailvision"
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: str = "http://localhost:5173"
    access_token_minutes: int = Field(default=30, gt=0, le=1440)

    @model_validator(mode="after")
    def validate_signing_configuration(self) -> "Settings":
        if self.app_env == "production" and not self.app_secret_key:
            raise ValueError("APP_SECRET_KEY must be configured in production.")
        if self.app_secret_key and len(self.app_secret_key) < 32:
            raise ValueError("APP_SECRET_KEY must contain at least 32 characters.")
        return self

    @property
    def signing_key(self) -> str:
        if self.app_secret_key:
            return self.app_secret_key
        return _development_signing_key()

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def _development_signing_key() -> str:
    return secrets.token_urlsafe(48)


@lru_cache
def get_settings() -> Settings:
    return Settings()
