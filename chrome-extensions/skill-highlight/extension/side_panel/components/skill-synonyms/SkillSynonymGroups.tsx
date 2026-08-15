import { useState } from "react";
import { SuggestedSynonymGroup } from "../../types/skill-synonyms";
import SuggestedSynonymSkill from "./SuggestedSynonymSkill";
import { handleSkillStorageMessage } from "../../../shared/storage";
import { IgnoreSuggestedSkillSynonymsRequest } from "../../../shared/types";


export default function SkillSynonymGroups({
  suggestedSynonymGroups
}: {
  suggestedSynonymGroups: SuggestedSynonymGroup[]
}) {
  const [ignoredGroups, setIgnoredGroups] = useState<string[]>([]);

  function ignoreSuggestedSynonymGroup(id: string) {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'ignoreSuggestedGroup',
      args: [{ id } satisfies IgnoreSuggestedSkillSynonymsRequest]
    }, response => {
      if (response.ok) {
        setIgnoredGroups([...ignoredGroups, id]);
      } else {
        console.log('error', response)
      }
    });
  }

  return (
    <section id="synonymGroupsList" className="synonym-groups" aria-live="polite">
      {suggestedSynonymGroups === null ?
        <div className="empty">Click Find similar skills to generate suggestions.</div> :
        suggestedSynonymGroups.length == 0 ?
        <div className="empty">No similar skill groups found.</div> :
        suggestedSynonymGroups.map(group => ignoredGroups.includes(group.id) ? <></> : (
          <article className="synonym-group">
            <div className="synonym-group__header">
              <h2>{group.skills.map((skill) => skill.displayText).join(", ")}</h2>
              <button
                type="button"
                className="synonym-group__ignore"
                onClick={
                  () => {
                    ignoreSuggestedSynonymGroup(group.id);
                  }
                }>Ignore group</button>
            </div>
            <div className="synonym-group__skills">{
              group.skills.map((skill) => <SuggestedSynonymSkill skill={skill} groupSkills={group.skills} />)
              }</div>
          </article>
        ))
      }
    </section>
  )
}

