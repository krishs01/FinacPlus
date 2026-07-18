import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'albums', label: 'Albums', icon: 'album' },
  { id: 'artists', label: 'Artists', icon: 'artist' },
  { id: 'songs', label: 'Songs', icon: 'song' },
  { id: 'playlists', label: 'Playlists', icon: 'playlist' },
  { id: 'favourites', label: 'Favourites', icon: 'heart' },
  { id: 'recent', label: 'Recently Added', icon: 'clock' },
];

function NavIcon({ type, active }) {
  const color = active ? 'currentColor' : 'currentColor';
  switch (type) {
    case 'home':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'album':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'artist':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'song':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'playlist':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'clock':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Sidebar — left nav panel with navigation items and a "Now Playing" mini player.
 * The now-playing bar shows the currently playing song info, progress, and controls.
 */
function Sidebar({ currentSong, isPlaying, onTogglePlay, progress, collapsed, onToggleCollapse }) {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <aside className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-[#0B1120] border-r border-white/[0.06] transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[220px]'} max-md:hidden`}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-400 flex items-center justify-center shadow-[0_2px_12px_rgba(79,70,229,0.3)] shrink-0">
          <span className="text-lg text-white leading-none">♫</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#F8FAFC] leading-tight truncate">Music Library</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">by FinacPlus</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                    <NavIcon type={item.icon} active={isActive} />
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="mx-2 mb-2 py-2 rounded-lg bg-white/[0.04] text-slate-500 text-xs transition-all hover:bg-white/[0.08] hover:text-slate-300"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Now Playing mini-player */}
      {currentSong && (
        <div className="border-t border-white/[0.06] p-3 shrink-0">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2.5 mb-2.5">
                {currentSong.artwork ? (
                  <img src={currentSong.artwork} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#1E293B] flex items-center justify-center text-lg text-slate-600 shrink-0">♫</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#F8FAFC] truncate">{currentSong.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentSong.artist}</p>
                </div>
                <button className="text-indigo-400 hover:text-indigo-300 text-base transition-colors shrink-0">♡</button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-400 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button className="text-slate-500 hover:text-slate-200 transition-colors" title="Shuffle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </button>
                <button className="text-slate-400 hover:text-slate-100 transition-colors" title="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4" /><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" /></svg>
                </button>
                <button
                  onClick={onTogglePlay}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-[0_2px_12px_rgba(79,70,229,0.4)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                  )}
                </button>
                <button className="text-slate-400 hover:text-slate-100 transition-colors" title="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20" /><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" /></svg>
                </button>
                <button className="text-slate-500 hover:text-slate-200 transition-colors" title="Repeat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            /* Collapsed: just show artwork + play button */
            <div className="flex flex-col items-center gap-2">
              {currentSong.artwork ? (
                <img src={currentSong.artwork} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#1E293B] flex items-center justify-center text-lg text-slate-600">♫</div>
              )}
              <button
                onClick={onTogglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-sky-400 flex items-center justify-center text-white"
              >
                {isPlaying ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
