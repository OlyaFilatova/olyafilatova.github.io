from typing import Optional, Dict, Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from .base import BaseRepository

from ..models.skill_synonym import SkillSynonym
from ..database.postgres_manager import postgresql_manager


class SkillSynonymRepository(BaseRepository):
  def __init__(self):
    super().__init__(SkillSynonym)

  async def get_by_text(self, text: str) -> Optional[SkillSynonym]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(SkillSynonym).filter(SkillSynonym.text == text)
      result = await session.execute(stmt)
      return result.scalars().first()

  async def filter_by_normalized_text(self, normalized_text: str) -> Optional[list[SkillSynonym]]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(SkillSynonym).filter(SkillSynonym.normalized_text == normalized_text)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def get_all(self) -> list[SkillSynonym]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(SkillSynonym)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, data: Dict[str, Any]) -> SkillSynonym:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = SkillSynonym(**data)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym creation failed: {e}")

  async def create_many(self, items_data: list[Dict[str, Any]]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        items = [SkillSynonym(**data) for data in items_data]
        session.add_all(items)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym batch creation failed: {e}")
