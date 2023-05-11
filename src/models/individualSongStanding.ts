import { IndividualSongScore } from "./individualSongScore";

/**
 * The IndividualSongStanding interface represents a single row in the
 * leaderboard that shows the best scores on a per-song basis.
 */
export interface IndividualSongStanding {
  individualScores: IndividualSongScore[];
}
