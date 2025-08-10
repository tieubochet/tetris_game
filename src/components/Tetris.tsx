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

interface TetrisProps {
  onGameOver: (score: number) => void;
}

const Tetris: React.FC<TetrisProps> = ({ onGameOver }) => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, playerRotate, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sdk.actions.ready();
    gameAreaRef.current?.focus();
    startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    gameAreaRef.current?.focus();
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
        onGameOver(score);
      }
      updatePlayerPos(0, 0, true);
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 83) { // S key - soft drop release
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
     setDropTime(null);
     drop();
  };

  const move = ({ keyCode }: { keyCode: number; repeat?: boolean }) => {
    if (gameOver) return;

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

  useEffect(() => {
    if (gameOver) {
      // Logic to handle game over, e.g. call onGameOver
    }
  }, [gameOver, onGameOver, score]);

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
      <div className="w-full max-w-sm flex-grow">
        <Stage stage={stage} />
      </div>
      
      <aside className="w-full max-w-sm">
        {gameOver ? (
            <Display gameOver={gameOver} text={`Final Score: ${score}`} />
        ) : (
            <div className="grid grid-cols-3 gap-2 mb-4">
                <Display label="Score" value={score} />
                <Display label="Rows" value={rows} />
                <Display label="Level" value={level} />
            </div>
        )}
      </aside>
    </div>
  );
};

export default Tetris;
