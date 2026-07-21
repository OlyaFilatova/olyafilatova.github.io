import { useContext, useEffect, useState } from 'react';

import './KnowledgeSources.css';

import { LanguageContext } from '../i18n/config';
import { texts } from '../i18n/knowledge-sources';
import { index } from '../data/knowledge-sources-index';
import KnowledgeSourceLoader from '../components/KnowledgeSourceLoader';

function KnowledgeSources() {
  const [knowledgeSources, setKnowledgeSources] = useState<[string, number][]>([]);

  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    document.title = texts.page_title[currentLanguage];
  }, [currentLanguage]);

  function getFilesToLoad() {
    const prefix = import.meta.env.DEV ? 'src/' : '';
    const dirPath = 'assets/knowledge-sources/';
    const pageSize = index.count;
    return [...Array(pageSize).keys()].map(index => [`${prefix}${dirPath}${index}.json`, index] satisfies [string, number]).toReversed();
  }

  useEffect(() => {
    setKnowledgeSources(getFilesToLoad());
  }, [])

  return (
    <div className='knw-source'>
      {knowledgeSources.map(([source, idx], key) => <KnowledgeSourceLoader key={key} idx={idx} filePath={source} />)}
    </div>
  )
}

export default KnowledgeSources
