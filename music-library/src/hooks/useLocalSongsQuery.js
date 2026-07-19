import { useQuery } from '@tanstack/react-query';
import { getLocalSongs } from '../api/localStore';

/**
 * Fetches locally-added songs from localStorage instead of MSW.
 * This ensures it works seamlessly when loaded as a Micro Frontend on Vercel.
 */
export function useLocalSongsQuery() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['songs', 'local'],
    queryFn: getLocalSongs,
    staleTime: 0,  // always refetch — local data changes often
  });

  return {
    localSongs: data ?? [],
    isLoading,
    isError,
    error,
  };
}
