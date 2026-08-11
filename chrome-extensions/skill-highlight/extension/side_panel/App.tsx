import './App.css';
import SkillsPanel from './components/SkillsPanel';
import SkillSynonymsPanel from './components/SkillSynonymsPanel';
import Tabs from './components/Tabs';
export default function App() {
  const tabs = [
    {
      id: "skillsTab",
      text: "Skills",
      panel: "skillsPanel"
    },
    {
      id: "synonymGroupsTab",
      text: "Suggested synonym groups",
      panel: "synonymGroupsPanel"
    }
  ];
  return (
    <main className="app">
      <Tabs
        activeTab='skillsTab'
        tabs={tabs}
       />

      <div id={tabs[0].panel} role="tabpanel" aria-labelledby={tabs[0].id}>
        <SkillsPanel />
      </div>

      <div id={tabs[1].panel} role="tabpanel" aria-labelledby={tabs[1].id} hidden>
        <SkillSynonymsPanel />
      </div>
    </main>
  );
}



// function deactivateTab(tab: HTMLButtonElement | null, panel: HTMLElement | null) {
//   tab?.classList.remove("tabs__button--active");
//   tab?.setAttribute("tabindex", "-1");
//   tab?.setAttribute("aria-selected", "false");
//   panel?.setAttribute("hidden", "true");
// }

// function activateTab(tab: HTMLButtonElement | null, panel: HTMLElement | null) {
//   tab?.classList.toggle("tabs__button--active");
//   tab?.setAttribute("tabindex", "0");
//   tab?.setAttribute("aria-selected", "true");
//   panel?.toggleAttribute("hidden", false);
// }

// function setActiveTab(activeTab: "skills" | "synonymGroups" | "jobMatches"): void {
//   deactivateTab(elements.skillsTab, elements.skillsPanel);
//   deactivateTab(elements.synonymGroupsTab, elements.synonymGroupsPanel);
//   deactivateTab(elements.jobMatchesTab, elements.jobMatchesPanel);

//   switch (activeTab) {
//     case "skills":
//       activateTab(elements.skillsTab, elements.skillsPanel);
//       break;
//     case "synonymGroups":
//       activateTab(elements.synonymGroupsTab, elements.synonymGroupsPanel);
//       break;
//     case "jobMatches":
//       activateTab(elements.jobMatchesTab, elements.jobMatchesPanel);
//       break;
//   }
// }