import { Tab, TabId } from "../types/skill-synonyms";

export default function Tabs({ tabs, chosenTab, setChosenTab }: {
  tabs: Tab[];
  chosenTab: TabId;
  setChosenTab: React.Dispatch<React.SetStateAction<TabId>>
}) {
  return (
    <nav className="tabs" role="tablist" aria-label="Side panel sections">
      {
        tabs.map(tab => <button
          id={tab.id}
          className={["tabs__button", ...(tab.id == chosenTab ? ["tabs__button--active"] : [])].join(' ')}
          type="button"
          role="tab"
          aria-selected={tab.id == chosenTab}
          aria-controls={tab.panel}
          onClick={() => setChosenTab(tab.id)}
        >
          {tab.text}
        </button>)
      }
    </nav>
  )
}

