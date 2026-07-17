import { http, HttpResponse } from 'msw';

/**
 * In-memory store for locally-added songs.
 * This simulates a backend database — songs persist only for the browser session.
 */
let localSongs = [];
let nextId = 1;

export const handlers = [
  // GET /songs — return all locally-added songs
  http.get('/songs', () => {
    return HttpResponse.json(localSongs);
  }),

  // POST /songs — add a new song
  http.post('/songs', async ({ request }) => {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.artist || !body.album || !body.year) {
      return HttpResponse.json(
        { error: 'Missing required fields: title, artist, album, year' },
        { status: 400 }
      );
    }

    const newSong = {
      id: `local-${nextId++}`,
      title: body.title.trim(),
      artist: body.artist.trim(),
      album: body.album.trim(),
      year: Number(body.year),
      artwork: null,
      preview: null,
      isLocal: true,
    };

    localSongs.push(newSong);

    // Simulate a small network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json(newSong, { status: 201 });
  }),

  // DELETE /songs/:id — remove a locally-added song
  http.delete('/songs/:id', async ({ params }) => {
    const { id } = params;
    const index = localSongs.findIndex((s) => s.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { error: `Song with id "${id}" not found` },
        { status: 404 }
      );
    }

    localSongs.splice(index, 1);

    await new Promise((resolve) => setTimeout(resolve, 200));

    return HttpResponse.json({ success: true });
  }),
];
