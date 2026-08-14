import { SuggestedSynonymGroup } from "../../types/skill-synonyms";
import SuggestedSynonymSkill from "./SuggestedSynonymSkill";


export default function SkillSynonymGroups({
  suggestedSynonymGroups
}: {
  suggestedSynonymGroups: SuggestedSynonymGroup[]
}) {
  return (
    <section id="synonymGroupsList" className="synonym-groups" aria-live="polite">
      {suggestedSynonymGroups === null ?
        <div className="empty">Click Find similar skills to generate suggestions.</div> :
        suggestedSynonymGroups.length == 0 ?
        <div className="empty">No similar skill groups found.</div> :
        suggestedSynonymGroups.map(group => (
          <article className="synonym-group">
            <div className="synonym-group__header">
              <h2>{group.skills.map((skill) => skill.displayText).join(", ")}</h2>
              <button
                type="button"
                className="synonym-group__ignore"
                onClick={
                  () => {
                    // ignoreSuggestedSynonymGroup(group.id);
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

