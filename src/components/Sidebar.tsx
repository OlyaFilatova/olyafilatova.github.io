import { useEffect, useContext, useState } from 'react'
import photo from '../assets/photo.jpg'
import './Sidebar.css'
import type { Language } from '../i18n/config'
import { languages, LanguageContext } from '../i18n/config'
import Navigation from './Navigation'

function Sidebar({ onLangChange }: {
  onLangChange: (lang: Language) => void
}) {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const currentLanguage = useContext(LanguageContext);

  function changeLanguage(lang: Language) {
    onLangChange(lang);
  }

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <>
      <div className={`sidebar-opener${sidebarOpened ? ' opened' : ''}`} onClick={() => setSidebarOpened(!sidebarOpened)}>
        <div className='sidebar-opener-bar'></div>
      </div>
      <div className={`sidebar${sidebarOpened ? ' opened' : ''}`}>
        <div>
          <img className='sidebar-img' src={photo} />
        </div>
        <Navigation onLinkClicked={() => setSidebarOpened(false)} />
        <div className='languages'>
          {languages.map(lang => <button key={lang} className={lang == currentLanguage ? 'selected-lang' : 'lang'} onClick={() => changeLanguage(lang)}>{lang}</button>)}
        </div>
        <a className='outside-link' href='https://github.com/OlyaFilatova' target='_blank'>GitHub</a>
      </div>
    </>
  )
}

export default Sidebar
