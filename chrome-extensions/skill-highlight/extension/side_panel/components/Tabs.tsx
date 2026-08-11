export default function Tabs({ tabs, activeTab }: {
  tabs: Array<{
    id: string;
    text: string;
    panel: string;
  }>;
  activeTab: string;
}) {
  return (
    <nav className="tabs" role="tablist" aria-label="Side panel sections">
      {
        tabs.map(tab => <button
          id={tab.id}
          className={["tabs__button", ...(tab.id == activeTab ? ["tabs__button--active"] : [])].join(' ')}
          type="button"
          role="tab"
          aria-selected={tab.id == activeTab}
          aria-controls={tab.panel}
        >
          {tab.text}
        </button>)
      }
    </nav>
  )
}

