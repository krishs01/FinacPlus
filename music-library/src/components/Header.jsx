import { useState } from 'react';

function Header({ searchTerm, onSearchChange, isFetching, user, onLoginClick, onLogout }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-[rgba(10,10,15,0.8)] backdrop-blur-xl border-b border-white/[0.08]">
      <div className="flex items-center gap-6 max-w-[1280px] mx-auto px-6 py-4 max-md:flex-wrap max-md:px-4 max-md:py-3 max-md:gap-3">

        {/* Logo / Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_2px_12px_rgba(139,92,246,0.3)] animate-pulse-glow">
            <span className="text-xl text-white leading-none">♫</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Music Library
            </h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide">by FinacPlus</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`flex-1 max-w-[520px] relative flex items-center max-md:order-3 max-md:max-w-full max-md:basis-full`}>
          <svg
            className={`absolute left-4 pointer-events-none transition-colors duration-150 ${isFocused ? 'text-violet-500' : 'text-slate-500'}`}
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-input"
            type="text"
            className="w-full py-3 px-4 pl-11 rounded-full bg-white/[0.06] border border-white/[0.08] text-slate-100 text-sm outline-none transition-all duration-250 placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.3)]"
            placeholder="Search artists, albums, or songs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full text-xs text-slate-500 transition-all duration-150 hover:bg-white/[0.08] hover:text-slate-100"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-3 shrink-0 max-md:ml-auto">
          {user ? (
            <>
              {/* User avatar + info */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col max-md:hidden">
                  <span className="text-xs font-medium text-slate-200 leading-tight">{user.name}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider leading-tight ${user.role === 'admin' ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-400 text-xs font-medium transition-all hover:bg-white/[0.1] hover:text-slate-100 hover:border-white/[0.15]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_2px_10px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Fetch progress bar */}
      {isFetching && (
        <div className="h-0.5 w-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-violet-500 to-cyan-500 animate-[shimmer_1s_ease-in-out_infinite] rounded-full" />
        </div>
      )}
    </header>
  );
}

export default Header;
