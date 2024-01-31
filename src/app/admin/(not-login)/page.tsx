'use client';

/* eslint-disable arrow-body-style */
import { DataTable } from '@/components/ui/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { columns, sampleData } from './columns';

const AdminHome = () => {
  return (
    <div className='space-y-5'>
      <h1>Control Panel</h1>
      <Alert>
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Some random tip about the control panel
        </AlertDescription>
      </Alert>
      <DataTable columns={columns} data={sampleData} />
    </div>
  );
};

export default AdminHome;
