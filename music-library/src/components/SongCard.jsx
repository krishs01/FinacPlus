import AudioPreview from './AudioPreview';

/**
 * SongCard — displays a single song with artwork, info, audio preview, and optional delete.
 * Local songs show a "LOCAL" badge and delete button. iTunes songs show a play button.
 */
function SongCard({ song, onDelete, canDelete, currentlyPlaying, setCurrentlyPlaying }) {
  const { title, artist, album, year, artwork, preview, isLocal } = song;

  return (
    <article className={`group flex flex-col overflow-hidden rounded-xl bg-white/[0.04] backdrop-blur-xl border shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-250 hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(79, 70, 229,0.15)] hover:-translate-y-0.5 ${isLocal ? 'border-indigo-600/30' : 'border-white/[0.08]'}`}>

      {/* Album Artwork */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#1E293B]">
        {artwork ? (
          <img
            src={artwork}
            alt={`${album} cover`}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#0f0f1a] text-5xl text-slate-600">
            ♫
          </div>
        )}

        {/* Local badge */}
        {isLocal && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-gradient-to-r from-indigo-600 to-sky-400 text-white shadow-[0_2px_8px_rgba(79, 70, 229,0.4)]">
            LOCAL
          </span>
        )}

        {/* Playing indicator overlay */}
        {currentlyPlaying === song.id && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex items-end gap-[3px] h-5">
              <div className="w-[3px] bg-indigo-400 rounded-full animate-[equalizer1_0.5s_ease-in-out_infinite]" />
              <div className="w-[3px] bg-sky-400 rounded-full animate-[equalizer2_0.7s_ease-in-out_infinite]" />
              <div className="w-[3px] bg-indigo-400 rounded-full animate-[equalizer3_0.6s_ease-in-out_infinite]" />
              <div className="w-[3px] bg-sky-400 rounded-full animate-[equalizer1_0.4s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-base font-semibold text-slate-100 leading-tight truncate" title={title}>
          {title}
        </h3>
        <p className="text-sm text-indigo-400 font-medium truncate" title={artist}>
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

      {/* Audio Preview */}
      <AudioPreview
        previewUrl={preview}
        songId={song.id}
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
      />

      {/* Delete — local songs + admin only */}
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
