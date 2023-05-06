/**
 * The Standing interface refers to an entry on the leaderboard.
 */
export interface Standing {
  timestamp: Date;
  ign: string;
  isDisqualified: boolean;

  // There's probably a better way to do this, but this'll do for now.
  song1: number;
  song2: number;
  song3: number;
  song4?: number;
  song5?: number;
  song6?: number;

  totalScore: number;
}

export const compareStandings = (standingA: Standing, standingB: Standing) => {
  const aScore = standingA.totalScore;
  const bScore = standingB.totalScore;

  if (aScore !== bScore) {
    return bScore - aScore;
  } else {
    return standingA.timestamp.getTime() - standingB.timestamp.getTime();
  }
};
