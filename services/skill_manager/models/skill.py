from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.orm import mapped_column
from sqlalchemy.sql import func

from shared.models.base import Base


class Familiarity(PyEnum):
  KNOW_IN_DEPTH = "know-in-depth"
  STUDY = "study"
  ACTIVELY_STUDYING = "actively-using"
  KNOW_A_BIT = "know-a-bit"
  UNKNOWN = "unknown"


class SkillType(PyEnum):
  APPROACH = "Approach"
  APPLICATION = "Application"
  NON_SKILL = "Non-skill"


class Temperature(PyEnum):
  INTERESTED = "interested"
  MEH = "meh"
  AVOID = "avoid!"


class Skill(Base):
  """Skill model."""

  __tablename__ = "skills"

  normalized_text = Column(String(50), primary_key=True)
  text = Column(String(50), unique=True, nullable=False, index=False)
  type = mapped_column(Enum(SkillType), unique=False, nullable=False, index=True)
  # these two are not suitable for multi-user system
  familiarity = mapped_column(Enum(Familiarity), unique=False, nullable=False, index=True)
  temperature = mapped_column(Enum(Temperature), unique=False, nullable=False, index=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

  def __repr__(self) -> str:
    return f"<Skill(normalizedText={self.normalized_text}, type='{self.type}')>"
