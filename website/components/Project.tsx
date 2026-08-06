import parse from 'html-react-parser';

import './Project.css';

function ProjectItem({ source }: {source: string}) {
  return (
    <article className="project">
      {parse(source)}
    </article>
  )
}

export default ProjectItem
