import React, { useState } from 'react';
import Tetris from './components/Tetris';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'game'>('home');

  return (
    // This outer div simulates the browser/device background for better previewing
    <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-4">
      {/* This inner div simulates the Farcaster Mini App frame */}
      <div className="w-full max-w-[424px] h-[695px] bg-gray-900 text-white font-mono flex flex-col items-center p-2 rounded-lg shadow-2xl overflow-hidden">
        <h1 className="text-4xl font-bold my-4 tracking-widest flex-shrink-0">TETRIS</h1>
        <div className="w-full flex-grow overflow-hidden">
            {view === 'home' ? (
              <Leaderboard onStartGame={() => setView('game')} />
            ) : (
              <Tetris onGoHome={() => setView('home')} />
            )}
        </div>
      </div>
    </div>
  );
};

export default App;
