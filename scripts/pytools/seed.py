# python -m scripts.pytools.seed
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

import asyncio
import json

from services.skills.models.skill import Familiarity, SkillType, Temperature
from services.skills.repositories.skill import SkillRepository
from services.skills.repositories.skill_synonym import SkillSynonymRepository


def literal_to_skill_type(text: str) -> SkillType:
  if text == "Approach":
    return SkillType.APPROACH
  elif text == "Application":
    return SkillType.APPLICATION
  elif text == "Non-skill":
    return SkillType.NON_SKILL
  else:
    raise Exception(f'Unknown skill "{text}"')


def literal_to_familiarity(text: str) -> Familiarity:
  if text == "know-in-depth":
    return Familiarity.KNOW_IN_DEPTH
  elif text == "study":
    return Familiarity.STUDY
  elif text == "actively-using":
    return Familiarity.ACTIVELY_STUDYING
  elif text == "know-a-bit":
    return Familiarity.KNOW_A_BIT
  elif text == "unknown":
    return Familiarity.UNKNOWN
  else:
    raise Exception(f'Unknown familiarity "{text}"')


def literal_to_temperature(text: str) -> Temperature:
  if text == "interested":
    return Temperature.INTERESTED
  elif text == "meh":
    return Temperature.MEH
  elif text == "avoid!":
    return Temperature.AVOID
  else:
    raise Exception(f'Unknown skill "{text}"')


async def seed() -> None:
  with open(Path(__file__).resolve().parent / "seed_data/prefill-skills.json") as f:
    prefill_items = json.load(f)

  existing_skills = await SkillRepository().get_all()
  if existing_skills:
    return

  skills = prefill_items
  synonyms = [
    {
      "text": item["text"],
      "normalized_text": item["normalizedText"],
      "origin_normalized_text": item["synonymSkillId"]
      if "synonymSkillId" in item
      else item["normalizedText"],
    }
    for item in prefill_items
  ]

  await SkillRepository().create_many(skills)
  await SkillSynonymRepository().create_many(synonyms)


asyncio.run(seed())
