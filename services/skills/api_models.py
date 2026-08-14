from datetime import datetime

from pydantic import BaseModel, Field

from .models.skill import Familiarity, SkillType, Temperature


class SkillSynonym(BaseModel):
  text: str
  originNormalizedText: str
  normalizedText: str
  createdAt: datetime
  updatedAt: datetime


class Skill(BaseModel):
  normalizedText: str
  text: str
  type: SkillType
  familiarity: Familiarity
  temperature: Temperature
  createdAt: datetime
  updatedAt: datetime


class SkillSynonymsResponse(BaseModel):
  skills: list[SkillSynonym]


class CreateSkillResponse(BaseModel):
  skill: Skill


class CreateSkillRequest(BaseModel):
  normalizedText: str
  text: str
  type: SkillType
  familiarity: Familiarity
  temperature: Temperature


class HealthResponse(BaseModel):
  status: str


class SkillsRequest(BaseModel):
  skillIds: list[str]


class SkillsResponse(BaseModel):
  skills: list[Skill]


class CreateRequest(BaseModel):
  displayText: str
  normalizedText: str


class CreateResponse(BaseModel):
  normalizedText: str
  displayText: str
  type: SkillType
  familiarity: Familiarity
  temperature: Temperature


class EditRequest(BaseModel):
  normalizedText: str
  skillType: SkillType | None = Field(None)
  familiarity: Familiarity | None = Field(None)
  temperature: Temperature | None = Field(None)


class EditResponse(BaseModel):
  pass


class SkillText(BaseModel):
  normalizedText: str
  displayText: str


class SkillTextsResponse(BaseModel):
  texts: list[SkillText]


class CreateSynonymRequest(BaseModel):
  originNormalizedText: str
  normalizedText: str


class CreateSynonymResponse(BaseModel):
  originNormalizedText: str
  normalizedText: str


class RemoveSynonymRequest(BaseModel):
  originNormalizedText: str
  normalizedText: str
  displayText: str


class RemoveSynonymResponse(BaseModel):
  originNormalizedText: str
  normalizedText: str
  displayText: str
