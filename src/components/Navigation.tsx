import { useContext } from 'react'
import './Navigation.css'
import { texts_navigation } from '../i18n/navigation'
import { LanguageContext } from '../i18n/config'

function Navigation({ onLinkClicked } : { onLinkClicked: () => void}) {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className='navigation'>
      <a onClick={onLinkClicked} href="/">{texts_navigation.main[currentLanguage]}</a>
      <a onClick={onLinkClicked} href="/#/knowledge-sources">{texts_navigation.books[currentLanguage]}</a>
      <a onClick={onLinkClicked} href="/#/history">{texts_navigation.history[currentLanguage]}</a>
    </div>
  )
}

export default Navigation
