import { SongScore } from './songScore';

/**
 * The IndividualSongScore interface represents a player's best score for an
 * individual song. That is to say, this interface is used for the leaderboard
 * that shows the best songs on a per-song basis.
 *
 * As such, in addition to the the song score, it contains information on the
 * player as well.
 */
export type IndividualSongScore = {
  timestamp: number;
  ign: string;
  leaderboardStanding?: { division: 'Challengers' | 'Masters'; rank: number };
  isDisqualified: boolean;
  songScore: SongScore;
};

export const compareIndividualSongScores = (
  scoreA: IndividualSongScore,
  scoreB: IndividualSongScore,
) => {
  const aScore = scoreA.songScore.score;
  const bScore = scoreB.songScore.score;

  if (aScore !== bScore) {
    return bScore - aScore;
  }

  return scoreA.timestamp - scoreB.timestamp;
};

/**
 * Merges an Individual Score Song object into an existing one, updating
 * the details (of the existing object in-place) if the merged score is
 * better.
 *
 * @param existingScore The existing Individual Song Score object to be updated (if applicable)
 * @param scoreToMerge The new Individual Song Score object to merge.
 */
export const mergeIndividualSongScores = (
  existingScore: IndividualSongScore,
  scoreToMerge: IndividualSongScore,
) => {
  existingScore.isDisqualified ||= scoreToMerge.isDisqualified;

  if (compareIndividualSongScores(scoreToMerge, existingScore)) {
    existingScore.timestamp = scoreToMerge.timestamp;
    existingScore.songScore = scoreToMerge.songScore;
  }
};
