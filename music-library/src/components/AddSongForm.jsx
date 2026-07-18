import { useForm } from 'react-hook-form';
import { useAddSong } from '../hooks/useAddSong';

/**
 * Modal form for adding a new song, built with react-hook-form.
 * Validates: title (required), artist (required), album (required), year (required + must be a number).
 */
function AddSongForm({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addSongMutation = useAddSong();

  const onSubmit = (data) => {
    addSongMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1E293B] border border-white/[0.08] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Add New Song</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/[0.08] transition-all"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="song-title" className="text-sm font-medium text-slate-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="song-title"
              type="text"
              placeholder="Enter song title"
              className={`w-full py-2.5 px-3 rounded-lg bg-white/[0.06] border text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79, 70, 229,0.2)] ${errors.title ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <span className="text-xs text-red-400">{errors.title.message}</span>
            )}
          </div>

          {/* Artist */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="song-artist" className="text-sm font-medium text-slate-300">
              Artist <span className="text-red-400">*</span>
            </label>
            <input
              id="song-artist"
              type="text"
              placeholder="Enter artist name"
              className={`w-full py-2.5 px-3 rounded-lg bg-white/[0.06] border text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79, 70, 229,0.2)] ${errors.artist ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              {...register('artist', { required: 'Artist is required' })}
            />
            {errors.artist && (
              <span className="text-xs text-red-400">{errors.artist.message}</span>
            )}
          </div>

          {/* Album */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="song-album" className="text-sm font-medium text-slate-300">
              Album <span className="text-red-400">*</span>
            </label>
            <input
              id="song-album"
              type="text"
              placeholder="Enter album name"
              className={`w-full py-2.5 px-3 rounded-lg bg-white/[0.06] border text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79, 70, 229,0.2)] ${errors.album ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              {...register('album', { required: 'Album is required' })}
            />
            {errors.album && (
              <span className="text-xs text-red-400">{errors.album.message}</span>
            )}
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="song-year" className="text-sm font-medium text-slate-300">
              Year <span className="text-red-400">*</span>
            </label>
            <input
              id="song-year"
              type="number"
              placeholder="e.g. 2024"
              className={`w-full py-2.5 px-3 rounded-lg bg-white/[0.06] border text-slate-100 text-sm outline-none transition-all placeholder:text-slate-500 focus:bg-white/[0.1] focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79, 70, 229,0.2)] ${errors.year ? 'border-red-500/50' : 'border-white/[0.08]'}`}
              {...register('year', {
                required: 'Year is required',
                valueAsNumber: true,
                validate: (value) => {
                  if (isNaN(value)) return 'Year must be a number';
                  if (value < 1900 || value > new Date().getFullYear() + 1) {
                    return `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
                  }
                  return true;
                },
              })}
            />
            {errors.year && (
              <span className="text-xs text-red-400">{errors.year.message}</span>
            )}
          </div>

          {/* Mutation error */}
          {addSongMutation.isError && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {addSongMutation.error?.message || 'Failed to add song'}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-sm font-medium transition-all hover:bg-white/[0.1] hover:border-white/[0.15]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addSongMutation.isPending}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-400 text-white text-sm font-semibold shadow-[0_2px_10px_rgba(79, 70, 229,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(79, 70, 229,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {addSongMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add Song'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSongForm;
