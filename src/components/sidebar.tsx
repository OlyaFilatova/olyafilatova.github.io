import { useEffect, useContext } from 'react'
import photo from '../assets/photo.jpg'
import './Sidebar.css'
import type { Language } from '../i18n/config'
import { languages, LanguageContext } from '../i18n/config'

function Sidebar({ onLangChange }: {
  onLangChange: (lang: Language) => void
}) {
  const currentLanguage = useContext(LanguageContext);

  function changeLanguage(lang: Language) {
    onLangChange(lang);
  }

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <div className='sidebar'>
      <div>
        <img className='sidebar-img' src={photo} />
      </div>
      <a className='outside-link' href='https://github.com/OlyaFilatova' target='_blank'>GitHub</a>
      <div className='languages'>
        {languages.map(lang => <button key={lang} className={lang == currentLanguage ? 'selected-lang' : 'lang'} onClick={() => changeLanguage(lang)}>{lang}</button>)}
      </div>
    </div>
  )
}

export default Sidebar
