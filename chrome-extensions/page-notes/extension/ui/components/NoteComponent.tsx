import { GlobalState } from "../types";
import { Note } from "../../shared/note";
import { noteRepository } from "../../shared/storage";

import './NoteComponent.css';

export default function Note({ state, note }: {
  state: GlobalState;
  note: Note;
}) {

  async function deleteNote() {
    await noteRepository.deleteNote(note);
    state.reload();
  }

  return (
    <li>
      <div>{note.text}</div>
      <div className="controls">
        <button
          className="delete-button"
          onClick={deleteNote}>Delete</button>
      </div>
    </li>
  );
}
