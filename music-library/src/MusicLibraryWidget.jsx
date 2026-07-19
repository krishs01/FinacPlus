import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthContext';
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
import './index.css';

const queryClient = new QueryClient();

/**
 * Self-contained Music Library widget — the remote entry point.
 *
 * This component bundles everything needed to function independently:
 * QueryClientProvider, AuthProvider, data fetching, toolbar, and song grid.
 * It's designed to be loaded by a Host app via Module Federation.
 */
function MusicLibraryInner() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('coldplay');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

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

  const handleDeleteSong = (songId) => deleteSongMutation.mutate(songId);

  const canAdd = isAdmin;
  const canDelete = isAdmin;

  const handleAddClick = () => {
    if (!isAuthenticated) setShowLoginForm(true);
    else if (isAdmin) setShowAddForm(true);
  };

  const renderSongList = () => {
    if (groupedSongs) {
      return (
        <div>
          {Object.entries(groupedSongs).map(([label, groupSongs], index) => (
            <SongGroup key={label} label={label} songs={groupSongs} index={index}
              onDelete={handleDeleteSong} canDelete={canDelete}
              currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 stagger-children max-md:grid-cols-1">
        {processedSongs.map((song) => (
          <SongCard key={song.id} song={song} onDelete={handleDeleteSong} canDelete={canDelete}
            currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text" placeholder="Search artists, albums, or songs..."
            className="w-full py-2.5 px-4 pl-10 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-indigo-600"
            value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Auth + Add */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-xs text-slate-400">{user.name}</span>
              <button onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-400 text-xs hover:bg-white/[0.1]">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => setShowLoginForm(true)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-400 text-white text-sm font-semibold">
              Sign In
            </button>
          )}
          <button onClick={handleAddClick}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${canAdd
              ? 'bg-gradient-to-r from-indigo-600 to-sky-400 text-white'
              : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>
            + Add
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
        <span>
          {isLoading ? 'Searching...' : `${allSongs.length} songs`}
          {submittedTerm && !isLoading && <span className="text-indigo-400 italic"> matching "{submittedTerm}"</span>}
        </span>
        {isFetching && !isLoading && <span className="text-xs text-slate-500">Refreshing...</span>}
      </div>

      {/* Toolbar */}
      {!isLoading && !isError && allSongs.length > 0 && (
        <Toolbar filterText={filterText} onFilterChange={setFilterText}
          sortKey={sortKey} onSortKeyChange={setSortKey}
          sortDir={sortDir} onSortDirChange={setSortDir}
          groupKey={groupKey} onGroupKeyChange={setGroupKey}
          totalCount={allSongs.length} filteredCount={filteredCount} />
      )}

      {/* Content */}
      {isLoading && <LoadingSkeleton count={6} />}
      {isError && !isLoading && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !isError && processedSongs.length > 0 && renderSongList()}
      {!isLoading && !isError && processedSongs.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>No songs found</p>
        </div>
      )}

      <AddSongForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
      <LoginForm isOpen={showLoginForm} onClose={() => setShowLoginForm(false)} />
    </div>
  );
}

/**
 * Exported widget — wraps providers so it works independently when loaded remotely.
 */
function MusicLibraryWidget() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MusicLibraryInner />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MusicLibraryWidget;
