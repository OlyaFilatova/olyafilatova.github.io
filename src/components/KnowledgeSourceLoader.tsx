import { useState, useEffect } from 'react'
import './KnowledgeSourceItem.css'
import { KnowledgeSource } from '../schemas/knowledge-source';
import KnowledgeSourceItem from './KnowledgeSourceItem';

function KnowledgeSourceLoader({ filePath }: {filePath: string}) {
  const [source, setSource] = useState<KnowledgeSource | undefined>()

  function loadData(filePath: string, retriesCount = 0, maxRetriesCount = 5) {
    fetch(filePath).then(async resp => {
      setSource(KnowledgeSource.parse(await resp.json()));
    }).catch(async () => {
      if (retriesCount < maxRetriesCount) {
        setTimeout(() => loadData(filePath, retriesCount + 1), 100);
      }
    })
  }

  useEffect(() => {
    loadData(filePath);
  }, []);

  return (
    source && <KnowledgeSourceItem source={source} />
  )
}

export default KnowledgeSourceLoader
