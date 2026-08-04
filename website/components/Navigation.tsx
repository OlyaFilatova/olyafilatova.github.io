import { useContext } from 'react'
import './Navigation.css'
import { texts_navigation } from '../i18n/navigation'
import { LanguageContext } from '../i18n/config'
import { Link } from 'react-router-dom';

function Navigation({ onLinkClicked } : { onLinkClicked: () => void}) {
  const currentLanguage = useContext(LanguageContext);

  return (
    <nav className='navigation'>
      <Link onClick={onLinkClicked} to="/">{texts_navigation.main[currentLanguage]}</Link>
      <Link onClick={onLinkClicked} to="/knowledge-sources">{texts_navigation.books[currentLanguage]}</Link>
      <Link onClick={onLinkClicked} to="/projects">{texts_navigation.projects[currentLanguage]}</Link>
      <Link onClick={onLinkClicked} to="/history">{texts_navigation.history[currentLanguage]}</Link>
    </nav>
  )
}

export default Navigation
