/**
 * SongCard — displays a single song with artwork, info, and optional delete button.
 * Local songs (added via the form) show a "LOCAL" badge and a delete button.
 */
function SongCard({ song, onDelete, canDelete }) {
  const { title, artist, album, year, artwork, isLocal } = song;

  return (
    <article className={`group flex flex-col overflow-hidden rounded-xl bg-white/[0.04] backdrop-blur-xl border shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-250 hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(139,92,246,0.15)] hover:-translate-y-0.5 ${isLocal ? 'border-violet-500/30' : 'border-white/[0.08]'}`}>

      {/* Album Artwork */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#1a1a2e]">
        {artwork ? (
          <img
            src={artwork}
            alt={`${album} cover`}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e] text-5xl text-slate-600">
            ♫
          </div>
        )}

        {/* Local badge */}
        {isLocal && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
            LOCAL
          </span>
        )}
      </div>

      {/* Song Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-base font-semibold text-slate-100 leading-tight truncate" title={title}>
          {title}
        </h3>
        <p className="text-sm text-violet-400 font-medium truncate" title={artist}>
          {artist}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400 truncate flex-1" title={album}>
            {album}
          </span>
          {year && (
            <span className="text-xs text-slate-500 font-medium shrink-0">
              {year}
            </span>
          )}
        </div>
      </div>

      {/* Actions — delete button for local songs only */}
      {isLocal && canDelete && onDelete && (
        <div className="px-4 pb-3">
          <button
            onClick={() => onDelete(song.id)}
            className="w-full py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium transition-all hover:bg-red-500/20 hover:border-red-500/30"
          >
            Remove
          </button>
        </div>
      )}
    </article>
  );
}

export default SongCard;
