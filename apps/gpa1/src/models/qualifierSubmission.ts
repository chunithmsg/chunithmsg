// Can't use @/libs due to circular dependency.
import { QualifierSet } from '@/libs/submissionConstants';
import { SongScore } from './songScore';

/**
 * The Submission type represents a player's submission of 3 songs.
 */
export type Submission = {
  ign: string;
  discordSubmissionTimestamp: number;
  songScores: SongScore[];
  isDisqualified: boolean;
  isVoidSubmission: boolean;
};

/* Process row values into a Submission type */
const columns = {
  ign: 0,
  song1Counts: [2, 3, 4],
  song2Counts: [6, 7, 8],
  song3Counts: [10, 11, 12],
  totalDeductions: 14,
  submissionTime: 15,
  dq: 16,
  void: 17,
};

export const parseSubmissionRow = (row: string[]) => {
  // Directly extractable columns
  const ign: string = row[columns.ign];
  const discordSubmissionTimestamp: number = new Date(
    row[columns.submissionTime],
  ).getTime();
  const isDisqualified: boolean = row[columns.dq] === 'TRUE';
  const isVoidSubmission: boolean = row[columns.void] !== 'FALSE';

  // Deduction calculations
  const getDeductions = ([justice, attack, miss]: number[]) => {
    return -justice + attack * -5 + miss * -3;
  };

  const getFcAjStatus = ([justice, attack, miss]: number[]) => {
    return miss === 0
      ? attack === 0
        ? justice === 0
          ? 'AJC'
          : 'AJ'
        : 'FC'
      : '';
  };

  type SongKey = 'song1Counts' | 'song2Counts' | 'song3Counts';
  const songScores: SongScore[] = [];
  for (let i = 1; i <= 3; i++) {
    const counts: number[] = columns[`song${i}Counts` as SongKey].map((col) =>
      parseInt(row[col]),
    );
    songScores.push({
      score: getDeductions(counts),
      ajFcStatus: getFcAjStatus(counts),
    });
  }

  // Return submission
  const submission: Submission = {
    ign,
    discordSubmissionTimestamp,
    songScores,
    isDisqualified,
    isVoidSubmission,
  };
  return submission;
};

export const filterSubmissions = (submissions: Submission[]) => {
  const filteredSubmissions: Submission[] = [];
  submissions.forEach((submissionA) => {
    if (
      submissions.filter(
        (submissionB) =>
          submissionA.ign === submissionB.ign &&
          compareSubmissions(submissionA, submissionB) > 0,
      ).length === 0
    ) {
      filteredSubmissions.push(submissionA);
    }
  });
  return filteredSubmissions;
};

export const getTotalSubmissionScore = (submission: Submission) =>
  submission.songScores.reduce(
    (total, songScore) => total + songScore.score,
    0,
  );

export const compareSubmissions = (
  submissionA: Submission,
  submissionB: Submission,
) => {
  const aScore = getTotalSubmissionScore(submissionA);
  const bScore = getTotalSubmissionScore(submissionB);

  if (aScore !== bScore) {
    return bScore - aScore;
  }

  return (
    submissionA.discordSubmissionTimestamp -
    submissionB.discordSubmissionTimestamp
  );
};

export type SubmissionSet = Record<QualifierSet, Submission[]>;
