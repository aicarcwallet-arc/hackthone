import { useState, useEffect } from 'react';
import { DollarSign, Loader2, CheckCircle2, AlertCircle, Wallet, Zap } from 'lucide-react';

interface DirectUSDCPayoutProps {
  walletAddress: string;
}

export function DirectUSDCPayout({ walletAddress }: DirectUSDCPayoutProps) {
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [lifetimeEarned, setLifetimeEarned] = useState<string>('0');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'wallet'>('wallet');

  useEffect(() => {
    if (walletAddress) {
      loadUSDCBalance();

      // Listen for USDC balance updates from other components
      const handleBalanceUpdate = () => {
        console.log('🔄 USDC balance update event received, refreshing...');
        loadUSDCBalance();
      };

      window.addEventListener('usdcBalanceUpdated', handleBalanceUpdate);

      // Also refresh every 5 seconds
      const interval = setInterval(() => {
        loadUSDCBalance();
      }, 5000);

      return () => {
        window.removeEventListener('usdcBalanceUpdated', handleBalanceUpdate);
        clearInterval(interval);
      };
    }
  }, [walletAddress]);

  const loadUSDCBalance = async () => {
    try {
      console.log('🔄 Loading USDC balance for:', walletAddress);
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('users')
        .select('total_usdc_earned, claimed_usdc')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const totalEarned = parseFloat(data.total_usdc_earned || '0');
        const claimed = parseFloat(data.claimed_usdc || '0');
        const available = totalEarned - claimed;
        console.log('✅ USDC Balance loaded:', {
          totalEarned,
          claimed,
          available
        });
        setUsdcBalance(available.toFixed(2));
        setLifetimeEarned(totalEarned.toFixed(2));
      } else {
        console.log('⚠️ No user data found');
      }
    } catch (err) {
      console.error('❌ Failed to load USDC balance:', err);
    }
  };

  const handlePayout = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(usdcBalance)) {
      setError('Insufficient USDC balance');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { supabase } = await import('../lib/supabase');

      // Call instant payout with accelerated nonce system
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/circle-instant-payout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            walletAddress: walletAddress,
            amount: amount,
            useAcceleratedNonce: true,
            crossChain: true,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send USDC');
      }

      // Update database to mark USDC as claimed
      await supabase
        .from('users')
        .update({
          claimed_usdc: parseFloat(usdcBalance),
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress.toLowerCase());

      setSuccess(true);
      setAmount('');
      await loadUSDCBalance();

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Payout failed:', err);
      setError(err.message || 'Payout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(usdcBalance);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cash Out Your USDC</h2>
          <p className="text-gray-400 text-sm">Your earnings converted to real money</p>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Available to Withdraw</span>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-bold text-lg">{usdcBalance} USDC</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <span className="text-gray-500 text-xs">Lifetime Earned</span>
            <span className="text-gray-400 text-xs">{lifetimeEarned} USDC</span>
          </div>
          <div className="text-right mt-1">
            <span className="text-gray-500 text-xs">≈ ${usdcBalance} USD available</span>
          </div>
        </div>

        {parseFloat(usdcBalance) === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm font-medium mb-2">No USDC available to withdraw</p>
            <p className="text-gray-400 text-xs">
              Go back and click "Convert AIC to USDC" to convert your earned AIC tokens into withdrawable USDC first.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Payout Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPayoutMethod('wallet')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  payoutMethod === 'wallet'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Wallet className="w-6 h-6 text-cyan-400" />
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-white font-medium text-sm">Your Wallet</div>
                <div className="text-green-400 text-xs font-semibold">Instant (&lt; 3s)</div>
              </button>
              <button
                onClick={() => setPayoutMethod('bank')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  payoutMethod === 'bank'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <div className="text-white font-medium text-sm">Bank Account</div>
                <div className="text-gray-500 text-xs">1-2 days</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Amount (USDC)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-gray-900/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white text-lg focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={handleMaxClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-1 rounded text-sm font-medium"
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-medium text-sm">Payout Successful!</p>
              <p className="text-gray-400 text-xs mt-1">
                {payoutMethod === 'wallet'
                  ? 'USDC sent to your wallet'
                  : 'Bank transfer initiated - arrives in 1-2 business days'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handlePayout}
          disabled={isLoading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(usdcBalance)}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Instant Transfer...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Instant Cash Out ${amount || '0.00'} USD</span>
            </>
          )}
        </button>

        <div className="mt-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-xs text-gray-300 text-center flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Using accelerated nonce system for instant USDC delivery via Circle infrastructure
          </p>
        </div>

        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2 text-sm">How it works:</h4>
          <ul className="text-gray-300 text-xs space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">1.</span>
              <span>Your {usdcBalance} USDC is ready to withdraw</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">2.</span>
              <span>Choose wallet (instant) or bank account (1-2 days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">3.</span>
              <span>Enter amount and cash out</span>
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-green-500/20">
            <p className="text-green-400 font-bold text-sm">
              💰 You have ${usdcBalance} USD ready to withdraw!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
