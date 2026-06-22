import { useState } from 'react'
import './App.css'
import Sidebar from './components/sidebar'
import { texts } from './i18n/app'
import { changeCurrentLanguage, getCurrentLanguage, LanguageContext, type Language } from './i18n/config'

function App() {
  const [currentLanguage, setLang] = useState<Language>(getCurrentLanguage());

  return (
    <LanguageContext.Provider value={currentLanguage}>
      <div className='app'>
        <div className='app-sidebar'>
          <Sidebar onLangChange={lang => {
            changeCurrentLanguage(lang);
            setLang(lang);
          }} />
        </div>
        <div className='app-content'>{texts.welcome[currentLanguage]}</div>
      </div>
    </LanguageContext.Provider>
  )
}

export default App
