import os

import requests

from .generated.skills_models import SkillsWithSynonymsResponse, SkillWithSynonyms


async def get_skill_with_synonyms() -> list[SkillWithSynonyms]:
  url = os.getenv("SKILLS_MANAGER_SERVICE")
  url = f"{url}skills-with-synonyms"

  response = requests.get(url)
  response.raise_for_status()

  return SkillsWithSynonymsResponse.model_validate(response.json()).skills
