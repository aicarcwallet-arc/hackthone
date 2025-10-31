import { useState, useEffect, useMemo } from 'react';
import { ArrowDownUp, Loader2, CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';
import { useSwap } from '../hooks/useSwap';
import { useNetworkCheck } from '../hooks/useNetworkCheck';
import { SUPPORTED_CHAINS, ARC_TESTNET_CHAIN_ID } from '../config/chains';
import { getAvailableTokensForChain } from '../config/tokens';
import { NetworkStatusBanner } from './NetworkStatusBanner';

export function SwapInterface() {
  const [chainId, setChainId] = useState(ARC_TESTNET_CHAIN_ID);
  const [fromToken, setFromToken] = useState('USDC');
  const [toToken, setToToken] = useState('AIC');
  const [amount, setAmount] = useState('');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const { isLoading, error, txHash, status, tokenBalances, swapTokens, getBalance, reset } = useSwap();
  const { isCorrectNetwork, switchToArcTestnet } = useNetworkCheck();

  const availableTokens = useMemo(
    () => getAvailableTokensForChain(chainId),
    [chainId]
  );

  const toTokenOptions = useMemo(
    () => availableTokens.filter((token) => token.symbol !== fromToken),
    [availableTokens, fromToken]
  );

  useEffect(() => {
    if (connectedAddress && chainId) {
      getBalance(fromToken, chainId, connectedAddress as `0x${string}`);
      getBalance(toToken, chainId, connectedAddress as `0x${string}`);
    }
  }, [connectedAddress, chainId, fromToken, toToken, getBalance]);

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask or another Web3 wallet');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts && accounts.length > 0) {
        setConnectedAddress(accounts[0]);
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert(err.message || 'Failed to connect wallet');
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSwap = async () => {
    if (!connectedAddress) {
      await handleConnectWallet();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!isCorrectNetwork) {
      try {
        await switchToArcTestnet();
      } catch (err) {
        console.error('Failed to switch network:', err);
        return;
      }
    }

    try {
      await swapTokens(fromToken, toToken, amount, chainId);
    } catch (err: any) {
      console.error('Swap failed:', err);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
    return chain?.blockExplorers?.default?.url
      ? `${chain.blockExplorers.default.url}/tx/${txHash}`
      : null;
  };

  const fromBalance = tokenBalances[`${fromToken}-${chainId}`] || '0';
  const toBalance = tokenBalances[`${toToken}-${chainId}`] || '0';

  return (
    <>
      <NetworkStatusBanner />
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Token Swap</h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Swap tokens on Arc Testnet
        </p>
      </div>

      {!connectedAddress ? (
        <button
          onClick={handleConnectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4 sm:mb-6 touch-manipulation"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-4 sm:mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs sm:text-sm text-green-800 font-medium">
            Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </p>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Network
          </label>
          <select
            value={chainId}
            onChange={(e) => setChainId(Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            disabled={isLoading}
          >
            <option value={ARC_TESTNET_CHAIN_ID}>Arc Testnet</option>
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">From</label>
            {connectedAddress && (
              <span className="text-xs text-gray-500">
                Balance: {parseFloat(fromBalance).toFixed(4)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex-1 px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
              disabled={isLoading}
            >
              {availableTokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="flex-1 px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwapTokens}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors touch-manipulation"
            disabled={isLoading}
          >
            <ArrowDownUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">To</label>
            {connectedAddress && (
              <span className="text-xs text-gray-500">
                Balance: {parseFloat(toBalance).toFixed(4)}
              </span>
            )}
          </div>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            disabled={isLoading}
          >
            {toTokenOptions.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-800">
            Token swaps require DEX integration. Use the Bridge to transfer tokens between chains, or add liquidity to a DEX on Arc Testnet.
          </p>
        </div>

        <button
          onClick={handleSwap}
          disabled={isLoading || !connectedAddress}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Swapping...
            </>
          ) : (
            'Swap Tokens'
          )}
        </button>
      </div>

      {status === 'success' && txHash && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900 mb-1">Swap Successful!</p>
              <p className="text-sm text-green-700 break-all mb-2">
                Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
              {getExplorerUrl(txHash) && (
                <a
                  href={getExplorerUrl(txHash)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium"
                >
                  View on Explorer
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={reset}
                className="block mt-2 text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Swap Again
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900 mb-1">Swap Not Available</p>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={reset}
                className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Your AIC Token</span>
          <span className="font-mono text-xs text-gray-900">0x394E...489A</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Network</span>
          <span className="font-medium text-gray-900">Arc Testnet</span>
        </div>
      </div>
      </div>
    </>
  );
}
