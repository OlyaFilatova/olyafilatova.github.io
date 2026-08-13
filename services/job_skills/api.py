from typing import Annotated, Literal, TypedDict

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

from services.skills.models.skill import Familiarity, SkillType, Temperature

from .repositories.job_skill import SkillRepository

app = FastAPI()


class Skill(TypedDict):
  normalizedText: str
  companyCount: int
  companies: list[str]
  categories: list[str]
  synonyms: list[str]
  synonymTexts: list[str]
  urls: list[str]
  familiarity: Familiarity
  temperature: Temperature
  type: SkillType
  displayText: str


class FilterSkillsRequest(BaseModel):
  currentPage: int = Field(1)
  pageSize: int = Field(10)
  search: str = Field("")
  category: str = Field("")
  sort: Literal["name", "companyCount"] = Field("name")
  type: SkillType | None = Field(None)
  familiarity: Familiarity | None = Field(None)
  temperature: Temperature | None = Field(None)
  jobUrl: str | None = Field(None)


class FilterSkillsResponse(BaseModel):
  skills: list[Skill]
  totalRows: int


class CreateRequest(BaseModel):
  normalizedText: str
  url: str


class CreateResponse(BaseModel):
  pass


class IgnoreRequest(BaseModel):
  normalizedText: str
  url: str


class IgnoreResponse(BaseModel):
  pass


# req: FilterSkillsRequest
@app.get("/filter")
async def filter_skills(
  filter_query: Annotated[FilterSkillsRequest, Query()],
) -> FilterSkillsResponse:
  total_rows, skills = await SkillRepository().filter(
    main_only=True,
    current_page=filter_query.currentPage,
    page_size=filter_query.pageSize,
    search=filter_query.search,
    category=filter_query.category,
    sort=filter_query.sort,
    type=filter_query.type,
    familiarity=filter_query.familiarity,
    temperature=filter_query.temperature,
    job_url=filter_query.jobUrl,
  )

  response_skills = [
    Skill(
      normalizedText=skill["normalized_text"],
      companyCount=skill["company_count"],
      companies=skill["companies"],
      categories=skill["categories"],
      synonyms=skill["synonyms"],
      synonymTexts=skill["synonym_texts"],
      urls=skill["urls"],
      familiarity=skill["familiarity"],
      temperature=skill["temperature"],
      type=skill["type"],
      displayText=skill["display_text"],
    )
    for skill in skills
  ]

  return FilterSkillsResponse(skills=response_skills, totalRows=total_rows)


@app.get("/categories")
async def categories() -> list[str]:
  return await SkillRepository().categories()


@app.post("/create")
async def create(req: CreateRequest) -> CreateResponse:
  await SkillRepository().create(req.normalizedText, req.url)
  return CreateResponse()


@app.post("/ignore")
async def ignore(req: IgnoreRequest) -> IgnoreResponse:
  await SkillRepository().ignore(req.normalizedText, req.url)

  return IgnoreResponse()
