import { useState, useEffect } from 'react'
import './KnowledgeSourceItem.css'
import { KnowledgeSource } from '../schemas/knowledge-source';
import KnowledgeSourceItem from './KnowledgeSourceItem';

function KnowledgeSourceLoader({ filePath }: {filePath: string}) {
  const [source, setSource] = useState<KnowledgeSource | undefined>()
  useEffect(() => {
    fetch(filePath).then(async resp => {
      setSource(KnowledgeSource.parse(await resp.json()))
    })
  }, []);

  return (
    source && <KnowledgeSourceItem source={source} />
  )
}

export default KnowledgeSourceLoader
