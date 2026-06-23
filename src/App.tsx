import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";

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
        <div className='app-sidebar'>
          <Sidebar onLangChange={lang => {
            changeCurrentLanguage(lang);
            setLang(lang);
          }} />
        </div>
        <div className='app-content'>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/knowledge-sources" element={<KnowledgeSources />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </LanguageContext.Provider>
  )
}

export default App
