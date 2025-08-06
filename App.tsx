
import React from 'react';
import Tetris from './components/Tetris';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center p-4">
       <h1 className="text-4xl font-bold mb-4 tracking-widest">TETRIS</h1>
      <Tetris />
    </div>
  );
};

export default App;
