import { type Types } from '@requestnetwork/request-client.js';

export const paymentIdDetails: Record<
  Types.Extension.PAYMENT_NETWORK_ID,
  string
> = {
  'pn-any-declarative':
    'Payer declares payment sent. Reciever declares payment received.',
  'pn-any-to-erc20-proxy': 'Swap to ERC20 before sending to reciever',
  'pn-any-to-eth-proxy':
    'Swap to native token before sending to reciever. Only works on EVM-compatible chains.',
  'pn-any-to-native-token':
    'Swap to native token before sending to reciever. Only works on NEAR.',
  'pn-bitcoin-address-based':
    'Reciever generates a new Bitcoin address. Use block explorer to detect all payments to that address.',
  'pn-erc20-address-based':
    'Reciever generates a new Ethereum address. Use block explorer to detect all payments to that address.',
  'pn-erc20-fee-proxy-contract':
    'Send ERC20 via smart contract with an optional fee.',
  'pn-erc20-proxy-contract': 'Send ERC20 via smart contract',
  'pn-erc20-transferable-receivable':
    'Mint a Request as an NFT. The holder receives the payment.',
  'pn-erc777-stream': 'Superfluid stream',
  'pn-eth-fee-proxy-contract':
    'Send native token via smart contract with an optional fee.',
  'pn-eth-input-data':
    'Send native token with paymentReference in the call data.',
  'pn-native-token':
    'Send native token via smart contract with an optional fee on NEAR.',
  'pn-testnet-bitcoin-address-based':
    'Reciever generates a new Bitcoin testnet address. Use block explorer to detect all payments to that address.',
};

export const currencyDetails: Record<Types.RequestLogic.CURRENCY, string> = {
  ETH: 'Native Token (Ethereum, MATIC, etc.)',
  BTC: 'Bitcoin',
  ISO4217: 'Fiat Currency (USD, EUR, etc.)',
  ERC20: 'ERC20 Token (DAI, USDC, etc.)',
  ERC777: 'Superfluid streamable Token (ETHx, USDCx, DAIx, etc.)',
};
