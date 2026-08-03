import { PageAggregate } from "../../shared/note";
import { noteRepository } from "../../shared/storage";
import { GlobalState } from "../types";
import Page from "./PageComponent";

import './CurrentPage.css';

export default function CurrentPage({ state: { currentPageUrl, newNote, setNewNote }, state, aggregate }: {
  aggregate: PageAggregate;
  state: GlobalState;
}) {
  async function handleAddNote(): Promise<void> {
    const text = newNote.trim();

    if (!text) {
      return;
    }

    await noteRepository.createNote({
      text,
      url: currentPageUrl
    });

    setNewNote('');
    localStorage.removeItem(currentPageUrl);

    state.reload();
  }

  return (
    <section id="currentPage" className="current-page" aria-live="polite">
      <Page state={state} aggregate={aggregate}>
        <div id="new-note-form">
          <textarea
            id="new-note-text"
            value={newNote}
            onChange={(e) => {
              setNewNote(e.target.value);
            }}
            />
          <button onClick={() => void handleAddNote()}>Add note</button>
        </div>
      </Page>
    </section>
  );
}
