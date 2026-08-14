/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Filters from "./skills/Filters";
import Header from "./skills/Header";
import Pagination from "./skills/Pagination";
import SkillList from "./skills/SkillList";
import { handleSkillStorageMessage } from "../../shared/storage";
import { SkillAggregate, SynonymUpdatedMessage } from "../../shared/types";

async function getCurrentTabUrl() {
  // Query the active tab in the current window
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Return the URL
  return tab?.url;
}

export default function SkillsPanel() {
  const [skills, setSkills] = useState<SkillAggregate[]>([]);
  // filters
  const [categories, setCategories] = useState<string[]>([]); // TODO: load from skills service
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [familiarity, setFamiliarity] = useState<string | undefined>(undefined);
  const [temperature, setTemperature] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [currentPageOnly, setCurrentPageOnly] = useState<boolean>(false);

  // pagination
  const PAGE_SIZES = [10, 25, 50];
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const [skillTexts, setSkillTexts] = useState<Array<{
    normalizedText: string;
    displayText: string;
  }>>([]);

  const skillsLoadingRef = useRef({
    currentPage,
    pageSize,
    search,
    category,
    type,
    familiarity,
    temperature,
    sort,
    currentPageOnly
  })

  function getSkillTexts() {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'getSkillTexts',
      args: []
    }, response => {
      if (response.ok) {
        setSkillTexts(response.result as any);
      } else {
        console.log('error', response);
      }
    })
  }

  const paginationContext = {
    currentPage, setCurrentPage, pagesCount, setPagesCount, pageSize, setPageSize, totalItems, setTotalItems
  };

  const filtersContext = {
    categories, setCategories, search, setSearch, category, setCategory, type, setType, familiarity, setFamiliarity,
    temperature, setTemperature, sort, setSort, currentPageOnly, setCurrentPageOnly
  };

  const skillsContext = {
    ...paginationContext,
    ...filtersContext
  }

  async function loadCategories() {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'getCategories',
      args: [{}]
    }, response => {
      if (response.ok) {
        setCategories(response.result as string[])
      } else {
        console.log('error', response)
      }
    })
  }

  async function reloadSkills() {
    const {
      currentPage,
      pageSize,
      search,
      category,
      type,
      familiarity,
      temperature,
      sort,
      currentPageOnly,
    } = skillsLoadingRef.current;

    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'getSkills',
      args: [
        {
          currentPage,
          pageSize,
          search,
          category,
          type,
          familiarity,
          temperature,
          sort,
          ...(currentPageOnly ? { jobUrl: await getCurrentTabUrl() } : {})
        }
      ]
    }, response => {
      if (response.ok) {
        setSkills((response.result as any)[1] as SkillAggregate[])
        setTotalItems((response.result as any)[0])
      } else {
        console.log('error', response)
      }
    })
  }

  useEffect(() => {
    void loadCategories();
    void reloadSkills();
    getSkillTexts();

    chrome.runtime.onMessage.addListener((
      message: SynonymUpdatedMessage
    ) => {
      console.log(message.type)
      if (message.type == 'SYNONYM_UPDATED') {
        getSkillTexts();
        void reloadSkills();
      }
    });
  }, []);

  useEffect(() => {

    skillsLoadingRef.current = {
      currentPage,
      pageSize,
      search,
      category,
      type,
      familiarity,
      temperature,
      sort,
      currentPageOnly,
    };

    void reloadSkills();
  }, [
      currentPage,
      pageSize,
      search,
      category,
      type,
      familiarity,
      temperature,
      sort,
      currentPageOnly,
    ]);

  return (<>
      <Header skillsContext={skillsContext} />

      <Filters filtersContext={skillsContext} />

      <SkillList skills={skills} skillTexts={skillTexts} />

      <Pagination pageSizes={PAGE_SIZES} skillsContext={skillsContext} />
    </>
  )
}