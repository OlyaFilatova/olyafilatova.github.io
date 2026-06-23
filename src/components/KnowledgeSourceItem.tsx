import { useContext } from 'react'
import './KnowledgeSourceItem.css'
import { LanguageContext } from '../i18n/config'
import type { KnowledgeSource } from '../schemas/knowledge-source';

function KnowledgeSourceItem({ source }: {source: KnowledgeSource}) {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className="item knowledge-source">
      <div className="title">{source.title[currentLanguage]}</div>

      <div className="meta">
        {source.access} · {source.kind} · {source.link}
      </div>

      {source.status}
    </div>
  )
}

export default KnowledgeSourceItem
