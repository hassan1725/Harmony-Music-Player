import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { useMediaFiles } from '../hooks/useMediaFiles';
import { SongList } from '../components/SongList';
import { FolderSearch, Search, ArrowUpDown } from 'lucide-react';

type SortOption = 'title' | 'artist' | 'album' | 'date';

export const Library = () => {
  const { t } = useTranslation();
  const { songs } = useStore();
  const { scanFiles, isScanning } = useMediaFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortAsc, setSortAsc] = useState(false);

  let filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredSongs.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'album':
        comparison = a.album.localeCompare(b.album);
        break;
      case 'date':
        comparison = a.timestamp - b.timestamp;
        break;
    }
    return sortAsc ? comparison : -comparison;
  });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1 md:mb-2">{t('library')}</h1>
          <p className="text-slate-400 text-sm md:text-base">{songs.length} songs available offline</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder={t('searchPlaceHolder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-full py-2 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition-all h-full w-full sm:w-auto justify-center">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>
              <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 hidden group-hover:block z-20">
                <button onClick={() => toggleSort('date')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${sortBy === 'date' ? 'text-blue-400' : 'text-slate-300'}`}>Date Added {sortBy === 'date' && (sortAsc ? '↑' : '↓')}</button>
                <button onClick={() => toggleSort('title')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${sortBy === 'title' ? 'text-blue-400' : 'text-slate-300'}`}>Title {sortBy === 'title' && (sortAsc ? '↑' : '↓')}</button>
                <button onClick={() => toggleSort('artist')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${sortBy === 'artist' ? 'text-blue-400' : 'text-slate-300'}`}>Artist {sortBy === 'artist' && (sortAsc ? '↑' : '↓')}</button>
                <button onClick={() => toggleSort('album')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${sortBy === 'album' ? 'text-blue-400' : 'text-slate-300'}`}>Album {sortBy === 'album' && (sortAsc ? '↑' : '↓')}</button>
              </div>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 whitespace-nowrap flex-1 sm:flex-none"
            >
              <FolderSearch className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{isScanning ? 'Scanning...' : t('scanStorage')}</span>
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => {
              if (e.target.files) scanFiles(e.target.files);
            }}
            className="hidden" 
            webkitdirectory="true" 
            directory="true" 
            multiple 
            accept="audio/*"
            // @ts-ignore
            allowdirs="true"
          />
        </div>
      </div>

      {filteredSongs.length > 0 ? (
        <SongList songs={filteredSongs} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-800">
            <FolderSearch className="w-10 h-10 md:w-12 md:h-12 text-slate-500" />
          </div>
          <h3 className="text-lg md:text-xl font-medium text-slate-300 mb-2">{t('noSongs')}</h3>
          <p className="text-sm md:text-base text-slate-500 max-w-sm">Click "Scan Music folder" to add audio files from your device. Supported formats: MP3, FLAC, M4A, WAV.</p>
        </div>
      )}
    </div>
  );
};
