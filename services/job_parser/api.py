from fastapi import FastAPI

from .api_models import (
  HealthResponse,
  JobPostingRequest,
  JobPostingResponse,
  VisitedLinksRequest,
  VisitedLinksResponse,
)
from .api_requests import get_skill_synonyms, get_skills, parse_skills
from .repositories.job import JobPostingRepository
from .repositories.job_history import JobPostingHistoryRepository
from .repositories.job_skill import JobPostingSkillRepository

app = FastAPI()


@app.get("/health")
def health() -> HealthResponse:
  return HealthResponse(status="ok")


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
      request.body, [skill.normalizedText for skill in skill_synonyms]
    )

    await JobPostingSkillRepository().create_many(request.url, matched_skills)
    job_skills = await JobPostingSkillRepository().get_by_url(request.url)

  skill_keys = [str(skill.skill_normalized_text) for skill in job_skills]
  main_skill_mapping = [
    (synonym.originNormalizedText, synonym.normalizedText)
    for synonym in skill_synonyms
    if synonym.normalizedText in skill_keys
  ]
  skills = await get_skills(list(set([mapping[0] for mapping in main_skill_mapping])))
  skill_dict = {skill.normalizedText: skill for skill in skills}

  skills_mapping = [(skill_dict[mapping[0]], mapping[1]) for mapping in main_skill_mapping]

  return JobPostingResponse(skills=skills_mapping)


@app.post("/get-visited", response_model=VisitedLinksResponse)
async def get_visited(request: VisitedLinksRequest) -> VisitedLinksResponse:
  links = await JobPostingRepository().get_visited_links(request.links)
  return VisitedLinksResponse(links=links)
