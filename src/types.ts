export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file?: File; // To support local files
  url?: string; // Standard URL or blob URL
  coverUrl?: string; // Blobs or string urls
  timestamp: number; // Added date
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

export interface AppState {
  // Library
  songs: Song[];
  playlists: Playlist[];
  favorites: string[];
  
  // Player
  currentSongIndex: number;
  queue: string[]; // List of song IDs
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  playbackRate: number;
  
  // Actions
  setSongs: (songs: Song[]) => void;
  addSongs: (songs: Song[]) => void;
  updateSong?: (id: string, updates: Partial<Song>) => void;
  playSong: (songOrIndex: number | string, contextQueue?: string[]) => void;
  togglePlayPause: () => void;
  setPlaying: (playing: boolean) => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  seekTo: (progress: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleFavorite: (songId: string) => void;
}
