/**
 * Toolbar with filter, sort, and group-by controls.
 * Sits below the header, above the song grid.
 */
function Toolbar({
  filterText,
  onFilterChange,
  sortKey,
  onSortKeyChange,
  sortDir,
  onSortDirChange,
  groupKey,
  onGroupKeyChange,
  totalCount,
  filteredCount,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">

      {/* Filter input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <input
          id="filter-input"
          type="text"
          className="w-full py-2 pl-9 pr-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-100 text-sm outline-none transition-all duration-150 placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79, 70, 229,0.2)]"
          placeholder="Filter results..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        {filterText && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] text-slate-500 hover:text-slate-100 hover:bg-white/[0.08] transition-all"
            onClick={() => onFilterChange('')}
            aria-label="Clear filter"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="sort-select" className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Sort
        </label>
        <select
          id="sort-select"
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value)}
          className="py-2 px-3 rounded-lg bg-[#1E293B] border border-white/[0.08] text-slate-200 text-sm outline-none cursor-pointer transition-all duration-150 focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.2)]"
        >
          <option value="title" className="bg-[#1E293B] text-slate-200">Title</option>
          <option value="artist" className="bg-[#1E293B] text-slate-200">Artist</option>
          <option value="album" className="bg-[#1E293B] text-slate-200">Album</option>
          <option value="year" className="bg-[#1E293B] text-slate-200">Year</option>
        </select>

        {/* Sort direction toggle */}
        <button
          id="sort-dir-toggle"
          onClick={() => onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')}
          className="p-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm transition-all duration-150 hover:bg-white/[0.1] hover:text-slate-100 hover:border-white/[0.15]"
          aria-label={`Sort ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
          title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Group-by dropdown */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="group-select" className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Group
        </label>
        <select
          id="group-select"
          value={groupKey}
          onChange={(e) => onGroupKeyChange(e.target.value)}
          className="py-2 px-3 rounded-lg bg-[#1E293B] border border-white/[0.08] text-slate-200 text-sm outline-none cursor-pointer transition-all duration-150 focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.2)]"
        >
          <option value="none" className="bg-[#1E293B] text-slate-200">None</option>
          <option value="album" className="bg-[#1E293B] text-slate-200">Album</option>
          <option value="artist" className="bg-[#1E293B] text-slate-200">Artist</option>
        </select>
      </div>

      {/* Filtered count badge */}
      {filterText && filteredCount !== totalCount && (
        <span className="ml-auto text-xs text-slate-500 font-medium">
          Showing {filteredCount} of {totalCount}
        </span>
      )}
    </div>
  );
}

export default Toolbar;
