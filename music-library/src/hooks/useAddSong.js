import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Mutation hook for adding a new song via POST /songs.
 * On success, invalidates the local songs query cache so the list refreshes.
 *
 * We chose cache invalidation over optimistic updates for simplicity and correctness:
 * - The server assigns the id, so we can't predict it client-side
 * - Invalidation guarantees the UI matches the "server" state
 * - For a mock endpoint with ~300ms delay, the UX is still snappy
 */
export function useAddSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songData) => {
      const response = await fetch('/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add song');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate local songs cache — triggers a refetch
      queryClient.invalidateQueries({ queryKey: ['songs', 'local'] });
    },
  });
}
