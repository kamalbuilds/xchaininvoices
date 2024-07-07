'use client';

import React, { useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { useRequest } from '~/lib/hooks';

import { useQuery } from '@tanstack/react-query';

import { Button } from '~/components/ui/button';

import { DatePickerWithRange } from './dashboard-components/date-range-picker';
import { RequestsTable } from './dashboard-components/request-table';

import { Header } from './create-invoice/invoice-components/header';

const Dashboard = () => {
  const { getAllRequestsData, data } = useRequest();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(1720002211000),
    to: new Date(4875323983000),
  });

  const { data: requests, refetch } = useQuery({
    queryKey: ['requests', date],
    queryFn: async () => {
      const from = date?.from?.getTime()
        ? Math.round(date.from.getTime() / 1000)
        : undefined;
      const to = date?.to?.getTime()
        ? Math.round(date.to.getTime() / 1000)
        : undefined;

      return await getAllRequestsData(from, to);
    },
    initialData: [],
    enabled: Boolean(data),
  });

  return (
    <div className='flex w-full flex-col bg-gray-50 px-4 py-12'>
      <div className='flex flex-col items-start justify-between md:flex-row'>
        <Header
          className='pb-4'
          description='View and manage your requests'
          title='Dashboard'
        />
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <RequestsTable data={requests ?? []} />
      <Button
        className='w-fit'
        onClick={async () => {
          await refetch();
        }}
      >
        Refresh Invoices
      </Button>
    </div>
  );
};

export default Dashboard;
