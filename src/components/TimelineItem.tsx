import { useContext } from 'react'
import './TimelineItem.css'
import { LanguageContext } from '../i18n/config'

function Navigation() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className="item">
      <div className="year">2026</div>

      <div className="spine">
        <div className="dot"></div>
      </div>

      <div className="content">
        <div className="title">Job Chronology page</div>

        <div className="meta">
          June 2026 · Placeholder
        </div>

        <div className="text">
          The chronology page is under development. TODO:
        </div>

        <ul className="list">
          <li>Add Job history</li>
          <li>Use i18n</li>
          <li>Improve styles as needed</li>
        </ul>

      </div>
    </div>
  )
}

export default Navigation
