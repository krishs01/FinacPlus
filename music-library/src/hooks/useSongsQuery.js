import { useQuery } from '@tanstack/react-query';
import { fetchSongs } from '../api/itunes';

/**
 * Custom hook wrapping useQuery for fetching songs from iTunes.
 *
 * This keeps the data-fetching concern out of components — they just call
 * useSongsQuery(searchTerm) and get back { songs, isLoading, isError, error, refetch }.
 *
 * The query is disabled when searchTerm is empty (no wasted API calls).
 * staleTime of 5 minutes avoids hammering the API on rapid re-renders.
 */
export function useSongsQuery(searchTerm) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['songs', 'itunes', searchTerm],
    queryFn: () => fetchSongs(searchTerm),
    enabled: searchTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000,       // 5 minutes — don't refetch on every mount
    gcTime: 10 * 60 * 1000,         // 10 minutes — keep in cache for a while
    retry: 2,                        // retry failed requests twice
    refetchOnWindowFocus: false,     // don't refetch when tab regains focus
  });

  return {
    songs: data ?? [],
    isLoading: isLoading && searchTerm.trim().length > 0,
    isFetching,
    isError,
    error,
    refetch,
  };
}
