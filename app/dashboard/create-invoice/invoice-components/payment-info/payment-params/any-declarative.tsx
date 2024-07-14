'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { type PaymentInfo } from '~/lib/zod';

import { Checkbox } from '~/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

export const AnyDeclarativeParams = () => {
  'use no memo';
  const form = useFormContext<PaymentInfo>();

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <div className='flex w-full flex-col gap-1'>
      {showAdvanced ? (
        <>
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
