import React from 'react';
import Tetris from './components/Tetris';

const App: React.FC = () => {
  return (
    // This outer div simulates the browser/device background for better previewing
    <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-4">
      {/* This inner div simulates the Farcaster Mini App frame */}
      <div className="w-full max-w-[424px] h-[695px] bg-gray-900 text-white font-mono flex flex-col items-center p-4 rounded-lg shadow-2xl overflow-hidden">
        <h1 className="text-2xl font-bold mb-2 tracking-widest flex-shrink-0">TETRIS</h1>
        <Tetris />
      </div>
    </div>
  );
};

export default App;