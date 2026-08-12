from typing import Annotated, Any, Literal, Optional, TypedDict

from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

from services.skills.models.skill import Familiarity, SkillType, Temperature

from .repositories.job_skill import SkillAggregate, SkillRepository


app = FastAPI()

class FilterSkillsRequest(BaseModel):
  currentPage: int = Field(1)
  pageSize: int = Field(10)
  search: str = Field("")
  category: str = Field("")
  sort: Literal['name', 'companyCount'] = Field("name")
  type: Optional[SkillType] = Field(None)
  familiarity: Optional[Familiarity] = Field(None)
  temperature: Optional[Temperature] = Field(None)
  jobUrl: Optional[str] = Field(None)

class FilterSkillsResponse(BaseModel):
  skills: list[SkillAggregate]
  total_rows: int


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
async def filter_skills(filter_query: Annotated[FilterSkillsRequest, Query()]) -> FilterSkillsResponse:
  total_rows, skills = await SkillRepository().filter(
    main_only=True,
    currentPage=filter_query.currentPage,
    pageSize=filter_query.pageSize,
    search=filter_query.search,
    category=filter_query.category,
    sort=filter_query.sort,
    type=filter_query.type,
    familiarity=filter_query.familiarity,
    temperature=filter_query.temperature,
    jobUrl=filter_query.jobUrl,
  )

  return FilterSkillsResponse(skills=skills, total_rows=total_rows)

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
