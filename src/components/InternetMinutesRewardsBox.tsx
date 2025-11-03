import { useState } from 'react';
import { Gift, Loader2, Zap, ArrowRight } from 'lucide-react';

interface InternetMinutesRewardsBoxProps {
  walletAddress: string;
  unclaimedUSDC: number;
  onClaimSuccess: () => void;
}

export function InternetMinutesRewardsBox({
  walletAddress,
  unclaimedUSDC,
  onClaimSuccess
}: InternetMinutesRewardsBoxProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    setIsLoading(true);

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
            walletAddress,
            sourceChain: 'baseSepolia'
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to claim USDC via CCTP');
      }

      alert(
        `✅ Success!\n\n` +
        `${result.message}\n\n` +
        `Burn TX: ${result.burnTxHash.slice(0, 10)}...\n` +
        `Fee: ${result.fee} USDC\n` +
        `Arrival: ${result.attestation.estimatedArrival}\n\n` +
        `USDC will arrive in your wallet in 8-20 seconds!\n\n` +
        `Check on explorer: ${result.explorerUrl}`
      );

      onClaimSuccess();
    } catch (err: any) {
      console.error('CCTP Claim error:', err);

      const errorMsg = err.message || 'Unknown error';

      if (errorMsg.includes('Insufficient USDC balance')) {
        alert(
          `❌ Treasury Needs Funding!\n\n` +
          `The treasury wallet needs USDC on Base Sepolia:\n` +
          `Address: 0x43909cce967BE2Ba4D44836A99b67040BF53f05a\n\n` +
          `Get testnet USDC: https://faucet.circle.com\n\n` +
          `Then send it to the treasury address above.`
        );
      } else {
        alert(
          `❌ CCTP Error:\n\n${errorMsg}\n\n` +
          `Make sure:\n` +
          `1. Treasury has USDC on Base Sepolia\n` +
          `2. CCTP_TREASURY_PRIVATE_KEY is set in Supabase\n\n` +
          `Get testnet USDC: https://faucet.circle.com`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (unclaimedUSDC <= 0) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.5)] p-1">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  🎉 Rewards Ready!
                </h3>
                <p className="text-emerald-300 text-sm">
                  Internet Minutes earned from gameplay
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/40">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-sm font-semibold">CCTP v2</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-xl p-6 mb-5 border border-emerald-500/30">
            <div className="text-center mb-4">
              <p className="text-emerald-200 text-sm mb-2">Your Unclaimed Rewards</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300">
                  {unclaimedUSDC.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className="text-2xl font-bold text-emerald-400">USDC</span>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                ≈ ${unclaimedUSDC.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} USD
              </p>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="text-white font-medium">1 Internet Minute = 1 USDC</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Delivery Method</span>
                <span className="text-emerald-400 font-medium">Circle CCTP v2 Burn & Mint</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Delivery Time</span>
                <span className="text-emerald-400 font-medium">8-20 seconds ⚡</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-yellow-400 font-medium">~0.1% (Fast Transfer)</span>
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-400 hover:via-green-400 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg touch-manipulation"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Converting to USDC...</span>
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6" />
                  <span>Claim {unclaimedUSDC.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} USDC</span>
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">ℹ</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p className="font-medium text-white">How it works:</p>
                <p>1. Click "Claim" to convert Internet Minutes to USDC</p>
                <p>2. USDC burns on Base Sepolia via Circle CCTP v2</p>
                <p>3. Native USDC mints directly to your wallet on Arc (8-20 sec)</p>
                <p>4. Use your USDC immediately - no bridges, no wrapped tokens!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
