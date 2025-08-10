import React, { useState, useEffect } from 'react';
import { ScoreEntry } from '../types';
import { getScores } from '../services/leaderboardService';
import StartButton from './StartButton';

interface LeaderboardProps {
  onStartGame: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onStartGame }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-4 tracking-widest text-cyan-400">LEADERBOARD</h2>
        <div className="bg-gray-800 rounded-lg p-3 text-sm h-80 overflow-y-auto">
          {scores.length > 0 ? (
            <ol className="space-y-2 text-gray-300">
              {scores.map((entry, index) => (
                <li key={index} className="flex justify-between items-center text-base font-mono border-b border-gray-700 pb-1.5 pt-0.5">
                  <span className="flex items-center overflow-hidden">
                    <span className="text-cyan-400 font-bold w-6 text-left">{index + 1}.</span>
                    <span className="truncate" title={entry.name}>{entry.name}</span>
                  </span>
                  <span className="font-bold text-yellow-400">{entry.score}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-500">No scores yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-4">
        <StartButton
          callback={onStartGame}
          text="Play Tetris"
          variant="primary"
          ariaLabel="Start a new game of Tetris"
        />
      </div>
    </div>
  );
};

export default Leaderboard;
