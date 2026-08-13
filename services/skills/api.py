import datetime
from typing import Any, cast

from fastapi import FastAPI
from pydantic import BaseModel, Field

from .models.skill import Familiarity, SkillType, Temperature
from .repositories.skill import SkillRepository
from .repositories.skill_synonym import SkillSynonymRepository

app = FastAPI()


class SkillSynonym(BaseModel):
  text: str
  originNormalizedText: str
  normalizedText: str
  createdAt: datetime.datetime
  updatedAt: datetime.datetime


class Skill(BaseModel):
  normalizedText: str
  text: str
  type: SkillType
  familiarity: Familiarity
  temperature: Temperature
  createdAt: datetime.datetime
  updatedAt: datetime.datetime


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


@app.get("/health")
def health() -> HealthResponse:
  return HealthResponse(status="ok")


@app.get("/synonyms")
async def get_all_skill_synonyms() -> SkillSynonymsResponse:
  synonyms = await SkillSynonymRepository().get_all()
  return SkillSynonymsResponse(
    skills=[
      SkillSynonym(
        text=str(synonym.text),
        originNormalizedText=str(synonym.origin_normalized_text),
        normalizedText=str(synonym.normalized_text),
        createdAt=cast(datetime.datetime, synonym.created_at),
        updatedAt=cast(datetime.datetime, synonym.updated_at),
      )
      for synonym in synonyms
    ]
  )


@app.get("/skills")
async def get_skills(req: SkillsRequest) -> SkillsResponse:
  skills = await SkillRepository().get_by_keys(req.skillIds)
  return SkillsResponse(
    skills=[
      Skill(
        normalizedText=str(skill.normalized_text),
        text=str(skill.text),
        type=skill.type,
        familiarity=skill.familiarity,
        temperature=skill.temperature,
        createdAt=cast(datetime.datetime, skill.created_at),
        updatedAt=cast(datetime.datetime, skill.updated_at),
      )
      for skill in skills
    ]
  )


@app.get("/skill-texts")
async def get_skill_texts() -> SkillTextsResponse:
  texts = await SkillRepository().get_skill_texts()
  return SkillTextsResponse(
    texts=[
      SkillText(normalizedText=text["normalized_text"], displayText=text["display_text"])
      for text in texts
    ]
  )


@app.post("/create")
async def create(req: CreateRequest) -> CreateResponse:
  skill = await SkillRepository().create(
    {
      "text": req.displayText,
      "normalized_text": req.normalizedText,
      "type": SkillType.APPROACH,
      "familiarity": Familiarity.UNKNOWN,
      "temperature": Temperature.MEH,
    }
  )
  await SkillSynonymRepository().create(
    {
      "text": req.displayText,
      "origin_normalized_text": req.normalizedText,
      "normalized_text": req.normalizedText,
    }
  )
  return CreateResponse(
    normalizedText=str(skill.normalized_text),
    displayText=str(skill.text),
    type=SkillType.APPROACH,
    familiarity=Familiarity.UNKNOWN,
    temperature=Temperature.MEH,
  )


@app.post("/edit")
async def edit(req: EditRequest) -> EditResponse:
  new_data: dict[str, Any] = {}

  if req.skillType:
    new_data["type"] = req.skillType

  if req.familiarity:
    new_data["familiarity"] = req.familiarity

  if req.temperature:
    new_data["temperature"] = req.temperature

  if len(new_data) == 0:
    raise Exception("No edited values found.")

  await SkillRepository().edit(req.normalizedText, new_data)
  return EditResponse()
