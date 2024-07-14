import {
  type CurrencyInput,
  CurrencyManager,
  type ERC20CurrencyInput,
  type ERC777CurrencyInput,
  type ISO4217CurrencyInput,
  type NativeCurrencyInput,
} from '@requestnetwork/currency';
import { RequestLogicTypes } from '@requestnetwork/types';

export type CurrencyDefinition<T> = T & {
  id: string;
  hash: string;
  meta: unknown;
};

export const getAllCurrencies = () => {
  const initial = CurrencyManager.getDefaultList();
  const toRemove = ['fUSDT-sepolia', 'fUSDC-sepolia'];

  const filtered = initial.filter((c) => !toRemove.includes(c.id));
  const toAdd = [
    {
      id: 'fUSDT-sepolia',
      hash: '0xF046b3CA5ae2879c6bAcC4D42fAF363eE8379F78',
      address: '0xF046b3CA5ae2879c6bAcC4D42fAF363eE8379F78',
      network: 'sepolia',
      decimals: 6,
      symbol: 'fUSDT',
      type: RequestLogicTypes.CURRENCY.ERC20,
    },
    {
      id: 'fUSDC-sepolia',
      hash: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      network: 'sepolia',
      decimals: 6,
      symbol: 'fUSDC',
      type: RequestLogicTypes.CURRENCY.ERC20,
    },
    {
      id: 'ETHx-sepolia',
      hash: '0x30a6933Ca9230361972E413a15dC8114c952414e',
      address: '0x30a6933Ca9230361972E413a15dC8114c952414e',
      network: 'sepolia',
      decimals: 18,
      symbol: 'ETHx',
      type: RequestLogicTypes.CURRENCY.ERC777,
      meta: undefined,
    },
  ];

  return [...filtered, ...toAdd];
};

export function getCurrenciesForType(
  type: RequestLogicTypes.CURRENCY
): CurrencyDefinition<CurrencyInput>[];
export function getCurrenciesForType(
  type: RequestLogicTypes.CURRENCY.BTC | RequestLogicTypes.CURRENCY.ETH
): CurrencyDefinition<NativeCurrencyInput>[];
export function getCurrenciesForType(
  type: RequestLogicTypes.CURRENCY.ISO4217
): CurrencyDefinition<ISO4217CurrencyInput>[];
export function getCurrenciesForType(
  type: RequestLogicTypes.CURRENCY.ERC20
): CurrencyDefinition<ERC20CurrencyInput>[];
export function getCurrenciesForType(
  type: RequestLogicTypes.CURRENCY.ERC777
): CurrencyDefinition<ERC777CurrencyInput>[];

export function getCurrenciesForType(type: RequestLogicTypes.CURRENCY) {
  const filtered = getAllCurrencies().filter((c) => c.type === type);

  if (
    type === RequestLogicTypes.CURRENCY.BTC ||
    type === RequestLogicTypes.CURRENCY.ETH
  ) {
    return filtered as CurrencyDefinition<NativeCurrencyInput>[];
  } else if (type === RequestLogicTypes.CURRENCY.ISO4217) {
    return filtered as CurrencyDefinition<ISO4217CurrencyInput>[];
  } else if (type === RequestLogicTypes.CURRENCY.ERC20) {
    return filtered as CurrencyDefinition<ERC20CurrencyInput>[];
  }

  return filtered as CurrencyDefinition<ERC777CurrencyInput>[];
}

export const getCurrencyFromId = (id: string) => {
  return getAllCurrencies().find((c) => c.id === id);
};
