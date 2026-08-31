import { useState } from 'react';
import { Link } from '../../shared/note'
import './GithubIssues.css';
import { noteRepository } from '../../shared/storage';
import { GlobalState } from '../types';

export function GithubIssue({
  url,
  links,
  state
}: {
  url: string;
  links: Link[];
  state: GlobalState
}) {
  const [issueOpened, setIssueOpened] = useState(false);

  const linksDone: string[] = links.filter(link => link[0] == 'DONE').map(link => link[1]);
  const linksPlanned: string[] = links.filter(link => link[0] == 'PLANNED').map(link => link[1]);

  return (<div className="github-issue">
    <button
      className="set-issue"
      onClick={() => setIssueOpened(!issueOpened)}
      >Completed links: {linksDone.length}. Planned: {linksPlanned.length}.</button>
    {issueOpened && <div>
      <div className='issue-controls'>
        <h2><a href={url} title={url} target="_blank">{url}</a></h2>
        <button className='clear-issue' onClick={() => {
          noteRepository.deleteIssue(url).then(() => state.reloadIssues())
        }}>Delete issue</button>
        <button className='reload-issue' onClick={() => {
          noteRepository.refreshIssue(url).then(() => state.reloadIssues())
        }}>Reload issue</button>
      </div>
      {linksPlanned.length ? <>
        <h2>Planned</h2>
        <ul>
          {linksPlanned.map(link => <li><a target="_blank" href={link}>{link}</a></li>)}
        </ul>
      </> : <></>}
      {linksDone.length ? <>
        <h2>Done</h2>
        <ul>
          {linksDone.map(link => <li><a target="_blank" href={link}>{link}</a></li>)}
        </ul>
      </> : <></>}
    </div>}
  </div>)
}