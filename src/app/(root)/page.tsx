import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getCompetitions } from '@/queries';

import Leaderboard from './leaderboard';

const LeaderboardPage = async () => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ['get_competitions'],
    queryFn: getCompetitions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Leaderboard />
    </HydrationBoundary>
  );
};

export default LeaderboardPage;
