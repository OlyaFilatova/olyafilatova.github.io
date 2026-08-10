from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from ..database.postgres_manager import postgresql_manager
from ..models.skill_synonym import SkillSynonym
from .base import BaseRepository


class SkillSynonymRepository(BaseRepository):
  def __init__(self) -> None:
    super().__init__(SkillSynonym)

  async def get_by_text(self, text: str) -> SkillSynonym | None:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(SkillSynonym).filter(SkillSynonym.text == text)
      result = await session.execute(stmt)
      return result.scalars().first()

  async def get_by_key(self, normalized_text: str) -> list[SkillSynonym]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(SkillSynonym).filter(SkillSynonym.normalized_text == normalized_text)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def get_all(self) -> list[SkillSynonym]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(SkillSynonym)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, data: dict[str, Any]) -> SkillSynonym:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = SkillSynonym(**data)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym creation failed: {e}") from e

  async def create_many(self, items_data: list[dict[str, Any]]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        items = [SkillSynonym(**data) for data in items_data]
        session.add_all(items)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym batch creation failed: {e}") from e
