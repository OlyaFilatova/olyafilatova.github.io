import { useState, useEffect, useContext } from 'react'
import Project from './Project';
import { bustCache } from '../data/projects-index';
import { LanguageContext, type Language } from '../i18n/config';

function ProjectLoader({ project }: {project: {
    dirPath: string;
    translations: Record<Language, string>;
  }}) {
  const [source, setSource] = useState<string | undefined>()

  const currentLanguage = useContext(LanguageContext);

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
    loadData(`${project.dirPath}${project.translations[currentLanguage]}` + '?cb=' + bustCache);
  }, [currentLanguage]);

  return (
    source && <Project source={source} />
  )
}

export default ProjectLoader
