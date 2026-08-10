from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func

from shared.models.base import Base


class JobPostingSkill(Base):
  """Job Posting Skill model."""

  __tablename__ = "job_posting_skills"

  job_url = Column(String(1024), primary_key=True)
  skill_normalized_text = Column(String(100), primary_key=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now())

  def __repr__(self) -> str:
    return (
      f"<JobPostingSkill(url={self.job_url}, skill_normalized_text='{self.skill_normalized_text}')>"
    )
