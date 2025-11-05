import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ExternalLink, RefreshCw, Coins, LogOut, ArrowRightLeft } from 'lucide-react';
import { getAICBalance, getAddressExplorerUrl, isOnArcNetwork, switchToArcNetwork } from '../lib/blockchain';
import { useAICToken } from '../hooks/useAICToken';
import { NetworkStatusIndicator } from './NetworkStatusBanner';
import { ClaimAICTokens } from './ClaimAICTokens';
import { CircleDemoWidget } from './CircleDemoWidget';
import { InternetMinutesRewardsBox } from './InternetMinutesRewardsBox';
import { QuickSwapModal } from './QuickSwapModal';
import type { Address } from 'viem';

interface WalletDashboardProps {
  walletAddress: string;
  userId: string | null;
  onDisconnect?: () => void;
}

export function WalletDashboard({ walletAddress, userId, onDisconnect }: WalletDashboardProps) {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [onArcNetwork, setOnArcNetwork] = useState(false);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [claimedAIC, setClaimedAIC] = useState<number>(0);
  const [totalUSDCEarned, setTotalUSDCEarned] = useState<number>(0);
  const [claimedUSDC, setClaimedUSDC] = useState<number>(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const { aicBalance, usdcBalance, refreshBalances } = useAICToken(walletAddress);

  useEffect(() => {
    if (walletAddress) {
      checkNetwork();
      loadBalance();
      loadUserStats();

      const refreshInterval = setInterval(() => {
        loadBalance();
        loadUserStats();
        refreshBalances();
      }, 5000);

      // Listen for network changes
      const handleChainChanged = () => {
        console.log('Chain changed, rechecking network...');
        checkNetwork();
        loadBalance();
        refreshBalances();
      };

      if (window.ethereum) {
        window.ethereum.on('chainChanged', handleChainChanged);
      }

      return () => {
        clearInterval(refreshInterval);
        if (window.ethereum) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [walletAddress, userId]);

  const checkNetwork = async () => {
    const isArc = await isOnArcNetwork();
    console.log('Network check result - isOnArcNetwork:', isArc);
    setOnArcNetwork(isArc);
  };

  const loadBalance = async () => {
    setIsLoading(true);
    try {
      const bal = await getAICBalance(walletAddress as Address);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!userId) return;

    try {
      const { supabase } = await import('../lib/supabase');
      const { data } = await supabase
        .from('users')
        .select('total_aic_earned, claimed_aic, total_usdc_earned, claimed_usdc')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        const earned = parseFloat(data.total_aic_earned || '0');
        const claimed = parseFloat(data.claimed_aic || '0');
        setTotalEarned(earned);
        setClaimedAIC(claimed);

        const usdcEarned = parseFloat(data.total_usdc_earned || '0');
        const usdcClaimed = parseFloat(data.claimed_usdc || '0');
        setTotalUSDCEarned(usdcEarned);
        setClaimedUSDC(usdcClaimed);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleSwitchNetwork = async () => {
    const button = document.activeElement as HTMLElement;
    if (button) button.blur();

    try {
      console.log('Attempting to switch to Arc Testnet...');
      const result = await switchToArcNetwork();
      console.log('Network switch result:', result);

      setTimeout(async () => {
        await checkNetwork();
        await loadBalance();
        await refreshBalances();
      }, 500);
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      alert(`Failed to switch network: ${error.message || 'Unknown error'}`);
    }
  };

  const handleRefresh = async () => {
    await loadBalance();
    await loadUserStats();
    await refreshBalances();
  };

  const usdcValue = parseFloat(aicBalance);
  const unclaimedAmount = totalEarned - claimedAIC;

  const handleClaimSuccess = async () => {
    await loadUserStats();
    await loadBalance();
    await refreshBalances();
  };

  const unclaimedUSDC = totalUSDCEarned - claimedUSDC;

  return (
    <div className="mb-8 sm:mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(234,179,8,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Available AIC Balance</h3>
                <p className="text-xs text-yellow-200">Ready to Convert</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-yellow-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold text-white mb-1">
              {parseFloat(aicBalance || '0').toFixed(2)}
            </p>
            <p className="text-yellow-200 text-sm">AIC Tokens</p>
          </div>
          {parseFloat(aicBalance || '0') > 0 ? (
            <button
              onClick={() => setShowSwapModal(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-5 h-5" />
              Convert to USDC
            </button>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
              <p className="text-yellow-200 text-sm font-medium">Play games to earn AIC tokens!</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                <img
                  src="/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp"
                  alt="USDC"
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Available USDC Balance</h3>
                <p className="text-xs text-green-200">Ready to Withdraw</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-green-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold text-white mb-1">
              {parseFloat(usdcBalance).toFixed(2)}
            </p>
            <p className="text-green-200 text-sm">
              ≈ ${parseFloat(usdcBalance).toFixed(2)} USD
            </p>
          </div>
          {parseFloat(usdcBalance) > 0 ? (
            <a
              href="#withdraw"
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg text-center"
            >
              Withdraw to Bank/Card
            </a>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-200 text-sm font-medium">Convert AIC to USDC to withdraw!</p>
            </div>
          )}
        </div>
      </div>

      <InternetMinutesRewardsBox
        walletAddress={walletAddress}
        unclaimedUSDC={unclaimedUSDC}
        onClaimSuccess={handleClaimSuccess}
      />
      <CircleDemoWidget
        treasuryBalance={parseFloat(usdcBalance)}
        pendingRequests={unclaimedAmount > 0 ? 1 : 0}
      />
      {unclaimedAmount > 0 && (
        <ClaimAICTokens
          walletAddress={walletAddress}
          unclaimedAmount={unclaimedAmount}
          onSuccess={handleClaimSuccess}
        />
      )}
      {showSwapModal && (
        <QuickSwapModal
          walletAddress={walletAddress}
          aicBalance={aicBalance}
          onClose={() => setShowSwapModal(false)}
          onSuccess={handleClaimSuccess}
        />
      )}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.4)] p-6 sm:p-8 text-white">
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Connected Wallet</p>
              <p className="font-mono text-xs sm:text-sm font-semibold">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
              {userId && (
                <p className="text-blue-200 text-xs mt-0.5">
                  User ID: {userId.slice(0, 8)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <NetworkStatusIndicator />
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1.5 sm:p-2 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors touch-manipulation"
              title="Refresh balance"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={getAddressExplorerUrl(walletAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors touch-manipulation"
              title="View on Arc Explorer"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            {onDisconnect && (
              <button
                onClick={() => {
                  console.log('Disconnect button clicked');
                  onDisconnect();
                }}
                className="p-1.5 sm:p-2 bg-red-500/30 hover:bg-green-500/40 active:bg-green-500/60 rounded-lg transition-all duration-200 touch-manipulation border-2 border-red-500/60 hover:border-green-500/80"
                title="Disconnect wallet"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-300 hover:text-green-300 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {!onArcNetwork ? (
          <div className="bg-yellow-500 text-yellow-900 rounded-lg p-4 mb-4">
            <p className="font-medium mb-2">Not on Arc Testnet</p>
            <button
              onClick={handleSwitchNetwork}
              className="bg-yellow-900 hover:bg-yellow-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Switch to Arc Testnet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                <p className="text-blue-200 text-xs sm:text-sm">AIC Earned</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">
                {totalEarned.toFixed(2)}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">From Games</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" />
                <p className="text-blue-200 text-xs sm:text-sm">USDC Balance</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">
                {parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">In MetaMask (Arc)</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
                <p className="text-blue-200 text-xs sm:text-sm">AIC in Wallet</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">
                {parseFloat(aicBalance || '0').toFixed(2)}
              </p>
              <button
                onClick={() => setShowSwapModal(true)}
                disabled={parseFloat(aicBalance || '0') === 0}
                className="mt-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs disabled:cursor-not-allowed"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Convert to USDC
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-blue-200 text-xs sm:text-sm">Network</p>
              </div>
              <p className="text-lg sm:text-xl font-bold mb-1">Arc Testnet</p>
              <p className="text-blue-200 text-xs sm:text-sm">Chain ID: 5042002</p>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-100">MetaMask</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-100">Arc Testnet</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-100 font-medium">Low Gas Fees</span>
            </div>
          </div>
          <p className="text-blue-100 text-xs text-center px-2">
            All transactions require MetaMask signature and are recorded on blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
