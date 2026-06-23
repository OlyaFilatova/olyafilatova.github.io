import { useContext } from 'react';
import { texts } from '../i18n/history';
import './history.css';
import { LanguageContext } from '../i18n/config';
import TimelineItem from '../components/TimelineItem';

function History() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className='timeline'>
      <TimelineItem />
      <TimelineItem />
      <TimelineItem />
      <TimelineItem />
    </div>
  )
}

export default History
