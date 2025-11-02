import { useState } from 'react';
import { Coins, Loader, CheckCircle, XCircle, CreditCard, Building2, Wallet, DollarSign } from 'lucide-react';

interface ClaimAICTokensProps {
  walletAddress: string;
  unclaimedAmount: number;
  onSuccess: () => void;
}

type WithdrawalMethod = 'wallet' | 'virtual_card' | 'bank';

export function ClaimAICTokens({ walletAddress, unclaimedAmount, onSuccess }: ClaimAICTokensProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleClaim = async (method: WithdrawalMethod) => {
    if (unclaimedAmount <= 0) {
      setError('No tokens to claim');
      return;
    }

    setIsClaiming(true);
    setError(null);
    setTxHash(null);
    setShowMethodSelector(false);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const endpoint = method === 'wallet' ? 'mint-usdc-reward' : 'circle-instant-payout';

      const response = await fetch(`${supabaseUrl}/functions/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          walletAddress,
          withdrawalMethod: method
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim rewards');
      }

      setTxHash(data.txHash || data.transactionId);
      setSuccessMessage(data.message || 'Rewards claimed successfully!');

      setTimeout(() => {
        onSuccess();
        setTxHash(null);
        setSuccessMessage('');
      }, 5000);
    } catch (err: any) {
      console.error('Claim error:', err);
      setError(err.message || 'Failed to claim rewards');
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
            <h3 className="text-lg font-bold text-white">Cash Out Your Earnings!</h3>
            <p className="text-sm text-gray-300">Convert AIC tokens to real money</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-400">${usdValue} USD</p>
          <p className="text-xs text-gray-400">{unclaimedAmount.toFixed(2)} AIC = {unclaimedAmount.toFixed(2)} USDC</p>
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
            <p className="text-sm font-semibold text-green-300">{successMessage}</p>
          </div>
          {txHash.startsWith('0x') && (
            <a
              href={`https://testnet.arcscan.app/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 break-all"
            >
              View on Arc Explorer →
            </a>
          )}
        </div>
      )}

      {!showMethodSelector && !isClaiming && !txHash ? (
        <button
          onClick={() => setShowMethodSelector(true)}
          disabled={unclaimedAmount <= 0}
          className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2 touch-manipulation"
        >
          <DollarSign className="w-6 h-6" />
          <span className="text-lg">Get Your ${usdValue} USD Now!</span>
        </button>
      ) : showMethodSelector && !isClaiming ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-300 mb-3 font-semibold text-center">
            Choose how you want to receive your money:
          </p>

          <button
            onClick={() => handleClaim('wallet')}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 active:bg-cyan-500/40 border border-cyan-500/50 text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center gap-3 touch-manipulation"
          >
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-base">To Wallet (Instant)</div>
              <div className="text-xs text-gray-400">Get USDC in your wallet - bridge, trade, or convert</div>
            </div>
          </button>

          <button
            onClick={() => handleClaim('virtual_card')}
            className="w-full bg-purple-500/20 hover:bg-purple-500/30 active:bg-purple-500/40 border border-purple-500/50 text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center gap-3 touch-manipulation"
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-base">Virtual Card (Spend Anywhere)</div>
              <div className="text-xs text-gray-400">Use online or in stores - works like a debit card</div>
            </div>
          </button>

          <button
            onClick={() => handleClaim('bank')}
            className="w-full bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/40 border border-green-500/50 text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center gap-3 touch-manipulation"
          >
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-base">Bank Account (1-2 days)</div>
              <div className="text-xs text-gray-400">Direct deposit to your checking account</div>
            </div>
          </button>

          <button
            onClick={() => setShowMethodSelector(false)}
            className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-all touch-manipulation"
          >
            Cancel
          </button>
        </div>
      ) : null}

      {isClaiming && (
        <div className="p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-cyan-400 flex-shrink-0" />
          <div className="text-sm text-cyan-300">
            <div className="font-semibold">Processing your ${usdValue} USD payout...</div>
            <div className="text-xs text-gray-400 mt-1">Secure, instant transfer in progress</div>
          </div>
        </div>
      )}

      {!showMethodSelector && !isClaiming && !txHash && (
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p className="font-semibold text-green-400">💰 Real money waiting for you!</p>
          <p className="mt-1">Choose your preferred cash-out method above</p>
        </div>
      )}
    </div>
  );
}
