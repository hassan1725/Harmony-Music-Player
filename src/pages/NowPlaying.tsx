import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Heart, ListMusic, Maximize2 } from 'lucide-react';
import { playerInstance } from '../services/audio';

export const NowPlaying = () => {
  const { 
    songs, currentSongIndex, queue, isPlaying, 
    togglePlayPause, nextSong, prevSong,
    progress, seekTo, shuffle, toggleShuffle,
    repeatMode, toggleRepeat, favorites, toggleFavorite
  } = useStore();

  const progressRef = useRef<HTMLInputElement>(null);
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  const currentSongId = currentSongIndex >= 0 ? queue[currentSongIndex] : null;
  const currentSong = currentSongId ? songs.find(s => s.id === currentSongId) : null;
  const isFav = currentSong ? favorites.includes(currentSong.id) : false;

  useEffect(() => {
    // A simplified visualizer simulation to avoid complex Web Audio analyser setup
    // Since we already routed audio through filters, we could add AnalyserNode, but a CSS animation or simple canvas works for "glassmorphism" feel
    const canvas = visualizerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const renderFrame = () => {
      animationId = requestAnimationFrame(renderFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const bars = 60;
      const barWidth = canvas.width / bars;
      
      for (let i = 0; i < bars; i++) {
        // Random height if playing, otherwise flat
        const height = isPlaying ? Math.random() * canvas.height * 0.8 : canvas.height * 0.05;
        const x = i * barWidth;
        const y = canvas.height - height;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)');
        
        ctx.fillStyle = gradient;
        // Draw with small gap
        ctx.fillRect(x, y, barWidth - 2, height);
      }
    };

    renderFrame();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full bg-slate-900/50">
        <h2 className="text-xl text-slate-400">Play a song to view details</h2>
      </div>
    );
  }

  const duration = currentSong.duration || playerInstance.audio.duration || 0;
  
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    playerInstance.audio.currentTime = val;
    seekTo(val);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
      
      <div className="w-full max-w-2xl flex flex-col items-center z-10">
        {/* Album Art Large */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 mb-10 group border border-slate-800">
           {currentSong.coverUrl ? (
             <img src={currentSong.coverUrl} className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'scale-105' : 'scale-100'}`} alt="cover" />
           ) : (
             <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700">
                <ListMusic className="w-32 h-32" />
             </div>
           )}
           <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Title and Info */}
        <div className="text-center mb-8 w-full">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight truncate px-4">{currentSong.title}</h1>
          <p className="text-xl text-blue-400 font-medium truncate px-4">{currentSong.artist}</p>
          <p className="text-sm text-slate-500 mt-2 truncate max-w-md mx-auto">{currentSong.album}</p>
        </div>

        {/* Fake Visualizer */}
        <div className="w-full h-16 mb-8 opacity-50 px-8">
           <canvas ref={visualizerRef} width="600" height="60" className="w-full h-full object-fill" />
        </div>

        {/* Progress */}
        <div className="w-full max-w-lg mb-8 px-4">
          <input 
            type="range" 
            ref={progressRef}
            min={0} 
            max={duration || 100} 
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-800/80 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full mb-3"
          />
          <div className="flex justify-between text-sm font-mono text-slate-400 px-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

         {/* Big Controls */}
         <div className="flex items-center justify-center space-x-6 md:space-x-8 rtl:space-x-reverse mb-10 w-full max-w-lg">
          <button 
             onClick={(e) => { e.stopPropagation(); toggleFavorite(currentSong.id); }}
             className="p-3 text-slate-400 hover:text-white transition-colors hover:scale-110 hidden sm:block"
          >
             <Heart className={`w-6 h-6 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
          </button>
          
          <button onClick={toggleShuffle} className={`p-3 rounded-full ${shuffle ? 'text-blue-400' : 'text-slate-400'} hover:text-white transition-colors`}>
            <Shuffle className="w-6 h-6" />
          </button>
          
          <button onClick={prevSong} className="p-3 text-slate-300 hover:text-white transition-transform hover:scale-110">
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          
          <button 
            onClick={() => { playerInstance.initAudioContext(); togglePlayPause(); }}
            className="w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current rtl:ml-1" />}
          </button>
          
          <button onClick={nextSong} className="p-3 text-slate-300 hover:text-white transition-transform hover:scale-110">
            <SkipForward className="w-8 h-8 fill-current" />
          </button>

          <button onClick={toggleRepeat} className={`p-3 rounded-full ${repeatMode !== 'off' ? 'text-blue-400' : 'text-slate-400'} hover:text-white transition-colors`}>
            {repeatMode === 'one' ? <Repeat1 className="w-6 h-6" /> : <Repeat className="w-6 h-6" />}
          </button>

          <button className="p-3 text-slate-500 hover:text-white transition-colors hidden sm:block">
            <ListMusic className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
};
