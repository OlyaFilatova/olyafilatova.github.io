from typing import Optional, Dict, Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from .base import BaseRepository

from ..models.job_history import JobPostingHistory
from ..database.postgres_manager import postgresql_manager


class JobPostingHistoryRepository(BaseRepository):
  def __init__(self):
    super().__init__(JobPostingHistory)

  async def get_by_url(self, url: str) -> Optional[JobPostingHistory]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(JobPostingHistory).filter(JobPostingHistory.url == url)
      result = await session.execute(stmt)
      return result.scalars().first()

  async def create(self, data: Dict[str, Any]) -> JobPostingHistory:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = JobPostingHistory(**data)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting History creation failed: {e}")
