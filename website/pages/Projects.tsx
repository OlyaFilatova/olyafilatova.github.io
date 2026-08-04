import { useContext, useEffect, useState } from 'react';

import './Projects.css';

import { LanguageContext, type Language } from '../i18n/config';
import { texts } from '../i18n/projects';
import ProjectLoader from '../components/ProjectLoader';
import { index } from '../data/projects-index';

function KnowledgeSources() {
  const [projects, setProjects] = useState<{
    dirPath: string;
    translations: Record<Language, string>;
  }[]>([]);

  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    document.title = texts.page_title[currentLanguage];
  }, [currentLanguage]);

  function getFilesToLoad() {
    const dirPath = 'assets/projects/';
    return index.map(({ translations }) => ({
      dirPath,
      translations
    })).toReversed();
  }

  useEffect(() => {
    setProjects(getFilesToLoad());
  }, [])

  return (
    <div className='project'>
      {projects.map((project, key) => <ProjectLoader key={key} project={project} />)}
    </div>
  )
}

export default KnowledgeSources
