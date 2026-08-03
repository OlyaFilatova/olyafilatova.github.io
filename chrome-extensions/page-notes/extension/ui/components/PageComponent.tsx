import { ReactNode } from "react";
import { PageAggregate } from "../../shared/note";
import { GlobalState } from "../types";
import { Meta } from "./Meta";
import Note from "./NoteComponent";

import './PageComponent.css';

export default function Page({ state, aggregate, children }: {
  state: GlobalState;
  aggregate: PageAggregate;
  children?: ReactNode;
}) {
  return (
    <article className='page-card'>
      <div className="page-card__top">
        <div>
          <div className="page-card__title">
            <h2><a href={aggregate.url} title={aggregate.url} target="_blank">{aggregate.url}</a></h2>
          </div>
          {children}
          <Meta aggregate={aggregate} />
          <ul>
            {aggregate.notes.map((note, idx) => <Note key={idx} state={state} note={note} />)}
          </ul>
        </div>
      </div>
    </article>
  );
}
