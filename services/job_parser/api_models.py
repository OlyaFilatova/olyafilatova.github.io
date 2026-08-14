from pydantic import BaseModel

from .generated.skills_models import Skill


class JobPostingRequest(BaseModel):
  body: str
  category: str
  company: str
  url: str


class HealthResponse(BaseModel):
  status: str


class JobPostingResponse(BaseModel):
  skills: list[tuple[Skill, str]]


class VisitedLinksRequest(BaseModel):
  links: list[str]


class VisitedLinksResponse(BaseModel):
  links: list[str]
