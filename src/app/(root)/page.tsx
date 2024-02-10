import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Leaderboard from './leaderboard';

const LeaderboardPage = async () => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const axios = (await import('@/libs/axios')).getAxiosInstance();
      const { data } = await axios.get('/api/submissions');
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Leaderboard />
    </HydrationBoundary>
  );
};

export default LeaderboardPage;
