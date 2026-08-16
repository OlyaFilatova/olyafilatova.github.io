import uuid

from sqlalchemy import UUID, Column, DateTime, String
from sqlalchemy.sql import func

from shared.models.base import Base


class JobPostingHistory(Base):
  """Job Posting history model."""

  __tablename__ = "job_posting_histories"

  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  url = Column(String(1024), unique=False, nullable=False, index=True)
  body = Column(String(51200), unique=False, nullable=False, index=False)
  category = Column(String(100), unique=False, nullable=False, index=True)
  company = Column(String(100), unique=False, nullable=False, index=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now())

  def __repr__(self) -> str:
    return (
      f"<JobPostingHistory(url={self.url}, company='{self.company}', category='{self.category}')>"
    )
