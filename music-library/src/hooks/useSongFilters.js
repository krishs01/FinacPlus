import { useState, useMemo } from 'react';

/**
 * Custom hook for client-side filter, sort, and group-by operations.
 *
 * All three core JS array methods are used here intentionally:
 *   - .filter() for text-based filtering
 *   - .sort()   for multi-field sorting (via spread-then-sort to avoid mutation)
 *   - .reduce() for grouping songs into buckets by album/artist
 *
 * These run on the client, on top of data already fetched by React Query — they
 * don't replace the API call, they refine its results.
 */
export function useSongFilters(songs) {
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState('title');   // 'title' | 'artist' | 'album' | 'year'
  const [sortDir, setSortDir] = useState('asc');      // 'asc' | 'desc'
  const [groupKey, setGroupKey] = useState('none');    // 'none' | 'album' | 'artist'

  const processedSongs = useMemo(() => {
    let result = songs;

    // ── Step 1: FILTER using .filter() ──
    // Match songs whose title, artist, or album contains the filter text
    if (filterText.trim()) {
      const query = filterText.toLowerCase().trim();
      result = result.filter((song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
      );
    }

    // ── Step 2: SORT using spread + .sort() ──
    // We spread into a new array first to avoid mutating React Query's cached data
    result = [...result].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // For year (number), compare numerically
      if (sortKey === 'year') {
        valA = valA ?? 0;
        valB = valB ?? 0;
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      // For strings, compare case-insensitively
      valA = (valA ?? '').toLowerCase();
      valB = (valB ?? '').toLowerCase();
      const cmp = valA.localeCompare(valB);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [songs, filterText, sortKey, sortDir]);

  // ── Step 3: GROUP using .reduce() ──
  // This produces either null (no grouping) or { [groupLabel]: Song[] }
  const groupedSongs = useMemo(() => {
    if (groupKey === 'none') return null;

    return processedSongs.reduce((groups, song) => {
      const label = song[groupKey] || 'Unknown';
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(song);
      return groups;
    }, {});
  }, [processedSongs, groupKey]);

  return {
    // Processed data
    processedSongs,
    groupedSongs,
    filteredCount: processedSongs.length,

    // Filter state
    filterText,
    setFilterText,

    // Sort state
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,

    // Group state
    groupKey,
    setGroupKey,
  };
}
