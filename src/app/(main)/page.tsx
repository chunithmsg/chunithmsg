import { getCompetitions, getLeaderboard } from '@/queries';

import Leaderboard from './leaderboard';

const LeaderboardPage = async () => {
  const competitions = await getCompetitions();
  const leaderboard = await getLeaderboard(competitions?.[0].id || '');

  return <Leaderboard leaderboard={leaderboard} />;
};

export default LeaderboardPage;
