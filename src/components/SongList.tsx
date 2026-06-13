import React, { useState } from 'react';
import { Play, Heart, MoreHorizontal, Music, Edit2, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Song } from '../types';
import { playerInstance } from '../services/audio';

export const SongList = ({ songs }: { songs: Song[] }) => {
  const { playSong, currentSongIndex, isPlaying, favorites, toggleFavorite, togglePlayPause, updateSong } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', artist: '', album: '' });

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '--:--';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startEdit = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(song.id);
    setEditForm({ title: song.title, artist: song.artist, album: song.album });
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const saveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (updateSong) {
      updateSong(id, editForm);
    }
    setEditingId(null);
  };

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Music className="w-16 h-16 mb-4 opacity-20" />
        <p>No songs available here.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden md:grid grid-cols-[1fr_3fr_3fr_1fr_min-content] gap-4 px-6 py-3 text-sm font-medium text-slate-400 border-b border-slate-800/50 mb-2">
        <div>#</div>
        <div>TITLE</div>
        <div>ALBUM</div>
        <div className="flex justify-end pr-8">DURATION</div>
        <div></div>
      </div>
      
      <div className="flex flex-col gap-1">
        {songs.map((song, idx) => {
          const isCurrent = currentSongIndex >= 0 && useStore.getState().queue[currentSongIndex] === song.id;
          const isFav = favorites.includes(song.id);
          const queueIds = songs.map(s => s.id);
          const isEditing = editingId === song.id;
          
          return (
            <div 
              key={song.id}
              className={`group flex md:grid md:grid-cols-[1fr_3fr_3fr_1fr_min-content] gap-3 md:gap-4 px-3 md:px-6 py-3 items-center rounded-xl transition-colors cursor-pointer ${
                isCurrent ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
              } ${isEditing ? 'bg-slate-800 border border-slate-700 shadow-lg' : ''}`}
              onDoubleClick={() => {
                if(isEditing) return;
                playerInstance.initAudioContext();
                playSong(song.id, queueIds);
              }}
              onClick={() => {
                // Mobile single tap play if not editing
                if (!isEditing && window.innerWidth < 768) {
                    playerInstance.initAudioContext();
                    playSong(song.id, queueIds);
                }
              }}
            >
              <div className="hidden md:flex items-center text-slate-400 w-8">
                <span className={`block group-hover:hidden ${isCurrent ? 'hidden' : ''}`}>{idx + 1}</span>
                {isCurrent && isPlaying ? (
                  <div className="flex space-x-1 items-end h-4 mx-1">
                    <div className="w-1 bg-blue-500 animate-[bounce_1s_infinite] h-3" />
                    <div className="w-1 bg-blue-500 animate-[bounce_0.8s_infinite] h-4" />
                    <div className="w-1 bg-blue-500 animate-[bounce_1.2s_infinite] h-2" />
                  </div>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playerInstance.initAudioContext();
                      isCurrent ? togglePlayPause() : playSong(song.id, queueIds);
                    }}
                    className={`hidden group-hover:block text-slate-200 hover:text-white ${isCurrent ? 'block' : ''}`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-3 overflow-hidden flex-1 md:flex-none rtl:space-x-reverse">
                <div className="w-12 h-12 md:w-10 md:h-10 rounded shadow flex-shrink-0 bg-slate-800 flex items-center justify-center overflow-hidden">
                   {song.coverUrl ? (
                     <img src={song.coverUrl} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <Music className="w-4 md:w-5 h-4 md:h-5 text-slate-500" />
                   )}
                </div>
                {isEditing ? (
                  <div className="flex flex-col gap-1 w-full" onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500 w-full" placeholder="Title"
                    />
                    <input 
                      type="text" value={editForm.artist} onChange={e => setEditForm({...editForm, artist: e.target.value})}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500 w-full" placeholder="Artist"
                    />
                  </div>
                ) : (
                  <div className="truncate flex-1 min-w-0">
                    <div className={`font-medium truncate text-sm md:text-base ${isCurrent ? 'text-blue-400' : 'text-slate-200'}`}>
                      {song.title}
                    </div>
                    <div className="text-xs md:text-sm text-slate-400 truncate mt-0.5">{song.artist}</div>
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div className="hidden md:flex w-full" onClick={e => e.stopPropagation()}>
                   <input 
                      type="text" value={editForm.album} onChange={e => setEditForm({...editForm, album: e.target.value})}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500 w-full" placeholder="Album"
                    />
                </div>
              ) : (
                <div className="hidden md:block font-mono text-sm text-slate-400 truncate">
                  {song.album}
                </div>
              )}
              
              <div className="hidden md:flex font-mono text-sm text-slate-400 justify-end items-center pr-4">
                {!isEditing && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                    className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all mr-6"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500 opacity-100' : 'text-slate-400'} `} />
                  </button>
                )}
                {formatTime(song.duration)}
              </div>

              <div className="flex items-center justify-end text-slate-400 gap-2 shrink-0 pr-2">
                {isEditing ? (
                  <>
                    <button onClick={(e) => saveEdit(song.id, e)} className="text-green-500 hover:text-green-400 bg-green-500/10 p-1.5 md:p-2 rounded-full transition-colors"><Check className="w-4 h-4 md:w-5 md:h-5" /></button>
                    <button onClick={cancelEdit} className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 md:p-2 rounded-full transition-colors"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={(e) => startEdit(song, e)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-slate-700/50 p-1.5 md:p-2 rounded-full transition-all hover:text-white"
                      title="Edit Tags"
                    >
                      <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-slate-700/50 p-1.5 md:p-2 rounded-full transition-all hover:text-white md:hidden lg:flex">
                      <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
