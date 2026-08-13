export interface FiltersContext {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  category: string | undefined;
  setCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  type: string | undefined;
  setType: React.Dispatch<React.SetStateAction<string | undefined>>;
  familiarity: string | undefined;
  setFamiliarity: React.Dispatch<React.SetStateAction<string | undefined>>;
  temperature: string | undefined;
  setTemperature: React.Dispatch<React.SetStateAction<string | undefined>>;
  sort: string | undefined;
  setSort: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentPageOnly: boolean;
  setCurrentPageOnly: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PaginationContext {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  pagesCount: number;
  setPagesCount: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export interface SkillsContext extends PaginationContext, FiltersContext {}
