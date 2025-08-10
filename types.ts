export type TetrominoShape = (string | number)[][];

export interface ITetromino {
  shape: TetrominoShape;
  color: string;
}

export type TetrominoKey = '0' | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type TetrominoShapes = {
  [key in TetrominoKey]: ITetromino;
};

export type StageCell = [TetrominoKey, string];
export type Stage = StageCell[][];

export interface Player {
  pos: {
    x: number;
    y: number;
  };
  tetromino: TetrominoShape;
  collided: boolean;
}

export interface ScoreEntry {
  name: string;
  score: number;
}