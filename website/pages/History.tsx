import { useContext, useEffect } from 'react';

import './History.css';

import TimelineItem from '../components/TimelineItem';
import { experience } from '../data/experience';
import { LanguageContext } from '../i18n/config';
import { texts } from '../i18n/history';

function History() {
  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    document.title = texts.page_title[currentLanguage];
  }, [currentLanguage]);

  return (
    <div className='timeline'>
      {experience.toReversed().map((event, idx) => <TimelineItem key={idx} experience={event} />)}
    </div>
  )
}

export default History
