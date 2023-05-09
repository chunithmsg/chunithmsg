import {
  QualifierSet,
  SubmissionSet,
  allQualifierSets,
} from "@/controllers/submissionController";
import { SongScore } from "@/models/songScore";
import { Standing, compareStandings } from "@/models/standing";
import {
  Submission,
  compareSubmissions,
  getTotalSubmissionScore,
} from "@/models/submission";

const ZERO_SCORE: SongScore = { score: 0, ajFcStatus: "" };

const extractBestSubmissions = (submissionSet: SubmissionSet) => {
  const output: { [S in QualifierSet]?: Submission[] } = {};
  for (const qualifierSet of allQualifierSets) {
    const submissions = submissionSet[qualifierSet];
    const bestSubmissionByIgn: { [ign: string]: Submission } = {};

    for (const submission of submissions) {
      if (submission.isVoidSubmission) {
        continue;
      }

      const { ign } = submission;
      if (!bestSubmissionByIgn.hasOwnProperty(submission.ign)) {
        bestSubmissionByIgn[ign] = submission;
        continue;
      }

      if (compareSubmissions(submission, bestSubmissionByIgn[ign]) < 0) {
        bestSubmissionByIgn[ign] = submission;
      }

      if (submission.isDisqualified) {
        bestSubmissionByIgn[ign].isDisqualified = true;
      }
    }

    output[qualifierSet] = Object.values(bestSubmissionByIgn);
  }

  return output as SubmissionSet;
};

export const getMastersStandings = (submissionSet: SubmissionSet) => {
  const bestSubmissionSet = extractBestSubmissions(submissionSet);
  const standingsByIgn: { [ign: string]: Standing } = {};

  // Set A Processing
  for (const submission of bestSubmissionSet[QualifierSet.MastersA]) {
    const { ign, timestamp, isDisqualified, songScores } = submission;
    standingsByIgn[ign] = {
      ign,
      timestamp,
      isDisqualified,
      song1: songScores[0],
      song2: songScores[1],
      song3: songScores[2],
      song4: ZERO_SCORE,
      song5: ZERO_SCORE,
      song6: ZERO_SCORE,
      totalScore: getTotalSubmissionScore(submission),
    };
  }

  // Set B Processing
  for (const submission of bestSubmissionSet[QualifierSet.MastersB]) {
    const { ign, timestamp, isDisqualified, songScores } = submission;

    if (!standingsByIgn.hasOwnProperty(ign)) {
      standingsByIgn[ign] = {
        ign,
        timestamp,
        isDisqualified,
        song1: ZERO_SCORE,
        song2: ZERO_SCORE,
        song3: ZERO_SCORE,
        song4: songScores[0],
        song5: songScores[1],
        song6: songScores[2],
        totalScore: getTotalSubmissionScore(submission),
      };
      continue;
    }

    if (standingsByIgn.hasOwnProperty(ign)) {
      const standing = standingsByIgn[ign];

      standing.song4 = songScores[0];
      standing.song5 = songScores[1];
      standing.song6 = songScores[2];
      standing.totalScore += getTotalSubmissionScore(submission);

      standing.isDisqualified ||= isDisqualified;
      if (timestamp > standing.timestamp) {
        standing.timestamp = timestamp;
      }
    }
  }

  const standings = Object.values(standingsByIgn);
  standings.sort(compareStandings);

  return standings;
};

export const getChallengersStandings = (submissionSet: SubmissionSet) => {
  const bestSubmissionSet = extractBestSubmissions(submissionSet);
  const standingsByIgn: { [ign: string]: Standing } = {};

  for (const submission of bestSubmissionSet[QualifierSet.Challengers]) {
    const { ign, timestamp, isDisqualified, songScores } = submission;
    standingsByIgn[ign] = {
      ign,
      timestamp,
      isDisqualified,
      song1: songScores[0],
      song2: songScores[1],
      song3: songScores[2],
      totalScore: getTotalSubmissionScore(submission),
    };
  }

  const standings = Object.values(standingsByIgn);
  standings.sort(compareStandings);

  return standings;
};
