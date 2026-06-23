import { useContext } from 'react'
import { texts } from '../i18n/home'
import { LanguageContext } from '../i18n/config'
import './Home.css'
import Icon from '../components/Icon';

function Home() {
  const currentLanguage = useContext(LanguageContext);

  return (
    <div className='home'>
      <h1>{texts.name[currentLanguage]}</h1>
      <div className='personal-details'>
        <div>{texts.specialization[currentLanguage]}</div>
        <Icon iconClass='icss-door'>{texts.job_status[currentLanguage]}</Icon>
        <Icon iconClass='icss-map-marker'>{texts.location[currentLanguage]}</Icon>
        <Icon iconClass='icss-clock'>{texts.work_hours[currentLanguage]}</Icon>
      </div>
      <h2>{texts.contacts[currentLanguage]}</h2>
      <p>{texts.contact_me[currentLanguage]}</p>
      <ul className='contacts-list'>
        <li><Icon iconClass='icss-envelope'><a href="mailto:olyafilatov@gmail.com">olyafilatov@gmail.com</a></Icon></li>
        <li><Icon iconClass='icss-phone'><a href="tel:+380687904383">+38 (068) 790-43-83</a></Icon></li>
        <li><Icon iconClass='icss-whatsapp'><a href="https://wa.me/+380687904383">Whatsapp</a></Icon></li>
        <li><Icon iconClass='icss-linkedin'><a href="https://www.linkedin.com/in/olha-filatova-dev/">LinkedIn</a></Icon></li>
        <li><Icon iconClass='icss-github-o'><a href="https://github.com/OlyaFilatova">GitHub</a></Icon></li>
      </ul>
    </div>
  )
}

export default Home
