'use client';

import Link from 'next/link';

import React from 'react';

import { getCurrenciesForType } from '~/lib/currency';
import { type InvoiceType } from '~/lib/invoice';
import { truncate } from '~/lib/utils';

import { RequestLogicTypes } from '@requestnetwork/types';
import { type IRequestData } from '@requestnetwork/types/dist/client-types';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { BigNumber } from 'bignumber.js';
import { formatUnits } from 'viem';

import { TextCopy } from '~/components/text-copy';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { CircleCheckBig, MoreHorizontal } from 'lucide-react';

interface RequestTableProps {
  data: IRequestData[];
}

export const columns: ColumnDef<IRequestData>[] = [
  {
    accessorKey: 'requestId',
    header: 'Request ID',
    cell: ({ row }) => <div>{truncate(row.original.requestId, 12)}</div>,
  },
  {
    accessorKey: 'contentData.creationDate',
    header: 'Created At',
    cell: ({ row }) => {
      const jsDate = new Date(
        (row.original.contentData as InvoiceType).creationDate
      );
      const formattedDate = jsDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'expectedAmount',
    header: 'Amount',
    cell: ({ row }) => {
      const request = row.original;

      const currency = getCurrenciesForType(request.currencyInfo.type).find(
        (c) => {
          const isAddress =
            request.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20 ||
            request.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC777;

          if (isAddress && 'address' in c) {
            return c.address === request.currencyInfo.value;
          }
          return c.symbol === request.currencyInfo.value;
        }
      );

      if (!currency) {
        return null;
      }

      const parsed = formatUnits(
        BigInt(request.expectedAmount),
        currency.decimals
      ).toString();

      return <div>{parsed}</div>;
    },
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row }) => {
      const request = row.original;

      const currency = getCurrenciesForType(request.currencyInfo.type).find(
        (c) => {
          const isAddress =
            request.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20 ||
            request.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC777;

          if (isAddress && 'address' in c) {
            return c.address === request.currencyInfo.value;
          }
          return c.symbol === request.currencyInfo.value;
        }
      );

      const shortened =
        currency?.symbol.split('-').slice(0, 2).join(' ') ?? 'unknown';

      return <div>{shortened}</div>;
    },
  },
  {
    accessorKey: 'contentData.invoiceNumber',
    header: 'Invoice #',
  },
  {
    accessorKey: 'reciever.value',
    header: 'Reciever',
    cell: ({ row }) => (
      <TextCopy
        text={row.original.payee?.value ?? ''}
        truncateOptions={{ length: 10 }}
      />
    ),
  },
  {
    accessorKey: 'payer.value',
    header: 'Payer',
    cell: ({ row }) => (
      <TextCopy
        text={row.original.payer?.value ?? ''}
        truncateOptions={{ length: 10 }}
      />
    ),
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => {
      const request = row.original;
      const current = BigNumber(request.balance?.balance ?? 0);
      const expected = BigNumber(request.expectedAmount);

      const progress = current
        .dividedBy(expected)
        .times(100)
        .toNumber()
        .toFixed(0);

      const isComplete = current.isEqualTo(expected);

      if (isComplete) {
        return (
          <div className='flex flex-col gap-2'>
            <CircleCheckBig className='h-4 w-4 text-green-500' />
          </div>
        );
      }
      return (
        <div className='flex flex-row items-center gap-2'>
          <div className='w-10 rounded-lg border border-neutral-300'>
            <div
              className='h-2 rounded-lg bg-yellow-500'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className='text-xs font-medium text-neutral-500'>
            {progress}%
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const request = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='h-8 w-8 p-0' variant='ghost'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(request.requestId)}
            >
              Copy Request ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                className='cursor-pointer'
                href={`/dashboard/invoice/${request.requestId}`}
              >
                Go to Invoice
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const RequestsTable = ({ data }: RequestTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className='h-24 text-center'
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          disabled={!table.getCanPreviousPage()}
          size='sm'
          variant='outline'
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          size='sm'
          variant='outline'
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
