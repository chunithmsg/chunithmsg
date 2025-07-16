import { compareInt } from '@/libs';

export type ScoreAttackResult = {
  rank: number;
  name: string;
  seed: number;
  score?: number;
};

export const compareScoreAttackResults = (
  resultA: ScoreAttackResult,
  resultB: ScoreAttackResult,
): number => {
  if (resultA.score !== resultB.score) {
    // If one is undefined, prioritise the one with a score
    if (resultA.score === undefined) {
      return 1;
    }
    if (resultB.score === undefined) {
      return -1;
    }

    return -compareInt(resultA.score, resultB.score);
  }

  return compareInt(resultA.seed, resultB.seed);
};

export type ScoreAttackPhase = {
  songName?: string;
  playerScores: ScoreAttackResult[];
};
