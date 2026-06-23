import { useContext } from 'react'
import { texts } from '../i18n/knowledge_sources'
import { LanguageContext } from '../i18n/config'

function KnowledgeSources() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div>{texts.welcome[currentLanguage]}</div>
  )
}

export default KnowledgeSources
