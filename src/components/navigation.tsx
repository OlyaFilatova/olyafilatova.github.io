import { useContext } from 'react'
import './Navigation.css'
import { texts_navigation } from '../i18n/navigation'
import { LanguageContext } from '../i18n/config'

function Navigation() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className='navigation'>
      <a>{texts_navigation.books[currentLanguage]}</a>
      <a>{texts_navigation.history[currentLanguage]}</a>
    </div>
  )
}

export default Navigation
