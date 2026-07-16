function SongCard({ song }) {
  const { title, artist, album, year, artwork } = song;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-250 hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(139,92,246,0.15)] hover:-translate-y-0.5">

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

      {/* Actions — delete button added in Stage 4 */}
      <div className="px-4 pb-3 flex gap-2">
      </div>
    </article>
  );
}

export default SongCard;
