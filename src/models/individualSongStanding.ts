import { SongId } from "@/utils/songUtils";
import { IndividualSongScore } from "./individualSongScore";

type IndividualSongScoreMap = {
  [songId in SongId]?: IndividualSongScore;
};

interface WithIndex {
  index: number;
}

/**
 * The IndividualSongStanding interface represents a single row in the
 * leaderboard that shows the best scores on a per-song basis.
 */
export type IndividualSongStanding = IndividualSongScoreMap & WithIndex;
