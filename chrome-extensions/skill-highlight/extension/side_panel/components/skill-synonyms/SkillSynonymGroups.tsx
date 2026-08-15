import { SuggestedSynonymGroup } from "../../types/skill-synonyms";
import SkillSynonymGroup from "./SkillSynonymGroup";


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
        suggestedSynonymGroups.map(group => <SkillSynonymGroup group={group} />)
      }
    </section>
  )
}
