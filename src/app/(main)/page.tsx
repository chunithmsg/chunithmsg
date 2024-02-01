import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getLeaderboard } from '@/queries';
import Leaderboard from './leaderboard';

const LeaderboardPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Leaderboard />
    </HydrationBoundary>
  );
};

export default LeaderboardPage;
