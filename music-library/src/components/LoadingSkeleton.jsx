/**
 * Shimmer loading skeleton that mimics the SongCard layout.
 * Renders a grid of placeholder cards while data is being fetched.
 */
function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 max-md:grid-cols-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.08]"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {/* Artwork placeholder */}
          <div className="w-full aspect-square skeleton" />

          {/* Text placeholders */}
          <div className="p-4 flex flex-col gap-3">
            <div className="h-4 w-3/4 rounded skeleton" />
            <div className="h-3 w-1/2 rounded skeleton" />
            <div className="flex items-center gap-2 mt-1">
              <div className="h-3 w-2/3 rounded skeleton" />
              <div className="h-3 w-10 rounded skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
