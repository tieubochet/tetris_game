import React from 'react';

import { createStage, checkCollision } from '../services/gameHelpers';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import HelpModal from './HelpModal';
import { FarcasterUser } from '../types';

interface TetrisProps {
  user: FarcasterUser | null;
}

const Tetris: React.FC<TetrisProps> = ({ user }) => {
  const [dropTime, setDropTime] = React.useState<number | null>(null);
  const [gameOver, setGameOver] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);

  const [player, playerRotate, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
  
  const gameAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    gameAreaRef.current?.focus();
  }, []);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos(dir, 0, false);
    }
  };

  const startGame = React.useCallback(() => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setIsPaused(false);
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
      }
      updatePlayerPos(0, 0, true);
    }
  };

  const togglePause = () => {
    if (!gameOver) {
      setIsPaused(prev => {
        const nextPausedState = !prev;
        if (nextPausedState) {
          setDropTime(null);
        } else {
          setDropTime(1000 / (level + 1) + 200);
          gameAreaRef.current?.focus();
        }
        return nextPausedState;
      });
    }
  };

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
    if (gameOver || isHelpOpen) return;

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
  
  const getButtonProps = () => {
    if (gameOver) {
      return {
        callback: startGame,
        text: 'Start Game',
        variant: 'primary' as const,
        ariaLabel: 'Start a new game of Tetris'
      };
    }
    return {
      callback: togglePause,
      text: isPaused ? 'Resume' : 'Pause',
      variant: 'secondary' as const,
      ariaLabel: isPaused ? 'Resume Game' : 'Pause Game'
    };
  };

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
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <div className="w-full max-w-sm relative">
        <Stage stage={stage} />
        {gameOver ? (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-center rounded-lg">
            <div>
              <h2 className="text-xl font-bold text-red-500">Game Over</h2>
              {user && <p className="text-lg text-white mt-2">{user.displayName}</p>}
              <p className="text-gray-300 mt-1 text-sm">Final Score: {score}</p>
            </div>
          </div>
        ) : isPaused && (
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
        
        <div className="flex items-center gap-2">
            <div className="flex-grow">
              <StartButton {...getButtonProps()} />
            </div>
            <button
              onClick={() => setIsHelpOpen(true)}
              aria-label="Open help"
              className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-600 hover:bg-gray-500 focus:ring-gray-400 text-lg font-bold text-white rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out shadow-md"
            >
              ?
            </button>
        </div>
      </aside>
    </div>
  );
};

export default Tetris;