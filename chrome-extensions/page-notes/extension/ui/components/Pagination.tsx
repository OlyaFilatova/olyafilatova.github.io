import { useEffect, useState } from "react";
import { GlobalState } from "../types";

import './Pagination.css';

export default function Pagination({ state: {
  setCurrentPage,
  setPageSize,
  currentPage,
  pageSize,
  totalItems
} }: {
  state: GlobalState
}) {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(totalItems / pageSize)))
  }, [pageSize, totalItems])

  return (
    <nav className="pagination" aria-label="Notes pagination">
      <label>
        <span>Per page</span>
        <select
          id="pageSize"
          onChange={event => {
            setPageSize(+event.currentTarget.value);
            setCurrentPage(1);
          }}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </label>
      <div className="pagination__controls">
        <button
          id="previousPage"
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage <= 1}
          type="button">Previous</button>
        <span id="paginationStatus">Page {currentPage} of {totalPages}</span>
        <button
          id="nextPage"
          onClick={() => {
            setCurrentPage(currentPage + 1)
          }}
          disabled={currentPage >= totalPages}
          type="button">Next</button>
      </div>
    </nav>
  );
}
