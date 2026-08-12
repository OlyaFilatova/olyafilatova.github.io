import datetime
import os
from typing import Any, TypedDict, cast

import requests
from fastapi import FastAPI
from pydantic import BaseModel

from .repositories.job import JobPostingRepository
from .repositories.job_history import JobPostingHistoryRepository
from .repositories.job_skill import JobPostingSkillRepository

app = FastAPI()


class JobPostingRequest(BaseModel):
  body: str
  category: str
  company: str
  url: str


class HealthResponse(BaseModel):
  status: str


class Skill(TypedDict):
  normalized_text: str
  text: str
  type: Any  # TODO move types to the shared package
  familiarity: Any
  temperature: Any
  created_at: datetime.datetime
  updated_at: datetime.datetime


class JobPostingResponse(BaseModel):
  skills: list[tuple[Skill, str]]


class SkillSynonym(TypedDict):
  text: str
  origin_normalized_text: str
  normalized_text: str
  created_at: datetime.datetime
  updated_at: datetime.datetime


@app.get("/health")
def health() -> HealthResponse:
  return HealthResponse(status="ok")


async def get_skill_synonyms() -> list[SkillSynonym]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}synonyms"

  response = requests.get(url)

  return cast(list[SkillSynonym], response.json()["skills"])


async def get_skills(skill_ids: list[str]) -> list[Skill]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}skills"

  response = requests.get(url, json={"skill_ids": skill_ids})

  return cast(list[Skill], response.json()["skills"])


async def parse_skills(body: str, skill_synonyms: list[str]) -> list[str]:
  url = os.getenv("PARSE_SKILLS_SERVICE")
  url = f"{url}parse"

  payload = {"body": body, "skill_synonyms": skill_synonyms}

  response = requests.post(url, json=payload)

  matches = cast(list[str], response.json()["matches"])
  return matches


@app.post("/process-job-posting", response_model=JobPostingResponse)
async def process(request: JobPostingRequest) -> JobPostingResponse:
  repo = JobPostingRepository()
  existing_job = await repo.get_by_url(request.url)
  if existing_job:
    if str(existing_job.body) != request.body:
      await JobPostingHistoryRepository().create(
        {
          "url": existing_job.url,
          "body": existing_job.body,
          "category": existing_job.category,
          "company": existing_job.company,
          "created_at": existing_job.updated_at,
        }
      )
      await JobPostingSkillRepository().delete_by_url(request.url)
      await repo.update(request.url, request.body)
  else:
    await repo.create(
      {
        "body": request.body,
        "category": request.category,
        "company": request.company,
        "url": request.url,
      }
    )

  job_skills = await JobPostingSkillRepository().get_by_url(request.url)

  skill_synonyms = await get_skill_synonyms()
  if not len(job_skills):
    matched_skills = await parse_skills(
      request.body, [skill["normalized_text"] for skill in skill_synonyms]
    )

    await JobPostingSkillRepository().create_many(request.url, matched_skills)
    job_skills = await JobPostingSkillRepository().get_by_url(request.url)

  skill_keys = [str(skill.skill_normalized_text) for skill in job_skills]
  main_skill_mapping = [
    (synonym["origin_normalized_text"], synonym["normalized_text"])
    for synonym in skill_synonyms
    if synonym["normalized_text"] in skill_keys
  ]
  skills = await get_skills(list(set([mapping[0] for mapping in main_skill_mapping])))
  skill_dict = {skill["normalized_text"]: skill for skill in skills}

  skills_mapping = [(skill_dict[mapping[0]], mapping[1]) for mapping in main_skill_mapping]

  return JobPostingResponse(skills=skills_mapping)


class VisitedLinksRequest(BaseModel):
  links: list[str]


class VisitedLinksResponse(BaseModel):
  links: list[str]


@app.post("/get-visited", response_model=VisitedLinksResponse)
async def get_visited(request: VisitedLinksRequest) -> VisitedLinksResponse:
  links = await JobPostingRepository().get_visited_links(request.links)
  return VisitedLinksResponse(links=links)
