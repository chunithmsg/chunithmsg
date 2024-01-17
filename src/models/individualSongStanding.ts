// Can't use @/libs due to circular dependency.
import { SongId, allSongIds } from '@/libs/song';
import { IndividualSongScore } from './individualSongScore';

/**
 * The IndividualSongStanding interface represents a single row in the
 * leaderboard that shows the best scores on a per-song basis.
 */
export type IndividualSongStanding = {
  key: number;
  scoreMap: { [songId in SongId]?: IndividualSongScore };
};

export const generateKey = (scoreMap: {
  [songId in SongId]?: IndividualSongScore;
}) => {
  // This is a very boring way to hash the scoreMap property.
  // Not much thought was put into this.

  const MOD = 1_000_000_009;
  const MULTIPLIER = 151;

  let output = 0;
  for (const songId of allSongIds) {
    const individualScore = scoreMap[songId];
    if (!individualScore) {
      continue;
    }

    const {
      ign,
      songScore: { score },
    } = individualScore;

    for (let i = 0; i < ign.length; ++i) {
      output = (output * MULTIPLIER + ign.charCodeAt(i)) % MOD;
    }
    output = (output * MULTIPLIER + score) % MOD;
  }

  return output;
};
