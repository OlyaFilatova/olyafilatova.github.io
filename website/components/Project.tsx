import parse from 'html-react-parser';

function ProjectItem({ source }: {source: string}) {
  return (
    <article className="item knowledge-source">
      {parse(source)}
    </article>
  )
}

export default ProjectItem
