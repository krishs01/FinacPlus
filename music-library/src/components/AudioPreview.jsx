import { useState, useRef, useEffect } from 'react';

/**
 * AudioPreview — inline audio player for 30-second iTunes previews.
 * Renders a play/pause button + progress bar. Only one song plays at a time
 * (managed via the global currentlyPlaying state in the parent).
 */
function AudioPreview({ previewUrl, songId, currentlyPlaying, setCurrentlyPlaying }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const isThisPlaying = currentlyPlaying === songId;

  // Pause when another song starts playing
  useEffect(() => {
    if (!isThisPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isThisPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    } else {
      audio.play();
      setIsPlaying(true);
      setCurrentlyPlaying(songId);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentlyPlaying(null);
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!previewUrl) return null;

  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={previewUrl}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shrink-0 ${
          isThisPlaying
            ? 'bg-gradient-to-r from-indigo-600 to-sky-400 text-white shadow-[0_0_15px_rgba(79, 70, 229,0.4)]'
            : 'bg-white/[0.08] text-slate-400 hover:bg-white/[0.15] hover:text-white'
        }`}
        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
      >
        {isThisPlaying ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div
        className="flex-1 h-1 bg-white/[0.08] rounded-full cursor-pointer group/progress relative"
        onClick={handleProgressClick}
      >
        <div
          className={`h-full rounded-full transition-all duration-150 ${
            isThisPlaying
              ? 'bg-gradient-to-r from-indigo-600 to-sky-400'
              : 'bg-white/[0.2]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time */}
      {isThisPlaying && duration > 0 && (
        <span className="text-[10px] text-slate-500 font-mono tabular-nums shrink-0">
          {formatTime(audioRef.current?.currentTime || 0)}
        </span>
      )}
    </div>
  );
}

export default AudioPreview;
