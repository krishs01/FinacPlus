import SongCard from './SongCard';

/**
 * Renders a named group of songs — a header label followed by a grid of SongCards.
 * Used when the user selects "Group by Album" or "Group by Artist".
 */
function SongGroup({ label, songs, index }) {
  return (
    <section
      className="mb-8 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Group header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <h3 className="text-sm font-semibold text-slate-200 truncate">
          {label}
        </h3>
        <span className="text-xs text-slate-500 font-medium shrink-0">
          {songs.length} {songs.length === 1 ? 'song' : 'songs'}
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Song grid within this group */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 max-md:grid-cols-1">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
}

export default SongGroup;
