from sqlalchemy.orm import Session

from shared.models.base import Base

from ..database.postgres_manager import postgresql_manager


class BaseRepository:
  """Base repository with common database operations."""

  def __init__(self, model: type[Base]) -> None:
    self.model = model

  def get_sync_session(self) -> Session:
    """Get synchronous session."""
    return postgresql_manager.get_sync_session()
