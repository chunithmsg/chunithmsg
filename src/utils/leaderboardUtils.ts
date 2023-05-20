import {
  QualifierSet,
  SubmissionSet,
  allQualifierSets,
} from "@/controllers/submissionController";
import { IndividualSongStanding } from "@/models/individualSongStanding";
import { SongScore } from "@/models/songScore";
import { Standing, compareStandings } from "@/models/standing";
import {
  Submission,
  compareSubmissions,
  getTotalSubmissionScore,
} from "@/models/submission";
import { SongId } from "./songUtils";
import {
  IndividualSongScore,
  compareIndividualSongScores,
  mergeIndividualSongScores,
} from "@/models/individualSongScore";

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

const toRankMap = (
  standings: Standing[],
  shouldIgnoreDisqualified: boolean = true
) => {
  const rankMap: { [ign: string]: number } = {};
  for (const [rank, standing] of standings
    .filter((standing) => !standing.isDisqualified)
    .entries()) {
    if (shouldIgnoreDisqualified && standing.isDisqualified) {
      continue;
    }

    rankMap[standing.ign] = rank + 1;
  }

  return rankMap;
};

export const getIndividualScoreStandings = (
  submissionSet: SubmissionSet,
  submissionScoreThreshold: number = 975_000
): IndividualSongStanding[] => {
  // Holy shit, this function is a long hot mess and I feel filthy for writing it.

  const setSongs: { [A in QualifierSet]: SongId[] } = {
    [QualifierSet.Challengers]: ["wakeUpDreamer", "chaos", "pygmalion"],
    [QualifierSet.MastersA]: ["valsqotch", "imperishableNight", "battleNo1"],
    [QualifierSet.MastersB]: ["spica", "weGonnaJourney", "blazingStorm"],
  };

  const allSongs: SongId[] = [];
  for (const qualifierSet of allQualifierSets) {
    allSongs.push(...setSongs[qualifierSet]);
  }

  // Prepare a map for "Leaderboard standings by IGN"
  const mastersStandings = getMastersStandings(submissionSet);
  const challengersStandings = getChallengersStandings(submissionSet);

  const mastersRankMap = toRankMap(mastersStandings);
  const challengersRankMap = toRankMap(challengersStandings);

  const bestScoreBySong: {
    [songId in SongId]?: { [ign: string]: IndividualSongScore };
  } = {};

  // Initialise an empty dict for each song.
  for (const songId of allSongs) {
    bestScoreBySong[songId] = {};
  }

  // Extract the best score of each player on a per-song basis.
  for (const qualifierSet of allQualifierSets) {
    // Filtering rule: Submissions eligible for this prize requires
    // all the songs in the submission to be at least the given threshold.
    const filteredSubmissions = submissionSet[qualifierSet].filter(
      ({ songScores }) =>
        songScores.every(({ score }) => score >= submissionScoreThreshold)
    );

    for (const {
      songScores,
      ign,
      isDisqualified,
      timestamp,
    } of filteredSubmissions) {
      // Prepare the "leaderboard standing" object.
      let leaderboardStanding: IndividualSongScore["leaderboardStanding"] =
        undefined;

      if (qualifierSet === QualifierSet.Challengers) {
        if (challengersRankMap.hasOwnProperty(ign)) {
          const rank = challengersRankMap[ign];
          leaderboardStanding = { division: "Challengers", rank };
        }
      } else {
        if (mastersRankMap.hasOwnProperty(ign)) {
          const rank = mastersRankMap[ign];
          leaderboardStanding = { division: "Masters", rank };
        }
      }

      for (let i = 0; i < songScores.length; ++i) {
        const songId = setSongs[qualifierSet][i];
        // TS Assertion: This object is not undefined; it was explicitly added earlier.
        const bestScoreDict = bestScoreBySong[songId]!;
        const individualSongScore: IndividualSongScore = {
          timestamp,
          ign,
          songScore: songScores[i],
          isDisqualified,
          leaderboardStanding,
        };

        if (!bestScoreDict.hasOwnProperty(ign)) {
          bestScoreDict[ign] = individualSongScore;
        } else {
          mergeIndividualSongScores(bestScoreDict[ign], individualSongScore);
        }
      }
    }
  }

  // For each song, convert the map into a sorted array
  const sortedScoresBySong: {
    [songId in SongId]?: IndividualSongScore[];
  } = {};

  for (const songId of allSongs) {
    const sortedScores = Object.values(bestScoreBySong[songId]!);
    sortedScores.sort(compareIndividualSongScores);

    sortedScoresBySong[songId] = sortedScores;
  }

  // Finally, create the standings
  const standings: IndividualSongStanding[] = [];

  const numMasters = Object.keys(mastersRankMap).length;
  const numChallengers = Object.keys(challengersRankMap).length;
  const numStandings = Math.max(numMasters, numChallengers);

  for (let i = 0; i < numStandings; ++i) {
    const standing: IndividualSongStanding = { index: i };

    for (const songId of allSongs) {
      const individualSongScore = sortedScoresBySong[songId]?.[i];
      if (individualSongScore) {
        standing[songId] = individualSongScore;
      }
    }

    standings.push(standing);
  }

  return standings;
};
