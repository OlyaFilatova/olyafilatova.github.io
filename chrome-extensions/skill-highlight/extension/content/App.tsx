import { useEffect, useState } from 'react';
import { getCurrentAdapter } from '../shared/adapters/current';
import { notifyJobListPageOpened, notifyJobPageOpened, notifySkillEditTriggered, notifySkillSaveTriggered } from '../shared/notifications';
import { ContentMessage, ContentMessageType, Familiarity, ReloadHighlightsMessage, SkillEditedMessage, SkillSavedMessage, SkillsParsedMessage, SkillType, Temperature, VisitedLinksParsedMessage } from '../shared/types';
import { highlightSavedSkill, highlightSkillsInElement, updateSkillHighlightFamiliarity, updateSkillHighlightSkillType, updateSkillHighlightTemperature } from './highlight';
import { selectionIsInside } from './dom-utils';
import { FAMILIARITIES, SKILL_TYPES, TEMPERATURES } from '../side_panel/config';

export default function App() {
  const [selectionPopupOpened, setSelectionPopupOpened] = useState(false);
  const [highlightPopupOpened, setHighlightPopupOpened] = useState(false);
  const [selectionText, setSelectionText] = useState("");
  const [normalizedText, setNormalizedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | undefined>();
  const [savePopupLocation, setSavePopupLocation] = useState<{
    left: string;
    top: string;
  }>({
    left: "0px",
    top: "0px"
  });

  function getPageContext() {
    const url = window.location.href;
    const adapter = getCurrentAdapter(url);

    if (!adapter) {
      throw new Error('Page not identified correctly.')
    }

    return {
      url,
      adapter,
      category: adapter.getPageCategory(),
      company: adapter.getCompany(),
      descriptionEl: adapter.getDescriptionEl()!
    };
  }

  const eventListeners: Record<ContentMessageType, (message: any) => void> = {
    SKILLS_PARSED: (message: SkillsParsedMessage) => {
      const pageContext = getPageContext();

      highlightSkillsInElement(pageContext.descriptionEl!, message.skills.map(skill => ({
        normalizedText: skill[1], // string;
        text: skill[0].text, // string;
        familiarity: skill[0].familiarity as Familiarity,
        temperature: skill[0].temperature as Temperature,
        type: skill[0].type as SkillType,
      })))
    },
    VISITED_LINKS_PARSED: (message: VisitedLinksParsedMessage) => {
      const pageContext = getPageContext();

      pageContext.adapter.stylizeVisitedLinks(message.links)
    },
    RELOAD_HIGHLIGHTS: (message: ReloadHighlightsMessage) => {
      const pageContext = getPageContext();
      notifyJobPageOpened({
        body: pageContext.descriptionEl.innerText,
        category: pageContext.category,
        company: pageContext.company,
        url: pageContext.url
      });
    },
    SKILL_SAVED: (message: SkillSavedMessage) => {
      const pageContext = getPageContext();
      setSelectionPopupOpened(false);
      window.getSelection()?.removeAllRanges();
      highlightSavedSkill(pageContext.descriptionEl!, message)
    },
    SKILL_EDITED: (message: SkillEditedMessage) => {
      const context = getPageContext();
      setHighlightPopupOpened(false);
      if (context.descriptionEl) {
        if (message.familiarity) {
          updateSkillHighlightFamiliarity(context.descriptionEl, message.normalizedText, message.familiarity);
        }
        if (message.skillType) {
          updateSkillHighlightSkillType(context.descriptionEl, message.normalizedText, message.skillType);
        }
        if (message.temperature) {
          updateSkillHighlightTemperature(context.descriptionEl, message.normalizedText, message.temperature);
        }
      }
    }
  };

  async function saveSelectedSkill(): Promise<void> {
    notifySkillSaveTriggered({
      displayText: selectionText,
      url: window.location.href
    })
  }

  async function updateFamiliarity(normalizedText: string, familiarity: Familiarity): Promise<void> {
    notifySkillEditTriggered({
      normalizedText,
      url: window.location.href,
      familiarity
    });
  }

  async function updateSkillTemperature(normalizedText: string, temperature: Temperature): Promise<void> {
    notifySkillEditTriggered({
      normalizedText,
      url: window.location.href,
      temperature
    });
  }

  async function updateSkillType(normalizedText: string, skillType: SkillType): Promise<void> {
    notifySkillEditTriggered({
      normalizedText,
      url: window.location.href,
      skillType: skillType
    });
  }

  function bindSelectionSave(descriptionEl: HTMLElement): void {
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selectionIsInside(selection, descriptionEl)) {
        setSelectionPopupOpened(false);
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText) {
        setSelectionPopupOpened(false);
        return;
      }

      setSelectionText(selectedText);
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectionRect(rect);
      setSavePopupLocation({
        left: `${Math.min(rect.left, window.innerWidth - 110)}px`,
        top: `${Math.max(rect.top - 38, 8)}px`
      });
      setSelectionPopupOpened(true);
    });

    document.addEventListener("mousedown", (event) => {
      const target = event.target as Node | null;

      setSelectionPopupOpened(false);
      setHighlightPopupOpened(false);
    });
  }

  function bindHighlightClicks(root: Document | HTMLElement): void {
    root.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".skill-highlight");
      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setNormalizedText(target.dataset.normalizedText || '');

      const rect = target.getBoundingClientRect();
      setSavePopupLocation({
        left: `${Math.min(rect.left, window.innerWidth - 300 - 12)}px`,
        top: `${Math.min(rect.bottom + 8, window.innerHeight - 307 - 12)}px`,
      });
      setHighlightPopupOpened(true);
    });

    root.addEventListener("keydown", (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") {
        return;
      }

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".skill-highlight");
      if (!target) {
        return;
      }

      event.preventDefault();
      setNormalizedText(target.dataset.normalizedText || '');

      const rect = target.getBoundingClientRect();
      setSavePopupLocation({
        left: `${Math.min(rect.left, window.innerWidth - 12)}px`,
        top: `${Math.min(rect.bottom + 8, window.innerHeight - 12)}px`,
      });
    });
  }

  useEffect(() => {
    const url = window.location.href;
    const adapter = getCurrentAdapter(url);

    if (adapter) {
      chrome.runtime.onMessage.addListener((message: ContentMessage, sender, sendResponse) => {
        const type = message.type;
        if (type in eventListeners) {
          eventListeners[type](message);
          sendResponse({ ok: true});
        }
      });

      const pageContext = getPageContext()

      const pageType = adapter.identifyPageType(url);
      if (pageType == 'job') {
        notifyJobPageOpened({
          body: pageContext.descriptionEl.innerText,
          category: pageContext.category,
          company: pageContext.company,
          url: pageContext.url
        });

        bindSelectionSave(pageContext.descriptionEl);
        bindHighlightClicks(document);
      } else if (pageType == 'jobs-list') {
        const stylizeVisitedLinks = function stylizeVisitedLinks() {
          const links = adapter.getLinks();

          notifyJobListPageOpened({
            links,
            url: pageContext.url
          });
        }

        adapter.setupJobListPageChangedObserver();
        adapter.addJobListPageChangedObserver(stylizeVisitedLinks);

        stylizeVisitedLinks();
      }
    }
  }, []);

  return (
    <>
      {selectionPopupOpened ? <div className="save-skill-popover" style={{
        left: savePopupLocation.left,
        top: savePopupLocation.top
      }}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}>
        <button
          type='button'
          className='save-skill-button'
          onClick={() => void saveSelectedSkill()}>Save Skill</button>
      </div> : <></>}
      {highlightPopupOpened ? <div className="skill-popover" style={{
        left: savePopupLocation.left,
        top: savePopupLocation.top
      }}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}>
        <p className='skill-popover__title'>{normalizedText}</p>
        <div className="skill-popover__actions">
          <h3>Choose familiarity level:</h3>
          <div className="skill-popover__buttons">{
            FAMILIARITIES.map(familiarity => <button
              type="button"
              onClick={() => void updateFamiliarity(normalizedText, familiarity)}>{familiarity}</button>
            )
          }</div>

          <br />
          <h3>Choose temperature level:</h3>
          <div className="skill-popover__buttons">{
            TEMPERATURES.map(temperature => <button
              type="button"
              onClick={() => void updateSkillTemperature(normalizedText, temperature)}>{temperature}</button>
            )
          }</div>

          <br />
          <h3>Choose skill type:</h3>
          <div className="skill-popover__buttons">{
            SKILL_TYPES.map(type => <button
              type="button"
              onClick={() => void updateSkillType(normalizedText, type)}>{type}</button>
            )
          }</div>
        </div>
      </div> : <></>}
    </>
  );
}
