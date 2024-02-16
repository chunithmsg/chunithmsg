import { compareInt } from '@/libs';

export type TeamPhaseResult = {
  rank: number;
  teamId: string;
  teamName: string;
  numMatchesPlayed: number;
  numWins: number;
  numAwayWins: number;
  totalScoreDiff: number;
};

export const compareTeamPhaseResults = (
  resultA: TeamPhaseResult,
  resultB: TeamPhaseResult,
): number => {
  if (resultA.numWins !== resultB.numWins) {
    return -compareInt(resultA.numWins, resultB.numWins);
  }
  if (resultA.numAwayWins !== resultB.numAwayWins) {
    return -compareInt(resultA.numAwayWins, resultB.numAwayWins);
  }

  return -compareInt(resultA.totalScoreDiff, resultB.totalScoreDiff);
};
