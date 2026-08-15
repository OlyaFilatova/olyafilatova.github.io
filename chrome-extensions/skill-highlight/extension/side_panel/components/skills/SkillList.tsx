import Skill from "./Skill";
import { SkillAggregate } from "../../../shared/types";

export default function SkillList({ skills, skillTexts }: {
  skills: SkillAggregate[],
  skillTexts: Array<{
    normalizedText: string;
    displayText: string;
  }> }) {

  return (
    <section id="skillList" className="skill-list" aria-live="polite">
      {skills.map((skill) =>  <Skill key={skill.normalizedText} skill={skill} skillTexts={skillTexts} />)}
    </section>
  )
}
