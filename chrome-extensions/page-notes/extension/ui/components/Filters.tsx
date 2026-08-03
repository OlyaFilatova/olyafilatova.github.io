import { GlobalState } from '../types';

import './Filters.css';

export default function Filters({ state: { setCurrentPage, setSearch } }: {
  state: GlobalState
}) {
  return (
    <section className="filters" aria-label="Note filters">
      <label>
        <span>Search</span>
        <input onInput={event => {
          setSearch(event.currentTarget.value);
          setCurrentPage(1);
        }} id="search" type="search" placeholder="Note" />
      </label>
    </section>
  );
}
