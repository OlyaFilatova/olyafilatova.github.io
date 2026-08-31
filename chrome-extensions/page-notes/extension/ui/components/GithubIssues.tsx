import { GlobalState } from '../types';
import './GithubIssues.css';
import { GithubIssue } from './GithubIssue';
import { noteRepository } from '../../shared/storage';

export function GithubIssues({ state }: { state: GlobalState }) {
  return (<>
    <div>
      <input
        className="set-issue-input"
        placeholder='Add GitHub issue with links'
        onKeyUpCapture={event => {
        if (event.key == 'Enter') {
          noteRepository.addIssue(event.currentTarget.value).then(() => {
            state.reloadIssues()
            event.currentTarget.value = ''
          })
        }
        }} />
    </div>
    {state.issues.map(issue =>
      <GithubIssue
        url={issue.url}
        links={issue.links}
        state={state} />)}
  </>)
}
