import datetime

from fastapi import FastAPI
from pydantic import BaseModel

from skill_manager.repositories.skill_synonym import SkillSynonymRepository

from .models.skill import SkillType, Familiarity, Temperature


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

@app.get("/health")
def health():
  return {
    "status": "ok"
  }

@app.get("/synonyms")
async def get_all_skill_synonyms() -> SkillSynonymsResponse:
  synonyms = await SkillSynonymRepository().get_all()
  return SkillSynonymsResponse(skills=[
    SkillSynonym(
      text = synonym.text,
      origin_normalized_text = synonym.origin_normalized_text,
      normalized_text = synonym.normalized_text,
      created_at = synonym.created_at,
      updated_at = synonym.updated_at,
    ) for synonym in synonyms
  ])
