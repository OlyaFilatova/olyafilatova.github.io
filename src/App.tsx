import { useState, useEffect } from 'react'
import photo from './assets/photo.jpg'
import './App.css'
import { texts } from './i18n/app'
import type { Language } from './i18n/config'
import { getCurrentLanguage, changeCurrentLanguage, languages } from './i18n/config'

function App() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  function changeLanguage(lang: Language) {
    changeCurrentLanguage(lang);
    setCurrentLang(lang);
  }

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <div className='profile'>
      <div>
        <img className='profile-img' src={photo} />
      </div>
      <div className='welcome'>{texts["welcome"][currentLang]}</div>
      <a className='profile-link' href='https://github.com/OlyaFilatova' target='_blank'>GitHub</a>
      <div className='languages'>
        {languages.map(lang => <button key={lang} className={lang == currentLang ? 'selected-lang' : 'lang'} onClick={() => changeLanguage(lang)}>{lang}</button>)}
      </div>
    </div>
  )
}

export default App
