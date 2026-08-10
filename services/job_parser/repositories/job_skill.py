from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError

from ..database.postgres_manager import postgresql_manager
from ..models.job_skill import JobPostingSkill
from .base import BaseRepository


class JobPostingSkillRepository(BaseRepository):
  def __init__(self) -> None:
    super().__init__(JobPostingSkill)

  async def get_by_url(self, url: str) -> list[JobPostingSkill]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(JobPostingSkill).filter(JobPostingSkill.job_url == url)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, url: str, normalized_text: str) -> JobPostingSkill:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = JobPostingSkill(**{"job_url": url, "skill_normalized_text": normalized_text})
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting Skill creation failed: {e}") from e

  async def create_many(self, url: str, normalized_texts: list[str]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        for normalized_text in normalized_texts:
          item = JobPostingSkill(**{"job_url": url, "skill_normalized_text": normalized_text})
          session.add(item)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting Skill list creation failed: {e}") from e

  async def delete_one(self, url: str, normalized_text: str) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = await session.get(JobPostingSkill, url)
        if item:
          stmt = delete(JobPostingSkill).where(
            JobPostingSkill.job_url == url,
            JobPostingSkill.skill_normalized_text == normalized_text,
          )
          await session.execute(stmt)
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting Skill delete one failed: {e}") from e

  async def delete_by_url(self, url: str) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = await session.get(JobPostingSkill, url)
        if item:
          stmt = delete(JobPostingSkill).where(JobPostingSkill.job_url == url)
          await session.execute(stmt)
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting Skill delete by URL failed: {e}") from e

  async def delete_all(self) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        stmt = delete(JobPostingSkill)
        await session.execute(stmt)
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Job Posting Skill delete all failed: {e}") from e
