import { useMemo } from 'react';

import {
  approveErc20,
  encodePayErc777StreamRequest,
  hasErc20Approval,
  payRequest,
  prepareApproveErc20,
} from '@requestnetwork/payment-processor';
import { validateRequest } from '@requestnetwork/payment-processor/dist/payment/utils';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import {
  type ClientTypes,
  ExtensionTypes,
  type PaymentTypes,
} from '@requestnetwork/types';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import sfMetadata from '@superfluid-finance/metadata';
import { Framework } from '@superfluid-finance/sdk-core';
import { BigNumber } from 'ethers';
import { toast } from 'sonner';
import { useAccount, useWalletClient } from 'wagmi';

import { type InvoiceType } from '../invoice';
import { errorHandler } from '../utils';
import { useEthers } from './use-ethers';

export const useRequest = () => {
  const { data: walletClient } = useWalletClient();
  const { provider, signer } = useEthers();
  const { address } = useAccount();

  const data = useMemo(() => {
    if (walletClient) {
      const signatureProvider = new Web3SignatureProvider(walletClient);
      const client = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: 'https://sepolia.gateway.request.network/',
        },
        signatureProvider,
      });

      return {
        signatureProvider,
        client,
      };
    }
  }, [walletClient]);

  const createRequest = async (
    requestInfo: ClientTypes.IRequestInfo,
    paymentNetwork: PaymentTypes.PaymentNetworkCreateParameters,
    invoice: InvoiceType
  ) => {
    if (!provider) {
      throw new Error('Connect wallet to create Invoice');
    }
    if (!data) {
      throw new Error('Request client not initialized');
    }
    if (!requestInfo.reciever) {
      throw new Error('Missing reciever');
    }

    const request = await data.client.createRequest({
      requestInfo,
      paymentNetwork,
      signer: requestInfo.reciever,
      contentData: invoice,
    });

    await request.waitForConfirmation();
    return request;
  };

  const getAllRequestsData = async (from?: number, to?: number) => {
    if (!data) return;
    if (!address) return;

    try {
      const res = await data.client.fromIdentity(
        {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        },
        {
          from,
          to,
        }
      );

      const requestsData = res.map((request) => request.getData());

      return requestsData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const getRequestById = async (requestID: string) => {
    if (!data) return;
    if (!signer) return;
    if (!provider) return;

    const request = await data.client.fromRequestId(requestID);

    return request;
  };

  const payERC777 = async (requestID: string, toastId: string | number) => {
    try {
      if (!data) {
        throw new Error('Request client not initialized');
      }
      if (!address) {
        throw new Error('Connect wallet to pay Invoice');
      }
      if (!signer) {
        throw new Error('Connect wallet to pay Invoice');
      }
      const request = await data.client.fromRequestId(requestID);
      const requestData = request.getData();
      validateRequest(
        requestData,
        ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM
      );

      const chainId = (await signer.provider.getNetwork()).chainId;
      const resolverAddress =
        sfMetadata.getNetworkByChainId(chainId)?.contractsV1.resolver;

      const sf = await Framework.create({
        chainId,
        provider: signer.provider,
        resolverAddress,
      });

      // @ts-expect-error -- TS CONVERSION ERROR
      const encodedTx = await encodePayErc777StreamRequest(requestData, sf);

      const params = {
        data: encodedTx,
        to: sf.host.contract.address,
        value: 0,
      };

      const res = await signer.sendTransaction(params);
      const receipt = await res.wait(2);

      toast.success('Invoice Paid', {
        id: toastId,
        description: receipt.transactionHash,
      });
    } catch (error) {
      toast.error(errorHandler(error), { id: toastId });
    }
  };

  const pay = async (requestID: string, amount?: string) => {
    const id = toast.loading('Paying Invoice');
    try {
      if (!data) {
        throw new Error('Request client not initialized');
      }
      if (!address) {
        throw new Error('Connect wallet to pay Invoice');
      }
      if (!signer) {
        throw new Error('Connect wallet to pay Invoice');
      }

      const request = await data.client.fromRequestId(requestID);
      const requestData = request.getData();

      if (
        requestData.currencyInfo.type === Types.RequestLogic.CURRENCY.ERC777
      ) {
        await payERC777(requestID, id);
        return;
      }

      if (requestData.currencyInfo.type === Types.RequestLogic.CURRENCY.ERC20) {
        const hasApproval = await hasErc20Approval(
          requestData,
          address,
          signer
        );

        if (!hasApproval) {
          const prepared = prepareApproveErc20(
            requestData,
            signer,
            undefined,
            BigNumber.from(amount)
          );

          console.log(prepared);
          toast.loading('Approving ERC20', { id });
          const r = await approveErc20(
            requestData,
            signer,
            undefined,
            BigNumber.from(amount)
          );

          await r.wait(2);
          toast.loading('Approved ERC20', { id });
        }
      }

      const res = await payRequest(requestData, signer, amount, {
        gasLimit: 1000000,
      });
      const receipt = await res.wait(2);

      toast.success('Invoice Paid', {
        id,
        description: receipt.transactionHash,
      });
    } catch (error) {
      toast.error(errorHandler(error), { id });
    }
  };

  return {
    createRequest,
    getAllRequestsData,
    pay,
    data,
    getRequestById,
    payERC777,
  };
};
