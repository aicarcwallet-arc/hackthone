import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ExternalLink, RefreshCw, Coins } from 'lucide-react';
import { getAICBalance, getAddressExplorerUrl, isOnArcNetwork, switchToArcNetwork } from '../lib/blockchain';
import { useAICToken } from '../hooks/useAICToken';
import type { Address } from 'viem';

interface WalletDashboardProps {
  walletAddress: string;
  userId: string | null;
}

export function WalletDashboard({ walletAddress, userId }: WalletDashboardProps) {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [onArcNetwork, setOnArcNetwork] = useState(false);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const { aicBalance, usdcBalance, refreshBalances } = useAICToken(walletAddress);

  useEffect(() => {
    if (walletAddress) {
      checkNetwork();
      loadBalance();
      loadUserStats();
    }
  }, [walletAddress, userId]);

  const checkNetwork = async () => {
    const isArc = await isOnArcNetwork();
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
        .select('total_aic_earned')
        .eq('id', userId)
        .single();

      if (data) {
        setTotalEarned(data.total_aic_earned || 0);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToArcNetwork();
      setOnArcNetwork(true);
      await loadBalance();
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const handleRefresh = async () => {
    await loadBalance();
    await loadUserStats();
    await refreshBalances();
  };

  const usdcValue = parseFloat(aicBalance);

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.4)] p-4 sm:p-6 text-white">
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
                <p className="text-blue-200 text-xs sm:text-sm">AIC Balance</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">
                {parseFloat(aicBalance).toFixed(2)}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">≈ ${parseFloat(aicBalance).toFixed(2)} USDC</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" />
                <p className="text-blue-200 text-xs sm:text-sm">USDC Balance</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">
                {parseFloat(usdcBalance).toFixed(2)}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">USDC</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200" />
                <p className="text-blue-200 text-xs sm:text-sm">Total Earned</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">
                {totalEarned.toFixed(2)}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm">AIC Tokens</p>
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
              <span className="text-blue-100 font-medium">1 AIC = 1 USDC</span>
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
