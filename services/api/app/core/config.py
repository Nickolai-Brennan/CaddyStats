"""Application configuration using pydantic-settings."""

import secrets
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
    APP_SECRET_KEY: str = Field(default_factory=lambda: secrets.token_urlsafe(32))

    # API
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    API_WORKERS: int = 1

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://caddystats:caddystats@postgres:5432/caddystats"
    DUCKDB_PATH: str = "./data/caddystats.duckdb"
    MOTHERDUCK_TOKEN: str = ""
    MOTHERDUCK_DATABASE: str = "caddystats"
    MOTHERDUCK_URL: str = "md:caddystats"
    PANDAS_QUERY_ROW_LIMIT: int = 5000

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # JWT
    JWT_SECRET_KEY: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
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
