from fastapi import FastAPI

from .tracing import profile

from .logic import calculate_suggested_synonym_groups
from .repositories.synonym_groups import IgnoredSynonymGroupRepository

from .api_models import HealthResponse, SuggestedSynonymGroup, SuggestedSynonymSkill
from .api_requests import get_skill_with_synonyms

app = FastAPI()


@app.get("/health")
def health() -> HealthResponse:
  return HealthResponse(status="ok")


@app.post("/ignore/{id}")
async def ignore(id: str) -> None:
  await IgnoredSynonymGroupRepository().create(id)


@app.get("/")
async def get_suggested_synonym_groups() -> list[SuggestedSynonymGroup]:
  with profile("load-ignored_suggested_groups"):
    ignored_suggested_groups = [*await IgnoredSynonymGroupRepository().get_all()]
    ignored_suggested_group_ids = [
      str(ignored_group.id) for ignored_group in ignored_suggested_groups
    ]

  with profile("get_skill_with_synonyms"):
    aggregates = await get_skill_with_synonyms()

  with profile("calculate_suggested_synonym_groups"):
    suggested_synonym_groups = calculate_suggested_synonym_groups(aggregates, ignored_suggested_group_ids)

  return [
    SuggestedSynonymGroup(
      id=group.id,
      score=group.score,
      skills=[
        SuggestedSynonymSkill(
          normalizedText=skill.normalized_text,
          displayText=skill.display_text,
          matchTexts=skill.match_texts,
        )
        for skill in group.skills
      ],
    )
    for group in suggested_synonym_groups
  ]
