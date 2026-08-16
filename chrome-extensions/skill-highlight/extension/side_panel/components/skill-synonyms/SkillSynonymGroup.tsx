import { useState } from "react";
import { SuggestedSynonymGroup } from "../../types/skill-synonyms";
import SuggestedSynonymSkill from "./SuggestedSynonymSkill";
import { handleSkillStorageMessage } from "../../../shared/storage";
import { IgnoreSuggestedSkillSynonymsRequest, SynonymAddTriggeredMessage } from "../../../shared/types";


export default function SkillSynonymGroup({
  group
}: {
  group: SuggestedSynonymGroup
}) {
  const [ignored, setIgnored] = useState(false);
  const [skillNames, setSkillNames] = useState(group.skills.map(skill => skill.normalizedText));

  function ignoreSuggestedSynonymGroup() {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'ignoreSuggestedGroup',
      args: [{ id: encodeURIComponent(encodeURIComponent(group.id)) } satisfies IgnoreSuggestedSkillSynonymsRequest]
    }, response => {
      if (response.ok) {
        setIgnored(true);
      } else {
        console.log('error', response)
      }
    });
  }

  function saveSkillSynonymPair(originSkill: string, synonymSkill: string) {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'addSynonym',
      args: [{ 
        originNormalizedText: originSkill,
        normalizedText: synonymSkill
       } satisfies SynonymAddTriggeredMessage["message"]]
    }, response => {
      if (response.ok) {
        setSkillNames([...skillNames.filter(skillName => skillName !== synonymSkill)]);
      } else {
        console.log('error', response)
      }
    });
  }

  return (ignored || skillNames.length < 2 ? <></> : (
    <article className="synonym-group">
      <div className="synonym-group__header">
        <h2>{group.skills.map((skill) => skill.displayText).join(", ")}</h2>
        <button
          type="button"
          className="synonym-group__ignore"
          onClick={
            () => {
              ignoreSuggestedSynonymGroup();
            }
          }>Ignore group</button>
      </div>
      <div className="synonym-group__skills">{
        group.skills.map((skill) => <SuggestedSynonymSkill skill={skill} groupSkills={group.skills} saveSkillSynonymPair={saveSkillSynonymPair} />)
      }</div>
    </article>
  ))
}

