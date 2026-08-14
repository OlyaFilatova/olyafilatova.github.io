export interface SuggestedSynonymGroupSkill {
  displayText: string;
  normalizedText: string;
}

export interface SuggestedSynonymGroup {
  id: string;
  skills: SuggestedSynonymGroupSkill[];
}

export type TabId = "skillsTab" | "synonymGroupsTab";

export type Tab = {
  id: TabId;
  text: string;
  panel: string;
};
