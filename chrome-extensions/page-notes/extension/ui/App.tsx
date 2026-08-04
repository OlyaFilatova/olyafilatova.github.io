import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import CurrentPage from "./components/CurrentPage";
import Filters from "./components/Filters";
import PagesList from "./components/PagesList";
import Pagination from "./components/Pagination";

import { noteRepository } from "../shared/storage";
import { PageAggregate } from "../shared/note";
import { fetchGithubIssueData } from "../shared/fetch";
import { GlobalState } from "./types";

import './App.css';
import { CurrentGithubIssue } from "./components/GithubIssue";

async function getActiveTabUrl(): Promise<string> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return activeTab?.url ?? "";
}

function getScrollTop(): number {
  return document.scrollingElement?.scrollTop ?? window.scrollY;
}

function restoreScrollTop(scrollTop: number): void {
  window.requestAnimationFrame(() => {
    document.scrollingElement?.scrollTo({ top: scrollTop, behavior: "auto" });
    window.scrollTo({ top: scrollTop, behavior: "auto" });
  });
}

export default function App() {
  const [preserveScroll, setPreserveScroll] = useState(true);
  const [scrollTop, setScrollTop] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentPageUrl, setCurrentPageUrl] = useState('');
  const [search, setSearch] = useState('');
  const [aggregates, setAggregates] = useState<Record<string, PageAggregate>>({});
  const [filteredAggregates, setFilteredAggregates] = useState<PageAggregate[]>([]);
  const [currentPageAggregate, setCurrentPageAggregate] = useState<PageAggregate>(getDefaultAggregate());
  const [visibleAggregates, setVisibleAggregates] = useState<PageAggregate[]>([]);
  const [newNote, setNewNote] = useState("");
  const [issueUrl, setIssueUrl] = useState("");
  const [linksDone, setLinksDone] = useState<string[]>([]);
  const [linksPlanned, setLinksPlanned] = useState<string[]>([]);

  function reload() {
    setScrollTop(preserveScroll ? getScrollTop() : null);
    noteRepository.getAggregates().then(setAggregates);
    noteRepository.getCurrentIssue().then(currentIssue => {
      console.log('currentIssue', currentIssue);
      if (currentIssue) {
        state.setIssueUrl(currentIssue.url);
        state.setLinksDone(currentIssue.links.filter(link => link.status == 'DONE').map(link => link.url));
        state.setLinksPlanned(currentIssue.links.filter(link => link.status == 'PLANNED').map(link => link.url));
      } else {
        state.setIssueUrl('');
        state.setLinksDone([]);
        state.setLinksPlanned([]);
      }
    })
  }

  const state: GlobalState = {
    currentPage,
    currentPageUrl,
    newNote,
    pageSize,
    preserveScroll,
    search,
    totalItems,
    issueUrl,
    linksDone,
    linksPlanned,
    aggregates,
    setLinksPlanned,
    setLinksDone,
    setIssueUrl,
    setCurrentPage,
    setNewNote,
    setPageSize,
    setPreserveScroll,
    setSearch,
    reload
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      (async () => {
        console.log(request.action)
        if (request.action === 'TAB_CHANGED') {
          setCurrentPageUrl(await getActiveTabUrl());
        }
        if (request.action === 'DATA_CHANGED') {
          console.log('data changed')
          reload();
        }
        sendResponse({ ok: true })
      })();

      return true;
    });

    getActiveTabUrl().then(url => setCurrentPageUrl(url));
  }, []);

  function getDefaultAggregate() {
    return {
      url: currentPageUrl,
      notes: [],
      lastUpdatedAt: new Date()
    }
  }

  useEffect(() => {
    localStorage.setItem(currentPageUrl, newNote);
  }, [newNote]);

  useEffect(() => {
    setNewNote(localStorage.getItem(currentPageUrl) || '');
    reload();
  }, [currentPageUrl]);

  useEffect(() => {
    reload();
  }, [search, pageSize, currentPage])

  useEffect(() => {
    setCurrentPageAggregate(aggregates[currentPageUrl] || getDefaultAggregate());

    setFilteredAggregates(filterAggregates(aggregates));
  }, [aggregates]);

  useEffect(() => {
    setTotalItems(filteredAggregates.length);
    
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    setCurrentPage(Math.min(Math.max(1, currentPage), totalPages));

    const pageStart = (currentPage - 1) * pageSize;
    setVisibleAggregates(filteredAggregates.slice(pageStart, pageStart + pageSize));
  }, [filteredAggregates]);

  useEffect(() => {
    if (state.issueUrl == '') {
      state.setLinksDone([]);
      state.setLinksPlanned([]);
      void noteRepository.clearCurrentIssue();
    } else {
      fetchGithubIssueData(state.issueUrl).then(res => {
        state.setLinksDone(res.filter(el => el[0] == 'DONE').map(el => el[1]));
        state.setLinksPlanned(res.filter(el => el[0] == 'PLANNED').map(el => el[1]));
        noteRepository.storeCurrentIssue({
          url: state.issueUrl,
          links: res.map(el => ({
            status: el[0] as 'DONE' | 'PLANNED',
            url: el[1]
          }))
        }).then(res => `Issue saved ${res}`)
      }, err => {
        console.log(err)
        // state.setIssueUrl('');
        // state.setLinksDone([]);
        // state.setLinksPlanned([]);
        // void noteRepository.clearCurrentIssue();
      });
    }
  }, [state.issueUrl])

  function filterAggregates(aggregates: Record<string, PageAggregate>): PageAggregate[] {
    return Object.values(aggregates)
      .filter((aggregate) => {
        const searchable = aggregate.notes.map(note => note.text)
          .join(" ")
          .toLowerCase();

        const noteMatches = (
          (!search || searchable.includes(search))
        );

        return !!noteMatches && aggregate.url !== currentPageUrl;
      })
      .sort((a, b) => b.lastUpdatedAt?.getTime() - a.lastUpdatedAt?.getTime());
  }

  useEffect(() => {
    if (scrollTop !== null) {
      restoreScrollTop(scrollTop);
    }
  }, [visibleAggregates])

  return (
    <main className="app">
      <div>
        <CurrentGithubIssue state={state} />
        <AppHeader state={state} />
        <Filters state={state} />
        <CurrentPage state={state} aggregate={currentPageAggregate} />
        <hr />
        <PagesList state={state} aggregates={visibleAggregates} />
        <Pagination state={state} />
      </div>
    </main>
  );
}
