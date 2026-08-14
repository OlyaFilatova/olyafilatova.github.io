import os
from typing import cast

import requests

from .api_models import Skill, SkillSynonym


async def get_skill_synonyms() -> list[SkillSynonym]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}synonyms"

  response = requests.get(url)

  return cast(list[SkillSynonym], response.json()["skills"])


async def get_skills(skill_ids: list[str]) -> list[Skill]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}skills"

  response = requests.get(url, json={"skillIds": skill_ids})

  return cast(list[Skill], response.json()["skills"])


async def parse_skills(body: str, skill_synonyms: list[str]) -> list[str]:
  url = os.getenv("PARSE_SKILLS_SERVICE")
  url = f"{url}parse"

  payload = {"body": body, "skillSynonyms": skill_synonyms}

  response = requests.post(url, json=payload)

  matches = cast(list[str], response.json()["matches"])
  return matches
