import { useContext } from 'react'
import './Navigation.css'
import { texts_navigation } from '../i18n/navigation'
import { LanguageContext } from '../i18n/config'

function Navigation() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className='navigation'>
      <a href="/">{texts_navigation.main[currentLanguage]}</a>
      <a href="/knowledge-sources">{texts_navigation.books[currentLanguage]}</a>
      <a href="/history">{texts_navigation.history[currentLanguage]}</a>
    </div>
  )
}

export default Navigation
