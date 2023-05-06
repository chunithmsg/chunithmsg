/**
 * The Submission type represents a player's submission of 3 songs.
 */
export interface Submission {
  ign: string;
  timestamp: Date;
  songScores: [number, number, number];
  isDisqualified: boolean;
  isVoidSubmission: boolean;
}

export const getTotalScore = (submission: Submission) =>
  submission.songScores.reduce((a, b) => a + b, 0);
