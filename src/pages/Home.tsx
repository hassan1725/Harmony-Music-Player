import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Play } from 'lucide-react';

export const Home = ({ setView }: { setView: (v: string) => void }) => {
  const { t } = useTranslation();
  const { songs, playSong } = useStore();

  const recentlyAdded = [...songs].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto h-full overflow-y-auto">
      <h1 className="text-4xl font-bold tracking-tight text-white mb-10">{t('home')}</h1>
      
      {recentlyAdded.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100">{t('recentlyAdded')}</h2>
            <button onClick={() => setView('library')} className="text-sm font-medium text-blue-400 hover:text-blue-300">View All</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {recentlyAdded.map(song => {
              const queueIds = recentlyAdded.map(s => s.id);
              return (
                <div 
                  key={song.id} 
                  className="group bg-slate-800/30 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all cursor-pointer"
                  onClick={() => playSong(song.id, queueIds)}
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 shadow-md bg-slate-800 flex items-center justify-center">
                     {song.coverUrl ? (
                         <img src={song.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                     ) : (
                         <div className="text-slate-600 font-bold text-4xl">?</div>
                     )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 text-white transform translate-y-4 group-hover:translate-y-0 transition-all">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-100 truncate text-base">{song.title}</h3>
                  <p className="text-sm text-slate-400 truncate mt-1">{song.artist}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {songs.length === 0 && (
        <div className="p-8 bg-slate-800/20 border border-blue-500/20 rounded-2xl text-center">
          <h3 className="text-xl font-medium text-slate-200 mb-2">Welcome to Harmony</h3>
          <p className="text-slate-400 mb-6">Your library is empty. Let's add some music to get started.</p>
          <button 
            onClick={() => setView('library')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Go to Library
          </button>
        </div>
      )}
    </div>
  );
};
