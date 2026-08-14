import os
from typing import cast

import requests
from pydantic import TypeAdapter

from .generated.skills_models import Skill, SkillSynonym


async def get_skill_synonyms() -> list[SkillSynonym]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}synonyms"

  response = requests.get(url)
  response.raise_for_status()

  adapter = TypeAdapter(list[SkillSynonym])
  synonyms = adapter.validate_python(response.json()["skills"])

  return synonyms


async def get_skills(skill_ids: list[str]) -> list[Skill]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}skills"

  response = requests.get(url, json={"skillIds": skill_ids})
  response.raise_for_status()

  adapter = TypeAdapter(list[Skill])
  skills = adapter.validate_python(response.json()["skills"])

  return skills


async def parse_skills(body: str, skill_synonyms: list[str]) -> list[str]:
  url = os.getenv("PARSE_SKILLS_SERVICE")
  url = f"{url}parse"

  payload = {"body": body, "skillSynonyms": skill_synonyms}

  response = requests.post(url, json=payload)
  response.raise_for_status()

  matches = cast(list[str], response.json()["matches"])
  return matches
