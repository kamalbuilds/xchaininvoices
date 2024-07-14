'use client';

import Image from 'next/image';

import React, { useEffect, useState } from 'react';

import { useEthers } from '~/lib/hooks/use-ethers';

import { ChainNames } from '~/lib/chains';
import { errorHandler, truncate } from '~/lib/utils';

import { type IRequestData } from '@requestnetwork/types/dist/client-types';
import sfMetadata from '@superfluid-finance/metadata';
import { Framework } from '@superfluid-finance/sdk-core';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';
import StreamGIF from 'public/superfluidstream.gif';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';

interface Erc777BalanceProps {
  request: IRequestData;
}

export const Erc777Balance = ({ request }: Erc777BalanceProps) => {
  const { provider, signer } = useEthers();
  const recieverAddress = request.payee?.value ?? '0x0';
  const payerAddress = request.payer?.value ?? '0x0';
  const [value, setValue] = useState<number>(0);

  const [payerBalance, setPayerBalance] = useState<BigNumber>(BigNumber(0));
  const [recieverBalance, setRecieverBalance] = useState<BigNumber>(BigNumber(0));

  const network = sfMetadata.getNetworkByShortName(
    request.currencyInfo.network ?? 'mainnet'
  );

  const chainLogo =
    ChainNames.find((c) => c.id === request.currencyInfo.network)?.icon ??
    'ethereum';

  const { data, refetch, isPending } = useQuery({
    enabled: Boolean(provider) && Boolean(network),
    queryKey: [
      'erc777-balance',
      recieverAddress,
      payerAddress,
      network?.nativeTokenWrapper,
    ],
    queryFn: async () => {
      if (!network) return;
      if (!provider) return;
      // Initialize Superfluid Framework
      const sf = await Framework.create({
        chainId: network.chainId,
        provider,
        resolverAddress: network.contractsV1.resolver,
      });

      const superToken = await sf.loadSuperToken(request.currencyInfo.value);

      const flowRate = await superToken.getAccountFlowInfo({
        account: payerAddress,
        providerOrSigner: provider,
      });
      const recieverBalance = await superToken.balanceOf({
        account: recieverAddress,
        providerOrSigner: provider,
      });

      const payerBalance = await superToken.balanceOf({
        account: payerAddress,
        providerOrSigner: provider,
      });

      setValue(Math.abs(Number(flowRate.flowRate)));

      let precision: number;
      if (parseInt(flowRate.flowRate) === 0) {
        precision = 0;
      } else {
        precision = 19 - Math.log10(Math.abs(Number(flowRate.flowRate)));
      }

      const b1 = BigNumber(
        BigNumber(payerBalance).dividedBy(1e18).toFixed(precision)
      );
      const b2 = BigNumber(
        BigNumber(recieverBalance).dividedBy(1e18).toFixed(precision)
      );

      setPayerBalance(b1);
      setRecieverBalance(b2);

      return {
        framework: sf,
        superToken,
        precision,
        flowRate,
        recieverBalance,
        payerBalance,
      };
    },
  });

  // when flowrate changes then decrease the balance every second
  useEffect(() => {
    if (!data) return;
    if (recieverBalance.isEqualTo(0) || payerBalance.isEqualTo(0)) return;

    const rate = BigNumber(data.flowRate.flowRate).dividedBy(1e19);

    const interval = setInterval(() => {
      const updatedRecieverBalance = recieverBalance.minus(rate);
      const updatedPayerBalance = payerBalance.plus(rate);

      setPayerBalance(updatedPayerBalance);
      setRecieverBalance(updatedRecieverBalance);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [data, recieverBalance, payerBalance]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='m-4 mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 rounded-xl text-center'>
        <div className='text-lg font-semibold text-neutral-800'>
          Total Amount Streamed
        </div>
        <div className='flex flex-row items-center justify-between gap-8 text-6xl font-semibold text-neutral-800'>
          <Image
            alt='Image'
            className='rounded-full'
            height={64}
            src={`https://icons.llamao.fi/icons/chains/rsz_${chainLogo}?w=512&h=512`}
            width={64}
          />
          <div>
            {isPending ? (
              <Skeleton className='h-[64px] w-[400px] rounded-xl' />
            ) : (
              <div>{recieverBalance.toFixed(data?.precision ?? 18)}</div>
            )}
          </div>
          <div className='text-[#01A261]'>ETHx</div>
        </div>
        <div className='flex w-full max-w-3xl flex-row items-end py-8'>
          <div className='flex flex-1 flex-col gap-4'>
            <div className='tet-neutral-700 text-start text-base font-medium'>
              Sender
            </div>
            <div className='flex flex-row items-center gap-3 rounded-xl border p-3 text-lg font-medium text-neutral-800 shadow-sm'>
              <Image
                alt='Image'
                className='rounded-full'
                height={32}
                src={`https://api.dicebear.com/9.x/shapes/png?seed=${request.payer?.value ?? ''}`}
                width={32}
              />
              {truncate(request.payer?.value ?? '', 12)}
            </div>
          </div>
          <Image
            alt='Image'
            className='mb-1'
            height={84}
            src={StreamGIF}
            width={84}
          />
          <div className='flex flex-1 flex-col gap-4'>
            <div className='tet-neutral-700 text-start text-base font-medium'>
              Receiver
            </div>
            <div className='flex flex-row items-center gap-3 rounded-xl border p-3 text-lg font-medium text-neutral-800 shadow-sm'>
              <Image
                alt='Image'
                className='rounded-full'
                height={32}
                src={`https://api.dicebear.com/9.x/shapes/png?seed=${request.payee?.value ?? ''}`}
                width={32}
              />
              {truncate(request.payee?.value ?? '', 12)}
            </div>
          </div>
        </div>
        <div className='flex flex-row items-center gap-2 text-lg font-semibold text-neutral-800'>
          Flow Rate:{' '}
          {isPending ? (
            <Skeleton className='h-6 w-32' />
          ) : (
            <div className='flex flex-row items-center gap-2'>
              <Input
                className='w-32'
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
              wei
              <Button
                className=''
                variant='secondary'
                onClick={async () => {
                  const id = toast.loading('Updating flow rate...');
                  try {
                    if (value === Math.abs(Number(data?.flowRate.flowRate))) {
                      throw new Error('Flow rate is already set to this value');
                    }
                    if (!data) {
                      throw new Error('Superfluid framework not initialized');
                    }
                    if (!signer) {
                      throw new Error('Connect wallet to update flow rate');
                    }
                    const operation = data.superToken.updateFlow({
                      flowRate: String(value),
                      sender: payerAddress,
                      receiver: recieverAddress,
                    });

                    const batchCall = data.framework.batchCall([operation]);
                    const operationStructArray = await Promise.all(
                      batchCall.getOperationStructArrayPromises
                    );
                    const txData =
                      batchCall.host.contract.interface.encodeFunctionData(
                        'batchCall',
                        [operationStructArray]
                      );

                    const params = {
                      data: txData,
                      to: data.framework.host.contract.address,
                      value: 0,
                    };

                    const tx = await signer.sendTransaction(params);
                    const receipt = await tx.wait(2);

                    toast.success('Flow rate updated', {
                      id,
                      description: receipt.transactionHash,
                    });

                    await refetch();
                  } catch (error) {
                    toast.error(errorHandler(error), { id });
                  }
                }}
              >
                Update
              </Button>
            </div>
          )}{' '}
        </div>
      </div>
    </div>
  );
};
