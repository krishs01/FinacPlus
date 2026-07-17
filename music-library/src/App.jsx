import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import SongCard from './components/SongCard';
import SongGroup from './components/SongGroup';
import Toolbar from './components/Toolbar';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import AddSongForm from './components/AddSongForm';
import { useSongsQuery } from './hooks/useSongsQuery';
import { useLocalSongsQuery } from './hooks/useLocalSongsQuery';
import { useDeleteSong } from './hooks/useDeleteSong';
import { useSongFilters } from './hooks/useSongFilters';

const queryClient = new QueryClient();

function MusicLibraryContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('coldplay');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch songs from iTunes + local MSW endpoint
  const { songs: itunesSongs, isLoading, isFetching, isError, error, refetch } = useSongsQuery(submittedTerm);
  const { localSongs } = useLocalSongsQuery();
  const deleteSongMutation = useDeleteSong();

  // Merge iTunes results + locally-added songs into a single list
  const allSongs = [...localSongs, ...itunesSongs];

  // Client-side filter, sort, and group-by
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
  } = useSongFilters(allSongs);

  // Debounced search
  const [debounceTimer, setDebounceTimer] = useState(null);
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setSubmittedTerm(value);
    }, 600);
    setDebounceTimer(timer);
  }, [debounceTimer]);

  const handleDeleteSong = (songId) => {
    deleteSongMutation.mutate(songId);
  };

  // canDelete is true for now — will be gated by admin role in Stage 5
  const canDelete = true;

  const renderSongList = () => {
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
              onDelete={handleDeleteSong}
              canDelete={canDelete}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 stagger-children max-md:grid-cols-1">
        {processedSongs.map((song) => (
          <SongCard key={song.id} song={song} onDelete={handleDeleteSong} canDelete={canDelete} />
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
        {/* Results info bar + Add Song button */}
        <div className="flex items-center justify-between mb-4 px-1 animate-fade-in">
          <p className="text-sm text-slate-400 font-medium">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                Searching...
              </span>
            ) : (
              <>
                {allSongs.length} {allSongs.length === 1 ? 'song' : 'songs'}
                {submittedTerm && (
                  <span className="text-violet-400 italic"> matching &quot;{submittedTerm}&quot;</span>
                )}
                {localSongs.length > 0 && (
                  <span className="text-cyan-400"> ({localSongs.length} local)</span>
                )}
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            {isFetching && !isLoading && (
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                Refreshing
              </span>
            )}
            {/* Add Song button — will be gated by admin role in Stage 5 */}
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_2px_10px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span>
              Add Song
            </button>
          </div>
        </div>

        {/* Toolbar */}
        {!isLoading && !isError && allSongs.length > 0 && (
          <Toolbar
            filterText={filterText}
            onFilterChange={setFilterText}
            sortKey={sortKey}
            onSortKeyChange={setSortKey}
            sortDir={sortDir}
            onSortDirChange={setSortDir}
            groupKey={groupKey}
            onGroupKeyChange={setGroupKey}
            totalCount={allSongs.length}
            filteredCount={filteredCount}
          />
        )}

        {/* Loading */}
        {isLoading && <LoadingSkeleton count={6} />}

        {/* Error */}
        {isError && !isLoading && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {/* Song List */}
        {!isLoading && !isError && processedSongs.length > 0 && renderSongList()}

        {/* No filter matches */}
        {!isLoading && !isError && allSongs.length > 0 && processedSongs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
            <div className="text-5xl leading-none mb-2">🔍</div>
            <h2 className="text-xl font-semibold text-slate-100">No matches</h2>
            <p className="text-sm text-slate-400 max-w-[400px] leading-relaxed">
              No songs match your filter &quot;{filterText}&quot;. Try broadening your search.
            </p>
          </div>
        )}

        {/* No API results */}
        {!isLoading && !isError && allSongs.length === 0 && (
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

      {/* Add Song Modal */}
      <AddSongForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicLibraryContent />
    </QueryClientProvider>
  );
}

export default App;
