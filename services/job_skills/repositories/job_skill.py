from typing import Literal, TypedDict

from sqlalchemy import and_, func, select
from sqlalchemy.exc import IntegrityError

from services.job_parser.models.job import JobPosting
from services.job_parser.models.job_skill import JobPostingSkill
from services.skills.models.skill import Familiarity, Skill, SkillType, Temperature
from services.skills.models.skill_synonym import SkillSynonym

from ..database.postgres_manager import postgresql_manager


class SkillAggregate(TypedDict):
  normalized_text: str
  company_count: int
  companies: list[str]
  categories: list[str]
  synonyms: list[str]
  synonym_texts: list[str]
  urls: list[str]
  familiarity: Familiarity
  temperature: Temperature
  type: SkillType
  display_text: str


class SkillRepository:
  async def categories(self) -> list[str]:
    async with postgresql_manager.get_async_session() as session:
      stmt = select(JobPosting.category).select_from(JobPosting)

      result = await session.execute(stmt)

      return [*{*result.scalars().all()}]

  async def create(self, normalized_text: str, url: str) -> JobPostingSkill:
    async with postgresql_manager.get_async_session() as session:
      try:
        item = JobPostingSkill(job_url=url, skill_normalized_text=normalized_text)
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item
      except IntegrityError as e:
        await session.rollback()
        raise ValueError(f"Skill creation failed: {e}") from e

  async def ignore(self, normalized_text: str, url: str) -> None:
    pass

  async def filter(
    self,
    main_only: bool = True,
    currentPage: int = 1,
    pageSize: int = 10,
    search: str = "",
    sort: Literal["name", "companyCount"] = "name",
    category: str = "",
    type: SkillType | None = None,
    familiarity: Familiarity | None = None,
    temperature: Temperature | None = None,
    jobUrl: str | None = None,
  ) -> tuple[int, list[SkillAggregate]]:
    async with postgresql_manager.get_async_session() as session:
      aggregates = (
        (
          select(
            SkillSynonym.origin_normalized_text.label("origin_normalized_text"),
            func.count(func.distinct(JobPosting.company)).label("company_count"),
            func.array_agg(func.distinct(JobPosting.company)).label("companies"),
            func.array_agg(func.distinct(JobPosting.category)).label("categories"),
            func.array_agg(func.distinct(JobPostingSkill.skill_normalized_text))
            .filter(JobPostingSkill.skill_normalized_text != SkillSynonym.origin_normalized_text)
            .label("synonyms"),
            func.array_agg(func.distinct(SkillSynonym.text))
            .filter(JobPostingSkill.skill_normalized_text != SkillSynonym.origin_normalized_text)
            .label("synonyms_texts"),
            func.array_agg(func.distinct(JobPosting.url)).label("urls"),
          )
          .select_from(JobPostingSkill)
          .join(
            JobPosting,
            JobPostingSkill.job_url == JobPosting.url
            if not jobUrl and not category
            else and_(JobPostingSkill.job_url == jobUrl, JobPostingSkill.job_url == JobPosting.url)
            if not category
            else and_(JobPosting.category == category, JobPostingSkill.job_url == JobPosting.url)
            if not jobUrl
            else and_(
              JobPosting.category == category,
              JobPostingSkill.job_url == jobUrl,
              JobPostingSkill.job_url == JobPosting.url,
            ),
          )
          .join(
            SkillSynonym,
            JobPostingSkill.skill_normalized_text == SkillSynonym.normalized_text,
          )
        )
        .group_by(SkillSynonym.origin_normalized_text)
        .subquery("aggregates")
      )

      isfullouter = not jobUrl and not category

      stmt = select(
        aggregates,
        Skill.familiarity,
        Skill.temperature,
        Skill.type,
        Skill.text.label("display_text"),
      ).join(
        Skill,
        aggregates.c.origin_normalized_text == Skill.normalized_text,
        full=isfullouter,
      )

      where = []

      if familiarity:
        where.append(Skill.familiarity == familiarity)

      if temperature:
        where.append(Skill.temperature == temperature)

      if type:
        where.append(Skill.type == type)

      if search:
        where.append(aggregates.c.normalized_text.ilike(f"%{search.lower()}%"))

      if where:
        stmt = stmt.where(*where)

      count_stmt = select(func.count()).select_from(stmt.subquery())
      total_rows = await session.scalar(count_stmt)

      if sort == "name":
        stmt = stmt.order_by(
          func.lower(Skill.normalized_text).asc(),
          func.lower(aggregates.c.origin_normalized_text).asc(),
        )
      else:
        stmt = stmt.order_by(aggregates.c.company_count.desc())

      stmt = stmt.limit(pageSize).offset((currentPage - 1) * pageSize)

      result = await session.execute(stmt)

      skills = [*result.mappings().all()]
      skill_dicts = [dict(row) for row in skills]
      skill_aggregates: list[SkillAggregate] = [
        SkillAggregate(
          normalized_text=row["origin_normalized_text"] or "",
          company_count=row["company_count"] or 0,
          companies=row["companies"] or [],
          categories=row["categories"] or [],
          synonyms=row["synonyms"] or [],
          synonym_texts=row["synonyms_texts"] or [],
          urls=row["urls"] or [],
          familiarity=row["familiarity"],
          temperature=row["temperature"],
          type=row["type"],
          display_text=row["display_text"],
        )
        for row in skill_dicts
      ]

      return (total_rows or 0, skill_aggregates)
