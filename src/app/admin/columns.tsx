'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { deletePlay } from '@/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { Score } from '@/models/standing';

export const columns: ColumnDef<Score>[] = [
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
    accessorKey: 'ign',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IGN" className='w-36' />
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
    accessorKey: 'total_score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Score" />
    ),
  },
  {
    accessorKey: 'played_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time of Play" />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('played_at')).toLocaleString('en-SG', {
        timeZone: 'Asia/Singapore',
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false,
      }),
  },
  {
    accessorKey: 'disqualified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DQed" />
    ),
    cell: ({ row }) => (
      <Checkbox disabled checked={row.getValue('disqualified')} />
    ),
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => <Checkbox disabled checked={row.getValue('active')} />,
  },
  {
    id: 'actions',
    header: () => (
      <div className='w-8' />
    ),
    cell: ({ row }) => {
      const play = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/admin/edit-play/${play.id}`}>
              <DropdownMenuItem>Edit Play</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={async () => {
                await deletePlay(play.id);
                window.location.reload();
              }}
            >
              Delete Play
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
