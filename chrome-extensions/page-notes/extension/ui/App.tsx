import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import CurrentPage from "./components/CurrentPage";
import PagesList from "./components/PagesList";

import { noteRepository } from "../shared/storage";
import { Issue, PageAggregate } from "../shared/note";
import { GlobalState } from "./types";

import './App.css';
import { GithubIssues } from "./components/GithubIssues";

async function getActiveTabUrl(): Promise<string> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return activeTab?.url ?? "";
}

export default function App() {
  const [currentPageUrl, setCurrentPageUrl] = useState('');
  const [aggregates, setAggregates] = useState<Record<string, PageAggregate>>({});
  const [filteredAggregates, setFilteredAggregates] = useState<PageAggregate[]>([]);
  const [currentPageAggregate, setCurrentPageAggregate] = useState<PageAggregate>(getDefaultAggregate());
  const [newNote, setNewNote] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);

  function reloadNotes() {
    noteRepository.getAggregates().then(setAggregates);
  }

  function reloadIssues() {
    noteRepository.getIssues().then(setIssues);
  }

  const state: GlobalState = {
    currentPageUrl,
    aggregates,
    newNote,
    issues,
    setIssues,
    setNewNote,
    reloadNotes,
    reloadIssues
  }

  function getDefaultAggregate(): PageAggregate {
    return {
      url: currentPageUrl,
      notes: [],
      lastUpdatedAt: new Date()
    }
  }

  function filterAggregates(aggregates: Record<string, PageAggregate>): PageAggregate[] {
    return Object.values(aggregates)
      .filter((aggregate) => {
        return aggregate.url !== currentPageUrl;
      });
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
          reloadNotes();
        }
        sendResponse({ ok: true })
      })();

      return true;
    });

    getActiveTabUrl().then(url => setCurrentPageUrl(url));
    reloadNotes();
    reloadIssues();
  }, []);

  useEffect(() => {
    localStorage.setItem(currentPageUrl, newNote);
  }, [newNote]);

  useEffect(() => {
    setNewNote(localStorage.getItem(currentPageUrl) || '');

    setCurrentPageAggregate(aggregates[currentPageUrl] || getDefaultAggregate());
    setFilteredAggregates(filterAggregates(aggregates));
  }, [currentPageUrl]);

  useEffect(() => {
    setCurrentPageAggregate(aggregates[currentPageUrl] || getDefaultAggregate());
    
    setFilteredAggregates(filterAggregates(aggregates));
  }, [aggregates]);


  return (
    <main className="app">
      <div>
        <GithubIssues state={state} />
        <AppHeader state={state} />
        <CurrentPage state={state} aggregate={currentPageAggregate} />
        <hr />
        <PagesList state={state} aggregates={filteredAggregates} />
      </div>
    </main>
  );
}
