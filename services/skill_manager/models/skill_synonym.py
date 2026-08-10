from sqlalchemy import Column, Computed, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from shared.models.base import Base


class SkillSynonym(Base):
  """SkillSynonym model."""

  __tablename__ = "skill_synonyms"

  text = Column(String(50), primary_key=True)
  origin_normalized_text = Column(String(50), unique=False, nullable=False, index=False)
  normalized_text = Column(String(50), unique=False, nullable=False, index=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
  text_length: Mapped[int] = mapped_column(Integer, Computed(func.char_length(text)))

  def __repr__(self) -> str:
    return f"<SkillSynonym(origin_normalized_text={self.origin_normalized_text}, normalized_text={
      self.normalized_text
    }, type='{self.text}')>"
