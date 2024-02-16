import { qualifiersSpreadsheetId, undefIfEmpty } from '@/libs';
import { GrandFinalsMatch } from '@/models/ssl-finals/grandFinalsMatch';
import {
  ScoreAttackPhase,
  ScoreAttackResult,
  compareScoreAttackResults,
} from '@/models/ssl-finals/scoreAttackPhase';
import { SslFinalsDetails } from '@/models/ssl-finals/sslFinalsDetails';
import { TeamDetails } from '@/models/ssl-finals/teamDetails';
import { TeamMatch } from '@/models/ssl-finals/teamMatch';
import {
  TeamPhaseResult,
  compareTeamPhaseResults,
} from '@/models/ssl-finals/teamPhaseResult';
import {
  AuthClient,
  getAuthClient,
  getSpreadSheetValues,
} from '@/services/googleSheetsService';

const SSL_FINALS_SHEET_NAME = 'S.S.L. Finals';
const SHEET_RANGE = 'C3:I200';

const parseScoreAttackPhase = (rangeStack: string[][]): ScoreAttackPhase => {
  // Line 1: N = Number of Players
  const firstLine = rangeStack.pop()!;
  const numPlayers = parseInt(firstLine[2]);

  // Line 2: Song Name
  const secondLine = rangeStack.pop()!;
  const songName = undefIfEmpty(secondLine[2]);

  // Line 3: Header
  rangeStack.pop();

  // Next N lines: Player scores
  const rawPlayerScores = rangeStack.splice(-numPlayers);
  const playerScores: ScoreAttackResult[] = rawPlayerScores.map((row) => {
    const seed = parseInt(row[1]);
    const name = row[2];
    const score = row[3] !== '' ? parseInt(row[3]) : undefined;

    return { seed, name, score };
  });
  playerScores.sort(compareScoreAttackResults);

  return { songName, playerScores };
};

const parseTeamDetails = (rangeStack: string[][]): TeamDetails => {
  // Line 1: N = Number of teams
  const firstLine = rangeStack.pop()!;
  const numTeams = parseInt(firstLine[2]);

  // Line 2: Header
  rangeStack.pop();

  // Next N lines: Teams
  const rawTeamDetails = rangeStack.splice(-numTeams);
  const teamDetails = rawTeamDetails.reduce((detailsDict, row) => {
    const teamId = row[1];
    const teamName = row[2];
    const captain = row[3];
    const player2 = row[4];
    const player3 = row[5];

    detailsDict[teamId] = {
      teamName,
      members: { captain, player2, player3 },
    };
    return detailsDict;
  }, {} as TeamDetails);

  return teamDetails;
};

const parseTeamMatch = (
  rangeStack: string[][],
  teamDetails: TeamDetails,
): TeamMatch | undefined => {
  // Return undefined if the match is not yet complete.

  // Exactly 5 lines for a Team Match.
  const teamMatchLines = rangeStack.splice(-5);

  // First line: Match Number, Home and Away Teams
  const firstLine = teamMatchLines.pop()!;
  const matchNumber = parseInt(firstLine[2]);
  const homeTeamId = firstLine[5];
  const awayTeamId = firstLine[7];

  // If the Team ID is still unset, this match isn't complete.
  if (homeTeamId === '' || awayTeamId === '') {
    return undefined;
  }

  const homeTeamName = teamDetails[homeTeamId].teamName;
  const awayTeamName = teamDetails[awayTeamId].teamName;

  // Second line: Header
  teamMatchLines.pop();

  // Next 2 lines: Song results
  const rawSongResults = teamMatchLines.splice(-2).reverse();
  // If any of the 'score' fields are empty, this match isn't complete.
  if (rawSongResults.some((row) => row[5] === '' || row[7] === '')) {
    return undefined;
  }

  const songResults = rawSongResults.map((row) => {
    const songName = row[2];
    const isLimitBroken = row[3] === 'Y';

    const homeResult = {
      playerName: row[4],
      score: parseInt(row[5]),
    };
    const awayResult = {
      playerName: row[6],
      score: parseInt(row[7]),
    };

    return {
      songName,
      isLimitBroken,
      homeResult,
      awayResult,
    };
  });

  // Last line: Total scores
  const lastLine = teamMatchLines.pop()!;
  const homeTotalScore = parseInt(lastLine[5]);
  const awayTotalScore = parseInt(lastLine[7]);

  return {
    matchNumber,
    homeTeamId,
    homeTeamName,
    awayTeamId,
    awayTeamName,
    songResults,
    homeTotalScore,
    awayTotalScore,
  };
};

const updatePhaseResult = (
  teamMatch: TeamMatch,
  teamPhaseResultMap: { [teamId: string]: TeamPhaseResult },
) => {
  const homePhaseResult = teamPhaseResultMap[teamMatch.homeTeamId];
  const awayPhaseResult = teamPhaseResultMap[teamMatch.awayTeamId];

  // Home win
  if (teamMatch.homeTotalScore > teamMatch.awayTotalScore) {
    homePhaseResult.numWins += 1;
  }
  // Away win
  if (teamMatch.awayTotalScore > teamMatch.homeTotalScore) {
    awayPhaseResult.numWins += 1;
    awayPhaseResult.numAwayWins += 1;
  }

  homePhaseResult.numMatchesPlayed += 1;
  homePhaseResult.totalScoreDiff +=
    teamMatch.homeTotalScore - teamMatch.awayTotalScore;
  awayPhaseResult.numMatchesPlayed += 1;
  awayPhaseResult.totalScoreDiff +=
    teamMatch.awayTotalScore - teamMatch.homeTotalScore;
};

