import './history.css';
import TimelineItem from '../components/TimelineItem';
import { experience } from '../data/experience';

function History() {
  return (
    <div className='timeline'>
      {experience.toReversed().map(event => <TimelineItem experience={event} />)}
    </div>
  )
}

export default History
