import { useContext } from 'react'
import './TimelineItem.css'
import { LanguageContext } from '../i18n/config'
import type { Experience } from '../schemas/experience';

function TimelineItem({ experience }: {experience: Experience}) {
  const currentLanguage = useContext(LanguageContext);

  return experience.kind == 'education' ? (
    <section className="item education">
      <div className="year">{experience.year[currentLanguage]}</div>

      <div className="spine">
        <div className="dot diamond-clip"></div>
      </div>

      <div className="content">
        <h2 className="title">{experience.specialization[currentLanguage]}</h2>

        <div className="meta">
          {experience.year[currentLanguage]} · {experience.location[currentLanguage]}
        </div>

        {experience.skills && <ul className="list">
          {experience.skills.map(skill => <li>{skill[currentLanguage]}</li>)}
        </ul>}
      </div>
    </section>
  ) : (
    <section className="item job">
      <div className="year">{experience.from[currentLanguage]}<br/> {experience.to[currentLanguage]}</div>

      <div className="spine">
        <div className="dot"></div>
      </div>

      <div className="content">
        <h2 className="title">{experience.position[currentLanguage]}</h2>

        <div className="meta">
          {experience.tech_stack[currentLanguage]}
        </div>

        {experience.projects && <ul className="list">
          {experience.projects.map(project => <li>{project[currentLanguage]}</li>)}
        </ul>}

        {experience.skills && <ul className="list">
          {experience.skills.map(skill => <li>{skill[currentLanguage]}</li>)}
        </ul>}
      </div>
    </section>
  )
}

export default TimelineItem
