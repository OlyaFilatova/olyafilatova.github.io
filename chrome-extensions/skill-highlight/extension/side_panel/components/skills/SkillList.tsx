import { useEffect, useState } from "react";
import Skill from "./Skill";
import { SkillAggregate, SynonymUpdatedMessage } from "../../../shared/types";
import { handleSkillStorageMessage } from "../../../shared/storage";

export default function SkillList({ skills }: { skills: SkillAggregate[] }) {
  const [skillTexts, setSkillTexts] = useState<Array<{
    normalizedText: string;
    displayText: string;
  }>>([]);

  function getSkillTexts() {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'getSkillTexts',
      args: []
    }, response => {
      if (response.ok) {
        setSkillTexts(response.result as any);
      } else {
        console.log('error', response);
      }
    })
  }

  useEffect(() => {
    getSkillTexts();

    chrome.runtime.onMessage.addListener((
      message: SynonymUpdatedMessage
    ) => {
      if (message.type == 'SYNONYM_UPDATED') {
        getSkillTexts();
      }
    });
  }, []);

  return (
    <section id="skillList" className="skill-list" aria-live="polite">
      {skills.map((skill, idx) => <Skill key={idx} skill={skill} skillTexts={skillTexts} />)}
    </section>
  )
}
