import React, { useCallback, useEffect, useRef, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

import { createStage, checkCollision } from '../services/gameHelpers';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [player, playerRotate, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sdk.actions.ready();
    gameAreaRef.current?.focus();
  }, []);

  // Effect to handle focusing the game area when the game starts or resumes.
  // This separates focus logic from game state logic, which can prevent race conditions.
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
      if (keyCode === 83) { // S key - soft drop release
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

  useInterval(() => {
    drop();
  }, dropTime);
  
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
      <div className="w-full max-w-xs relative">
        <Stage stage={stage} />
        {gameOver ? (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-center rounded-lg">
            <div>
              <h2 className="text-xl font-bold text-red-500">Game Over</h2>
              <p className="text-gray-300 mt-1 text-sm">Final Score: {score}</p>
            </div>
          </div>
        ) : isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <p className="text-white text-2xl font-bold">PAUSED</p>
          </div>
        )}
      </div>

      <aside className="w-full max-w-xs flex flex-col gap-3">
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
      </aside>
    </div>
  );
};

export default Tetris;
