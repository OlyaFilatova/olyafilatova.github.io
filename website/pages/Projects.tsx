import { useContext, useEffect, useState } from 'react';

import './Projects.css';

import { LanguageContext } from '../i18n/config';
import { texts } from '../i18n/projects';
import ProjectLoader from '../components/ProjectLoader';
import { index } from '../data/projects-index';

function KnowledgeSources() {
  const [projects, setProjects] = useState<string[]>([]);

  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    document.title = texts.page_title[currentLanguage];
  }, [currentLanguage]);

  function getFilesToLoad() {
    const dirPath = 'assets/projects/';
    return index.map(fileName => `${dirPath}${fileName}`).toReversed();
  }

  useEffect(() => {
    setProjects(getFilesToLoad());
  }, [])

  return (
    <div className='project'>
      {projects.map((filePath, key) => <ProjectLoader key={key} filePath={filePath} />)}
    </div>
  )
}

export default KnowledgeSources
