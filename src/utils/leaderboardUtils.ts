import {
  IndividualSongStanding,
  generateKey,
} from "@/models/individualSongStanding";
import { SongScore } from "@/models/songScore";
import { Standing, compareStandings } from "@/models/standing";
import {
  Submission,
  SubmissionSet,
  compareSubmissions,
  getTotalSubmissionScore,
} from "@/models/submission";
import { SongId } from "./songUtils";
import {
  IndividualSongScore,
  compareIndividualSongScores,
  mergeIndividualSongScores,
} from "@/models/individualSongScore";
import { numChallengersFinalists, numMastersFinalists } from "./constants";
import { QualifierSet, allQualifierSets } from "./submissionConstants";

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

  const numMasters = Object.keys(mastersStandings).length;
  const numChallengers = Object.keys(challengersStandings).length;
  const numStandings = Math.max(numMasters, numChallengers);

  for (let i = 0; i < numStandings; ++i) {
    const scoreMap: { [songId in SongId]?: IndividualSongScore } = {};

    for (const songId of allSongs) {
      const individualSongScore = sortedScoresBySong[songId]?.[i];
      if (individualSongScore) {
        scoreMap[songId] = individualSongScore;
      }
    }

    standings.push({ key: generateKey(scoreMap), scoreMap });
  }

  return standings;
};

export const isFinalist = (leaderboardStanding?: {
  division: "Challengers" | "Masters";
  rank: number;
}) => {
  if (!leaderboardStanding) {
    return false;
  }

  const { division, rank } = leaderboardStanding;
  if (division === "Challengers") {
    return rank <= numChallengersFinalists;
  } else {
    return rank <= numMastersFinalists;
  }
};

export const filterIndividualScoreStandings = (
  standings: IndividualSongStanding[],
  options: {
    shouldFilterDisqualified?: boolean;
    shouldFilterFinalists?: boolean;
  } = {}
): IndividualSongStanding[] => {
  if (standings.length === 0) {
    return [];
  }

  const { shouldFilterDisqualified, shouldFilterFinalists } = options;

  const output: IndividualSongStanding[] = [];
  for (let i = 0; i < standings.length; ++i) {
    output.push({ key: 0, scoreMap: {} });
  }

  // Copy over the entries, skipping filtered entries as required.
  const songIds = Object.keys(standings[0].scoreMap) as SongId[];
  for (const songId of songIds) {
    let copyIndex = 0;
    let readIndex = 0;

    for (; readIndex < standings.length; ++readIndex) {
      const individualSongScore = standings[readIndex].scoreMap[songId];
      if (!individualSongScore) {
        break;
      }

      const shouldFilter =
        (shouldFilterDisqualified && individualSongScore.isDisqualified) ||
        (shouldFilterFinalists &&
          isFinalist(individualSongScore.leaderboardStanding));

      if (shouldFilter) {
        continue;
      }

      output[copyIndex].scoreMap[songId] = individualSongScore;
      ++copyIndex;
    }
  }

  // Remove trailing empty entries.
  for (let i = output.length - 1; i >= 0; --i) {
    if (Object.keys(output[i].scoreMap).length > 0) {
      break;
    }

    output.pop();
  }

  // Re-calculate key values
  for (let i = 0; i < output.length; ++i) {
    output[i].key = generateKey(output[i].scoreMap);
  }

  return output;
};
