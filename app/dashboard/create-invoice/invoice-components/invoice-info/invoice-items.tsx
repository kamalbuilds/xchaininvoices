'use client';

/* eslint-disable @typescript-eslint/restrict-template-expressions  -- needed to register fields */
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useInvoiceForm } from '~/lib/hooks';
import type { InvoiceInfo } from '~/lib/zod';

import { Button } from '~/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { PlusIcon, Trash2 } from 'lucide-react';

const calculateTotal = (
  quantity: number | undefined,
  unitPrice: string | undefined,
  discount: string | undefined,
  tax: string | undefined
) => {
  if (!quantity || !unitPrice) {
    return 0;
  }
  let total = quantity * parseFloat(unitPrice);
  if (discount) {
    total -= parseFloat(discount);
  }

  if (tax) {
    // add tax percentage
    total += (parseFloat(tax) / 100) * total;
  }
  return total.toFixed(2);
};

export const InvoiceItems = () => {
  'use no memo';

  const { paymentInfo } = useInvoiceForm();
  const form = useFormContext<InvoiceInfo>();

  const items = useFieldArray({
    control: form.control,
    name: 'invoiceItems',
    rules: {
      minLength: 1,
    },
  });

  return (
    <div className='flex w-full max-w-2xl flex-col gap-1 rounded-lg py-12'>
      <div className='flex justify-end px-2 py-3'>
        <Button
          className='flex flex-row items-center gap-2'
          type='button'
          onClick={() => {
            items.append({
              name: '',
              tax: { amount: '', type: 'percentage' },
              quantity: 0,
              unitPrice: '',
              currency: paymentInfo?.currency.value ?? 'USD',
            });
          }}
        >
          <PlusIcon size={16} />
          <span>Add Item</span>
        </Button>
      </div>
      <Table className='max-w-2xl overflow-hidden rounded-lg'>
        <TableHeader className='rounded-lg bg-primary px-4 py-2 text-center text-sm text-white'>
          <TableRow>
            <TableHead className='w-[100px] !text-sm text-white'>
              Name
            </TableHead>
            <TableHead className='!text-sm text-white'>QTY</TableHead>
            <TableHead className='!text-sm text-white'>Price</TableHead>
            <TableHead className='!text-sm text-white'>Discount</TableHead>
            <TableHead className='!text-sm text-white'>%Tax</TableHead>
            <TableHead className='!text-sm text-white'>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.fields.map((field, index) => {
            const quantity = form.watch(`invoiceItems.${index}.quantity`);
            const unitPrice = form.watch(`invoiceItems.${index}.unitPrice`);
            const discount = form.watch(`invoiceItems.${index}.discount`);
            const tax = form.watch(`invoiceItems.${index}.tax.amount`);

            return (
              <TableRow key={field.id} className='w-full'>
                <TableCell className='w-[12rem] px-1'>
                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            className='w-full border-gray-100'
                            placeholder='Item Name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className='px-1'>
                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            className='border-gray-100'
                            placeholder='3'
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className='px-1'>
                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className='w-[5rem]'>
                        <FormControl>
                          <Input
                            className='border-gray-100'
                            placeholder='45'
                            type='number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className='px-1'>
                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.discount`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            className='border-gray-100'
                            placeholder='12'
                            type='number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className='px-1'>
                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.tax.amount`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            className='border-gray-100'
                            placeholder='4'
                            type='number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className='px-1 text-center'>
                  <div className='flex flex-row items-center justify-around gap-2'>
                    <div className='text-sm font-medium'>
                      {calculateTotal(quantity, unitPrice, discount, tax)}
                    </div>
                    <Button
                      className='h-5 w-5 p-0 text-red-500'
                      type='button'
                      variant='ghost'
                      onClick={() => items.remove(index)}
                    >
                      <Trash2 className='text-red-500' size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
