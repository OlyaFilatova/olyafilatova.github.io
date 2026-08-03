import { useState } from "react";
import { noteRepository } from "../../shared/storage";
import { GlobalState } from "../types";

import './AppHeader.css';

export default function AppHeader({ state: { setCurrentPage, totalItems, reload } }: {
  state: GlobalState
}) {
  const [clearAllConfirmationActive, setClearAllConfirmationActive] = useState(false);
  const [clearAllConfirmationTimeout, setClearAllConfirmationTimeout] = useState<undefined | number>(undefined);

  function setClearAllConfirmation(active: boolean): void {
    setClearAllConfirmationActive(active);
    if (clearAllConfirmationTimeout !== undefined) {
      window.clearTimeout(clearAllConfirmationTimeout);
      setClearAllConfirmationTimeout(undefined);
    }

    if (active) {
      setClearAllConfirmationTimeout(window.setTimeout(() => setClearAllConfirmation(false), 5000));
    }
  }

  async function handleClearAllClick(): Promise<void> {
    if (!clearAllConfirmationActive) {
      setClearAllConfirmation(true);
      return;
    }

    setClearAllConfirmation(false);
    await noteRepository.clearNotes();
    setCurrentPage(1);
    reload();
  }

  async function exportJson(): Promise<void> {
    const storage = await noteRepository.getStorage();
    downloadJson(storage, `notes.json`);
  }

  function downloadJson(value: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <header className="app__header">
      <div>
        <h1>Notes</h1>
        <p id="summary">{
          totalItems ?
          `${totalItems} pages` :
          "No notes saved yet"
        }</p>
      </div>
      <div className="header-actions">
        <button
          id="exportButton"
          onClick={exportJson}
          type="button">Export JSON</button>
        <button
          id="clearAllButton"
          className={
            [
              "danger-action",
              ...(clearAllConfirmationActive ? ["danger-action--confirming"] : [])
            ].join(' ')
          }
          type="button"
          aria-label={clearAllConfirmationActive ? "Confirm clearing all saved notes" : "Clear all saved notes"}
          onClick={handleClearAllClick}>{
            clearAllConfirmationActive ? "Confirm clear all" : "Clear all"
          }</button>
      </div>
    </header>
  );
}
