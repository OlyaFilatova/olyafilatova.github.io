from typing import Any

from sqlalchemy import and_, delete, select, update
from sqlalchemy.exc import IntegrityError

from services.skills.models.skill import Skill

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

  async def create(self, normalized_text: str, origin_normalized_text: str) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        stmt = update(SkillSynonym).where(and_(
          SkillSynonym.normalized_text == normalized_text,
          SkillSynonym.origin_normalized_text == normalized_text
        )).values(origin_normalized_text=origin_normalized_text)
        await session.execute(stmt)
        delete_stmt = delete(Skill).where(Skill.normalized_text == normalized_text)
        await session.execute(delete_stmt)
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym creation failed: {e}") from e

  async def delete(self, normalized_text: str, text: str, origin_normalized_text: str) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        stmt = update(SkillSynonym).where(and_(
          SkillSynonym.normalized_text == normalized_text,
          SkillSynonym.origin_normalized_text == origin_normalized_text
        )).values(origin_normalized_text=normalized_text)
        await session.execute(stmt)

        origin_skill_stmt = select(Skill).where(Skill.normalized_text == origin_normalized_text)
        result = await session.execute(origin_skill_stmt)
        origin_skill = result.scalars().first()

        if not origin_skill:
          raise Exception('Failed to find origin skill.')

        skill = Skill(
          normalized_text=normalized_text,
          temperature=origin_skill.temperature,
          type=origin_skill.type,
          familiarity=origin_skill.familiarity,
          text=text,
        )
        session.add(skill)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym deletion failed: {e}") from e

  async def create_many(self, items_data: list[dict[str, Any]]) -> None:
    async with postgresql_manager.get_async_session() as session:
      try:
        items = [SkillSynonym(**data) for data in items_data]
        session.add_all(items)
        await session.commit()
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"SkillSynonym batch creation failed: {e}") from e
