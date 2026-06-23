import './KnowledgeSources.css';
import KnowledgeSource from '../components/KnowledgeSourceItem';
import { knowledgeSources } from '../data/knowledge-sources';

function KnowledgeSources() {
  return (
    <div className='knw-source'>
      {knowledgeSources.map(source => <KnowledgeSource source={source} />)}
    </div>
  )
}

export default KnowledgeSources
