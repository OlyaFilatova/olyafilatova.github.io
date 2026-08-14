import datetime
from typing import Any, TypedDict

from pydantic import BaseModel


class Skill(TypedDict):
  normalizedText: str
  text: str
  type: Any  # TODO move types to the shared package
  familiarity: Any
  temperature: Any
  createdAt: datetime.datetime
  updatedAt: datetime.datetime


class SkillSynonym(TypedDict):
  text: str
  originNormalizedText: str
  normalizedText: str
  createdAt: datetime.datetime
  updatedAt: datetime.datetime


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
