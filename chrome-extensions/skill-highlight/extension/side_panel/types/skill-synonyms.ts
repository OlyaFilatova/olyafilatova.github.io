export interface SuggestedSynonymGroupSkill {
  displayText: string;
  normalizedText: string;
}

export interface SuggestedSynonymGroup {
  id: string;
  skills: SuggestedSynonymGroupSkill[];
}
