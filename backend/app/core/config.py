"""Application configuration using pydantic-settings."""

from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # App
    APP_ENV: Literal["development", "test", "staging", "production"] = "development"
    APP_VERSION: str = "0.0.1"
    APP_SECRET_KEY: str = Field(default="caddystats-local-app-secret-not-for-production")

    # API
    API_HOST: str = "0.0.0.0"  # noqa: S104
    API_PORT: int = 8000
    API_WORKERS: int = 1

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://caddystats:caddystats@postgres:5432/caddystats"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # JWT
    JWT_SECRET_KEY: str = Field(default="caddystats-local-jwt-secret-not-for-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:80"]

    # Logging
    LOG_LEVEL: str = "INFO"

    # Feature flags
    FEATURE_AI_ENABLED: bool = False
    FEATURE_BETTING_ENABLED: bool = False
    FEATURE_SUBSCRIPTIONS_ENABLED: bool = False

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        """Allow comma-separated string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v


settings = Settings()
