from typing import Any, TypedDict

from sqlalchemy import func, select, update
from sqlalchemy.exc import IntegrityError

from ..database.postgres_manager import postgresql_manager
from ..models.skill import Skill
from ..models.skill_synonym import SkillSynonym
from .base import BaseRepository


class SkillTexts(TypedDict):
  normalized_text: str
  display_text: str


class SkillWithSynonyms(TypedDict):
  origin_normalized_text: str
  display_text: str
  synonyms: list[str]
  synonym_texts: list[str]


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

  async def get_all(self) -> list[Skill]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill)
      result = await session.execute(stmt)
      return [*result.scalars().all()]

  async def get_skill_texts(self) -> list[SkillTexts]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(Skill.normalized_text, Skill.text).order_by(Skill.normalized_text)
      result = await session.execute(stmt)
      text_dicts = [dict(mapping) for mapping in result.mappings().all()]
      return [
        SkillTexts(display_text=mapping["text"], normalized_text=mapping["normalized_text"])
        for mapping in text_dicts
      ]

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
          stmt = update(Skill).where(Skill.normalized_text == normalized_text).values(**update_data)
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

  async def skills_with_synonyms(self) -> list[SkillWithSynonyms]:
    async with postgresql_manager.get_async_session() as session:
      stmt = (
        select(
          SkillSynonym.origin_normalized_text.label("origin_normalized_text"),
          func.array_agg(func.distinct(SkillSynonym.normalized_text))
          .filter(Skill.normalized_text != SkillSynonym.origin_normalized_text)
          .label("synonyms"),
          func.array_agg(func.distinct(SkillSynonym.text))
          .filter(Skill.normalized_text != SkillSynonym.origin_normalized_text)
          .label("synonyms_texts"),
        )
        .select_from(Skill)
        .join(
          SkillSynonym,
          Skill.normalized_text == SkillSynonym.origin_normalized_text,
        )
        .group_by(SkillSynonym.origin_normalized_text)
      )

      result = await session.execute(stmt)

      skills = [*result.mappings().all()]
      skill_dicts = [dict(row) for row in skills]
      skill_aggregates: list[SkillWithSynonyms] = [
        SkillWithSynonyms(
          origin_normalized_text=row["origin_normalized_text"],
          display_text=row["origin_normalized_text"],
          synonyms=row["synonyms"] or [],
          synonym_texts=row["synonyms_texts"] or [],
        )
        for row in skill_dicts
      ]

      return skill_aggregates
