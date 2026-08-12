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
  origin_normalized_text: str
  normalized_text: str
  created_at: datetime.datetime
  updated_at: datetime.datetime


class Skill(BaseModel):
  normalized_text: str
  text: str
  type: SkillType
  familiarity: Familiarity
  temperature: Temperature
  created_at: datetime.datetime
  updated_at: datetime.datetime


class SkillSynonymsResponse(BaseModel):
  skills: list[SkillSynonym]


class CreateSkillResponse(BaseModel):
  skill: Skill


class CreateSkillRequest(BaseModel):
  normalized_text: str
  text: str
  type: SkillType
  familiarity: Familiarity
  temperature: Temperature


class HealthResponse(BaseModel):
  status: str


class SkillsRequest(BaseModel):
  skill_ids: list[str]


class SkillsResponse(BaseModel):
  skills: list[Skill]


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
        origin_normalized_text=str(synonym.origin_normalized_text),
        normalized_text=str(synonym.normalized_text),
        created_at=cast(datetime.datetime, synonym.created_at),
        updated_at=cast(datetime.datetime, synonym.updated_at),
      )
      for synonym in synonyms
    ]
  )


@app.get("/skills")
async def get_skills(req: SkillsRequest) -> SkillsResponse:
  skills = await SkillRepository().get_by_keys(req.skill_ids)
  return SkillsResponse(
    skills=[
      Skill(
        normalized_text=str(skill.normalized_text),
        text=str(skill.text),
        type=skill.type,
        familiarity=skill.familiarity,
        temperature=skill.temperature,
        created_at=cast(datetime.datetime, skill.created_at),
        updated_at=cast(datetime.datetime, skill.updated_at),
      )
      for skill in skills
    ]
  )


class CreateRequest(BaseModel):
  displayText: str
  normalizedText: str


class CreateResponse(BaseModel):
  normalized_text: str


class EditRequest(BaseModel):
  normalizedText: str
  skillType: SkillType | None = Field(None)
  familiarity: Familiarity | None = Field(None)
  temperature: Temperature | None = Field(None)


class EditResponse(BaseModel):
  pass


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
  return CreateResponse(normalized_text=str(skill.normalized_text))


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
