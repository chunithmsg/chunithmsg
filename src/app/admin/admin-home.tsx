'use client';

/* eslint-disable arrow-body-style */
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/ui/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCompetitions, getScores } from '@/queries';

import { columns } from './columns';

const AdminHome = () => {
  const { data: competitions, isLoading: isCompetitionsLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: getCompetitions,
  });

  const { data: scores, isLoading: isScoresLoading } = useQuery({
    queryKey: ['scores', competitions?.[0].id],
    queryFn: ({ queryKey }) => getScores(queryKey[1] || ''),
    enabled: !isCompetitionsLoading,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  return (
    <div className="space-y-5">
      <h1>Control Panel</h1>
      <Alert>
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Some random tip about the control panel
        </AlertDescription>
      </Alert>
      <DataTable
        columns={columns}
        data={scores || []}
        isDataLoading={isCompetitionsLoading || isScoresLoading}
      />
    </div>
  );
};

export default AdminHome;
