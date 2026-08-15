import { SuggestSkillSynonymsResponse } from "../../shared/types";


export type SuggestedSynonymGroup = SuggestSkillSynonymsResponse[number];

export type TabId = "skillsTab" | "synonymGroupsTab";

export type Tab = {
  id: TabId;
  text: string;
  panel: string;
};
