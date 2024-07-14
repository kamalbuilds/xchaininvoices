'use client';

import React, { useMemo, useState } from 'react';

import { getAllCurrencies } from '~/lib/currency';
import { useRequest } from '~/lib/hooks';

import { type Request, Types } from '@requestnetwork/request-client.js';
import { RequestLogicTypes } from '@requestnetwork/types';
import { formatUnits, parseUnits } from 'viem';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Slider } from '~/components/ui/slider';

interface PayerProps {
  request: Request;
}

export const Payer = ({ request }: PayerProps) => {
  const { pay } = useRequest();
  const [payAmount, setPayAmount] = useState(0);

  const requestData = request.getData();

  const currency = useMemo(() => {
    const c = getAllCurrencies()
      .filter((c) => c.type === requestData.currencyInfo.type)
      .find((c) => {
        if (
          c.type === RequestLogicTypes.CURRENCY.ERC20 ||
          c.type === RequestLogicTypes.CURRENCY.ERC777
        ) {
          return c.address === requestData.currencyInfo.value;
        }
        return c.symbol === requestData.currencyInfo.value;
      });

    return c;
  }, [requestData.currencyInfo.type, requestData.currencyInfo.value]);

  const onPay = async () => {
    const parsedAmount = parseUnits(
      String(payAmount),
      currency?.decimals ?? 18
    ).toString();
    await pay(requestData.requestId, parsedAmount);
  };

  return (
    <div className='flex flex-col gap-2 py-6'>
      <div className='flex flex-col gap-2'>
        <div className='text-lg font-semibold text-neutral-700'>Pay Amount</div>
        {requestData.currencyInfo.type !==
          Types.RequestLogic.CURRENCY.ERC777 && (
          <div className='flex max-w-xl flex-row items-center gap-2'>
            <Button
              className=''
              variant='outline'
              onClick={() => setPayAmount(1000)}
            >
              Max
            </Button>
            <Slider
              className='w-full'
              defaultValue={[0]}
              step={0.00001}
              value={[payAmount]}
              max={Number(
                formatUnits(
                  BigInt(
                    Number(requestData.expectedAmount) -
                      Number(requestData.balance?.balance ?? 0)
                  ),
                  currency?.decimals ?? 18
                )
              )}
              onValueChange={(v) => {
                if (v[0]) {
                  setPayAmount(v[0]);
                }
              }}
            />
            <div className='flex w-full flex-row items-center gap-2 text-base font-medium text-neutral-600'>
              <Input
                className='w-[6rem] border-none'
                type='number'
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
              />
              {currency?.symbol}
            </div>
          </div>
        )}
        <Button className='w-fit' onClick={onPay}>
          Pay
        </Button>
        <Button className='my-4 w-fit'>Declare Payment Complete</Button>
      </div>
    </div>
  );
};
