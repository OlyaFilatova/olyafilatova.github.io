import { useContext, useEffect } from 'react';

import './KnowledgeSources.css';

import KnowledgeSource from '../components/KnowledgeSourceItem';
import { knowledgeSources } from '../data/knowledge-sources';
import { LanguageContext } from '../i18n/config';
import { texts } from '../i18n/knowledge-sources';

function KnowledgeSources() {
  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    document.title = texts.page_title[currentLanguage];
  }, [currentLanguage]);

  return (
    <div className='knw-source'>
      {knowledgeSources.map(source => <KnowledgeSource source={source} />)}
    </div>
  )
}

export default KnowledgeSources
