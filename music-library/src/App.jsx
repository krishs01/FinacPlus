import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Header from './components/Header';
import SongCard from './components/SongCard';
import SongGroup from './components/SongGroup';
import Toolbar from './components/Toolbar';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import AddSongForm from './components/AddSongForm';
import LoginForm from './components/LoginForm';
import { useSongsQuery } from './hooks/useSongsQuery';
import { useLocalSongsQuery } from './hooks/useLocalSongsQuery';
import { useDeleteSong } from './hooks/useDeleteSong';
import { useSongFilters } from './hooks/useSongFilters';

const queryClient = new QueryClient();

function MusicLibraryContent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('coldplay');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const { songs: itunesSongs, isLoading, isFetching, isError, error, refetch } = useSongsQuery(submittedTerm);
  const { localSongs } = useLocalSongsQuery();
  const deleteSongMutation = useDeleteSong();

  const allSongs = [...localSongs, ...itunesSongs];

  const {
    processedSongs, groupedSongs, filteredCount,
    filterText, setFilterText,
    sortKey, setSortKey, sortDir, setSortDir,
    groupKey, setGroupKey,
  } = useSongFilters(allSongs);

  const [debounceTimer, setDebounceTimer] = useState(null);
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => setSubmittedTerm(value), 600);
    setDebounceTimer(timer);
  }, [debounceTimer]);

  const handleDeleteSong = (songId) => {
    deleteSongMutation.mutate(songId);
  };

  // Only admins can add/delete songs
  const canAdd = isAdmin;
  const canDelete = isAdmin;

  const handleAddClick = () => {
    if (!isAuthenticated) {
      setShowLoginForm(true); // prompt login first
    } else if (!isAdmin) {
      // viewer role — show a hint (handled inline)
    } else {
      setShowAddForm(true);
    }
  };

  const renderSongList = () => {
    if (groupedSongs) {
      return (
        <div>
          {Object.entries(groupedSongs).map(([label, groupSongs], index) => (
            <SongGroup key={label} label={label} songs={groupSongs} index={index}
              onDelete={handleDeleteSong} canDelete={canDelete} />
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
        user={user}
        onLoginClick={() => setShowLoginForm(true)}
        onLogout={logout}
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
            {/* Add Song — admin only, login prompt for unauthenticated */}
            <button
              onClick={handleAddClick}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                canAdd
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-[0_2px_10px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:bg-white/[0.1] hover:text-slate-200'
              }`}
              title={!isAuthenticated ? 'Sign in to add songs' : !isAdmin ? 'Admin access required' : 'Add a new song'}
            >
              <span className="text-base leading-none">+</span>
              Add Song
            </button>
          </div>
        </div>

        {/* Role hint for viewers */}
        {isAuthenticated && !isAdmin && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-slate-500 animate-fade-in">
            👋 You&apos;re signed in as a <span className="text-slate-300 font-medium">viewer</span>. Sign in as <span className="text-cyan-400 font-medium">admin</span> to add or remove songs.
          </div>
        )}

        {/* Toolbar */}
        {!isLoading && !isError && allSongs.length > 0 && (
          <Toolbar
            filterText={filterText} onFilterChange={setFilterText}
            sortKey={sortKey} onSortKeyChange={setSortKey}
            sortDir={sortDir} onSortDirChange={setSortDir}
            groupKey={groupKey} onGroupKeyChange={setGroupKey}
            totalCount={allSongs.length} filteredCount={filteredCount}
          />
        )}

        {isLoading && <LoadingSkeleton count={6} />}
        {isError && !isLoading && <ErrorState error={error} onRetry={refetch} />}
        {!isLoading && !isError && processedSongs.length > 0 && renderSongList()}

        {/* No filter matches */}
        {!isLoading && !isError && allSongs.length > 0 && processedSongs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
            <div className="text-5xl leading-none mb-2">🔍</div>
            <h2 className="text-xl font-semibold text-slate-100">No matches</h2>
            <p className="text-sm text-slate-400 max-w-[400px] leading-relaxed">
              No songs match your filter &quot;{filterText}&quot;.
            </p>
          </div>
        )}

        {/* No API results */}
        {!isLoading && !isError && allSongs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
            <div className="text-5xl leading-none mb-2">{submittedTerm ? '🔍' : '🎵'}</div>
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

      {/* Modals */}
      <AddSongForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
      <LoginForm isOpen={showLoginForm} onClose={() => setShowLoginForm(false)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MusicLibraryContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
