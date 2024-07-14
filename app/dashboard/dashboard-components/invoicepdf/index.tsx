'use client';

import { useMemo } from 'react';

import { getAllCurrencies, getCurrencyFromId } from '~/lib/currency';
import { type InvoiceType } from '~/lib/invoice';
import type { InvoiceInfo, PartyInfo, PaymentInfo } from '~/lib/zod';

import { Document, Page, Text, View } from '@react-pdf/renderer';
import { RequestLogicTypes } from '@requestnetwork/types';
import { type IRequestData } from '@requestnetwork/types/dist/client-types';
import { formatUnits } from 'viem';

import {
  Address,
  DateBox,
  ItemsTable,
  Logo,
  Note,
  PaymentDetails,
  PaymentTerms,
  tw,
} from './components';

export interface InvoicePDFProps {
  partyInfo?: PartyInfo;
  paymentInfo?: PaymentInfo;
  invoiceInfo?: InvoiceInfo;
}

export const InvoicePDF = ({
  partyInfo,
  paymentInfo,
  invoiceInfo,
}: InvoicePDFProps) => {
  'use no memo';

  const currency = useMemo(() => {
    return getCurrencyFromId(paymentInfo?.currency.value ?? '');
  }, [paymentInfo?.currency]);

  return (
    <Document>
      <Page style={tw('flex bg-white flex-col border p-12 font-sfProRegular')}>
        <View style={tw('w-full flex flex-row')}>
          <View style={tw('basis-2/6 w-full')}>
            <Logo />
          </View>
          <View style={tw('basis-4/6 w-full flex flex-col gap-3')}>
            <View style={tw('flex flex-row items-center gap-2')}>
              <Text style={tw('text-2xl font-sfProBold text-headings')}>
                Invoice No:{' '}
              </Text>
              <Text style={tw('text-2xl font-sfProBold text-neutral-700')}>
                {invoiceInfo?.invoiceNumber ?? ''}
              </Text>
            </View>
            <View style={tw('flex flex-row items-center gap-2')}>
              <Address type='from' {...partyInfo?.reciever.userInfo} />
              <Address type='to' {...partyInfo?.payer.userInfo} />
            </View>
          </View>
        </View>
        <PaymentDetails
          currency={currency?.symbol ?? ''}
          network={paymentInfo?.currency.network}
          paymentType={paymentInfo?.currency.type}
        />
        <View style={tw('flex flex-row items-center gap-8 pt-20')}>
          <DateBox date={invoiceInfo?.creationDate ?? ''} title='Issue Date' />
          <DateBox
            date={invoiceInfo?.paymentTerms?.dueDate ?? ''}
            title='Due Date'
          />
        </View>
        <View style={tw('flex flex-row items-center gap-8 pt-2')}>
          <View style={tw('basis-4/6 w-full')}>
            <Note text={invoiceInfo?.note ?? ''} />
          </View>
          <View style={tw('basis-2/6 w-full')}>
            <View style={tw('flex flex-col w-full')}>
              <Text style={tw('text-sm font-sfProSemibold text-headings py-1')}>
                Total Due
              </Text>
              <Text style={tw('text-3xl font-sfProBold text-neutral-700')}>
                {`${String(paymentInfo?.expectedAmount ?? '0')} ${currency?.symbol.split('-')[0] ?? ''}`}
              </Text>
            </View>
          </View>
        </View>
        <ItemsTable items={invoiceInfo?.invoiceItems ?? []} />
        <PaymentTerms
          lateFeesFix={invoiceInfo?.paymentTerms?.lateFeesFix}
          lateFeesPercent={invoiceInfo?.paymentTerms?.lateFeesPercent}
          terms={invoiceInfo?.terms}
        />
      </Page>
    </Document>
  );
};

export interface InvoicePDFCreatedProps {
  data: IRequestData;
}

export const InvoicePDFCreated = ({ data }: InvoicePDFCreatedProps) => {
  const invoice = data.contentData as InvoiceType;

  const parsedData = useMemo(() => {
    const currency = getAllCurrencies().find((c) => {
      const isAddress =
        data.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC20 ||
        data.currencyInfo.type === RequestLogicTypes.CURRENCY.ERC777;

      if (isAddress && 'address' in c) {
        return c.address === data.currencyInfo.value;
      }
      return c.symbol === data.currencyInfo.value;
    });

    const i = structuredClone(invoice);

    i.invoiceItems.forEach((item) => {
      item.unitPrice = formatUnits(
        BigInt(item.unitPrice),
        currency?.decimals ?? 18
      );
    });

    return {
      currency,
      items: i.invoiceItems,
    };
  }, [data.currencyInfo.type, data.currencyInfo.value, invoice]);

  const parsedCurrency = formatUnits(
    BigInt(data.expectedAmount),
    parsedData.currency?.decimals ?? 18
  );

  const symbol = parsedData.currency?.symbol.split('-')[0] ?? '';

  return (
    <Document>
      <Page style={tw('flex bg-white flex-col border p-12 font-sfProRegular')}>
        <View style={tw('w-full flex flex-row')}>
          <View style={tw('basis-2/6 w-full flex')}>
            <Logo />
          </View>
          <View style={tw('basis-4/6 w-full flex flex-col gap-3')}>
            <View style={tw('flex flex-row items-center gap-2')}>
              <Text style={tw('text-2xl font-sfProBold text-headings')}>
                Invoice No:{' '}
              </Text>
              <Text style={tw('text-2xl font-sfProBold text-neutral-700')}>
                {invoice.invoiceNumber}
              </Text>
            </View>
            <View style={tw('flex flex-row items-center gap-2')}>
              <Address type='from' {...invoice.sellerInfo} />
              <Address type='to' {...invoice.buyerInfo} />
            </View>
          </View>
        </View>
        <PaymentDetails
          currency={data.currency}
          network={data.currencyInfo.network}
          paymentType={data.currencyInfo.type}
        />
        <View style={tw('flex flex-row items-center gap-8 pt-20')}>
          <DateBox date={invoice.creationDate} title='Issue Date' />
          <DateBox
            date={invoice.paymentTerms?.dueDate ?? ''}
            title='Due Date'
          />
        </View>
        <View style={tw('flex flex-row items-center gap-8 pt-2')}>
          <View style={tw('basis-4/6 w-full')}>
            <Note text={invoice.note ?? ''} />
          </View>
          <View style={tw('basis-2/6 w-full')}>
            <View style={tw('flex flex-col w-full')}>
              <Text style={tw('text-sm font-sfProSemibold text-headings py-1')}>
                Total Due
              </Text>
              <Text style={tw('text-3xl font-sfProBold text-neutral-700')}>
                {`${parsedCurrency} ${symbol}`}
              </Text>
            </View>
          </View>
        </View>
        <ItemsTable items={parsedData.items} />
        <PaymentTerms
          lateFeesFix={invoice.paymentTerms?.lateFeesFix}
          lateFeesPercent={invoice.paymentTerms?.lateFeesPercent}
          terms={invoice.terms}
        />
      </Page>
    </Document>
  );
};
