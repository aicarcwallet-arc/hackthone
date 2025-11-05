import { useState } from 'react';
import { Coins, Loader, CheckCircle, XCircle, DollarSign } from 'lucide-react';

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

      if (!supabaseUrl) {
        throw new Error('Configuration error: Supabase URL not found');
      }

      console.log('Starting mint for wallet:', walletAddress);
      console.log('Unclaimed amount:', unclaimedAmount);

      const response = await fetch(`${supabaseUrl}/functions/v1/mint-aic-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ walletAddress }),
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Mint failed - Status:', response.status);
        console.error('Mint failed - Data:', data);

        if (data.error?.includes('Minter private key not configured')) {
          throw new Error('⚙️ Setup Required: Minting key not configured in Supabase secrets.');
        } else if (data.error?.includes('AIC token address not configured')) {
          throw new Error('⚙️ Setup Required: AIC Token contract address not set.');
        } else if (data.error?.includes('User not found')) {
          throw new Error('Account not found. Play the game first to create your account.');
        } else if (data.error?.includes('No unclaimed AIC')) {
          throw new Error('No unclaimed tokens available. Play the game to earn more!');
        } else if (data.error?.includes('insufficient funds') || data.error?.includes('insufficient balance')) {
          throw new Error('⛽ Minter wallet needs gas (USDC). The backend wallet has no funds to pay for transactions.');
        } else if (data.error?.includes('reverted') || data.error?.includes('execution reverted')) {
          throw new Error('🔧 Smart contract error: Transaction reverted. Check if minter has MINTER_ROLE permission on the contract.');
        }

        const errorMsg = data.details ? `${data.error}\n\nTechnical details: ${data.details}` : data.error;
        throw new Error(errorMsg || 'Failed to claim tokens. Check browser console for details.');
      }

      setTxHash(data.txHash);

      // Emit custom event to trigger balance refresh across all components
      window.dispatchEvent(new CustomEvent('aicBalanceUpdated'));

      // Multiple refresh cycles to ensure balance updates
      // Immediate refresh
      await onSuccess();

      // Refresh every 2 seconds for the next 10 seconds
      const refreshIntervals = [2000, 4000, 6000, 8000, 10000];
      refreshIntervals.forEach(delay => {
        setTimeout(() => {
          onSuccess();
          window.dispatchEvent(new CustomEvent('aicBalanceUpdated'));
        }, delay);
      });

      // Clear success message after 15s
      setTimeout(() => {
        setTxHash(null);
        setError(null);
      }, 15000);
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

  const usdValue = (unclaimedAmount * 1).toFixed(2);

  return (
    <div className="w-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-6 mb-8 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Claim Your AiC Tokens!</h3>
            <p className="text-sm text-gray-300">Mints tokens to your wallet</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-400">{unclaimedAmount.toFixed(2)} AiC</p>
          <p className="text-xs text-gray-400">≈ ${usdValue} USDC value</p>
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
            <p className="text-sm font-semibold text-green-300">
              Successfully minted {unclaimedAmount.toFixed(2)} AiC tokens!
            </p>
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

      {!isClaiming && !txHash && (
        <button
          onClick={handleClaim}
          disabled={unclaimedAmount <= 0}
          className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2 touch-manipulation"
        >
          <Coins className="w-6 h-6" />
          <span className="text-lg">Claim {unclaimedAmount.toFixed(2)} AiC Now!</span>
        </button>
      )}

      {isClaiming && (
        <div className="p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-cyan-400 flex-shrink-0" />
          <div className="text-sm text-cyan-300">
            <div className="font-semibold">Minting {unclaimedAmount.toFixed(2)} AiC tokens...</div>
            <div className="text-xs text-gray-400 mt-1">This may take 10-30 seconds. Please wait...</div>
            <div className="text-xs text-cyan-400 mt-2">Check browser console (F12) for progress</div>
          </div>
        </div>
      )}

      {!isClaiming && !txHash && (
        <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-xs text-cyan-400 text-center font-semibold mb-1">⚡ Gas-Free Claiming!</p>
          <p className="text-xs text-gray-400 text-center">
            No MetaMask signature needed - tokens are automatically minted to your wallet
          </p>
        </div>
      )}
    </div>
  );
}
