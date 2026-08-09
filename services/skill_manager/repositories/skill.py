from typing import Optional, Dict, Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from .base import BaseRepository

from ..models.skill import Skill
from ..database.postgres_manager import postgresql_manager


class SkillRepository(BaseRepository):
  def __init__(self):
    super().__init__(Skill)

  async def get_by_normalized_text(self, normalized_text: str) -> Optional[Skill]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill).filter(Skill.normalized_text == normalized_text)
      result = await session.execute(stmt)
      return result.scalars().first()

  async def get_all(self) -> Optional[list[Skill]]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, data: Dict[str, Any]) -> Skill:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = Skill(**data)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Skill creation failed: {e}")

  async def create_many(self, items_data: list[Dict[str, Any]]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        items = [Skill(**data) for data in items_data]
        session.add_all(items)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Skill batch creation failed: {e}")
