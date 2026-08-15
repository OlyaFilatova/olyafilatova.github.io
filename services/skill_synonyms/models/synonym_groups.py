
from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func

from shared.models.base import Base


class IgnoredSynonymGroup(Base):
  """Ignored synonym group model."""

  __tablename__ = "ignored_synonym_group"

  id = Column(String(1024), primary_key=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

  def __repr__(self) -> str:
    return f"<IgnoredSynonymGroup(id={self.id}')>"
