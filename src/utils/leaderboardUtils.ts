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
import {
  IndividualSongScore,
  compareIndividualSongScores,
  mergeIndividualSongScores,
} from "@/models/individualSongScore";
import { SongId } from "./songUtils";
import { numChallengersFinalists, numMastersFinalists } from "./constants";
import { QualifierSet, allQualifierSets } from "./submissionConstants";

const ZERO_SCORE: SongScore = { score: 0, ajFcStatus: "" };

const extractBestSubmissions = (submissionSet: SubmissionSet) => {
  const output: { [S in QualifierSet]?: Submission[] } = {};

  allQualifierSets.forEach((qualifierSet) => {
    const submissions = submissionSet[qualifierSet];
    const bestSubmissionByIgn: { [ign: string]: Submission } = {};

    submissions.forEach((submission) => {
      if (submission.isVoidSubmission) {
        return;
      }

      const { ign } = submission;
      if (!Object.hasOwn(bestSubmissionByIgn, submission.ign)) {
        bestSubmissionByIgn[ign] = submission;
        return;
      }

      if (compareSubmissions(submission, bestSubmissionByIgn[ign]) < 0) {
        bestSubmissionByIgn[ign] = submission;
      }

      if (submission.isDisqualified) {
        bestSubmissionByIgn[ign].isDisqualified = true;
      }
    });

    output[qualifierSet] = Object.values(bestSubmissionByIgn);
  });

  return output as SubmissionSet;
};

export const getMastersStandings = (submissionSet: SubmissionSet) => {
  const bestSubmissionSet = extractBestSubmissions(submissionSet);
  const standingsByIgn: { [ign: string]: Standing } = {};

  // Set A Processing
  bestSubmissionSet[QualifierSet.MastersA].forEach((submission) => {
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
  });

  // Set B Processing
  bestSubmissionSet[QualifierSet.MastersB].forEach((submission) => {
    const { ign, timestamp, isDisqualified, songScores } = submission;

    if (!Object.hasOwn(standingsByIgn, ign)) {
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
      return;
    }

    if (Object.hasOwn(standingsByIgn, ign)) {
      const standing = standingsByIgn[ign];

      [standing.song4, standing.song5, standing.song6] = songScores;
      standing.totalScore += getTotalSubmissionScore(submission);

      standing.isDisqualified ||= isDisqualified;
      if (timestamp > standing.timestamp) {
        standing.timestamp = timestamp;
      }
    }
  });

  const standings = Object.values(standingsByIgn);
  standings.sort(compareStandings);

  return standings;
};

export const getChallengersStandings = (submissionSet: SubmissionSet) => {
  const bestSubmissionSet = extractBestSubmissions(submissionSet);
  const standingsByIgn: { [ign: string]: Standing } = {};

  bestSubmissionSet[QualifierSet.Challengers].forEach((submission) => {
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
  });

  const standings = Object.values(standingsByIgn);
  standings.sort(compareStandings);

  return standings;
};

const toRankMap = (
  standings: Standing[],
  shouldIgnoreDisqualified: boolean = true
) =>
  standings
    .filter(
      (standing) => !(shouldIgnoreDisqualified && standing.isDisqualified)
    )
    .reduce<{ [ign: string]: number }>((rankMap, standing, index) => {
      rankMap[standing.ign] = index + 1;
      return rankMap;
    }, {});

export const getIndividualScoreStandings = (
  submissionSet: SubmissionSet,
  submissionScoreThreshold: number = 0
): IndividualSongStanding[] => {
  // Holy shit, this function is a long hot mess and I feel filthy for writing it.

  const setSongs: { [A in QualifierSet]: SongId[] } = {
    [QualifierSet.Challengers]: ["wakeUpDreamer", "chaos", "pygmalion"],
    [QualifierSet.MastersA]: ["valsqotch", "imperishableNight", "battleNo1"],
    [QualifierSet.MastersB]: ["spica", "weGonnaJourney", "blazingStorm"],
  };

  const allSongs: SongId[] = [];
  allQualifierSets.forEach((qualifierSet) =>
    allSongs.push(...setSongs[qualifierSet])
  );

  // Prepare a map for "Leaderboard standings by IGN"
  const mastersStandings = getMastersStandings(submissionSet);
  const challengersStandings = getChallengersStandings(submissionSet);

  const mastersRankMap = toRankMap(mastersStandings);
  const challengersRankMap = toRankMap(challengersStandings);

  const bestScoreBySong: {
    [songId in SongId]?: { [ign: string]: IndividualSongScore };
  } = {};

  // Initialise an empty dict for each song.
  allSongs.forEach((songId) => {
    bestScoreBySong[songId] = {};
  });

  // Extract the best score of each player on a per-song basis.
  allQualifierSets.forEach((qualifierSet) => {
    // Filtering rule: Submissions eligible for this prize requires
    // all the songs in the submission to be at least the given threshold.
    submissionSet[qualifierSet]
      .filter(({ songScores }) =>
        songScores.every(({ score }) => score >= submissionScoreThreshold)
      )
      .forEach(({ songScores, ign, isDisqualified, timestamp }) => {
        // Prepare the "leaderboard standing" object.
        let leaderboardStanding: IndividualSongScore["leaderboardStanding"];

        if (qualifierSet === QualifierSet.Challengers) {
          if (Object.hasOwn(challengersRankMap, ign)) {
            const rank = challengersRankMap[ign];
            leaderboardStanding = { division: "Challengers", rank };
          }
        } else if (Object.hasOwn(mastersRankMap, ign)) {
          const rank = mastersRankMap[ign];
          leaderboardStanding = { division: "Masters", rank };
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

          if (!Object.hasOwn(bestScoreDict, ign)) {
            bestScoreDict[ign] = individualSongScore;
          } else {
            mergeIndividualSongScores(bestScoreDict[ign], individualSongScore);
          }
        }
      });
  });

  // For each song, convert the map into a sorted array
  const sortedScoresBySong: {
    [songId in SongId]?: IndividualSongScore[];
  } = {};

  allSongs.forEach((songId) => {
    const sortedScores = Object.values(bestScoreBySong[songId]!);
    sortedScores.sort(compareIndividualSongScores);

    sortedScoresBySong[songId] = sortedScores;
  });

  // Finally, create the standings
  const standings: IndividualSongStanding[] = [];

  const numMasters = Object.keys(mastersStandings).length;
  const numChallengers = Object.keys(challengersStandings).length;
  const numStandings = Math.max(numMasters, numChallengers);

  for (let i = 0; i < numStandings; ++i) {
    const scoreMap: { [songId in SongId]?: IndividualSongScore } = {};

    allSongs.forEach((songId) => {
      const individualSongScore = sortedScoresBySong[songId]?.[i];
      if (individualSongScore) {
        scoreMap[songId] = individualSongScore;
      }
    });

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
  }
  return rank <= numMastersFinalists;
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
  songIds.forEach((songId) => {
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
  });

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

/**
 * Formats the given score using the "en-US" locale.
 *
 * @param score The score to format, given as the string representation of an integer.
 * @returns The formatted score.
 */
export const formatScore = (score: number) => score.toLocaleString("en-US");

export const formatOrdinal = (rank: number) => {
  if (rank % 10 === 1 && rank % 100 !== 11) {
    return `${rank}st`;
  }
  if (rank % 10 === 2 && rank % 100 !== 12) {
    return `${rank}nd`;
  }
  if (rank % 10 === 3 && rank % 100 !== 13) {
    return `${rank}rd`;
  }
  return `${rank}th`;
};

export const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  });
