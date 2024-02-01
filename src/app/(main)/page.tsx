import { getCompetitions, getLeaderboard } from '@/queries';
import type { Score } from '@/models/standing';

import Leaderboard from './leaderboard';

const LeaderboardPage = async () => {
  const competitions = await getCompetitions();
  const leaderboard: Array<Score> | null = await getLeaderboard(
    competitions?.[0].id,
  );

  return <Leaderboard leaderboard={leaderboard} />;
};

export default LeaderboardPage;
