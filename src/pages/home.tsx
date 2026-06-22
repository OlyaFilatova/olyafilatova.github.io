import { useContext } from 'react'
import { texts } from '../i18n/home'
import { LanguageContext } from '../i18n/config'

function Home() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div>{texts.welcome[currentLanguage]}</div>
  )
}

export default Home
