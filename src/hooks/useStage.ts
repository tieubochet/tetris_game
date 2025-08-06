import { useState, useEffect, useCallback } from 'react';
import { createStage } from '../services/gameHelpers';
import { Player, Stage, StageCell, TetrominoKey } from '../types';

export const useStage = (player: Player, resetPlayer: () => void): [Stage, React.Dispatch<React.SetStateAction<Stage>>, number] => {
  const [stage, setStage] = useState<Stage>(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage: Stage): Stage => {
      return newStage.reduce((ack, row) => {
        // If the row doesn't contain a '0' it means it's full
        if (row.findIndex(cell => cell[0] === '0') === -1) {
          setRowsCleared(prev => prev + 1);
          // Add a new empty row at the top of the stage
          ack.unshift(new Array(newStage[0].length).fill(['0', 'clear']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as Stage);
    };


    const updateStage = (prevStage: Stage): Stage => {
      // First flush the stage
      const newStage = prevStage.map(
        row => row.map(cell => (cell[1] === 'clear' ? ['0', 'clear'] : cell) as StageCell)
      );

      // Then draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const yPos = y + player.pos.y;
            const xPos = x + player.pos.x;
            if (newStage[yPos] && newStage[yPos][xPos]) {
                 newStage[yPos][xPos] = [
                    value as TetrominoKey,
                    `${player.collided ? 'merged' : 'clear'}`,
                ];
            }
          }
        });
      });

      // Then check if we collided
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };
    
    setStage(prev => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};
