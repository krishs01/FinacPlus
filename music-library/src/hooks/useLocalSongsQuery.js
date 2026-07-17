import { useQuery } from '@tanstack/react-query';

/**
 * Fetches locally-added songs from the MSW mock endpoint.
 * These are songs the user added via the "Add Song" form.
 */
export function useLocalSongsQuery() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['songs', 'local'],
    queryFn: async () => {
      const response = await fetch('/songs');
      if (!response.ok) throw new Error('Failed to fetch local songs');
      return response.json();
    },
    staleTime: 0,  // always refetch — local data changes often
  });

  return {
    localSongs: data ?? [],
    isLoading,
    isError,
    error,
  };
}
