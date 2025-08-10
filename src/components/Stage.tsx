import React from 'react';
import { Stage as StageType } from '../types';
import Cell from './Cell';

interface StageProps {
  stage: StageType;
}

const Stage: React.FC<StageProps> = ({ stage }) => {
  return (
    <div 
        className="grid gap-px border-2 border-gray-700 bg-black"
        style={{
            gridTemplateRows: `repeat(${stage.length}, 1fr)`,
            gridTemplateColumns: `repeat(${stage[0].length}, 1fr)`
        }}
    >
      {stage.map((row, y) =>
        row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
      )}
    </div>
  );
};

export default Stage;
