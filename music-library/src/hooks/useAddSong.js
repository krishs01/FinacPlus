import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLocalSong } from '../api/localStore';

/**
 * Mutation hook for adding a new song to localStorage.
 * On success, invalidates the local songs query cache so the list refreshes.
 */
export function useAddSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLocalSong,
    onSuccess: () => {
      // Invalidate local songs cache — triggers a refetch
      queryClient.invalidateQueries({ queryKey: ['songs', 'local'] });
    },
  });
}
