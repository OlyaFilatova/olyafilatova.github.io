from datetime import datetime
from typing import Any

from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError

from ..database.postgres_manager import postgresql_manager
from ..models.skill import Skill
from .base import BaseRepository


class SkillRepository(BaseRepository):
  def __init__(self) -> None:
    super().__init__(Skill)

  async def get_by_key(self, normalized_text: str) -> Skill | None:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill).filter(Skill.normalized_text == normalized_text)
      result = await session.execute(stmt)
      return result.scalars().first()

  async def get_by_keys(self, keys: list[str]) -> list[Skill]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill).filter(Skill.normalized_text.in_(keys))
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def get_all(self) -> list[Skill] | None:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def create(self, data: dict[str, Any]) -> Skill:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = Skill(**data)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Skill creation failed: {e}") from e

  async def edit(self, normalized_text: str, update_data: dict[str, Any]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        skill = await session.get(Skill, normalized_text)
        if skill:
          stmt = update(Skill).where(Skill.normalized_text == normalized_text).values(
            **update_data
          )
          await session.execute(stmt)
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Skill edit failed: {e}") from e

  async def create_many(self, items_data: list[dict[str, Any]]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        items = [Skill(**data) for data in items_data]
        session.add_all(items)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Skill batch creation failed: {e}") from e
