import { useEffect, useContext, useState } from 'react'
import photo from '../assets/photo-250.jpg'
import './Sidebar.css'
import type { Language } from '../i18n/config'
import { languages, LanguageContext } from '../i18n/config'
import Navigation from './Navigation'
import { texts } from '../i18n/sidebar'

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
        <nav className='languages' aria-label={texts.language_selector[currentLanguage]}>
          {languages.map(lang => <button key={lang} className={lang == currentLanguage ? 'selected-lang' : 'lang'} onClick={() => changeLanguage(lang)}>{lang}</button>)}
        </nav>
        <a className='cv-link' href={texts.cv_link[currentLanguage]} download>{texts.download_cv[currentLanguage]}</a>
      </div>
    </>
  )
}

export default Sidebar
