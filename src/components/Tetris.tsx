import React, { useState, useCallback, useEffect } from 'react';
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

  const [player, playerRotate, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
  
  // Signal to the Farcaster client that the app is ready to be displayed.
  useEffect(() => {
    sdk.actions.ready();
  }, []);

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

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const move = ({ keyCode }: { keyCode: number; repeat?: boolean }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);
  
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <div className="flex-shrink-0">
        <Stage stage={stage} />
      </div>

      <div className="w-full flex flex-col gap-3">
        {gameOver ? (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-md text-center">
            <h2 className="text-2xl font-bold text-red-500">Game Over</h2>
            <p className="text-gray-300 mt-1">Final Score: {score}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Display label="Score" value={score} />
            <Display label="Rows" value={rows} />
            <Display label="Level" value={level} />
          </div>
        )}
        
        <StartButton callback={startGame} />

        <div className="text-gray-400 text-xs p-3 bg-gray-800 rounded-md">
          <h3 className="font-bold text-white mb-2 text-center">Controls</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-lg">&uarr;</span> Rotate</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-lg">&darr;</span> Drop</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-lg">&larr;</span> Left</p>
            <p className="flex items-center gap-2"><span className="font-bold text-cyan-400 text-lg">&rarr;</span> Right</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tetris;