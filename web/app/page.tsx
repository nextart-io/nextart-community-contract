'use client';

import { useEffect, useState, useMemo } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { getTextsByScreenSize } from './config/textContent';
import { useTextLayout } from './hooks/useTextLayout';
import TextElement from './components/TextElement';

export default function Home() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const texts = useMemo(() => {
    if (screenSize.width === 0 || screenSize.height === 0) return [];
    return getTextsByScreenSize(screenSize.width, screenSize.height);
  }, [screenSize.width, screenSize.height]);

  const layoutElements = useTextLayout(texts, screenSize.width, screenSize.height);

  if (!layoutElements.length) return null;

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center rounded-full overflow-hidden w-full space-y-4 z-10">
        <p className="text-6xl sm:text-9xl font-permanent text-bright_red">Next Art</p>
        <ConnectButton/>
      </div>
      
      {layoutElements.map((element, index) => (
        <TextElement key={`${element.text}-${index}`} element={element} />
      ))}

     
    </main>
  );
}