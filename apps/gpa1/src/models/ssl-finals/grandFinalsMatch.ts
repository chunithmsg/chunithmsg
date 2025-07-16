import { TeamSongResult } from './teamSongResult';

export type GrandFinalsMatch = {
  matchName: string;
  homeTeamName: string; // Higher ranked team
  awayTeamName: string; // Lower ranked team
  /**
   * The results of the songs played in this match.
   *
   * An 'undefined' `homeResult` or `awayResult` means that the song has not yet
   * concluded
   */
  songResults: {
    songName?: string;
    homeResult?: TeamSongResult;
    awayResult?: TeamSongResult;
  }[];
  homeTotalScore: number;
  awayTotalScore: number;
};
