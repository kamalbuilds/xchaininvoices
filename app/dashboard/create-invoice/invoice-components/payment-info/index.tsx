'use client';

import Image from 'next/image';

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { getChainsForCurrency } from '~/lib/chains';
import { getCurrenciesForType } from '~/lib/currency';
import { useInvoiceForm } from '~/lib/hooks';
import { paymentIdDetails } from '~/lib/payment';
import { type PaymentInfo, paymentInfoSchema } from '~/lib/zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Types } from '@requestnetwork/request-client.js';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { Header } from '../header';
import { PaymentParams } from './payment-params';

export const PaymentInfoForm = () => {
  'use no memo';

  const { previous, paymentInfo, setPaymentInfo, next } = useInvoiceForm();

  const form = useForm<PaymentInfo>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: paymentInfo ?? {
      currency: {
        type: Types.RequestLogic.CURRENCY.ETH,
        network: 'mainnet',
        value: 'ETH',
      },
      expectedAmount: '1',
      parameters: {
        id: 'pn-fee-reference-based',
      },
    },
  });

  const onSubmit = (values: PaymentInfo) => {
    setPaymentInfo(values);
    next();
  };

  const currencyType = form.watch('currency.type');
  const network = form.watch('currency.network');

  useEffect(() => {
    if (currencyType === Types.RequestLogic.CURRENCY.BTC) {
      form.setValue('currency.network', undefined);
      form.setValue('currency.value', 'BTC');
    } else if (currencyType === Types.RequestLogic.CURRENCY.ISO4217) {
      form.setValue('currency.network', undefined);
    }
  }, [currencyType, form]);

  const currencies = useMemo(() => {
    const currenciesForType = getCurrenciesForType(currencyType);
    if (network) {
      const networkCurrencies = currenciesForType.filter((c) => {
        if ('network' in c) {
          return c.network === network;
        }
        return false;
      });
      return networkCurrencies;
    }
    return currenciesForType;
  }, [currencyType, network]);

  const chains = useMemo(() => {
    return getChainsForCurrency(currencyType);
  }, [currencyType]);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Header
        description='Choose the payment network and currency for your invoice.'
        title='Currency Information'
      />
      <Form {...form}>
        <form className='space-y-1' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='py-2 text-lg font-semibold text-neutral-700'>
            Currency Details
          </div>
          <FormField
            control={form.control}
            name='currency.type'
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Currency Type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='ETH'>
                      Native Token (Ethereum, MATIC, etc.)
                    </SelectItem>
                    <SelectItem value='BTC'>Bitcoin</SelectItem>
                    <SelectItem value='ISO4217'>
                      Fiat Currency (USD, EUR, etc.)
                    </SelectItem>
                    <SelectItem value='ERC20'>
                      ERC20 Token (DAI, USDC, etc.)
                    </SelectItem>
                    <SelectItem value='ERC777'>
                      Superfluid streamable Token (USDCx, DAIx, etc.)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {currencyType !== Types.RequestLogic.CURRENCY.ISO4217 && (
            <FormField
              control={form.control}
              name='currency.network'
              render={({ field }) => (
                <FormItem>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Currency Network (only for tokens)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chains.map((chain) => {
                        return (
                          <SelectItem key={chain.id} value={chain.id}>
                            <div className='flex flex-row items-center gap-2'>
                              <Image
                                alt={chain.name}
                                className='rounded-full'
                                height={24}
                                src={`https://icons.llamao.fi/icons/chains/rsz_${chain.icon}?w=256&h=256`}
                                width={24}
                              />
                              {chain.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name='currency.value'
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Currency Value' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => {
                      return (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.symbol}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='expectedAmount'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Amount Expected in Currency'
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='py-2 text-lg font-semibold text-neutral-700'>
            Payment Network Type
          </div>
          <FormField
            control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Payment Network Id' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(paymentIdDetails).map(([key, value]) => {
                      return (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <PaymentParams />
          <div className='flex items-center gap-3 py-6'>
            <Button type='button' variant='outline' onClick={previous}>
              Previous
            </Button>
            <Button type='submit'>Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
