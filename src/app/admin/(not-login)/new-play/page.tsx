import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getCompetitions } from '@/queries';
import NewPlay from './new-play';

const NewPlayPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['competitions'],
    queryFn: getCompetitions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewPlay />
    </HydrationBoundary>
  );
};

export default NewPlayPage;
