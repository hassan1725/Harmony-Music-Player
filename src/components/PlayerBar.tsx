import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart, Maximize2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { playerInstance } from '../services/audio';

export const PlayerBar = ({ setView }: { setView: (v: string) => void }) => {
  const { 
    songs, currentSongIndex, queue, isPlaying, volume, 
    togglePlayPause, nextSong, prevSong, setVolume,
    progress, seekTo, shuffle, toggleShuffle,
    repeatMode, toggleRepeat, favorites, toggleFavorite
  } = useStore();

  const progressRef = useRef<HTMLInputElement>(null);
  
  const currentSongId = currentSongIndex >= 0 ? queue[currentSongIndex] : null;
  const currentSong = currentSongId ? songs.find(s => s.id === currentSongId) : null;

  useEffect(() => {
    if (currentSong) {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSong.title,
          artist: currentSong.artist || 'Unknown Artist',
          album: currentSong.album || 'Unknown Album',
          artwork: currentSong.coverUrl ? [
            { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }
          ] : []
        });

        navigator.mediaSession.setActionHandler('play', () => {
          playerInstance.play().catch(console.error);
          useStore.getState().setPlaying(true);
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          playerInstance.pause();
          useStore.getState().setPlaying(false);
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          prevSong();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          nextSong();
        });
      }

      if (currentSong.file && !currentSong.url) {
         const url = URL.createObjectURL(currentSong.file);
         playerInstance.setSrc(url);
      } else if (currentSong.url) {
         playerInstance.setSrc(currentSong.url);
      }
      playerInstance.initAudioContext();
      if (isPlaying) {
        playerInstance.play().catch(e => console.error("Playback failed", e));
      }
    }
  }, [currentSongId, currentSong]);

  useEffect(() => {
    if (isPlaying) {
      playerInstance.play().catch(e => console.error("Playback failed", e));
    } else {
      playerInstance.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    playerInstance.audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = playerInstance.audio;
    const updateProgress = () => {
      seekTo(audio.currentTime);
    };
    const onEnded = () => {
      nextSong();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, [nextSong, seekTo]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    playerInstance.audio.currentTime = val;
    seekTo(val);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  const duration = currentSong.duration || playerInstance.audio.duration || 0;
  const isFavorite = favorites.includes(currentSong.id);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[88px] lg:h-24 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 lg:px-8 flex flex-col justify-center z-30 shadow-2xl">
      <div className="flex items-center justify-between pointer-events-auto w-full">
        {/* Song Info */}
        <div className="flex items-center flex-1 min-w-0 cursor-pointer pl-2 lg:pl-0" onClick={() => setView('nowPlaying')}>
          <div className="relative group w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl overflow-hidden shadow-lg border border-slate-700 shrink-0">
            {currentSong.coverUrl ? (
              <img src={currentSong.coverUrl} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <div className="w-4 h-4 lg:w-6 lg:h-6 rounded-full bg-slate-700" />
              </div>
            )}
          </div>
          <div className="mx-3 lg:mx-4 overflow-hidden flex-1 min-w-0">
            <h4 className="text-slate-100 font-medium text-sm lg:text-base truncate">{currentSong.title}</h4>
            <p className="text-slate-400 text-xs lg:text-sm truncate">{currentSong.artist}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(currentSong.id); }}
            className="hidden lg:block p-2 ml-1 hover:bg-slate-800 rounded-full transition-colors shrink-0"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
          </button>
        </div>

        {/* Controls center */}
        <div className="flex flex-col items-center justify-center w-auto lg:w-1/3 shrink-0 px-2 lg:px-4">
          <div className="flex items-center space-x-2 lg:space-x-4 rtl:space-x-reverse mb-1 lg:mb-2">
            <button onClick={toggleShuffle} className={`hidden lg:block p-2 rounded-full ${shuffle ? 'text-blue-400' : 'text-slate-400'} hover:text-slate-200 transition-colors`}>
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={prevSong} className="p-2 text-slate-300 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); playerInstance.initAudioContext(); togglePlayPause(); }}
              className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 lg:w-6 lg:h-6 fill-current" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current rtl:ml-1" />}
            </button>
            <button onClick={nextSong} className="p-2 text-slate-300 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button onClick={toggleRepeat} className={`hidden lg:block p-2 rounded-full ${repeatMode !== 'off' ? 'text-blue-400' : 'text-slate-400'} hover:text-slate-200 transition-colors`}>
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Bar (Visible mostly on desktop in this layout) */}
          <div className="hidden lg:flex items-center w-full max-w-md space-x-3 rtl:space-x-reverse text-xs text-slate-400 font-mono">
            <span>{formatTime(progress)}</span>
            <input 
              type="range" 
              ref={progressRef}
              min={0} 
              max={duration || 100} 
              value={progress || 0}
              onChange={handleSeek}
              className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Mobile Expand */}
        <div className="flex items-center justify-end flex-1 lg:w-1/3">
          {/* Mobile progress absolute bottom line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800 lg:hidden">
            <div 
               className="h-full bg-blue-500" 
               style={{ width: `${(progress / duration) * 100 || 0}%` }}
            />
          </div>

          <div className="hidden lg:flex items-center justify-end w-full">
            <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-slate-400 hover:text-white p-2">
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 ml-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
          
          {/* Mobile expand button */}
          <button 
            className="lg:hidden p-2 text-slate-400"
            onClick={() => setView('nowPlaying')}
          >
             <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
