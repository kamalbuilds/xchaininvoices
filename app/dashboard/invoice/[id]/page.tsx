'use client';

import React, { createElement } from 'react';

import { useRequest } from '~/lib/hooks';

import { Types } from '@requestnetwork/request-client.js';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';
import { useAccount } from 'wagmi';
import { Message } from '~/components';

import { Button } from '~/components/ui/button';

import {
  Erc777Balance,
  InvoicePDFCreated,
_com  type InvoicePDFCreatedProps,
  Payer,
} from '../../ponents';

import { CircleCheckBig } from 'lucide-react';

interface Params {
  params: { id: string };
}

const renderPDF = async (props: InvoicePDFCreatedProps) => {
  const { pdf } = await import('@react-pdf/renderer');
  const { InvoicePDFCreated: PDF } = await import(
    '../../dashboard-components/invoice-pdf'
  );
  // @ts-expect-error -- TS CONVERSION ERROR
  return pdf(createElement(PDF, props)).toBlob();
};

const InvoicePage = ({ params: { id } }: Params) => {
  const { getRequestById, data } = useRequest();
  const { address } = useAccount();

  const { data: request, isPending } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => await getRequestById(id),
    enabled: Boolean(data) && Boolean(address) && Boolean(id),
    refetchInterval: 3000,
  });

  if (!address) {
    return <Message message='Please connect your wallet to view this page' />;
  }

  if (isPending || !request) return <Message message='Loading...' />;

  const requestData = request.getData();

  const userType = () => {
    if (address === requestData.reciever?.value) {
      return 'reciever';
    } else if (requestData.payer?.value === address) {
      return 'payer';
    }
    return 'other';
  };

  if (userType() === 'other') {
    return <Message message='You are not authorized to view this page' />;
  }

  const current = BigNumber(requestData.balance?.balance ?? 0);
  const expected = BigNumber(requestData.expectedAmount);

  const progress = current.dividedBy(expected).times(100).toNumber().toFixed(0);

  const isComplete = current.isEqualTo(expected);

  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      {requestData.currencyInfo.type === Types.RequestLogic.CURRENCY.ERC777 && (
        <Erc777Balance request={requestData} />
      )}
      <InvoicePDFCreated data={request.getData()} />
      <Button
        className='w-fit'
        onClick={async () => {
          const blob = await renderPDF({
            data: request.getData(),
          });
          const file = new File([blob], 'invoice.pdf', {
            type: 'application/pdf',
          });

          const url = URL.createObjectURL(file);
          const a = document.createElement('a');

          a.download = 'invoice.pdf';
          a.href = url;
          a.click();

          URL.revokeObjectURL(url);
          a.remove();
        }}
      >
        Download
      </Button>

      {requestData.currencyInfo.type !== Types.RequestLogic.CURRENCY.ERC777 && (
        <div className='flex flex-row items-center gap-2'>
          <div className='text-base font-semibold text-neutral-700'>
            Payment Status:{' '}
          </div>
          <div className='text-base font-semibold text-neutral-700'>
            {isComplete ? (
              <div className='flex flex-row items-center gap-2'>
                <CircleCheckBig className='h-6 w-6 text-green-500' />
                Completed
              </div>
            ) : (
              <div className='flex flex-row items-center gap-2'>
                <div className='flex flex-row items-center gap-2'>
                  <div className='w-24 rounded-md border border-neutral-300'>
                    <div
                      className='h-3 rounded-md bg-yellow-500'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className='text-sm font-medium text-neutral-500'>
                    {progress}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {userType() === 'payer' ? <Payer request={request} /> : null}
    </div>
  );
};

export default InvoicePage;
