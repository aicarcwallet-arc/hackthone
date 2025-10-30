import { useState, useMemo } from 'react';
import { ArrowDownUp, Loader2, CheckCircle, XCircle, ExternalLink, Repeat, Gift } from 'lucide-react';
import { useBridge } from '../hooks/useBridge';
import { useAICToken } from '../hooks/useAICToken';
import { SUPPORTED_CHAINS, CHAIN_OPTIONS, ARC_TESTNET_CHAIN_ID } from '../config/chains';
import { getTokenAddress, getAvailableTokensForChain } from '../config/tokens';
import { supabase } from '../lib/supabase';

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
  const { aicBalance, usdcBalance, loading: swapLoading, swapAICForUSDC, refreshBalances } = useAICToken(connectedAddress || undefined);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapTxHash, setSwapTxHash] = useState<string>('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState<string>('');
  const [unclaimedAIC, setUnclaimedAIC] = useState<number>(0);

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
        await checkUnclaimedAIC(accounts[0]);
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert(err.message || 'Failed to connect wallet');
    }
  };

  const checkUnclaimedAIC = async (address: string) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('total_aic_earned, claimed_aic')
        .eq('wallet_address', address.toLowerCase())
        .maybeSingle();

      if (data) {
        const earned = parseFloat(data.total_aic_earned || '0');
        const claimed = parseFloat(data.claimed_aic || '0');
        setUnclaimedAIC(earned - claimed);
      }
    } catch (err) {
      console.error('Error checking unclaimed AIC:', err);
    }
  };

  const handleClaimAIC = async () => {
    if (!connectedAddress) return;

    setClaimLoading(true);
    setClaimSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mint-aic-tokens`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ walletAddress: connectedAddress }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to claim AIC');
      }

      setClaimTxHash(result.txHash);
      setClaimSuccess(true);
      setUnclaimedAIC(0);
      await refreshBalances();
    } catch (err: any) {
      console.error('Claim error:', err);
      alert(err.message || 'Failed to claim AIC tokens');
    } finally {
      setClaimLoading(false);
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
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">Circle Bridge Kit</h2>
        <p className="text-xs sm:text-sm text-gray-300 font-medium">
          Bridge USDC across chains • All transactions on Arc Testnet
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Powered by Circle CCTP Protocol
        </p>
      </div>

      {!connectedAddress ? (
        <button
          onClick={handleConnectWallet}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] mb-4 sm:mb-6 touch-manipulation"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="mb-4 sm:mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-xs sm:text-sm text-green-300 font-medium">
              Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
            </p>
          </div>

          <div className="mb-4 sm:mb-6 space-y-3">
            {unclaimedAIC > 0 && (
              <div className="p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg backdrop-blur-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Unclaimed AIC (from game)</span>
                  <span className="text-lg font-bold text-yellow-300">{unclaimedAIC.toFixed(2)} AIC</span>
                </div>
                <button
                  onClick={handleClaimAIC}
                  disabled={claimLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
                >
                  {claimLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Claiming on Arc...</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4" />
                      <span className="text-sm">Claim AIC Tokens to Wallet</span>
                    </>
                  )}
                </button>
                {claimSuccess && claimTxHash && (
                  <div className="p-2 bg-green-500/20 border border-green-500/30 rounded text-center">
                    <p className="text-xs text-green-300">✅ Claimed successfully!</p>
                    <a
                      href={`https://testnet.arcscan.com/tx/${claimTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-1 mt-1"
                    >
                      View on Arc Explorer
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                <p className="text-xs text-gray-400 text-center">Step 1: Claim your earned AIC from the game to your wallet</p>
              </div>
            )}

            <div className="p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Your AIC Balance (on-chain)</span>
                <span className="text-lg font-bold text-cyan-300">{aicBalance} AIC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Your USDC Balance</span>
                <span className="text-lg font-bold text-green-300">{parseFloat(usdcBalance).toFixed(2)} USDC</span>
              </div>
              {parseFloat(aicBalance) > 0 && (
                <>
                  <button
                    onClick={async () => {
                      try {
                        setSwapSuccess(false);
                        const hash = await swapAICForUSDC(aicBalance);
                        setSwapTxHash(hash);
                        setSwapSuccess(true);
                      } catch (err: any) {
                        alert(err.message || 'Swap failed');
                      }
                    }}
                    disabled={swapLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
                  >
                    {swapLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Swapping on Arc...</span>
                      </>
                    ) : (
                      <>
                        <Repeat className="w-4 h-4" />
                        <span className="text-sm">Step 2: Convert AIC to USDC</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">⚡ Low gas fees • Flash transaction on Arc Layer 1</p>
                </>
              )}
              {swapSuccess && swapTxHash && (
                <div className="p-2 bg-green-500/20 border border-green-500/30 rounded text-center">
                  <p className="text-xs text-green-300">✅ Swap successful on Arc!</p>
                  <a
                    href={`https://testnet.arcscan.com/tx/${swapTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-1 mt-1"
                  >
                    View on Arc Explorer
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-cyan-500/30 text-white rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 touch-manipulation"
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
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            From Chain
          </label>
          <select
            value={fromChain}
            onChange={(e) => setFromChain(Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-cyan-500/30 text-white rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 touch-manipulation"
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
            className="p-2 hover:bg-cyan-500/20 active:bg-cyan-500/30 rounded-full transition-colors touch-manipulation"
            disabled={isLoading}
          >
            <ArrowDownUp className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            To Chain
          </label>
          <select
            value={toChain}
            onChange={(e) => setToChain(Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-cyan-500/30 text-white rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 touch-manipulation"
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
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Amount ({selectedToken})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-cyan-500/30 text-white rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 touch-manipulation placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleBridge}
          disabled={isLoading || !connectedAddress}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2 touch-manipulation"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm sm:text-base">Sign in MetaMask</span>
            </>
          ) : (
            `Bridge ${selectedToken}`
          )}
        </button>
        {!isLoading && connectedAddress && amount && parseFloat(amount) > 0 && (
          <p className="text-xs text-gray-400 text-center mt-2 px-2">
            ⚠️ MetaMask signature required
          </p>
        )}
      </div>

      {status === 'success' && txHash && (
        <div className="mt-4 sm:mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-300 mb-1">✅ Bridge Successful!</p>
            </div>
          </div>
          <div className="bg-gray-800/50 p-2 rounded">
            <p className="text-xs text-gray-400 mb-1">Transaction Hash (Arc Testnet):</p>
            <p className="text-xs font-mono text-cyan-300 break-all">{txHash}</p>
          </div>
          <div className="flex flex-wrap gap-2">
              {getExplorerUrl(fromChain, txHash) && (
                <a
                  href={getExplorerUrl(fromChain, txHash)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 px-3 py-2 rounded-lg text-sm inline-flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Arc Explorer
                </a>
              )}
              <button
                onClick={reset}
                className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Bridge Again
              </button>
            </div>
        </div>
      )}

      {status === 'error' && error && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-900/30 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-300 mb-1">Bridge Failed</p>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={reset}
                className="mt-2 text-sm text-red-400 hover:text-red-300 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-cyan-500/20">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-400">Protocol</span>
          <span className="font-medium text-white">Circle CCTP</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Estimated Time</span>
          <span className="font-medium text-white">10-20 minutes</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Bridge Fee</span>
          <span className="font-medium text-white">Network gas only</span>
        </div>
      </div>
    </div>
  );
}
