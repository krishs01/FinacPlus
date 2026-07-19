const STORAGE_KEY = 'finacplus_songs';

export const getLocalSongs = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addLocalSong = async (songData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const songs = await getLocalSongs();
  const newSong = { ...songData, id: `local-${Date.now()}` };
  songs.unshift(newSong);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  return newSong;
};

export const deleteLocalSong = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const songs = await getLocalSongs();
  const filtered = songs.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return { success: true };
};
