import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getCompetitions } from '@/queries';
import AdminHome from './admin-home';

const AdminHomePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['competitions', ],
    queryFn: getCompetitions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminHome />
    </HydrationBoundary>
  );
};

export default AdminHomePage;
