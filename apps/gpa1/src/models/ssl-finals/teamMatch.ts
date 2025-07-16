import { TeamSongResult } from './teamSongResult';

export type TeamMatch = {
  matchNumber: number;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  /**
   * The results of the songs played in this match.
   *
   * There are exactly 2 songs.
   */
  songResults: {
    songName: string;
    isLimitBroken: boolean;
    homeResult: TeamSongResult;
    awayResult: TeamSongResult;
  }[];

  homeTotalScore: number;
  awayTotalScore: number;
};
