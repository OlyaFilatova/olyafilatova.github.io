from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func

from shared.models.base import Base


class JobPosting(Base):
  """Job Posting model."""

  __tablename__ = "job_postings"

  url = Column(String(1024), primary_key=True)
  body = Column(String(51200), unique=False, nullable=False, index=False)
  category = Column(String(100), unique=False, nullable=False, index=True)
  company = Column(String(100), unique=False, nullable=False, index=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

  def __repr__(self) -> str:
    return f"<JobPosting(url={self.url}, company='{self.company}', category='{self.category}')>"
