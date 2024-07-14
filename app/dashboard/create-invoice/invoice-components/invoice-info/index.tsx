import React from 'react';
import { useForm } from 'react-hook-form';

import { useInvoiceForm, useRequest } from '~/lib/hooks';
import { getCreateRequestParams } from '~/lib/request';
import { errorHandler, truncate } from '~/lib/utils';
import { type InvoiceInfo, invoiceInfoSchema } from '~/lib/zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

import { Header } from '../header';
import { InvoiceItems } from './invoice-items';

export const InvoiceInfoForm = () => {
  'use no memo';

  const { paymentInfo, invoiceInfo, partyInfo, setInvoiceInfo, previous } =
    useInvoiceForm();

  const { createRequest } = useRequest();

  const form = useForm<InvoiceInfo>({
    resolver: zodResolver(invoiceInfoSchema),
    defaultValues: invoiceInfo ?? {
      meta: { format: 'rnf_invoice', version: '0.0.3' },
      invoiceItems: [
        {
          name: '',
          tax: { amount: '', type: 'percentage' },
          currency: paymentInfo?.currency.value ?? 'USD',
          quantity: 0,
          unitPrice: '0',
        },
      ],
    },
  });

  const onSubmit = async (data: InvoiceInfo) => {
    const id = toast.loading('Creating invoice...');
    try {
      setInvoiceInfo(data);
      if (!partyInfo || !paymentInfo) {
        throw new Error('Missing party or payment info');
      }
      const params = getCreateRequestParams(partyInfo, paymentInfo, data);
      console.log(params);
      const request = await createRequest(
        params.request,
        params.paymentNetwork,
        params.invoice
      );

      toast.success('Invoice created!', {
        id,
        description: truncate(request.requestId),
      });
    } catch (error) {
      toast.error(errorHandler(error), { id });
    }
  };

  return (
    <div className='p-4'>
      <Header
        className='pb-4'
        description='Invoice Details such as invoice number, purchase order id, note, terms, invoice items, payment terms, and miscellaneous information.'
        title='Invoice Information'
      />
      <Form {...form}>
        <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-row items-center justify-between gap-2'>
            <div className=''>
              <FormField
                control={form.control}
                name='invoiceNumber'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <div className='flex flex-row items-center gap-2'>
                      <div className='w-[8rem] font-semibold'>Invoice #</div>
                      <FormControl>
                        <Input placeholder='223' {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col'>
              <div className='pb-[2px] text-sm font-semibold text-neutral-600'>
                Creation Date
              </div>
              <FormField
                control={form.control}
                name='creationDate'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateTimePicker
                        granularity='minute'
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- is undefined if no default value
                        jsDate={new Date(field.value ?? Date.now())}
                        onJsDateChange={(date) =>
                          field.onChange(date.toISOString())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name='purchaseOrderId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order ID (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='8aa9475c-4582-4e1b-bf63-06ce82e02e6b'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InvoiceItems />
          <div className='flex flex-col gap-2'>
            <div className='py-2 text-lg font-semibold text-neutral-700'>
              Payment Terms
            </div>
            <FormField
              control={form.control}
              name='terms'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Payment due in 30 days.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='paymentTerms.dueDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (optional)</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      granularity='minute'
                      jsDate={
                        new Date(
                          field.value ?? Date.now() + 30 * 24 * 60 * 60 * 1000
                        )
                      }
                      onJsDateChange={(date) =>
                        field.onChange(date.toISOString())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='paymentTerms.lateFeesPercent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Fees % (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='2'
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
            <FormField
              control={form.control}
              name='paymentTerms.lateFeesFix'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Fees Fixed (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='17'
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
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Additional notes for the invoice.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type='button'
            variant='secondary'
            onClick={() => {
              const data = form.getValues();
              setInvoiceInfo(data);
            }}
          >
            Save
          </Button>

          <div className='flex flex-row items-center gap-2 py-4'>
            <Button type='button' variant='outline' onClick={previous}>
              Back
            </Button>
            <Button type='submit'>Create Invoice</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
