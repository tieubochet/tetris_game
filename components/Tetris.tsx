
import React, { useState, useCallback } from 'react';

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
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos(0, 1, false);
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos(0, 0, true);
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 40) { // down arrow
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
      if (keyCode === 37) { // left arrow
        movePlayer(-1);
      } else if (keyCode === 39) { // right arrow
        movePlayer(1);
      } else if (keyCode === 40) { // down arrow
        dropPlayer();
      } else if (keyCode === 38) { // up arrow
        playerRotate(stage, 1);
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);
  
  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto">
          <Stage stage={stage} />
        </div>
        <aside className="w-full md:w-48 flex-shrink-0">
          {gameOver ? (
            <Display gameOver={gameOver} text={`Game Over - Score: ${score}`} />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
           <div className="text-gray-400 text-sm mt-4 p-2 bg-gray-800 rounded-md">
            <h3 className="font-bold text-white mb-2">Controls</h3>
            <p><span className="font-bold text-cyan-400">&uarr;</span> - Rotate</p>
            <p><span className="font-bold text-cyan-400">&larr;</span> - Move Left</p>
            <p><span className="font-bold text-cyan-400">&rarr;</span> - Move Right</p>
            <p><span className="font-bold text-cyan-400">&darr;</span> - Soft Drop</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Tetris;
