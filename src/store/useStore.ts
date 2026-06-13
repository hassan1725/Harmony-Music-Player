import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Song, Playlist } from '../types';
import { getSongsFromDB, saveSongsToDB } from '../services/db';

interface PlayerState extends AppState {}

export const useStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      songs: [],
      playlists: [],
      favorites: [],
      
      currentSongIndex: -1,
      queue: [],
      isPlaying: false,
      progress: 0,
      volume: 1,
      isMuted: false,
      shuffle: false,
      repeatMode: 'off',
      playbackRate: 1,

      setSongs: (songs: Song[]) => {
        set({ songs, queue: songs.map(s => s.id) });
        saveSongsToDB(songs);
      },
      
      addSongs: (newSongs: Song[]) => {
        const { songs, queue } = get();
        const updatedSongs = [...songs, ...newSongs];
        const updatedQueue = [...queue, ...newSongs.map(s => s.id)];
        set({ songs: updatedSongs, queue: updatedQueue });
        saveSongsToDB(updatedSongs);
      },

      updateSong: (id: string, updates: Partial<Song>) => {
        const { songs } = get();
        const updatedSongs = songs.map(s => s.id === id ? { ...s, ...updates } : s);
        set({ songs: updatedSongs });
        saveSongsToDB(updatedSongs);
      },

      playSong: (songOrIndex: number | string, contextQueue?: string[]) => set((state) => {
        let index = -1;
        let newQueue = state.queue;
        
        if (contextQueue) {
          newQueue = contextQueue;
        }

        if (typeof songOrIndex === 'string') {
          index = newQueue.indexOf(songOrIndex);
          if (index === -1 && !contextQueue) {
             // If not in current queue, maybe it's in global songs
             index = state.songs.findIndex(s => s.id === songOrIndex);
             newQueue = state.songs.map(s => s.id);
          }
        } else {
          index = songOrIndex;
        }

        return { 
          queue: newQueue,
          currentSongIndex: index !== -1 ? index : state.currentSongIndex, 
          isPlaying: true, 
          progress: 0 
        };
      }),

      togglePlayPause: () => set((state) => ({ 
        isPlaying: !state.isPlaying 
      })),

      nextSong: () => set((state) => {
        if (state.queue.length === 0) return state;
        
        // Single repeat handled by audio element effectively, but we can do it here
        if (state.repeatMode === 'one') {
           return { isPlaying: true, progress: 0 };
        }

        let nextIdx = state.currentSongIndex + 1;
        if (nextIdx >= state.queue.length) {
          if (state.repeatMode === 'all') nextIdx = 0;
          else return { isPlaying: false, currentSongIndex: -1 }; // stop at end
        }
        
        if (state.shuffle) {
          nextIdx = Math.floor(Math.random() * state.queue.length);
        }
        
        return { currentSongIndex: nextIdx, isPlaying: true, progress: 0 };
      }),

      prevSong: () => set((state) => {
        if (state.queue.length === 0) return state;
        if (state.progress > 3) {
           return { progress: 0, isPlaying: true }; // Just restart song
        }
        let prevIdx = state.currentSongIndex - 1;
        if (prevIdx < 0) {
          if (state.repeatMode === 'all') prevIdx = state.queue.length - 1;
          else prevIdx = 0;
        }
        return { currentSongIndex: prevIdx, isPlaying: true, progress: 0 };
      }),

      setVolume: (volume: number) => set({ volume }),
      seekTo: (progress: number) => set({ progress }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      
      toggleRepeat: () => set((state) => {
        const modes: ('off'|'all'|'one')[] = ['off', 'all', 'one'];
        const idx = modes.indexOf(state.repeatMode);
        return { repeatMode: modes[(idx + 1) % modes.length] };
      }),

      setPlaybackRate: (playbackRate: number) => set({ playbackRate }),
      
      toggleFavorite: (songId: string) => set((state) => {
        const favs = state.favorites;
        return { 
          favorites: favs.includes(songId) 
            ? favs.filter(id => id !== songId) 
            : [...favs, songId] 
        };
      })
    }),
    {
      name: 'harmony-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        shuffle: state.shuffle, 
        repeatMode: state.repeatMode,
        favorites: state.favorites,
        playlists: state.playlists
      }),
    }
  )
);

// Load initial data
getSongsFromDB().then(songs => {
  if (songs && songs.length > 0) {
    useStore.setState({ songs, queue: songs.map(s => s.id) });
  }
});
