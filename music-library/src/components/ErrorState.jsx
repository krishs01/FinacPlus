/**
 * Error state component with a retry button.
 * Shown when the iTunes API call fails.
 */
function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
        ⚠
      </div>
      <h2 className="text-xl font-semibold text-slate-100">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-400 max-w-md leading-relaxed">
        {error?.message || 'Failed to fetch songs. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_2px_10px_rgba(139,92,246,0.3)] transition-all duration-150 hover:shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
