import { SongScore } from './songScore';

/**
 * The Standing interface refers to an entry on the leaderboard.
 */
export type Standing = {
  timestamp: number;
  ign: string;
  isDisqualified: boolean;
  qualifiedIndex: number;
  song1: SongScore;
  song2: SongScore;
  song3: SongScore;
  // song4?: SongScore;
  // song5?: SongScore;
  // song6?: SongScore;
  totalScore: number;
};

/**
 * Future Standing type, named as Score to maintain backwards compatibility.
 */
export type Score = {
  id: string;
  competition_id: string;
  active: boolean;
  disqualified: boolean;
  ign: string;
  song1: number;
  song2: number;
  song3: number;
  total_score: number;
  played_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
};

export const compareStandings = (standingA: Standing, standingB: Standing) => {
  const aScore = standingA.totalScore;
  const bScore = standingB.totalScore;

  if (aScore !== bScore) {
    return bScore - aScore;
  }

  return standingA.timestamp - standingB.timestamp;
};
