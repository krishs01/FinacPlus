import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLocalSong } from '../api/localStore';

/**
 * Mutation hook for deleting a locally-added song from localStorage.
 * Invalidates the local songs cache on success.
 */
export function useDeleteSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocalSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', 'local'] });
    },
  });
}
