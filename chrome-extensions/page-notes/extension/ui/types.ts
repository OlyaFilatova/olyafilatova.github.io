import { Dispatch, SetStateAction } from "react";

export interface GlobalState {
  currentPage: number;
  currentPageUrl: string;
  totalItems: number;
  pageSize: number;
  preserveScroll: boolean;
  search: string;
  newNote: string;
  setNewNote: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  setPreserveScroll: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  reload: () => void;
}
