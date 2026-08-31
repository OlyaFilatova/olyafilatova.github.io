import { Dispatch, SetStateAction } from "react";
import { PageAggregate, Issue } from "../shared/note";

export interface GlobalState {
  currentPageUrl: string;
  newNote: string;
  aggregates: Record<string, PageAggregate>;
  issues: Issue[];
  setIssues: Dispatch<SetStateAction<Issue[]>>;
  setNewNote: Dispatch<SetStateAction<string>>;
  reloadIssues: () => void;
  reloadNotes: () => void;
}
