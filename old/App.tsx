import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import Tetris from './components/Tetris';
import Leaderboard from './components/Leaderboard';

type View = 'home' | 'game';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  useEffect(() => {
    // Asynchronously call ready to show the app
    sdk.actions.ready();
    // Preconnect to auth server for faster auth, as recommended
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://auth.farcaster.xyz';
    document.head.appendChild(link);
  }, []);

  const handleStartGame = () => setView('game');
  const handleGoHome = () => setView('home');

  return (
    <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-sm h-[700px] bg-gray-900 text-white font-mono flex flex-col items-center p-3 rounded-lg shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold my-4 tracking-widest flex-shrink-0 text-cyan-400">TETRIS</h1>
        <div className="w-full flex-grow overflow-hidden relative">
            {view === 'home' ? (
              <Leaderboard onStartGame={handleStartGame} />
            ) : (
              <Tetris onGoHome={handleGoHome} />
            )}
        </div>
      </div>
    </div>
  );
};

export default App;