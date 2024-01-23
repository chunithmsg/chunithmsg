import { SongScore } from './songScore';

/**
 * The Standing interface refers to an entry on the leaderboard.
 */
export type Standing = {
  timestamp: number;
  ign: string;
  isDisqualified: boolean;
  song1: SongScore;
  song2: SongScore;
  song3: SongScore;
  // song4?: SongScore;
  // song5?: SongScore;
  // song6?: SongScore;
  totalScore: number;
};

export const compareStandings = (standingA: Standing, standingB: Standing) => {
  const aScore = standingA.totalScore;
  const bScore = standingB.totalScore;

  if (aScore !== bScore) {
    return bScore - aScore;
  }

  return standingA.timestamp - standingB.timestamp;
};
