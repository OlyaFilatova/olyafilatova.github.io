import { useEffect, useState } from "react";
import Skill from "./Skill";
import { SkillAggregate } from "../../../shared/types";

export default function SkillList({ skills }: { skills: SkillAggregate[] }) {
  const [skillTexts, setSkillTexts] = useState<Array<{
    normalizedText: string;
    displayText: string;
  }>>([]);

  useEffect(() => {
    setSkillTexts(skills.map(skill => ({
      normalizedText: skill.normalizedText,
      displayText: skill.displayText
    })))
  }, [skills]);

  return (
    <section id="skillList" className="skill-list" aria-live="polite">
      {skills.map((skill, idx) => <Skill key={idx} skill={skill} skillTexts={skillTexts} />)}
    </section>
  )
}
