import React from 'react';
import { TetrominoKey } from '../types';
import { TETROMINOS } from '../services/tetrominos';

interface CellProps {
  type: TetrominoKey;
}

const Cell: React.FC<CellProps> = ({ type }) => {
    const color = TETROMINOS[type].color;
    const borderClass = type === '0' ? 'border-gray-800' : 'border-gray-900';
    return <div className={`w-full aspect-square border ${color} ${borderClass}`}></div>;
};

export default React.memo(Cell);
