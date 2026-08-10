import os
from typing import cast

import requests
from fastapi import FastAPI
from pydantic import BaseModel

from .repositories.job import JobPostingRepository
from .repositories.job_history import JobPostingHistoryRepository
from .repositories.job_skill import JobPostingSkillRepository

app = FastAPI()


class JobPostingResponse(BaseModel):
  skills: list[str]


class JobPostingRequest(BaseModel):
  body: str
  category: str
  company: str
  url: str


class HealthResponse(BaseModel):
  status: str


@app.get("/health")
def health() -> HealthResponse:
  return HealthResponse(status="ok")


async def get_skill_synonyms() -> list[str]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}synonyms"

  response = requests.get(url)

  return [skill["normalized_text"] for skill in response.json()["skills"]]


async def parse_skills(body: str) -> list[str]:
  url = os.getenv("PARSE_SKILLS_SERVICE")
  url = f"{url}parse"
  skill_synonyms = await get_skill_synonyms()

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
    print(
      await repo.create(
        {
          "body": request.body,
          "category": request.category,
          "company": request.company,
          "url": request.url,
        }
      )
    )

  skills = await JobPostingSkillRepository().get_by_url(request.url)

  if not len(skills):
    matched_skills = await parse_skills(request.body)
    await JobPostingSkillRepository().create_many(request.url, matched_skills)
    skills = await JobPostingSkillRepository().get_by_url(request.url)

  return JobPostingResponse(skills=[str(skill.skill_normalized_text) for skill in skills])
