import { useEffect, useState } from 'react';
import './App.css';
import { getCurrentAdapter } from '../shared/adapters/current';
import { WebsiteAdapter } from '../shared/adapters/types';
import { notifyJobPageOpened } from './notifications';
import { ExtensionMessage, Familiarity, SkillType, Temperature } from '../shared/types';
import { highlightSkillsInElement } from './highlight';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    const adapter: WebsiteAdapter | undefined = getCurrentAdapter(url);

    if (adapter) {
      chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
        if (message.type === "SKILLS_PARSED") {
          highlightSkillsInElement(pageContext.descriptionEl!, message.skills.map(skill => ({
            normalizedText: skill[1], // string;
            text: skill[0].text, // string;
            familiarity: skill[0].familiarity as Familiarity,
            temperature: skill[0].temperature as Temperature,
            type: skill[0].type as SkillType,
            ...(skill[0].normalized_text != skill[1] ? {parentSkillId: skill[0].normalized_text} : {})
          })));
        }
      });

      const pageContext = {
        url,
        category: adapter.getPageCategory(),
        company: adapter.getCompany(),
        descriptionEl: adapter.getDescriptionEl()!
      };

      if (adapter.identifyPageType(url) == 'job') {
        notifyJobPageOpened({
          body: pageContext.descriptionEl.innerText,
          category: pageContext.category,
          company: pageContext.company,
          url: pageContext.url
        });
      }

    }
  }, []);

  return (
    <>{
      isOpened ? 'Hello from JSX Content!' : ''
    }</>
  );
}
