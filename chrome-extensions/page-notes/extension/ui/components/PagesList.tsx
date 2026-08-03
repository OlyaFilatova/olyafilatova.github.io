import { PageAggregate } from "../../shared/note";
import { GlobalState } from "../types";
import Page from "./PageComponent";

import './PagesList.css';

export default function PagesList({ state, aggregates }: {
  aggregates: PageAggregate[];
  state: GlobalState;
}) {
  return (
    <section id="noteList" className="note-list" aria-live="polite">{
      aggregates.map((aggregate, idx) => <Page key={idx} state={state} aggregate={aggregate} />)
    }</section>
  );
}
