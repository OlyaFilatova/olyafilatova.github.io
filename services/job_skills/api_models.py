from typing import Literal

from pydantic import BaseModel, Field

from services.skills.models.skill import Familiarity, SkillType, Temperature


class Skill(BaseModel):
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
