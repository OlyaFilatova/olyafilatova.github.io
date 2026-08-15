import { useState } from "react";
import { SuggestedSynonymGroup } from "../types/skill-synonyms";
import SkillSynonymGroups from "./skill-synonyms/SkillSynonymGroups";
import { handleSkillStorageMessage } from "../../shared/storage";
import { SuggestSkillSynonymsResponse } from "../../shared/types";

export default function SkillSynonymsPanel() {
  const [groups, setGroups] = useState<SuggestedSynonymGroup[]>([]);

  function loadSynonymGroups() {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'suggestSkillSynonyms',
      args: []
    }, response => {
      if (response.ok) {
        setGroups(response.result as SuggestSkillSynonymsResponse);
      } else {
        console.log('error', response)
      }
    });
  }

  return (
    <>
      <div className="synonym-groups__actions">
        <button id="findSynonymGroupsButton" type="button" onClick={() => loadSynonymGroups()}>Find similar skills</button>
      </div>
      <SkillSynonymGroups suggestedSynonymGroups={groups} />
    </>
  )
}
