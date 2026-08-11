"""Configuration module for SQLAlchemy Overview Demo."""

import os
from dataclasses import dataclass, field


@dataclass
class DatabaseConfig:
  """Database configuration."""

  # PostgreSQL URLs
  postgres_async_url: str = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://demo_user:demo_password@localhost:5432/sqlalchemy_demo",
  )
  postgres_sync_url: str = os.getenv(
    "DATABASE_SYNC_URL",
    "postgresql+psycopg2://demo_user:demo_password@localhost:5432/sqlalchemy_demo",
  )

  # Connection Pool Settings
  pool_size: int = int(os.getenv("POSTGRES_POOL_SIZE", "5"))
  max_overflow: int = int(os.getenv("POSTGRES_MAX_OVERFLOW", "10"))
  pool_timeout: int = int(os.getenv("POSTGRES_POOL_TIMEOUT", "30"))
  pool_recycle: int = int(os.getenv("POSTGRES_POOL_RECYCLE", "3600"))

  # Async Pool Settings
  async_pool_size: int = int(os.getenv("ASYNC_POOL_SIZE", "20"))
  async_max_overflow: int = int(os.getenv("ASYNC_MAX_OVERFLOW", "0"))


@dataclass
class AppConfig:
  """Application configuration."""

  log_level: str = os.getenv("LOG_LEVEL", "INFO")
  debug: bool = os.getenv("DEBUG", "false").lower() == "true"

  # Database config
  database: DatabaseConfig = field(default_factory=DatabaseConfig)


# Global config instance
config = AppConfig()
