import { useState } from 'react';
import Header from './components/Header';
import SongCard from './components/SongCard';

// Dummy data for Stage 1 — replaced with real iTunes API data in Stage 2
const DUMMY_SONGS = [
  {
    id: '1',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    year: 2000,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/200x200bb.jpg',
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    year: 2020,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/4d/e0/e1/4de0e176-2495-c640-2a28-a53dd3304ef4/20UMGIM12176.rgb.jpg/200x200bb.jpg',
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    year: 1975,
    artwork: null,
  },
  {
    id: '4',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    year: 2017,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/47/51/d0/4751d09a-40ef-b498-3ad1-0ae46d51a66a/190295851286.jpg/200x200bb.jpg',
  },
  {
    id: '5',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    year: 2016,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/57/56/d4/5756d408-3a8c-ee82-aa5a-e3a21bade0f3/16UMGIM64954.rgb.jpg/200x200bb.jpg',
  },
  {
    id: '6',
    title: 'Fix You',
    artist: 'Coldplay',
    album: 'X&Y',
    year: 2005,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b6/2f/cb/b62fcb8b-6542-9a88-a3e3-9f95082c8002/190295939717.jpg/200x200bb.jpg',
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // Simple client-side filter on dummy data (real filtering via React Query in Stage 2)
  const displayedSongs = DUMMY_SONGS.filter((song) =>
    [song.title, song.artist, song.album]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 pb-16 pt-6 max-md:px-4 max-md:pb-12">
        {/* Results info */}
        <div className="flex items-center justify-between mb-6 px-1 animate-fade-in">
          <p className="text-sm text-slate-400 font-medium">
            {displayedSongs.length} {displayedSongs.length === 1 ? 'song' : 'songs'}
            {searchTerm && (
              <span className="text-violet-400 italic"> matching &quot;{searchTerm}&quot;</span>
            )}
          </p>
        </div>

        {/* Song Grid */}
        {displayedSongs.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 stagger-children max-md:grid-cols-1">
            {displayedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
            <div className="text-5xl leading-none mb-2">🔍</div>
            <h2 className="text-xl font-semibold text-slate-100">No songs found</h2>
            <p className="text-sm text-slate-400 max-w-[400px] leading-relaxed">
              {searchTerm
                ? `No results for "${searchTerm}". Try a different search term.`
                : 'Start by searching for your favorite artist or song.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
