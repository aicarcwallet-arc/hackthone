import { useState, useMemo } from 'react';
import { ArrowDownUp, Loader2, CheckCircle, XCircle, ExternalLink, Repeat, Gift, AlertCircle, RefreshCw } from 'lucide-react';
import { useBridge } from '../hooks/useBridge';
import { useAICToken } from '../hooks/useAICToken';
import { SUPPORTED_CHAINS, BRIDGE_CHAIN_OPTIONS, ARC_TESTNET_CHAIN_ID } from '../config/chains';
import { getTokenAddress, getBridgeableTokensForChain } from '../config/tokens';
import { supabase } from '../lib/supabase';

export function BridgeInterface() {
  const [fromChain, setFromChain] = useState(11155111); // Ethereum Sepolia (Circle CCTP supported)
  const [toChain, setToChain] = useState(84532); // Base Sepolia
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const availableTokens = useMemo(
    () => getBridgeableTokensForChain(fromChain),
    [fromChain]
  );

  const { isLoading, error, txHash, status, bridgeTokens, reset } = useBridge();
  const { aicBalance, usdcBalance, refreshBalances } = useAICToken(connectedAddress || undefined);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapTxHash, setSwapTxHash] = useState<string>('');
  const [swapLoading, setSwapLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState<string>('');
  const [unclaimedAIC, setUnclaimedAIC] = useState<number>(0);
  const [unclaimedUSDC, setUnclaimedUSDC] = useState<number>(0);
  const [usdcClaimLoading, setUsdcClaimLoading] = useState(false);
  const [usdcClaimSuccess, setUsdcClaimSuccess] = useState(false);
  const [usdcClaimTxHash, setUsdcClaimTxHash] = useState<string>('');

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
        await checkUnclaimedRewards(accounts[0]);
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert(err.message || 'Failed to connect wallet');
    }
  };

  const checkUnclaimedRewards = async (address: string) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('total_aic_earned, claimed_aic, total_usdc_earned, claimed_usdc')
        .eq('wallet_address', address.toLowerCase())
        .maybeSingle();

      if (data) {
        const aicEarned = parseFloat(data.total_aic_earned || '0');
        const aicClaimed = parseFloat(data.claimed_aic || '0');
        setUnclaimedAIC(aicEarned - aicClaimed);

        const usdcEarned = parseFloat(data.total_usdc_earned || '0');
        const usdcClaimed = parseFloat(data.claimed_usdc || '0');
        setUnclaimedUSDC(usdcEarned - usdcClaimed);
      }
    } catch (err) {
      console.error('Error checking unclaimed rewards:', err);
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

  const handleClaimUSDC = async () => {
    if (!connectedAddress) return;

    setUsdcClaimLoading(true);
    setUsdcClaimSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cctp-mint-reward`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            walletAddress: connectedAddress,
            sourceChain: 'baseSepolia'
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to claim USDC via CCTP');
      }

      setUsdcClaimTxHash(result.burnTxHash);
      setUsdcClaimSuccess(true);
      setUnclaimedUSDC(0);
      await refreshBalances();

      alert(`✅ Success!\n\n${result.message}\n\nBurn TX: ${result.burnTxHash.slice(0, 10)}...\nFee: ${result.fee} USDC\nArrival: ${result.attestation.estimatedArrival}`);
    } catch (err: any) {
      console.error('CCTP Claim error:', err);
      alert(`❌ CCTP Error:\n\n${err.message}\n\nMake sure the CCTP treasury wallet on Base Sepolia has USDC!\n\nGet testnet USDC: https://faucet.circle.com`);
    } finally {
      setUsdcClaimLoading(false);
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
      // Check if wallet is on the correct chain
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainIdDecimal = parseInt(currentChainId as string, 16);

        if (currentChainIdDecimal !== fromChain) {
          console.log(`Switching from chain ${currentChainIdDecimal} to ${fromChain}`);

          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${fromChain.toString(16)}` }],
            });

            // Wait a bit for the switch to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (switchError: any) {
            // Chain not added to wallet, try to add it
            if (switchError.code === 4902) {
              const chainConfig = SUPPORTED_CHAINS[fromChain];
              if (chainConfig) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: `0x${fromChain.toString(16)}`,
                    chainName: chainConfig.name,
                    nativeCurrency: chainConfig.nativeCurrency,
                    rpcUrls: chainConfig.rpcUrls.default.http,
                    blockExplorerUrls: chainConfig.blockExplorers?.default ? [chainConfig.blockExplorers.default.url] : undefined,
                  }],
                });

                // Wait for the add and switch to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } else {
              throw switchError;
            }
          }
        }
      }

      console.log('Starting bridge:', { fromChain, toChain, amount, tokenAddress });
      await bridgeTokens(fromChain, toChain, amount, tokenAddress as `0x${string}`);
      console.log('Bridge successful');
    } catch (err: any) {
      console.error('Bridge failed:', err);
      alert(err.message || 'Bridge failed. Please try again.');
    }
  };

  const getExplorerUrl = (chainId: number, txHash: string) => {
    const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
    return chain?.blockExplorers?.default?.url
      ? `${chain.blockExplorers.default.url}/tx/${txHash}`
      : null;
  };

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">Circle Bridge Kit</h2>
        <p className="text-xs sm:text-sm text-gray-300 font-medium">
          Bridge USDC across 6 testnet chains
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Powered by Circle CCTP Protocol
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <Gift className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-green-200">
              <p className="font-semibold mb-1">🎮 Play → 💰 Earn → 🌉 Withdraw Flow</p>
              <ol className="text-green-300/80 space-y-1 list-decimal list-inside">
                <li>Play vocabulary game → Earn AIC tokens</li>
                <li>Convert AIC to USDC (on Arc Testnet)</li>
                <li>Bridge USDC to any chain OR spend with virtual card</li>
                <li>Withdraw to bank account OR use in DeFi</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-200">
              <p className="font-semibold mb-1">Arc Testnet Bridge Coming Soon</p>
              <p className="text-yellow-300/80">
                Circle CCTP is not yet deployed on Arc Testnet. Use this bridge to transfer USDC between Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, Optimism Sepolia, Polygon Amoy, and Avalanche Fuji.
              </p>
            </div>
          </div>
        </div>
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
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-green-300 font-medium">
                Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
              </p>
              <button
                onClick={() => {
                  setConnectedAddress(null);
                  setSwapSuccess(false);
                  setSwapTxHash('');
                  setUnclaimedAIC(0);
                }}
                className="text-xs text-red-300 hover:text-red-200 font-semibold px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded border border-red-500/50 transition-all touch-manipulation"
              >
                Disconnect
              </button>
            </div>
          </div>

          <div className="mb-4 sm:mb-6 space-y-3">
            <div className="p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-cyan-300">Your Balances</h3>
                <button
                  onClick={async () => {
                    await refreshBalances();
                    await checkUnclaimedRewards(connectedAddress);
                  }}
                  className="p-1.5 hover:bg-cyan-500/20 active:bg-cyan-500/40 rounded-lg transition-colors touch-manipulation"
                  title="Refresh balances"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-300" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Your AIC Balance (on-chain)</span>
                <span className="text-lg font-bold text-cyan-300">{aicBalance} AIC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Your USDC Balance</span>
                <span className="text-lg font-bold text-green-300">{parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
              </div>
              {unclaimedUSDC > 0 && (
                <div className="p-3 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-200">🎁 Unclaimed USDC Rewards</span>
                    <span className="text-lg font-bold text-green-300">{unclaimedUSDC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
                  </div>
                  <button
                    onClick={handleClaimUSDC}
                    disabled={usdcClaimLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
                  >
                    {usdcClaimLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Claiming USDC...</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        <span className="text-sm">Claim {unclaimedUSDC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">💰 Receive USDC directly to your wallet on Arc</p>
                </div>
              )}
              {usdcClaimSuccess && usdcClaimTxHash && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg space-y-2">
                  <p className="text-sm text-green-300 font-semibold">✅ USDC Claimed Successfully!</p>
                  <p className="text-xs text-gray-300">
                    Your USDC rewards have been sent to your wallet on Arc Testnet!
                  </p>
                  <a
                    href={`https://testnet.arcscan.app/tx/${usdcClaimTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-1 justify-center"
                  >
                    View Transaction on Arc Explorer
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {parseFloat(aicBalance) > 0 && (
                <>
                  <button
                    onClick={async () => {
                      try {
                        setSwapSuccess(false);
                        setSwapLoading(true);

                        const response = await fetch(
                          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mint-usdc-reward`,
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
                          const errorMsg = result.error || 'Failed to convert AIC to USDC';
                          throw new Error(errorMsg);
                        }

                        setSwapTxHash(result.txHash);
                        setSwapSuccess(true);
                        await refreshBalances();
                      } catch (err: any) {
                        alert(err.message || 'Conversion failed');
                      } finally {
                        setSwapLoading(false);
                      }
                    }}
                    disabled={swapLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
                  >
                    {swapLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Converting to USDC...</span>
                      </>
                    ) : (
                      <>
                        <Repeat className="w-4 h-4" />
                        <span className="text-sm">Convert {aicBalance} AIC to USDC</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">💰 Receive USDC directly to your wallet on Arc</p>
                </>
              )}
              {swapSuccess && swapTxHash && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg space-y-2">
                  <p className="text-sm text-green-300 font-semibold">✅ Conversion Successful!</p>
                  <p className="text-xs text-gray-300">
                    Your AIC rewards have been converted to USDC and sent to your wallet on Arc Testnet. You can now bridge it to other chains!
                  </p>
                  <a
                    href={`https://testnet.arcscan.app/tx/${swapTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-1 justify-center"
                  >
                    View Transaction on Arc Explorer
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mb-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-blue-200 font-medium">
              ℹ️ Bridge USDC Only
            </p>
            <p className="text-xs text-gray-300">
              Circle CCTP only supports USDC bridging between chains. To bridge AIC tokens, first convert them to USDC using the "Convert AIC to USDC" button above.
            </p>
          </div>
        </div>
      </div>

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
          <p className="text-xs text-gray-400 mt-1">
            Only USDC can be bridged via Circle CCTP
          </p>
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
            {BRIDGE_CHAIN_OPTIONS.map((option) => (
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
            {BRIDGE_CHAIN_OPTIONS.filter((option) => option.value !== fromChain).map(
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
              <span className="text-sm sm:text-base">Bridging via CCTP...</span>
            </>
          ) : (
            <>
              <ArrowDownUp className="w-5 h-5" />
              <span className="text-sm sm:text-base">Bridge {selectedToken}</span>
            </>
          )}
        </button>
        {!isLoading && connectedAddress && amount && parseFloat(amount) > 0 && (
          <div className="p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg">
            <p className="text-xs text-cyan-300 text-center">
              ✨ Powered by Circle CCTP • Bridge across 18 testnet chains
            </p>
          </div>
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
          <span className="font-medium text-white">30 sec - 3 min (Fast)</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Bridge Fee</span>
          <span className="font-medium text-white">Network gas only</span>
        </div>
      </div>
    </div>
  );
}
