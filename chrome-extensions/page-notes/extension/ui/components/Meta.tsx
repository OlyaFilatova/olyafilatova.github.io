import { PageAggregate } from "../../shared/note";

import './Meta.css';

export function Meta({ aggregate }: {
  aggregate: PageAggregate
}) {
  function MetaLine({ label, value }: { label: string, value: string }) {
    return (
      <p>
        <strong>{label}: </strong> {value}
      </p>
    )
  }

  return (<div className="meta">
    <MetaLine label="Notes" value={aggregate.notes.length.toString()} />
    {aggregate.notes.length ?
      <MetaLine label="Last updated at" value={aggregate.lastUpdatedAt.toLocaleString()} /> :
      undefined}
  </div>)
}