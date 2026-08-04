import { useState, useEffect } from 'react'
import Project from './Project';
import { bustCache } from '../data/projects-index';

function ProjectLoader({ filePath }: { filePath: string; }) {
  const [source, setSource] = useState<string | undefined>()

  function loadData(filePath: string, retriesCount = 0, maxRetriesCount = 5) {
    fetch(filePath).then(async resp => {
      setSource(await resp.text());
    }).catch(async () => {
      if (retriesCount < maxRetriesCount) {
        setTimeout(() => loadData(filePath, retriesCount + 1), 100);
      }
    })
  }

  useEffect(() => {
    loadData(filePath + '?cb=' + bustCache);
  }, []);

  return (
    source && <Project source={source} />
  )
}

export default ProjectLoader