const parseFinalsMatch = (
  rangeStack: string[][],
  teamDetails: TeamDetails,
): GrandFinalsMatch | undefined => {
  // Return undefined if the match has not yet started.

  // Exactly 8 lines for a Grand Finals Match.
  const teamMatchLines = rangeStack.splice(-8);

  // First line: Match Number, Home and Away Teams
  const firstLine = teamMatchLines.pop()!;
  const homeTeamId = firstLine[4];
  const awayTeamId = firstLine[6];

  // If the Team ID is empty, the match has not yet started.
  if (homeTeamId === '' || awayTeamId === '') {
    return undefined;
  }

  const homeTeamName = teamDetails[homeTeamId].teamName;
  const awayTeamName = teamDetails[awayTeamId].teamName;

  // Second line: Header
  teamMatchLines.pop();

  // Next 5 lines: Song results
  const rawSongResults = teamMatchLines.splice(-5).reverse();

  const songResults = rawSongResults.map((row) => {
    const songName = row[2];
    const homeResult =
      row[4] !== ''
        ? { playerName: row[3], score: parseInt(row[4]) }
        : undefined;
    const awayResult =
      row[6] !== ''
        ? { playerName: row[5], score: parseInt(row[6]) }
        : undefined;

    return {
      songName,
      homeResult,
      awayResult,
    };
  });

  // Last line: Total scores
  const lastLine = teamMatchLines.pop()!;
  const homeTotalScore = parseInt(lastLine[4]);
  const awayTotalScore = parseInt(lastLine[6]);

  return {
    homeTeamName,
    awayTeamName,
    songResults,
    homeTotalScore,
    awayTotalScore,
  };
};

const processPhaseResults = (teamPhaseResultMap: {
  [teamId: string]: TeamPhaseResult;
}): TeamPhaseResult[] => {
  const teamPhaseResults = Object.values(teamPhaseResultMap);
  teamPhaseResults.sort(compareTeamPhaseResults).forEach((result, index) => {
    result.rank = index + 1;
  });

  return teamPhaseResults;
};

export class SubmissionController {
  authClient?: AuthClient;

  async initialise() {
    // Opening myself up to race conditions, but I'll deal with those later.
    if (this.authClient !== undefined) {
      return;
    }

    this.authClient = await getAuthClient();
  }

  private async readRange(
    sheetName: string,
    sheetRange: string,
  ): Promise<string[][]> {
    const response = await getSpreadSheetValues(
      qualifiersSpreadsheetId,
      this.authClient,
      `${sheetName}!${sheetRange}`,
    );

    const values = response.data.values as string[][] | null | undefined;
    if (!values) {
      // A null or undefined response is likely due to the sheet being empty in
      // the searched range.
      return [];
    }

    return values;
  }

  async getFinalsDetails(): Promise<SslFinalsDetails> {
    const rawRange = await this.readRange(SSL_FINALS_SHEET_NAME, SHEET_RANGE);
    const rangeStack = rawRange.reverse();

    let scoreAttackPhase: ScoreAttackPhase;
    let teamDetails: TeamDetails;
    const teamPhaseMatches: TeamMatch[] = [];
    const teamPhaseResultMap: { [teamId: string]: TeamPhaseResult } = {};
    const grandFinalsMatches: GrandFinalsMatch[] = [];

    while (rangeStack.length > 0) {
      switch (rangeStack.at(-1)![0]) {
        case 'score-attack':
          scoreAttackPhase = parseScoreAttackPhase(rangeStack);
          break;
        case 'team-details':
          teamDetails = parseTeamDetails(rangeStack);

          for (const [teamId, details] of Object.entries(teamDetails)) {
            teamPhaseResultMap[teamId] = {
              rank: 0,
              teamId,
              teamName: details.teamName,
              numMatchesPlayed: 0,
              numWins: 0,
              numAwayWins: 0,
              totalScoreDiff: 0,
            };
          }

          break;
        case 'team-match':
          const nextTeamMatch = parseTeamMatch(rangeStack, teamDetails!);
          if (nextTeamMatch === undefined) {
            break;
          }

          teamPhaseMatches.push(nextTeamMatch);
          updatePhaseResult(nextTeamMatch, teamPhaseResultMap);
          break;
        case 'finals-battle':
          const nextFinalsMatch = parseFinalsMatch(rangeStack, teamDetails!);
          if (nextFinalsMatch === undefined) {
            break;
          }

          grandFinalsMatches.push(nextFinalsMatch);
      }
    }

    const teamPhaseResults = processPhaseResults(teamPhaseResultMap);

    return {
      scoreAttackPhase: scoreAttackPhase!,
      teamPhaseMatches,
      teamPhaseResults,
      grandFinalsMatches,
    };
  }
}
