import { SuggestedSynonymGroupSkill } from "../../types/skill-synonyms";

export default function SuggestedSynonymSkill({ skill, groupSkills }: {
  skill: SuggestedSynonymGroupSkill,
  groupSkills: SuggestedSynonymGroupSkill[]
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
              void updateSuggestedSynonym(skill.normalizedText, event.target.value);
            }
          }}>
          <option value="">Choose skill</option>
          {groupSkills
            .filter((item) => item.normalizedText !== skill.normalizedText)
            .map(option => <option value={option.normalizedText}>{option.displayText}</option>)}
        </select>
      </label>

      <label>
        <span>Parent skill</span>
        <select
          aria-label={`Set parent for ${skill.displayText}`}
          onChange={event => {
            void updateSuggestedParent(skill.normalizedText, event.target.value || undefined);
          }}>
          <option value="">None</option>

          {groupSkills
            .filter((item) => item.normalizedText !== skill.normalizedText)
            .map(option => <option value={option.normalizedText}>{option.displayText}</option>)}
        </select>
      </label>

      <label></label>
    </div>
  )
}


async function updateSuggestedSynonym(normalizedText: string, synonymSkillId: string): Promise<void> {
  // await skillRepository.updateSynonymForText(normalizedText, synonymSkillId);
  // await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}

async function updateSuggestedParent(normalizedText: string, parentSkillId?: string): Promise<void> {
  // await skillRepository.updateParentForText(normalizedText, parentSkillId);
  // await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}
