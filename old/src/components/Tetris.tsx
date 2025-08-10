import React, { useState, useCallback, useRef, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

import { createStage, checkCollision } from '../services/gameHelpers';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';
import { addScore } from '../services/leaderboardService';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

interface TetrisProps {
  onGoHome: () => void;
}

type GameState = 'start' | 'playing' | 'paused' | 'gameOver';

const Tetris: React.FC<TetrisProps> = ({ onGoHome }) => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerName, setPlayerName] = useState('Player'); // Fallback for non-Farcaster env
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [farcasterUser, setFarcasterUser] = useState<{ displayName: string; pfpUrl?: string } | null>(null);

  const [player, playerRotate, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      gameAreaRef.current?.focus();
    }
  }, [gameState]);

  useEffect(() => {
    const initializeFarcaster = async () => {
      const inMiniApp = await sdk.isInMiniApp();
      setIsMiniApp(inMiniApp);
      if (inMiniApp) {
        try {
          // The context is available on the sdk object, but as a promise
          const context = await sdk.context;
          if (context && context.user) {
            setFarcasterUser({
              displayName: context.user.displayName || context.user.username || 'anon',
              pfpUrl: context.user.pfpUrl,
            });
          }
        } catch (error) {
           console.error("Failed to get Farcaster context", error);
        }
      }
    };

    initializeFarcaster();
  }, []);
  
  const movePlayer = (dir: number) => {
    if (gameState === 'playing' && !checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos(dir, 0, false);
    }
  };

  const startGame = useCallback(() => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setRows(0);
    setLevel(0);
    setGameState('playing');
  }, [resetPlayer, setLevel, setRows, setScore, setStage]);

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos(0, 1, false);
    } else {
      if (player.pos.y < 1) {
        setGameState('gameOver');
        setDropTime(null);
      }
      updatePlayerPos(0, 0, true);
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (gameState === 'playing') {
      if (keyCode === 83) { // 'S' key for soft drop
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    if (gameState === 'playing') {
      setDropTime(null);
      drop();
    }
  };

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      setDropTime(null);
    } else if (gameState === 'paused') {
      setGameState('playing');
      setDropTime(1000 / (level + 1) + 200);
    }
  }, [gameState, level]);

  const move = ({ keyCode }: { keyCode: number }) => {
    if (gameState === 'gameOver') return;

    if (keyCode === 80) { // 'P' key for pause/resume
      togglePause();
      return;
    }
    
    if (gameState !== 'playing') return;
    
    if (keyCode === 65) { // 'A' key for left
      movePlayer(-1);
    } else if (keyCode === 68) { // 'D' key for right
      movePlayer(1);
    } else if (keyCode === 83) { // 'S' key for down
      dropPlayer();
    } else if (keyCode === 87) { // 'W' key for rotate
      playerRotate(stage, 1);
    }
  };

  const handleSaveScore = () => {
    // If we have a Farcaster user, use their name. Otherwise, use the manually entered name.
    const nameToSave = farcasterUser?.displayName || playerName;
    // Ensure name is not too long for UI, matching original input constraint
    addScore(nameToSave.substring(0, 12), score);
    onGoHome();
  };

  useInterval(() => {
    if (gameState === 'playing') {
      drop();
    }
  }, dropTime);
  
  if (gameState === 'gameOver') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>
        <p className="text-gray-300 text-xl mb-4">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>

        {isMiniApp && farcasterUser ? (
          <div className="flex flex-col items-center mb-4">
            {farcasterUser.pfpUrl && (
              <img src={farcasterUser.pfpUrl} alt="Player PFP" className="w-16 h-16 rounded-full mb-2 border-2 border-cyan-400" />
            )}
            <p className="text-lg text-white">Saving score for <span className="font-bold text-cyan-400">{farcasterUser.displayName}</span></p>
          </div>
        ) : (
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={12}
            className="w-full max-w-xs p-3 mb-4 rounded bg-gray-800 text-white text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        )}

        <div className="w-full max-w-xs space-y-3">
          <StartButton callback={handleSaveScore} text="Save & Main Menu" variant="primary" />
          <StartButton callback={startGame} text="Play Again" variant="secondary" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameAreaRef}
      className="w-full h-full flex flex-col justify-between items-center outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={move}
      onKeyUp={keyUp}
    >
      <div className="w-full flex justify-center">
        <div className="relative">
          <Stage stage={stage} />
          {gameState === 'paused' && (
             <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
              <p className="text-white text-2xl font-bold">PAUSED</p>
            </div>
          )}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
               <StartButton callback={startGame} text="Start Game" variant="primary" />
            </div>
          )}
        </div>
      </div>

      <aside className="w-full max-w-sm flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Display label="Score" value={score} />
          <Display label="Rows" value={rows} />
          <Display label="Level" value={level} />
        </div>
        
        {gameState !== 'start' && (
          <StartButton
            callback={togglePause}
            text={gameState === 'paused' ? 'Resume' : 'Pause'}
            variant={gameState === 'paused' ? 'success' : 'secondary'}
            ariaLabel={gameState === 'paused' ? 'Resume Game' : 'Pause Game'}
          />
        )}

        <div className="text-gray-400 text-xs p-3 bg-gray-800 rounded-md">
          <h3 className="font-bold text-white mb-2 text-center uppercase tracking-wider">Controls</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">W</span> Rotate</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">D</span> Right</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">A</span> Left</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">S</span> Drop</p>
            <p className="flex items-center gap-2 col-span-2 justify-center mt-1"><span className="font-bold text-cyan-400 text-base w-6 text-center">P</span> Pause</p>
          </div>
        </div>
        <button onClick={onGoHome} className="w-full text-center text-gray-500 hover:text-gray-300 transition-colors py-1 text-sm rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
            Main Menu
        </button>
      </aside>
    </div>
  );
};

export default Tetris;
