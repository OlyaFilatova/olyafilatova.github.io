import { useEffect, useState } from 'react';
import { GlobalState } from '../types';
import './GithubIssue.css';

export function CurrentGithubIssue({ state }: { state: GlobalState }) {
  const [formOpened, setFormOpened] = useState(false);
  const [inputValue, setInputValue] = useState(state.issueUrl);
  
  const [inProgress, setInProgress] = useState<string[]>([]);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [plannedCount, setPlannedCount] = useState(0);

  useEffect(() => setInputValue(state.issueUrl), [state.issueUrl]);

  useEffect(() => {
    setInProgress(Object.keys(state.aggregates));
    setPlannedCount(state.linksPlanned.filter(link => !inProgress.includes(link)).length);
    setInProgressCount(inProgress.filter(link => state.linksPlanned.includes(link)).length);
    setDoneCount(state.linksDone.length);
  }, [state.aggregates, state.linksDone, state.linksPlanned])

  return (<div className="current-github-issue">
    <button className="set-issue" onClick={() => setFormOpened(!formOpened)}>{formOpened ? 
      "Close form" : 
      state.issueUrl ?
        `Completed links: ${state.linksDone.length}. Planned: ${state.linksPlanned.length}. Change Issue.` :
        "Set current GitHub issue"}</button>
    {formOpened && <div>
      <div>
        <input
          className="set-issue-input"
          value={inputValue}
          onChange={event => setInputValue(event.currentTarget.value)}
          onKeyUpCapture={event => {
          if (event.key == 'Enter') {
            setFormOpened(false);
            state.setIssueUrl(inputValue);
          }
          }} />
      </div>
      <div className='issue-controls'>
        {state.issueUrl && <button className='clear-issue'
          onClick={() => {
            state.setIssueUrl('');
            setInputValue('');
            setFormOpened(false);
          }}>Clear current issue</button>}
        {state.issueUrl && <button className='reload-issue' onClick={() => {
          const url = state.issueUrl;
          state.setIssueUrl('');
          setTimeout(() => state.setIssueUrl(url), 100)
        }}>Reload current issue</button>}
      </div>
      {plannedCount ? <>
        <h2>Planned</h2>
        <ul>
          {state.linksPlanned.filter(link => !inProgress.includes(link)).map(link => <li><a target="_blank" href={link}>{link}</a></li>)}
        </ul>
      </> : <></>}
      {inProgressCount ? <>
        <h2>In progress</h2>
        <ul>
          {inProgress.filter(link => state.linksPlanned.includes(link)).map(link => <li><a target="_blank" href={link}>{link}</a></li>)}
        </ul>
      </> : <></>}
      {doneCount ? <>
        <h2>Done</h2>
        <ul>
          {state.linksDone.map(link => <li><a target="_blank" href={link}>{link}</a></li>)}
        </ul>
      </> : <></>}
    </div>}
  </div>)
}