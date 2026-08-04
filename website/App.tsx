import { useState } from 'react'
import { HashRouter, Routes, Route } from "react-router-dom";

import './App.css'
import Sidebar from './components/Sidebar'
import { changeCurrentLanguage, getCurrentLanguage, LanguageContext, type Language } from './i18n/config'
import KnowledgeSources from './pages/KnowledgeSources';
import History from './pages/History';
import Home from './pages/Home';

function App() {
  const [currentLanguage, setLang] = useState<Language>(getCurrentLanguage());

  return (
    <LanguageContext.Provider value={currentLanguage}>
      <div className='app'>
        <HashRouter>
          <div className='app-sidebar'>
            <Sidebar onLangChange={lang => {
              changeCurrentLanguage(lang);
              setLang(lang);
            }} />
          </div>
          <main className='app-content'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/knowledge-sources" element={<KnowledgeSources />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </HashRouter>
      </div>
    </LanguageContext.Provider>
  )
}

export default App
