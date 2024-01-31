'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

export const sampleData = [
  {
    active: true,
    ign: 'Testify',
    isDisqualified: true,
    qualifiedIndex: 0,
    song1: 1008797,
    song2: 1009088,
    song3: 1009294,
    totalScore: 3027179,
    timestamp: 1706263500000,
  },
];

type SampleData = (typeof sampleData)[number];

export const columns: ColumnDef<SampleData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => <Checkbox checked={row.getValue('active')} />,
  },
  {
    accessorKey: 'ign',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IGN" />
    ),
  },
  {
    accessorKey: 'song1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Song 1" />
    ),
  },
  {
    accessorKey: 'song2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Song 2" />
    ),
  },
  {
    accessorKey: 'song3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Song 3" />
    ),
  },
  {
    accessorKey: 'totalScore',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Score" />
    ),
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('timestamp')).toLocaleString('en-SG', {
        timeZone: 'Asia/Singapore',
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
      }),
  },
  {
    accessorKey: 'isDisqualified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DQed" />
    ),
    cell: ({ row }) => <Checkbox checked={row.getValue('isDisqualified')} />,
  },
];
