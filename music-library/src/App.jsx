import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import SongCard from './components/SongCard';
import SongGroup from './components/SongGroup';
import Toolbar from './components/Toolbar';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import { useSongsQuery } from './hooks/useSongsQuery';
import { useSongFilters } from './hooks/useSongFilters';

// Create a single QueryClient instance outside the component
const queryClient = new QueryClient();

/**
 * Inner app component — needs to be inside QueryClientProvider
 * so it can use the useSongsQuery hook.
 */
function MusicLibraryContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('coldplay');

  const { songs, isLoading, isFetching, isError, error, refetch } = useSongsQuery(submittedTerm);

  // Client-side filter, sort, and group-by — applied on top of React Query data
  const {
    processedSongs,
    groupedSongs,
    filteredCount,
    filterText,
    setFilterText,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    groupKey,
    setGroupKey,
  } = useSongFilters(songs);

  // Debounced search: submit after user stops typing for 600ms
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setSubmittedTerm(value);
    }, 600);
    setDebounceTimer(timer);
  }, [debounceTimer]);

  // Decide what to render for the song list
  const renderSongList = () => {
    // Grouped view — render SongGroup sections
    if (groupedSongs) {
      const entries = Object.entries(groupedSongs);
      return (
        <div>
          {entries.map(([label, groupSongs], index) => (
            <SongGroup
              key={label}
              label={label}
              songs={groupSongs}
              index={index}
            />
          ))}
        </div>
      );
    }

    // Flat view — render the song grid directly
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 stagger-children max-md:grid-cols-1">
        {processedSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isFetching={isFetching}
      />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 pb-16 pt-6 max-md:px-4 max-md:pb-12">
        {/* Results info bar */}
        <div className="flex items-center justify-between mb-4 px-1 animate-fade-in">
          <p className="text-sm text-slate-400 font-medium">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                Searching...
              </span>
            ) : (
              <>
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                {submittedTerm && (
                  <span className="text-violet-400 italic"> matching &quot;{submittedTerm}&quot;</span>
                )}
              </>
            )}
          </p>
          {isFetching && !isLoading && (
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Refreshing
            </span>
          )}
        </div>

        {/* Toolbar — only show when we have songs to work with */}
        {!isLoading && !isError && songs.length > 0 && (
          <Toolbar
            filterText={filterText}
            onFilterChange={setFilterText}
            sortKey={sortKey}
            onSortKeyChange={setSortKey}
            sortDir={sortDir}
            onSortDirChange={setSortDir}
            groupKey={groupKey}
            onGroupKeyChange={setGroupKey}
            totalCount={songs.length}
            filteredCount={filteredCount}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton count={6} />}

        {/* Error State */}
        {isError && !isLoading && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {/* Song List — flat grid or grouped sections */}
        {!isLoading && !isError && processedSongs.length > 0 && renderSongList()}

        {/* Empty State — no results after filtering, or no search yet */}
        {!isLoading && !isError && songs.length > 0 && processedSongs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
            <div className="text-5xl leading-none mb-2">🔍</div>
            <h2 className="text-xl font-semibold text-slate-100">No matches</h2>
            <p className="text-sm text-slate-400 max-w-[400px] leading-relaxed">
              No songs match your filter &quot;{filterText}&quot;. Try broadening your search.
            </p>
          </div>
        )}

        {/* Empty State — no API results at all */}
        {!isLoading && !isError && songs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
            <div className="text-5xl leading-none mb-2">
              {submittedTerm ? '🔍' : '🎵'}
            </div>
            <h2 className="text-xl font-semibold text-slate-100">
              {submittedTerm ? 'No songs found' : 'Discover Music'}
            </h2>
            <p className="text-sm text-slate-400 max-w-[400px] leading-relaxed">
              {submittedTerm
                ? `No results for "${submittedTerm}". Try a different search term.`
                : 'Search for your favorite artist, album, or song to get started.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * App root — wraps everything in QueryClientProvider.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicLibraryContent />
    </QueryClientProvider>
  );
}

export default App;
