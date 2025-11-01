import { AlertCircle, ExternalLink, Fuel } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getArcPublicClient } from '../lib/blockchain';

interface GasFaucetBannerProps {
  walletAddress: string;
}

export function GasFaucetBanner({ walletAddress }: GasFaucetBannerProps) {
  const [nativeBalance, setNativeBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    checkBalance();
    const interval = setInterval(checkBalance, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [walletAddress]);

  const checkBalance = async () => {
    try {
      const publicClient = getArcPublicClient();
      const balance = await publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });
      setNativeBalance(balance);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to check gas balance:', error);
      setIsLoading(false);
    }
  };

  // Don't show if dismissed, loading, or has sufficient balance (> 0.1 USDC in 6 decimals)
  if (isDismissed || isLoading || !nativeBalance || nativeBalance > BigInt(100000)) {
    return null;
  }

  const balanceInUsdc = Number(nativeBalance) / 1_000_000;

  return (
    <div className="w-full max-w-3xl mb-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-sm border-2 border-cyan-500/50 rounded-xl p-4 sm:p-6 shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-pulse-slow">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
          <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <h3 className="text-cyan-300 font-bold text-base sm:text-lg leading-tight">Get Free Testnet USDC for Gas</h3>
          </div>

          <div className="bg-black/30 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2 gap-2">
              <span className="text-gray-300 text-xs sm:text-sm">Your Gas Balance:</span>
              <span className="text-red-400 font-bold text-sm sm:text-base">{balanceInUsdc.toFixed(6)} USDC</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                style={{ width: `${Math.min((balanceInUsdc / 0.1) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 mb-3 sm:mb-4">
            <div className="bg-cyan-500/10 rounded-lg p-2.5 sm:p-3 border border-cyan-500/30">
              <p className="text-white font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2">📋 Quick Start Guide:</p>
              <ol className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-1.5 ml-4 list-decimal">
                <li>Visit Arc Faucet and request testnet USDC</li>
                <li>Wait 10-30 seconds for tokens to arrive</li>
                <li>Add AiC Token contract to track earnings</li>
                <li>Start playing and earn AiC tokens!</li>
                <li>Swap AiC → USDC and withdraw anytime</li>
              </ol>
            </div>

            <div className="bg-yellow-500/10 rounded-lg p-2.5 sm:p-3 border border-yellow-500/30">
              <p className="text-yellow-300 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold">💡 Important:</span> Arc uses USDC as native gas (6 decimals). You need ~10 USDC for gas fees to play games, swap tokens, and make transactions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <a
              href="https://faucet.arc.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 active:from-cyan-600 active:to-blue-700 sm:hover:from-cyan-400 sm:hover:to-blue-500 text-white font-bold px-4 py-3 sm:py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.5)] active:shadow-[0_0_25px_rgba(34,211,238,0.7)] sm:hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] text-sm touch-manipulation min-h-[48px]"
            >
              <Fuel className="w-4 h-4" />
              Get Free USDC
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                const tokenAddress = '0x4B71cD610AfCCDf0B02d566dA0071C74444a8666';
                if (window.ethereum) {
                  window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                      type: 'ERC20',
                      options: {
                        address: tokenAddress,
                        symbol: 'AiC',
                        decimals: 18,
                        image: 'https://your-domain.com/aic-token.png',
                      },
                    },
                  }).then((success: boolean) => {
                    if (success) {
                      alert('✅ AiC Token added to MetaMask!\n\nYou can now track your earned tokens.');
                    }
                  }).catch((error: Error) => {
                    console.error('Failed to add token:', error);
                  });
                }
              }}
              className="flex items-center justify-center gap-2 bg-gray-800 active:bg-gray-900 sm:hover:bg-gray-700 text-white font-semibold px-4 py-3 sm:py-3.5 rounded-lg transition-all border border-cyan-500/30 text-sm touch-manipulation min-h-[48px]"
            >
              🪙 Add AiC Token
            </button>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="mt-2.5 sm:mt-3 text-cyan-400 active:text-cyan-500 sm:hover:text-cyan-300 text-xs underline touch-manipulation min-h-[32px]"
          >
            I already have USDC, dismiss this
          </button>
        </div>
      </div>
    </div>
  );
}
