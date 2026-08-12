from typing import Any

from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError

from ..database.postgres_manager import postgresql_manager
from ..models.job import JobPosting
from .base import BaseRepository


class JobPostingRepository(BaseRepository):
  def __init__(self) -> None:
    super().__init__(JobPosting)

  async def get_by_url(self, url: str) -> JobPosting | None:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(JobPosting).filter(JobPosting.url == url)
      result = await session.execute(stmt)
      return result.scalars().first()

  async def get_visited_links(self, links: list[str]) -> list[str]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(JobPosting.url).where(JobPosting.url.in_(links))
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, data: dict[str, Any]) -> JobPosting:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = JobPosting(**data)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting creation failed: {e}") from e

  async def update(self, url: str, body: str) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = await session.get(JobPosting, url)
        if item:
          stmt = update(JobPosting).where(JobPosting.url == url).values(body=body)
          await session.execute(stmt)
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting update failed: {e}") from e
