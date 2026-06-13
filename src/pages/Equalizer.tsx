import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { playerInstance } from '../services/audio';

export const Equalizer = () => {
  const { t } = useTranslation();
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);

  const handleBassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBass(val);
    playerInstance.setBass(val);
  };

  const handleTrebleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setTreble(val);
    playerInstance.setTreble(val);
  };

  const presets = [
    { name: 'Flat', bass: 0, treble: 0 },
    { name: 'Bass Boost', bass: 10, treble: -2 },
    { name: 'Vocal Enhance', bass: -3, treble: 8 },
    { name: 'Electronic', bass: 8, treble: 6 }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setBass(p.bass);
    setTreble(p.treble);
    playerInstance.setBass(p.bass);
    playerInstance.setTreble(p.treble);
  };

  return (
    <div className="p-8 pb-32 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-4xl font-bold tracking-tight text-white mb-10">{t('equalizer')}</h1>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-200">Bass</h3>
                <span className="text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full">{bass > 0 ? `+${bass}` : bass} dB</span>
              </div>
              <input 
                type="range" 
                min="-15" 
                max="15" 
                value={bass}
                onChange={handleBassChange}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full shadow-lg"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500 px-1">
                <span>-15</span>
                <span>0</span>
                <span>+15</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-200">Treble</h3>
                <span className="text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full">{treble > 0 ? `+${treble}` : treble} dB</span>
              </div>
              <input 
                type="range" 
                min="-15" 
                max="15" 
                value={treble}
                onChange={handleTrebleChange}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full shadow-lg"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500 px-1">
                <span>-15</span>
                <span>0</span>
                <span>+15</span>
              </div>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-700/50 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-lg font-medium text-slate-200 mb-6">Presets</h3>
            <div className="grid grid-cols-2 gap-4">
              {presets.map(p => (
                <button 
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                    bass === p.bass && treble === p.treble
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
               <p className="text-sm text-slate-400">Note: The equalizer applies processing to active audio playback. Enable playback to hear changes.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
