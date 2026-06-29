import { useContext, useEffect } from 'react'

import './Home.css'

import { texts } from '../i18n/home'
import { LanguageContext } from '../i18n/config'
import Icon from '../components/Icon';

function Home() {
  const currentLanguage = useContext(LanguageContext);

  useEffect(() => {
    document.title = texts.page_title[currentLanguage];
  }, [currentLanguage]);

  return (
    <div className='home'>
      <h1>{texts.name[currentLanguage]}</h1>
      <section className='personal-details'>
        <div>{texts.specialization[currentLanguage]}</div>
        <Icon iconClass='icss-door'>{texts.job_status[currentLanguage]}</Icon>
        <Icon iconClass='icss-map-marker'>{texts.location[currentLanguage]}</Icon>
        <Icon iconClass='icss-clock'>{texts.work_hours[currentLanguage]}</Icon>
      </section>
      <section>
        <h2>{texts.contacts[currentLanguage]}</h2>
        <p>{texts.contact_me[currentLanguage]}</p>
        <ul className='contacts-list'>
          <li><Icon iconClass='icss-envelope'><a href="mailto:olyafilatov@gmail.com">olyafilatov@gmail.com</a></Icon></li>
          <li><Icon iconClass='icss-phone'><a href="tel:+380687904383">+38 (068) 790-43-83</a></Icon></li>
          <li><Icon iconClass='icss-whatsapp'><a target="_blank" href="https://wa.me/+380687904383">https://wa.me/+380687904383</a></Icon></li>
          <li><Icon iconClass='icss-linkedin'><a target="_blank" href="https://www.linkedin.com/in/olha-filatova-dev/">https://www.linkedin.com/in/olha-filatova-dev/</a></Icon></li>
          <li><Icon iconClass='icss-github-o'><a target="_blank" href="https://github.com/OlyaFilatova">https://github.com/OlyaFilatova</a></Icon></li>
        </ul>
      </section>
    </div>
  )
}

export default Home
