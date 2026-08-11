import { FiltersContext } from "../../types/skills";
import SelectFilter from "./SelectFilter";

export default function Filters({ filtersContext }: {
  filtersContext: FiltersContext
}) {

  return (
    <section className="filters" aria-label="Skill filters">
      <label>
        <span>Search</span>
        <input
          id="search"
          type="search"
          placeholder="Skill"
          value={filtersContext.search}
          onChange={event => filtersContext.setSearch(event.target.value)} />
      </label>
      <SelectFilter
        label="Category"
        options={[
          { value: "", text: "All" },
          ...filtersContext.categories.map(category => ({ value: category, text: category }))
        ]}
        currentValue={filtersContext.category}
        onChange={event => filtersContext.setCategory(event.currentTarget.value)} />
      <SelectFilter
        label="Type"
        options={[
          { value: "", text: "All" },
          { value: "Application", text: "Application" },
          { value: "Approach", text: "Approach" },
          { value: "Non-skill", text: "Non skill phrase" }
        ]}
        currentValue={filtersContext.type}
        onChange={event => filtersContext.setType(event.currentTarget.value)} />
      <SelectFilter
        label="Familiarity"
        options={[
          { value: '', text: 'All' },
          { value: 'know-in-depth', text: 'Know in depth' },
          { value: 'study', text: 'Actively Studying' },
          { value: 'actively-using', text: 'Actively Using' },
          { value: 'know-a-bit', text: 'Know a bit' },
          { value: 'unknown', text: 'Unknown' }
        ]}
        currentValue={filtersContext.familiarity}
        onChange={event => filtersContext.setFamiliarity(event.currentTarget.value)} />
      <SelectFilter
        label="Temperature"
        options={[
          { value: '', text: 'All'},
          { value: 'interested', text: 'Cool!'},
          { value: 'meh', text: 'Meh...'},
          { value: 'avoid!', text: 'Avoid!'},
        ]}
        currentValue={filtersContext.temperature}
        onChange={event => filtersContext.setTemperature(event.currentTarget.value)} />
      <SelectFilter
        label="Sort"
        options={[
          { value: 'name', text: 'Name'},
          { value: 'companyCount', text: 'Company count'},
        ]}
        currentValue={filtersContext.sort}
        onChange={event => filtersContext.setSort(event.currentTarget.value)} />
      <label className="checkbox-filter">
        <input
          id="currentPageOnly"
          type="checkbox"
          checked={filtersContext.currentPageOnly}
          onChange={event => filtersContext.setCurrentPageOnly(event.target.checked)} />
        <span>Current page only</span>
      </label>
    </section>
  )
}
