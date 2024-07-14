import { useMemo } from 'react';

import { providers } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { useClient, useConnectorClient } from 'wagmi';

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- safe
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- safe
  return new providers.JsonRpcProvider(transport.url, network);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useEthers({ chainId }: { chainId?: number | undefined } = {}) {
  const client = useClient({ chainId });
  const { data: signerClient } = useConnectorClient({ chainId });

  const provider = useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client]
  );

  const signer = useMemo(
    () => (signerClient ? clientToSigner(signerClient) : undefined),
    [signerClient]
  );

  return { provider, signer };
}
