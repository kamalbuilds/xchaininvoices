import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type PaymentInfo } from '~/lib/zod';

import { Types } from '@requestnetwork/request-client.js';

import { AddressBasedParams } from './address-based';
import { AnyDeclarativeParams } from './any-declarative';
import { AnyToAnyBased } from './any-to-any';
import { AnyToERC20Based } from './any-to-erc20';
import { AnyToEthBased } from './any-to-eth';
import { FeeReferenceBasedParams } from './fee-reference-based';
import { ReferenceBasedParams } from './reference-based';
import { StreamBased } from './stream-based';

const PAYMENT_NETWORK_ID = Types.Extension.PAYMENT_NETWORK_ID;

export const PaymentParams = () => {
  const form = useFormContext<PaymentInfo>();

  const id = form.watch('id');

  if (id === PAYMENT_NETWORK_ID.ANY_DECLARATIVE) {
    form.setValue('parameters.id', 'pn-any-declarative');
    return <AnyDeclarativeParams />;
  } else if (
    id === PAYMENT_NETWORK_ID.BITCOIN_ADDRESS_BASED ||
    id === PAYMENT_NETWORK_ID.TESTNET_BITCOIN_ADDRESS_BASED ||
    id === PAYMENT_NETWORK_ID.ERC20_ADDRESS_BASED
  ) {
    form.setValue('parameters.id', 'pn-address-based');
    return <AddressBasedParams />;
  } else if (
    id === PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT ||
    id === PAYMENT_NETWORK_ID.ETH_INPUT_DATA ||
    id === PAYMENT_NETWORK_ID.NATIVE_TOKEN
  ) {
    form.setValue('parameters.id', 'pn-reference-based');
    return <ReferenceBasedParams />;
  } else if (
    id === PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT ||
    id === PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT ||
    id === PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE
  ) {
    form.setValue('parameters.id', 'pn-fee-reference-based');
    return <FeeReferenceBasedParams />;
  } else if (id === PAYMENT_NETWORK_ID.ERC777_STREAM) {
    form.setValue('parameters.id', 'pn-stream-reference-based');
    return <StreamBased />;
  } else if (id === PAYMENT_NETWORK_ID.ANY_TO_NATIVE_TOKEN) {
    form.setValue('parameters.id', 'pn-any-to-any-conversion');
    return <AnyToAnyBased />;
  } else if (id === PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY) {
    form.setValue('parameters.id', 'pn-any-to-erc20');
    return <AnyToERC20Based />;
  }

  form.setValue('parameters.id', 'pn-any-to-eth');
  return <AnyToEthBased />;

  return null;
};
