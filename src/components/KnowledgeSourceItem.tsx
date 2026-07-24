import { useContext } from 'react'
import './KnowledgeSourceItem.css'
import { LanguageContext } from '../i18n/config'
import type { KnowledgeSource } from '../schemas/knowledge-source';
import { statusTextMapping, texts } from '../i18n/knowledge-sources';
import React from 'react';

function KnowledgeSourceItem({ source }: {source: KnowledgeSource}) {
  const currentLanguage = useContext(LanguageContext);
  const separator = ' · ';

  function renderThoughts(thoughts: NonNullable<KnowledgeSource["thoughts"]>) {
    return <ul>
        {thoughts.map((thought, idx) => <li key={idx}><p>{thought[currentLanguage]}</p></li>)}
      </ul>;
  }

  return (
    <article className="item knowledge-source">
      <header>
        <h2 className="title">{source.title[currentLanguage]}</h2>

        <hgroup className="meta">
          {source.access}{separator}{source.kind}{separator}{statusTextMapping[source.status][currentLanguage]}
          {!source.date ? undefined : <>{separator}{texts.last_reviewed[currentLanguage]}: {source.date.toDateString()}</>}
        </hgroup>
        {source.categories ? <div className="meta">
          {source.categories.map((category, idx) => <React.Fragment key={idx}>
            {idx != 0 ? separator : undefined}
            <span>{category}</span>
          </React.Fragment>)}
        </div> : undefined}
        <a href={source.link} target='_blank'>{source.link}</a>
      </header>
      {!source.thoughts ? undefined :
        source.thoughts.length == 1 ? renderThoughts(source.thoughts) : <details>
          <summary>{source.thoughts[0][currentLanguage]}</summary>
          {renderThoughts(source.thoughts.slice(1))}
        </details> }
    </article>
  )
}

export default KnowledgeSourceItem
