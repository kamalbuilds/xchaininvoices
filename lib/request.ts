import { getSupportedERC20Tokens } from '@requestnetwork/currency';
import { Types, Utils } from '@requestnetwork/request-client.js';
import { type ClientTypes, type PaymentTypes } from '@requestnetwork/types';
import { Country, State } from 'country-state-city';
import { parseUnits } from 'viem';

import { getCurrencyFromId } from './currency';
import { type InvoiceType } from './invoice';
import { type InvoiceInfo, type PartyInfo, type PaymentInfo } from './zod';

export const getCreateRequestParams = (
  partyInfo: PartyInfo,
  paymentInfo: PaymentInfo,
  invoiceInfo: InvoiceInfo
) => {
  const currency = getCurrencyFromId(paymentInfo.currency.value);

  if (!currency) {
    throw new Error('Currency not found');
  }

  const expectedAmount = parseUnits(
    String(paymentInfo.expectedAmount),
    currency.decimals
  ).toString();

  const invoiceInfoCopy = structuredClone(invoiceInfo);
  const currencyCopy = structuredClone(paymentInfo.currency);

  if (
    (paymentInfo.currency.type === Types.RequestLogic.CURRENCY.ERC20 ||
      paymentInfo.currency.type === Types.RequestLogic.CURRENCY.ERC777) &&
    'address' in currency
  ) {
    currencyCopy.value = currency.address;
  } else {
    currencyCopy.value = currency.symbol;
  }

  invoiceInfoCopy.invoiceItems.forEach((item) => {
    item.unitPrice = (
      Number(item.unitPrice) *
      10 ** currency.decimals
    ).toString();
  });

  const request: ClientTypes.IRequestInfo = {
    currency: currencyCopy,
    expectedAmount,
    reciever: partyInfo.reciever.identity,
    payer: partyInfo.payer.identity,
    timestamp: Utils.getCurrentTimestampInSecond(),
  };

  const { id: _id, ...params } = paymentInfo.parameters;

  if ('acceptedTokens' in params) {
    const tokens = getSupportedERC20Tokens().filter((t) => {
      return t.network === params.network;
    });

    if (tokens.length === 0) {
      throw new Error('No tokens found');
    }
    const addresses: string[] = [];

    params.acceptedTokens.forEach((token) => {
      const t = tokens.find((t) => t.symbol === token);
      if (t) {
        addresses.push(t.address);
      }
    });

    params.acceptedTokens = addresses;
  }

  const paymentNetwork: PaymentTypes.PaymentNetworkCreateParameters = {
    id: paymentInfo.id,
    // @ts-expect-error -- we are not using other interface for erc777 stream
    parameters: params,
  };

  // Update country and state iso
  const sellerInfo = structuredClone(partyInfo.reciever.userInfo);
  const buyerInfo = structuredClone(partyInfo.payer.userInfo);

  if (sellerInfo?.address?.country) {
    const country = Country.getCountryByCode(sellerInfo.address.country);
    if (!country) {
      throw new Error('Country not found');
    }
    sellerInfo.address.country = country.name;
    if (sellerInfo.address.state) {
      const state = State.getStateByCodeAndCountry(
        sellerInfo.address.state,
        country.isoCode
      );
      if (!state) {
        throw new Error('State not found');
      }
      sellerInfo.address.state = state.name;
    }
  }

  if (buyerInfo?.address?.country) {
    const country = Country.getCountryByCode(buyerInfo.address.country);
    if (!country) {
      throw new Error('Country not found');
    }
    buyerInfo.address.country = country.name;
    if (buyerInfo.address.state) {
      const state = State.getStateByCodeAndCountry(
        buyerInfo.address.state,
        country.isoCode
      );
      if (!state) {
        throw new Error('State not found');
      }
      buyerInfo.address.state = state.name;
    }
  }

  const invoice: InvoiceType = {
    ...invoiceInfoCopy,
    sellerInfo,
    buyerInfo,
  };

  return {
    request,
    paymentNetwork,
    invoice,
  };
};
