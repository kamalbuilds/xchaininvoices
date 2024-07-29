// @ts-nocheck
"use client"
import React, { useState } from 'react';
import { SwapSDK, Chains, Assets } from '@chainflip/sdk/swap';
import { useEthers } from '../../lib/hooks/use-ethers';
import { Wallet, getDefaultProvider } from 'ethers';

const SwapComponent = () => {
  const [srcChain, setSrcChain] = useState(Chains.Ethereum);
  const [destChain, setDestChain] = useState(Chains.Bitcoin);
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const { provider, signer } = useEthers();

  const fetchQuote = async () => {
    setLoading(true);
    const swapSDK = new SwapSDK({
      network: 'perseverance',
      signer,
      // signer: new Wallet(
      //   "3dc5a139c3753d94c057555b5773506163d060ee5f30ace701a075ec206bd526",
      //   getDefaultProvider('sepolia'),
      // ),
    });

    try {
      const fetchedQuote = await swapSDK.getQuote({
        srcChain,
        srcAsset: Assets.ETH,
        destChain,
        destAsset: Assets.BTC,
        amount: (amount * 1e18).toString(), // Convert ETH to wei
      });
      setQuote(fetchedQuote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateSwap = async () => {
    setLoading(true);
    const swapSDK = new SwapSDK({
      network: 'perseverance',
      signer,
    });

    try {
      const txHash = await swapSDK.executeSwap({
        srcChain,
        srcAsset: Assets.ETH,
        destChain,
        destAsset: Assets.BTC,
        amount: (amount * 1e18).toString(), // Convert ETH to wei
        destAddress: 'tb1p8p3xsgaeltylmvyrskt3mup5x7lznyrh7vu2jvvk7mn8mhm6clksl5k0sm',
      });
      setTransactionHash(txHash);

      const swapStatus = await swapSDK.getStatus({
        id: txHash,
      });
      setStatus(swapStatus);
    } catch (error) {
      console.error('Error initiating swap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Crypto Swap</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Source Chain:</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            value={srcChain}
            onChange={(e) => setSrcChain(e.target.value)}
          >
            <option value={Chains.Ethereum}>Ethereum</option>
            <option value={Chains.Arbitrum}>Arbitrum</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Destination Chain:</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            value={destChain}
            onChange={(e) => setDestChain(e.target.value)}
          >
            <option value={Chains.Bitcoin}>Bitcoin</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Amount (ETH):</label>
          <input
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          onClick={fetchQuote}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
          disabled={loading}
        >
          Fetch Quote
        </button>

        {quote && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold">Quote:</h3>
            <p>Estimated Amount Received: {quote.estimatedAmountReceived}</p>
            <p>Fee: {quote.fee}</p>
          </div>
        )}

        <button
          onClick={initiateSwap}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          disabled={loading || !quote}
        >
          Initiate Swap
        </button>

        {loading && <p className="text-center mt-4">Loading...</p>}

        {transactionHash && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold">Transaction Hash:</h3>
            <pre className="text-sm break-words">{transactionHash}</pre>
          </div>
        )}

        {status && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold">Swap Status:</h3>
            <pre className="text-sm">{JSON.stringify(status, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapComponent;
