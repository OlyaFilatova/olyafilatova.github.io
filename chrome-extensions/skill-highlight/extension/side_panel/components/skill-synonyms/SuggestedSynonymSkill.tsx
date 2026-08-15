import { SuggestedSynonymGroupSkill } from "../../types/skill-synonyms";

export default function SuggestedSynonymSkill({ skill, groupSkills, saveSkillSynonymPair }: {
  skill: SuggestedSynonymGroupSkill,
  groupSkills: SuggestedSynonymGroupSkill[],
  saveSkillSynonymPair: (synonymSkill: string, originSkill: string) => void
}) {
  return (
    <div className="synonym-group__skill">
      <div className="synonym-group__skill-name">{skill.displayText}</div>

      <label>
        <span>Synonym of</span>
        <select
          aria-label={`Set ${skill.displayText} as synonym of`}
          onChange={event => {
            if (event.target.value) {
              saveSkillSynonymPair(event.target.value, skill.normalizedText);
            }
          }}>
          <option value="">Choose skill</option>
          {groupSkills
            .filter((item) => item.normalizedText !== skill.normalizedText)
            .map(option => <option value={option.normalizedText}>{option.displayText}</option>)}
        </select>
      </label>
    </div>
  )
}
