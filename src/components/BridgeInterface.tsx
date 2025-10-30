import { useState, useMemo } from 'react';
import { ArrowDownUp, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useBridge } from '../hooks/useBridge';
import { SUPPORTED_CHAINS, CHAIN_OPTIONS, ARC_TESTNET_CHAIN_ID } from '../config/chains';
import { getTokenAddress, getAvailableTokensForChain } from '../config/tokens';

export function BridgeInterface() {
  const [fromChain, setFromChain] = useState(ARC_TESTNET_CHAIN_ID);
  const [toChain, setToChain] = useState(11155111);
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const availableTokens = useMemo(
    () => getAvailableTokensForChain(fromChain),
    [fromChain]
  );

  const { isLoading, error, txHash, status, bridgeTokens, reset } = useBridge();

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

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    console.log('Bridge button clicked');

    if (!connectedAddress) {
      console.log('No wallet connected, prompting connection');
      await handleConnectWallet();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const tokenAddress = getTokenAddress(selectedToken, fromChain);
    if (!tokenAddress) {
      alert(`${selectedToken} not available on selected chain`);
      return;
    }

    try {
      console.log('Starting bridge:', { fromChain, toChain, amount, tokenAddress });
      await bridgeTokens(fromChain, toChain, amount, tokenAddress as `0x${string}`);
      console.log('Bridge successful');
    } catch (err: any) {
      console.error('Bridge failed:', err);
    }
  };

  const getExplorerUrl = (chainId: number, txHash: string) => {
    const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
    return chain?.blockExplorers?.default?.url
      ? `${chain.blockExplorers.default.url}/tx/${txHash}`
      : null;
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Circle Bridge Kit</h2>
        <p className="text-xs sm:text-sm text-gray-700 font-medium">
          Bridge USDC across chains • All transactions on Arc Testnet
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Powered by Circle CCTP Protocol
        </p>
      </div>

      {!connectedAddress ? (
        <button
          onClick={handleConnectWallet}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl mb-4 sm:mb-6 touch-manipulation"
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
            Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            disabled={isLoading}
          >
            {availableTokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            From Chain
          </label>
          <select
            value={fromChain}
            onChange={(e) => setFromChain(Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            disabled={isLoading}
          >
            {CHAIN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwapChains}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors touch-manipulation"
            disabled={isLoading}
          >
            <ArrowDownUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            To Chain
          </label>
          <select
            value={toChain}
            onChange={(e) => setToChain(Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            disabled={isLoading}
          >
            {CHAIN_OPTIONS.filter((option) => option.value !== fromChain).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Amount ({selectedToken})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleBridge}
          disabled={isLoading || !connectedAddress}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 touch-manipulation"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Bridging...
            </>
          ) : (
            `Bridge ${selectedToken}`
          )}
        </button>
      </div>

      {status === 'success' && txHash && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900 mb-1">Bridge Successful!</p>
              <p className="text-sm text-green-700 break-all mb-2">
                Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
              {getExplorerUrl(fromChain, txHash) && (
                <a
                  href={getExplorerUrl(fromChain, txHash)!}
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
                Bridge Again
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && error && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900 mb-1">Bridge Failed</p>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={reset}
                className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">Protocol</span>
          <span className="font-medium text-gray-900">Circle CCTP</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Estimated Time</span>
          <span className="font-medium text-gray-900">10-20 minutes</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Bridge Fee</span>
          <span className="font-medium text-gray-900">Network gas only</span>
        </div>
      </div>
    </div>
  );
}
