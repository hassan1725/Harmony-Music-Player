import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { PlayerBar } from './PlayerBar';
import { Home } from '../pages/Home';
import { Library } from '../pages/Library';
import { Settings } from '../pages/Settings';
import { Equalizer } from '../pages/Equalizer';
import { NowPlaying } from '../pages/NowPlaying';
import { useStore } from '../store/useStore';
import { Menu, X } from 'lucide-react';

export const Layout = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();
  const { songs, currentSongIndex, isPlaying, queue } = useStore();

  const currentSongId = currentSongIndex >= 0 ? queue[currentSongIndex] : null;
  const currentSong = currentSongId ? songs.find(s => s.id === currentSongId) : null;

  // Sync RTL based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const setViewWithMenuClose = (view: string) => {
    setCurrentView(view);
    closeMobileMenu();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={setViewWithMenuClose} />;
      case 'library':
      case 'artists':
      case 'albums':
      case 'playlists':
      case 'favorites':
        // For simplicity reusing Library or showing placeholders
        return <Library />;
      case 'equalizer':
        return <Equalizer />;
      case 'settings':
        return <Settings />;
      case 'nowPlaying':
        return <NowPlaying />;
      default:
        return <Home setView={setViewWithMenuClose} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />
      
      {/* Blurred background image if playing */}
      {currentSong?.coverUrl && isPlaying && (
        <div 
          className="absolute inset-0 opacity-[0.03] transition-opacity duration-1000 ease-in-out pointer-events-none mix-blend-screen"
          style={{ 
            backgroundImage: `url(${currentSong.coverUrl})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'blur(100px)' 
          }}
        />
      )}

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center ltr:mr-2 rtl:ml-2 shadow-lg shadow-blue-500/30">
            <div className="text-white font-bold text-xs">H</div>
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Harmony
          </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Wrapper for Drawer behavior on mobile */}
      <div className={`fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 transform lg:relative lg:transform-none lg:z-auto transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'ltr:translate-x-0 rtl:translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}>
        <Sidebar currentView={currentView} setView={setViewWithMenuClose} />
      </div>
      
      <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-black/20 pt-16 lg:pt-0">
        <div className="flex-1 overflow-y-auto w-full">
          {renderContent()}
        </div>
      </main>

      <PlayerBar setView={setViewWithMenuClose} />
    </div>
  );
};