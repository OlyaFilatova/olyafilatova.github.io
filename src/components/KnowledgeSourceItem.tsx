import { useContext } from 'react'
import './KnowledgeSourceItem.css'
import { LanguageContext } from '../i18n/config'
import type { KnowledgeSource } from '../schemas/knowledge-source';
import { statusTextMapping } from '../i18n/knowledge-sources';

function KnowledgeSourceItem({ source }: {source: KnowledgeSource}) {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className="item knowledge-source">
      <div className="title">{source.title[currentLanguage]}</div>

      <div className="meta">
        {source.access} · {source.kind} · {statusTextMapping[source.status][currentLanguage]}
      </div>
      <a href={source.link} target='_blank'>{source.link}</a>
      <ul>
        {source.thoughts.map(thought => <li>{thought[currentLanguage]}</li>)}
      </ul>
    </div>
  )
}

export default KnowledgeSourceItem
