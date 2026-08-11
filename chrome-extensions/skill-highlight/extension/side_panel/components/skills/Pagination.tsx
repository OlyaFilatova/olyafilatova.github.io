import { useEffect } from "react";
import { PaginationContext } from "../../types/skills";

export default function Pagination({
  pageSizes,
  skillsContext
}: {
  pageSizes: number[];
  skillsContext: PaginationContext;
}) {
  useEffect(() => {
    skillsContext.setCurrentPage(1);
    skillsContext.setPagesCount(Math.max(1, Math.ceil(skillsContext.totalItems / skillsContext.pageSize)));
  }, [skillsContext.pageSize, skillsContext.totalItems])


  
  return (
    <nav className="pagination" aria-label="Skill pagination">
      <label>
        <span>Per page</span>
        <select id="pageSize" onChange={event => skillsContext.setPageSize(+event.target.value)} value={skillsContext.pageSize}>
          {pageSizes.map(pageSize => <option value={pageSize}>{pageSize}</option>)}
        </select>
      </label>
      <div className="pagination__controls">
        <button
          id="previousPage"
          type="button"
          disabled={skillsContext.currentPage <= 1}
          onClick={() => skillsContext.setCurrentPage(skillsContext.currentPage - 1)}>Previous</button>
        <span id="paginationStatus">Page {skillsContext.currentPage} of {skillsContext.pagesCount}</span>
        <button
          id="nextPage"
          type="button"
          disabled={skillsContext.currentPage >= skillsContext.pagesCount}
          onClick={() => skillsContext.setCurrentPage(skillsContext.currentPage + 1)}>Next</button>
      </div>
    </nav>
  )
}
