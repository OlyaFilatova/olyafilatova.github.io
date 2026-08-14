from typing import Annotated

from fastapi import FastAPI, Query

from .repositories.job_skill import JobSkillRepository
from .api_models import (
  CreateRequest,
  CreateResponse,
  FilterSkillsRequest,
  FilterSkillsResponse,
  Skill,
)

app = FastAPI()


# req: FilterSkillsRequest
@app.get("/filter")
async def filter_skills(
  filter_query: Annotated[FilterSkillsRequest, Query()],
) -> FilterSkillsResponse:
  total_rows, skills = await JobSkillRepository().filter(
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
  return await JobSkillRepository().categories()


@app.post("/create")
async def create(req: CreateRequest) -> CreateResponse:
  await JobSkillRepository().create(req.normalizedText, req.url)
  return CreateResponse()
