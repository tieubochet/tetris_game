import { ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'tetrisLeaderboard';
const MAX_SCORES = 10;

export const getScores = (): ScoreEntry[] => {
  try {
    const scoresJSON = localStorage.getItem(LEADERBOARD_KEY);
    if (!scoresJSON) {
      return [];
    }
    const scores = JSON.parse(scoresJSON) as ScoreEntry[];
    return scores.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Failed to get scores from localStorage", error);
    return [];
  }
};

export const addScore = (name: string, score: number): void => {
    if (!name || score <= 0) return;

    try {
        const scores = getScores();
        const newScore: ScoreEntry = { name: name.trim(), score };

        scores.push(newScore);
        
        const sortedScores = scores.sort((a, b) => b.score - a.score);
        const topScores = sortedScores.slice(0, MAX_SCORES);
        
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
    } catch (error) {
        console.error("Failed to add score to localStorage", error);
    }
};
