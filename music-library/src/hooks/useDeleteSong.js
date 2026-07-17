import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Mutation hook for deleting a locally-added song via DELETE /songs/:id.
 * Invalidates the local songs cache on success.
 */
export function useDeleteSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songId) => {
      const response = await fetch(`/songs/${songId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete song');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', 'local'] });
    },
  });
}
