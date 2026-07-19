/**
 * iTunes Search API — fetch and data mapping layer.
 *
 * The raw iTunes response has fields like trackName, artistName, collectionName, etc.
 * We map them to a cleaner shape our UI expects: { id, title, artist, album, year, artwork, preview }.
 */

const ITUNES_SEARCH_URL = '/api/itunes/search';

/**
 * Maps a single raw iTunes track object to our app's Song model.
 * This mapping step normalizes the messy API response into a predictable shape.
 */
export function mapItunesTrack(track) {
  return {
    id: String(track.trackId),
    title: track.trackName || 'Unknown Title',
    artist: track.artistName || 'Unknown Artist',
    album: track.collectionName || 'Unknown Album',
    year: track.releaseDate
      ? new Date(track.releaseDate).getFullYear()
      : null,
    artwork: track.artworkUrl100
      ? track.artworkUrl100.replace('100x100', '300x300')
      : null,
    preview: track.previewUrl || null,
    isLocal: false,
  };
}

/**
 * Fetches songs from the iTunes Search API for a given search term.
 * Returns an array of mapped Song objects.
 */
export async function fetchSongs(term) {
  if (!term || term.trim().length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    term: term.trim(),
    entity: 'song',
    limit: '30',
  });

  const response = await fetch(`${ITUNES_SEARCH_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Map each raw track to our app model using .map()
  return data.results.map(mapItunesTrack);
}
