import { SuggestedSynonymGroup } from "../types/skill-synonyms";
import SkillSynonymGroups from "./skill-synonyms/SkillSynonymGroups";

export default function SkillSynonymsPanel() {
  const groups: SuggestedSynonymGroup[] = [];

  return (
    <>
      <div className="synonym-groups__actions">
        <button id="findSynonymGroupsButton" type="button">Find similar skills</button>
      </div>
      <SkillSynonymGroups suggestedSynonymGroups={groups} />
    </>
  )
}
