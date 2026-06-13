import { openDB, DBSchema } from 'idb';
import { Song, Playlist } from '../types';

interface HarmonyDB extends DBSchema {
  songs: {
    key: string;
    value: Song;
    indexes: { 'by-artist': string; 'by-album': string; 'by-date': number };
  };
  playlists: {
    key: string;
    value: Playlist;
  };
  settings: {
    key: string;
    value: any;
  };
}

export const dbPromise = openDB<HarmonyDB>('harmony-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('songs')) {
      const store = db.createObjectStore('songs', { keyPath: 'id' });
      store.createIndex('by-artist', 'artist');
      store.createIndex('by-album', 'album');
      store.createIndex('by-date', 'timestamp');
    }
    if (!db.objectStoreNames.contains('playlists')) {
      db.createObjectStore('playlists', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings');
    }
  },
});

export const saveSongsToDB = async (songs: Song[]) => {
  const db = await dbPromise;
  const tx = db.transaction('songs', 'readwrite');
  for (const song of songs) {
    tx.store.put(song);
  }
  await tx.done;
};

export const getSongsFromDB = async (): Promise<Song[]> => {
  const db = await dbPromise;
  return db.getAll('songs');
};

export const deleteSongFromDB = async (id: string) => {
  const db = await dbPromise;
  await db.delete('songs', id);
};
