from pydantic import BaseModel


class HealthResponse(BaseModel):
  status: str


class SuggestedSynonymSkill(BaseModel):
  normalizedText: str
  displayText: str
  matchTexts: list[str]


class SuggestedSynonymGroup(BaseModel):
  id: str
  skills: list[SuggestedSynonymSkill]
  score: float


class IgnoreSuggestedGroupRequest(BaseModel):
  id: str
