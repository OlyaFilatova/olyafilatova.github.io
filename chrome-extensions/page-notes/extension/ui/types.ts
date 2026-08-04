import { Dispatch, SetStateAction } from "react";
import { PageAggregate } from "../shared/note";

export interface GlobalState {
  currentPage: number;
  currentPageUrl: string;
  totalItems: number;
  pageSize: number;
  preserveScroll: boolean;
  search: string;
  newNote: string;
  issueUrl: string;
  linksDone: string[];
  linksPlanned: string[];
  aggregates: Record<string, PageAggregate>;
  setLinksPlanned: Dispatch<SetStateAction<string[]>>;
  setLinksDone: Dispatch<SetStateAction<string[]>>;
  setIssueUrl: Dispatch<SetStateAction<string>>;
  setNewNote: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setPreserveScroll: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  reload: () => void;
}
