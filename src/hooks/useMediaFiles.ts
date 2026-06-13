import { useState } from 'react';
import * as mm from 'music-metadata-browser';
import { Song } from '../types';
import { useStore } from '../store/useStore';

export const useMediaFiles = () => {
  const [isScanning, setIsScanning] = useState(false);
  const addSongs = useStore(state => state.addSongs);

  const scanFiles = async (files: FileList | File[]) => {
    setIsScanning(true);
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    
    const parsedSongs: Song[] = [];
    
    for (const file of audioFiles) {
      try {
        const metadata = await mm.parseBlob(file);
        
        let coverUrl = undefined;
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const picture = metadata.common.picture[0];
          const blob = new Blob([picture.data], { type: picture.format });
          coverUrl = URL.createObjectURL(blob);
        }

        parsedSongs.push({
          id: `${file.name}-${file.size}`,
          title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: metadata.common.artist || 'Unknown Artist',
          album: metadata.common.album || 'Unknown Album',
          duration: metadata.format.duration || 0,
          file,
          timestamp: Date.now(),
          coverUrl
        });
      } catch (e) {
        console.warn(`Failed to parse ${file.name}:`, e);
        // Fallback
        parsedSongs.push({
          id: `${file.name}-${file.size}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: 0,
          file,
          timestamp: Date.now(),
        });
      }
    }
    
    if (parsedSongs.length > 0) {
      addSongs(parsedSongs);
    }
    setIsScanning(false);
  };

  return { isScanning, scanFiles };
};
