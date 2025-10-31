import { useState } from 'react';
import { Coins, Loader, CheckCircle, XCircle } from 'lucide-react';

interface ClaimAICTokensProps {
  walletAddress: string;
  unclaimedAmount: number;
  onSuccess: () => void;
}

export function ClaimAICTokens({ walletAddress, unclaimedAmount, onSuccess }: ClaimAICTokensProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (unclaimedAmount <= 0) {
      setError('No tokens to claim');
      return;
    }

    setIsClaiming(true);
    setError(null);
    setTxHash(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/mint-aic-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim tokens');
      }

      setTxHash(data.txHash);
      setTimeout(() => {
        onSuccess();
        setTxHash(null);
      }, 3000);
    } catch (err: any) {
      console.error('Claim error:', err);
      setError(err.message || 'Failed to claim tokens');
    } finally {
      setIsClaiming(false);
    }
  };

  if (unclaimedAmount <= 0) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6 mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Coins className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Claim Your AIC Tokens</h3>
            <p className="text-sm text-gray-300">Convert earned tokens to your wallet</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-400">{unclaimedAmount.toFixed(2)} AIC</p>
          <p className="text-xs text-gray-400">Ready to claim</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-sm font-semibold text-green-300">Tokens Claimed Successfully!</p>
          </div>
          <a
            href={`https://testnet.arcscan.app/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 break-all"
          >
            View on Arc Explorer →
          </a>
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={isClaiming || unclaimedAmount <= 0}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:shadow-[0_0_50px_rgba(234,179,8,0.8)] flex items-center justify-center gap-2 touch-manipulation"
      >
        {isClaiming ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Minting AIC Tokens...
          </>
        ) : (
          <>
            <Coins className="w-5 h-5" />
            Claim {unclaimedAmount.toFixed(2)} AIC Tokens
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>Tokens will be minted directly to your wallet on Arc Testnet</p>
        <p className="mt-1">No gas fees required - paid by the system</p>
      </div>
    </div>
  );
}
