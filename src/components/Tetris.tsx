import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const Tetris: React.FC<TetrisProps> = ({ onGoHome }) => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [playerName, setPlayerName] = useState('Player');

  const [player, playerRotate, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sdk.actions.ready();
    gameAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameAreaRef.current?.focus();
    }
  }, [gameOver, isPaused]);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos(dir, 0, false);
    }
  };

  const startGame = useCallback(() => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    setPlayerName('Player');
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
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos(0, 0, true);
    }
  };

  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPaused(prev => {
        const nextPausedState = !prev;
        if (nextPausedState) {
          setDropTime(null);
        } else {
          setDropTime(1000 / (level + 1) + 200);
        }
        return nextPausedState;
      });
    }
  }, [gameOver, level]);

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver && !isPaused) {
      if (keyCode === 83) { // S key
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
     if (!isPaused) {
        setDropTime(null);
        drop();
     }
  };

  const move = ({ keyCode }: { keyCode: number; repeat?: boolean }) => {
    if (gameOver) return;

    if (keyCode === 80) { // P key
      togglePause();
      return;
    }

    if (isPaused) return;

    if (keyCode === 65) { // A key
      movePlayer(-1);
    } else if (keyCode === 68) { // D key
      movePlayer(1);
    } else if (keyCode === 83) { // S key
      dropPlayer();
    } else if (keyCode === 87) { // W key
      playerRotate(stage, 1);
    }
  };
  
  const handleSaveScore = () => {
    addScore(playerName, score);
    onGoHome();
  };

  useInterval(() => {
    drop();
  }, dropTime);

  if (gameOver && score > 0) {
    // Post-game screen
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>
            <p className="text-gray-300 text-xl mb-4">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
            
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={12}
              className="w-full p-3 mb-4 rounded bg-gray-800 text-white text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="space-y-3">
              <StartButton
                callback={handleSaveScore}
                text="Save & Main Menu"
                variant="primary"
                ariaLabel="Save score and return to main menu"
              />
              <StartButton
                callback={startGame}
                text="Play Again"
                variant="secondary"
                ariaLabel="Start a new game of Tetris"
              />
            </div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      id="game-area"
      ref={gameAreaRef}
      className="w-full h-full flex flex-col justify-start items-center gap-4 outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
      aria-label="Game Area"
    >
      <div className="w-full max-w-sm relative">
        <Stage stage={stage} />
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <p className="text-white text-2xl font-bold">PAUSED</p>
          </div>
        )}
      </div>

      <aside className="w-full max-w-sm flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Display label="Score" value={score} />
          <Display label="Rows" value={rows} />
          <Display label="Level" value={level} />
        </div>
        
        {gameOver ? (
          <StartButton
            callback={startGame}
            text="Start Game"
            variant="primary"
            ariaLabel="Start a new game of Tetris"
          />
        ) : (
          <StartButton
            callback={togglePause}
            text={isPaused ? 'Resume' : 'Pause'}
            variant="secondary"
            ariaLabel={isPaused ? 'Resume Game' : 'Pause Game'}
          />
        )}

        <div className="text-gray-400 text-xs p-3 bg-gray-800 rounded-md">
          <h3 className="font-bold text-white mb-2 text-center uppercase tracking-wider">Controls</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">W</span> Rotate</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">D</span> Move Right</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">A</span> Move Left</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-base w-6 text-center">S</span> Soft Drop</p>
            <p className="flex items-center gap-2 col-span-2 justify-center mt-1"><span className="font-bold text-cyan-400 text-base w-6 text-center">P</span> Pause</p>
          </div>
        </div>
        <button onClick={onGoHome} className="w-full text-center text-gray-500 hover:text-gray-300 transition-colors py-1 text-sm rounded-lg hover:bg-gray-700">
            Main Menu
        </button>
      </aside>
    </div>
  );
};

export default Tetris;
