import { ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'react-tetris-leaderboard';
const MAX_SCORES = 10;

export const getScores = (): ScoreEntry[] => {
  try {
    const scoresJSON = localStorage.getItem(LEADERBOARD_KEY);
    if (!scoresJSON) {
      return [];
    }
    const scores = JSON.parse(scoresJSON) as ScoreEntry[];
    // Ensure data integrity and sort
    return scores
      .filter(s => typeof s.name === 'string' && typeof s.score === 'number')
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Failed to retrieve scores from localStorage", error);
    // Clear corrupted data
    localStorage.removeItem(LEADERBOARD_KEY);
    return [];
  }
};

export const addScore = (name: string, score: number): void => {
    if (!name || score <= 0) return;

    try {
        const scores = getScores();
        const newScore: ScoreEntry = { name: name.trim() || 'Player', score };

        scores.push(newScore);
        
        const sortedScores = scores.sort((a, b) => b.score - a.score);
        const topScores = sortedScores.slice(0, MAX_SCORES);
        
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
    } catch (error) {
        console.error("Failed to save score to localStorage", error);
    }
};
