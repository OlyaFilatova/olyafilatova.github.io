import { useEffect, useState } from 'react';
import './App.css';
import { getCurrentAdapter } from '../shared/adapters/current';
import { WebsiteAdapter } from '../shared/adapters/types';
import { notifyJobPageOpened } from './notifications';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    const adapter: WebsiteAdapter | undefined = getCurrentAdapter(url);

    if (adapter) {
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
