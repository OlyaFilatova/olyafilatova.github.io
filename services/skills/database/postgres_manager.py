"""Database connection management for PostgreSQL and MongoDB."""

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy import Engine, create_engine
from sqlalchemy.ext.asyncio import (
  AsyncEngine,
  AsyncSession,
  async_sessionmaker,
  create_async_engine,
)
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import QueuePool

from ..config import config

logger = logging.getLogger(__name__)


class PostgreSQLManager:
  """Manages PostgreSQL connections using SQLAlchemy."""

  def __init__(self) -> None:
    self._sync_engine: Engine | None = None
    self._async_engine: AsyncEngine | None = None
    self._sync_session_factory: sessionmaker[Session] | None = None
    self._async_session_factory: async_sessionmaker[AsyncSession] | None = None

  @property
  def sync_engine(self) -> Engine:
    """Get synchronous PostgreSQL engine."""
    if self._sync_engine is None:
      self._sync_engine = create_engine(
        config.database.postgres_sync_url,
        poolclass=QueuePool,
        pool_size=config.database.pool_size,
        max_overflow=config.database.max_overflow,
        pool_timeout=config.database.pool_timeout,
        pool_recycle=config.database.pool_recycle,
        echo=config.debug,
      )
    return self._sync_engine

  @property
  def async_engine(self) -> AsyncEngine:
    """Get asynchronous PostgreSQL engine."""
    if self._async_engine is None:
      self._async_engine = create_async_engine(
        config.database.postgres_async_url,
        pool_size=config.database.async_pool_size,
        max_overflow=config.database.async_max_overflow,
        pool_timeout=config.database.pool_timeout,
        pool_recycle=config.database.pool_recycle,
        echo=config.debug,
      )
    return self._async_engine

  @property
  def sync_session_factory(self) -> sessionmaker[Session]:
    """Get synchronous session factory."""
    if self._sync_session_factory is None:
      self._sync_session_factory = sessionmaker(
        bind=self.sync_engine,
        autocommit=False,
        autoflush=False,
      )
    return self._sync_session_factory

  @property
  def async_session_factory(self) -> async_sessionmaker[AsyncSession]:
    """Get asynchronous session factory."""
    if self._async_session_factory is None:
      self._async_session_factory = async_sessionmaker(
        bind=self.async_engine,
        class_=AsyncSession,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
      )
    return self._async_session_factory

  @asynccontextmanager
  async def get_async_session(self) -> AsyncGenerator[AsyncSession]:
    """Get async session context manager."""
    async with self.async_session_factory() as session:
      try:
        yield session
        await session.commit()
      except Exception:
        await session.rollback()
        raise
      finally:
        await session.close()

  def get_sync_session(self) -> Session:
    """Get synchronous session."""
    return self.sync_session_factory()

  async def close(self) -> None:
    """Close all connections."""
    if self._async_engine:
      await self._async_engine.dispose()
    if self._sync_engine:
      self._sync_engine.dispose()


# Global instances
postgresql_manager = PostgreSQLManager()
