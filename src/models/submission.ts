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

export const getTotalSubmissionScore = (submission: Submission) =>
  submission.songScores.reduce((a, b) => a + b, 0);

export const compareSubmissions = (
  submissionA: Submission,
  submissionB: Submission
) => {
  const aScore = getTotalSubmissionScore(submissionA);
  const bScore = getTotalSubmissionScore(submissionB);

  if (aScore !== bScore) {
    return bScore - aScore;
  } else {
    return submissionA.timestamp.getTime() - submissionB.timestamp.getTime();
  }
};
