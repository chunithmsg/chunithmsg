import { QualifierSet } from "@/utils/submissionConstants";
import { SongScore } from "./songScore";

/**
 * The Submission type represents a player's submission of 3 songs.
 */
export interface Submission {
  ign: string;
  timestamp: number;
  formSubmissionTimestamp: number;
  songScores: SongScore[];
  isDisqualified: boolean;
  isVoidSubmission: boolean;
}

export const getTotalSubmissionScore = (submission: Submission) =>
  submission.songScores.reduce(
    (total, songScore) => total + songScore.score,
    0
  );

export const compareSubmissions = (
  submissionA: Submission,
  submissionB: Submission
) => {
  const aScore = getTotalSubmissionScore(submissionA);
  const bScore = getTotalSubmissionScore(submissionB);

  if (aScore !== bScore) {
    return bScore - aScore;
  }
  return submissionA.timestamp - submissionB.timestamp;
};

export type SubmissionSet = { [S in QualifierSet]: Submission[] };
