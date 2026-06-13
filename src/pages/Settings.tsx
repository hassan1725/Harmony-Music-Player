import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, Info, Timer, Play } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const { isPlaying, togglePlayPause } = useStore();
  const [sleepTimer, setSleepTimer] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    let interval: number | undefined;
    if (timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (isPlaying) togglePlayPause();
            setSleepTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Check every minute, time is in minutes
    }
    return () => clearInterval(interval);
  }, [timeRemaining, isPlaying, togglePlayPause]);

  const handleStartTimer = (mins: number) => {
    setSleepTimer(mins);
    setTimeRemaining(mins);
  };

  return (
    <div className="p-8 pb-32 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-4xl font-bold tracking-tight text-white mb-10">{t('settings')}</h1>

      <div className="space-y-8">
        <section className="bg-slate-800/20 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <h2 className="text-xl font-semibold text-slate-100 flex items-center mb-6 relative">
            <Globe className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-blue-400" />
            {t('language')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <button
              onClick={() => changeLanguage('en')}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                i18n.language === 'en' 
                  ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="font-medium">{t('english')}</span>
              {i18n.language === 'en' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
            <button
              onClick={() => changeLanguage('fa')}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                i18n.language === 'fa' 
                  ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="font-medium">{t('persian')}</span>
              {i18n.language === 'fa' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          </div>
          
          <div className="mt-4 flex items-start text-sm text-slate-500 relative">
            <Info className="w-4 h-4 ltr:mr-2 rtl:ml-2 mt-0.5 shrink-0" />
            <p>{t('autoDetectInfo')}</p>
          </div>
        </section>

        <section className="bg-slate-800/20 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center mb-6 relative">
            <Timer className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-indigo-400" />
            {t('sleepTimer')}
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">
            {[15, 30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => handleStartTimer(mins)}
                className={`py-2 px-4 rounded-xl border transition-all text-sm font-medium ${
                  sleepTimer === mins
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                {mins} mins
              </button>
            ))}
            <button
                onClick={() => handleStartTimer(0)}
                className={`py-2 px-4 rounded-xl border transition-all text-sm font-medium ${
                  sleepTimer === 0
                    ? 'bg-slate-700/50 border-slate-600/50 text-slate-300'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                Off
              </button>
          </div>
          {timeRemaining > 0 && (
             <div className="p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl flex items-center">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse ltr:mr-3 rtl:ml-3" />
               <p className="text-indigo-200 text-sm">Stopping playback in {timeRemaining} minutes</p>
             </div>
          )}
        </section>

        <section className="bg-slate-800/20 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center mb-6 relative">
            <Moon className="w-5 h-5 ltr:mr-3 rtl:ml-3 text-purple-400" />
            {t('theme')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <button className="flex items-center p-4 rounded-xl border bg-purple-600/10 border-purple-500/50 text-purple-400 transition-all cursor-default">
              <Moon className="w-5 h-5 ltr:mr-3 rtl:ml-3" />
              <span className="font-medium">{t('darkMode')}</span>
              <div className="ltr:ml-auto rtl:mr-auto w-2 h-2 rounded-full bg-purple-500" />
            </button>
            <button className="flex items-center p-4 rounded-xl border bg-slate-800/40 border-slate-700/50 text-slate-500 transition-all cursor-not-allowed opacity-50">
              <Sun className="w-5 h-5 ltr:mr-3 rtl:ml-3" />
              <span className="font-medium">{t('lightMode')} (Coming soon)</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

