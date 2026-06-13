import React from 'react';
import { Home, Library, Mic2, Disc3, ListMusic, Heart, Settings, Info, Sliders, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ currentView, setView }: { currentView: string; setView: (v: string) => void }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'library', icon: Library, label: t('library') },
    { id: 'artists', icon: Mic2, label: t('artists') },
    { id: 'albums', icon: Disc3, label: t('albums') },
    { id: 'playlists', icon: ListMusic, label: t('playlists') },
    { id: 'favorites', icon: Heart, label: t('favorites') },
  ];

  const bottomItems = [
    { id: 'equalizer', icon: Sliders, label: t('equalizer') },
    { id: 'settings', icon: Settings, label: t('settings') },
    { id: 'about', icon: Info, label: t('about') },
  ];

  const renderItem = (item: any) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setView(item.id)}
        className={`w-full flex items-center px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600/10 text-blue-500 font-medium' 
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
        }`}
      >
        <Icon className={`w-5 h-5 ltr:mr-4 rtl:ml-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-500'}`} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="w-64 h-full bg-slate-900 md:bg-slate-900/50 backdrop-blur-3xl border-r border-slate-800/80 flex flex-col pt-6 lg:pt-8 pb-24 overflow-y-auto shrink-0 z-20 transition-transform">
      <div className="px-6 mb-8 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center ltr:mr-3 rtl:ml-3 shadow-lg shadow-blue-500/30">
          <Music className="text-white w-4 h-4" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          {t('appTitle')}
        </h1>
      </div>

      <div className="flex-1 px-3">
        <div className="text-xs font-semibold text-slate-500 mb-4 px-4 uppercase tracking-wider">Menu</div>
        {navItems.map(renderItem)}
      </div>

      <div className="px-3 mt-auto pt-6 border-t border-slate-800/50">
        {bottomItems.map(renderItem)}
      </div>
    </div>
  );
};
