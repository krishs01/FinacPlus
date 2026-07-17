import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import SongCard from './components/SongCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import { useSongsQuery } from './hooks/useSongsQuery';

// Create a single QueryClient instance outside the component
// so it's not recreated on every render
const queryClient = new QueryClient();

/**
 * Inner app component — needs to be inside QueryClientProvider
 * so it can use the useSongsQuery hook.
 */
function MusicLibraryContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('coldplay'); // default search

  const { songs, isLoading, isFetching, isError, error, refetch } = useSongsQuery(submittedTerm);

  // Debounced search: submit after user stops typing for 600ms
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);

    // Clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set a new debounce timer
    const timer = setTimeout(() => {
      setSubmittedTerm(value);
    }, 600);
    setDebounceTimer(timer);
  }, [debounceTimer]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isFetching={isFetching}
      />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 pb-16 pt-6 max-md:px-4 max-md:pb-12">
        {/* Results info bar */}
        <div className="flex items-center justify-between mb-6 px-1 animate-fade-in">
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

        {/* Loading State */}
        {isLoading && <LoadingSkeleton count={6} />}

        {/* Error State */}
        {isError && !isLoading && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {/* Song Grid — shown when we have data and no error */}
        {!isLoading && !isError && songs.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 stagger-children max-md:grid-cols-1">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}

        {/* Empty State — no results or no search yet */}
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
