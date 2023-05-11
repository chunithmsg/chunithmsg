import { SongScore } from "./songScore";

/**
 * The IndividualSongScore interface represents a player's best score for an
 * individual song. That is to say, this interface is used for the leaderboard
 * that shows the best songs on a per-song basis.
 *
 * As such, in addition to the the song score, it contains information on the
 * player as well.
 */
export interface IndividualSongScore {
  timestamp: number;
  ign: string;
  leaderboardStanding?: { division: "Challengers" | "Masters"; rank: number };
  isDisqualified: boolean;
  songScore: SongScore;
}
