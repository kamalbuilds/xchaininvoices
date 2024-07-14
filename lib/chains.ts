import { RequestLogicTypes } from '@requestnetwork/types';

export const EVMChains = [
  {
    id: 'mainnet',
    name: 'Ethereum',
    icon: 'ethereum',
  },
  {
    id: 'rinkeby',
    name: 'Ethereum Rinkeby',
    icon: 'ethereum',
  },
  {
    id: 'bsc',
    name: 'Binance Smart Chain',
    icon: 'bsc',
  },
  {
    id: 'bsctest',
    name: 'Binance Smart Chain Testnet',
    icon: 'bsc',
  },
  {
    id: 'matic',
    name: 'Polygon',
    icon: 'polygon',
  },
  {
    id: 'optimism',
    name: 'Optimism',
    icon: 'optimism',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    icon: 'avalanche',
  },
  {
    id: 'sepolia',
    name: 'Sepolia',
    icon: 'ethereum',
  },
  {
    id: 'zksyncera',
    name: 'zkSync Mainnet',
    icon: 'zksync era',
  },
  {
    id: 'zksynceratestnet',
    name: 'zkSync Testnet',
    icon: 'zksync era',
  },
  {
    id: 'base',
    name: 'Base',
    icon: 'base',
  },
] as const;

export const BtcChains = [
  {
    id: 'mainnet',
    name: 'Bitcoin',
    icon: 'bitcoin',
  },
  {
    id: 'testnet',
    name: 'Bitcoin Testnet',
    icon: 'bitcoin',
  },
] as const;

export const DeclarativeChains = [
  {
    id: 'tron',
    name: 'Tron',
    icon: 'tron',
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: 'solana',
  },
] as const;

export const NearChains = [
  {
    id: 'aurora',
    name: 'Aurora',
    icon: 'aurora',
  },
  {
    id: 'aurora-testnet',
    name: 'Aurora Testnet',
    icon: 'aurora',
  },
  {
    id: 'near',
    name: 'NEAR',
    icon: 'near',
  },
  {
    id: 'near-testnet',
    name: 'NEAR Testnet',
    icon: 'near',
  },
] as const;
export const VMChains = [...EVMChains, ...NearChains] as const;

export const ChainNames = [
  ...EVMChains,
  ...BtcChains,
  ...NearChains,
  ...DeclarativeChains,
] as const;

export const getChainsForCurrency = (currency: RequestLogicTypes.CURRENCY) => {
  if (currency === RequestLogicTypes.CURRENCY.BTC) {
    return BtcChains;
  } else if (
    currency === RequestLogicTypes.CURRENCY.ETH ||
    currency === RequestLogicTypes.CURRENCY.ERC20 ||
    currency === RequestLogicTypes.CURRENCY.ERC777
  ) {
    return EVMChains;
  }
  return [];
};
