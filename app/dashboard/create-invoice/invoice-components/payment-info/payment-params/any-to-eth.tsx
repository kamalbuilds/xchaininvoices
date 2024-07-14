'use client';

import Image from 'next/image';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { VMChains } from '~/lib/chains';
import type { PaymentInfo } from '~/lib/zod';

import { Checkbox } from '~/components/ui/checkbox';
import {
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

export const AnyToEthBased = () => {
  'use no memo';
  const form = useFormContext<PaymentInfo>();

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <div className='flex w-full flex-col gap-1'>
      <FormField
        control={form.control}
        name='parameters.network'
        render={({ field }) => (
          <FormItem>
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Network (Optional)' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VMChains.map((chain) => (
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
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='parameters.paymentAddress'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder='Payments Address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='parameters.feeAddress'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder='Fee Address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='parameters.feeAmount'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder='Fee Amount' type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {showAdvanced ? (
        <>
          <FormField
            control={form.control}
            name='parameters.paymentNetworkName'
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Payment Network (Optional)' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VMChains.map((chain) => (
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
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.maxRateTimespan'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Max Rate Timespan (optional)'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.refundAddress'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Refund Address (optional)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.paymentInfo'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Payment Info (optional)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.refundInfo'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Refund Info (optional)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.recieverDelegate'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Reciever Delegate (optional)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.payerDelegate'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Payer Delegate (optional)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parameters.salt'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Salt (optional)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : null}
      <div className='flex flex-row items-center gap-2'>
        <Checkbox
          checked={showAdvanced}
          id='advanced-options'
          onCheckedChange={(value) => {
            setShowAdvanced(Boolean(value));
          }}
        />
        Show Advanced Options
      </div>
    </div>
  );
};
