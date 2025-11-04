import { useState, useEffect } from 'react';
import { ArrowDown, Loader2, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { createPublicClient, createWalletClient, custom, http, formatUnits, parseUnits } from 'viem';
import { SUPPORTED_CHAINS, getActiveArcExplorerUrl, getActiveArcChainId } from '../config/chains';
import { USDC_ADDRESS, ERC20_ABI } from '../config/contracts';

interface SimpleAICConverterProps {
  walletAddress?: string;
}

const AIC_TOKEN_ADDRESS = import.meta.env.VITE_AIC_TOKEN_ADDRESS as `0x${string}` | undefined;
const AIC_CONVERTER_ADDRESS = import.meta.env.VITE_AIC_CONVERTER_ADDRESS as `0x${string}` | undefined;
const CONVERSION_RATE = 1;

const SIMPLE_CONVERTER_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'aicAmount', type: 'uint256' }],
    name: 'convertAICToUSDC',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getConvertibleBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function SimpleAICConverter({ walletAddress }: SimpleAICConverterProps) {
  const [aicBalance, setAicBalance] = useState<string>('0');
  const [aicAmount, setAicAmount] = useState<string>('');
  const [usdcAmount, setUsdcAmount] = useState<string>('0');
  const [isConverting, setIsConverting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const activeChainId = getActiveArcChainId();
  const arcChain = Object.values(SUPPORTED_CHAINS).find(c => c.id === activeChainId);

  useEffect(() => {
    if (walletAddress) {
      loadAICBalance();

      const interval = setInterval(() => {
        loadAICBalance();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (aicAmount && !isNaN(parseFloat(aicAmount))) {
      const aic = parseFloat(aicAmount);
      const usdc = aic * CONVERSION_RATE;
      setUsdcAmount(usdc.toFixed(6));
    } else {
      setUsdcAmount('0');
    }
  }, [aicAmount]);

  const loadAICBalance = async () => {
    if (!walletAddress) {
      console.log('❌ No wallet connected');
      return;
    }

    setIsLoadingBalance(true);
    try {
      console.log('🔄 Loading AIC balance for:', walletAddress);

      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('users')
        .select('total_aic_earned, claimed_aic')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      console.log('📊 Database result:', { data, error });

      if (error) throw error;

      if (data) {
        const totalEarned = parseFloat(data.total_aic_earned || '0');
        const claimed = parseFloat(data.claimed_aic || '0');
        const available = totalEarned - claimed;
        console.log('✅ Balance:', { totalEarned, claimed, available });
        setAicBalance(available.toFixed(6));
      } else {
        console.log('⚠️ No user found');
        setAicBalance('0');
      }
    } catch (err) {
      console.error('❌ Load failed:', err);
      setAicBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleConvert = async () => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return;
    }

    if (!aicAmount || parseFloat(aicAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(aicAmount) > parseFloat(aicBalance)) {
      setError('Insufficient AIC balance');
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      // Simple database conversion: AIC -> USDC
      const { supabase } = await import('../lib/supabase');

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, total_aic_earned, claimed_aic, total_usdc_earned')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (userError || !userData) {
        throw new Error('User not found. Play the game first to create your account.');
      }

      const convertAmount = parseFloat(aicAmount);
      const totalEarned = parseFloat(userData.total_aic_earned || '0');
      const claimed = parseFloat(userData.claimed_aic || '0');
      const currentUSDC = parseFloat(userData.total_usdc_earned || '0');

      // Update: increase claimed_aic (marking as "converted")
      // and increase total_usdc_earned
      const newClaimedAIC = claimed + convertAmount;
      const newUSDCEarned = currentUSDC + (convertAmount * CONVERSION_RATE);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          claimed_aic: newClaimedAIC.toString(),
          total_usdc_earned: newUSDCEarned.toString(),
        })
        .eq('id', userData.id);

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from('token_transactions').insert({
        user_id: userData.id,
        transaction_type: 'convert',
        amount: convertAmount,
        from_token: 'AIC',
        to_token: 'USDC',
        tx_hash: `convert-${Date.now()}`,
        chain_id: activeChainId,
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      });

      setTxHash(`convert-${Date.now()}`);
      setSuccess(true);
      setAicAmount('');
      await loadAICBalance();

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('usdcBalanceUpdated', {
        detail: { newBalance: newUSDCEarned }
      }));

      setTimeout(() => {
        setSuccess(false);
        setTxHash(null);
      }, 8000);
    } catch (err: any) {
      console.error('Conversion failed:', err);
      setError(err.message || 'Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleMaxClick = () => {
    setAicAmount(parseFloat(aicBalance).toFixed(6));
  };

  if (!walletAddress) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
          <p className="text-gray-300">Please connect your wallet to convert AIC to USDC</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Convert AIC to USDC
          </h2>
          <p className="text-green-400 text-sm sm:text-base font-semibold">
            Exchange Rate: 1 AIC = 1 USDC = $1 USD
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 border border-cyan-500/20">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-1">
              <label className="text-xs sm:text-sm text-gray-400">From</label>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400">
                  Balance: {isLoadingBalance ? '...' : parseFloat(aicBalance).toFixed(2)} AIC
                </span>
                <button
                  onClick={() => loadAICBalance()}
                  disabled={isLoadingBalance}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50 touch-manipulation"
                >
                  <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="number"
                value={aicAmount}
                onChange={(e) => setAicAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-white outline-none min-w-0"
                disabled={isConverting}
              />
              <button
                onClick={handleMaxClick}
                className="px-2 sm:px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 active:bg-cyan-500/40 text-cyan-400 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation flex-shrink-0"
                disabled={isConverting}
              >
                MAX
              </button>
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0">
                <img src="/aic toekn .png" alt="AIC" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                <span className="font-bold text-white text-sm sm:text-base">AIC</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-1 sm:my-0">
            <div className="bg-gray-800 rounded-full p-1.5 sm:p-2 border border-cyan-500/30">
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 border border-cyan-500/20">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm text-gray-400">To</label>
              <span className="text-xs sm:text-sm text-gray-400">You'll receive</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={usdcAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-white outline-none min-w-0"
              />
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0">
                <img
                  src="/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp"
                  alt="USDC"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                />
                <span className="font-bold text-white text-sm sm:text-base">USDC</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-medium text-sm sm:text-base">✅ Conversion Successful!</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {parseFloat(usdcAmount).toFixed(2)} USDC added to your balance. Go to "Bridge" or "Withdraw" to cash out!
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={isConverting || !aicAmount || parseFloat(aicAmount) <= 0 || parseFloat(aicAmount) > parseFloat(aicBalance)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:from-cyan-600 active:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] disabled:shadow-none flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              'Convert AIC to USDC'
            )}
          </button>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
            <h4 className="text-green-400 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-2">
              💰 How to Cash Out Your Earnings:
            </h4>
            <ul className="text-gray-300 text-xs space-y-1.5 sm:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold flex-shrink-0">1.</span>
                <span>Play game & earn AIC (10 AIC per correct word)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold flex-shrink-0">2.</span>
                <span>Convert AIC to USDC at 1:1 ratio (1 AIC = $1 USD)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold flex-shrink-0">3.</span>
                <span>Withdraw via Bridge (to exchange), Virtual Card (spend), or Circle Bank (save)</span>
              </li>
            </ul>
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-500/20">
              <p className="text-green-400 font-bold text-xs sm:text-sm">
                Example: 500 AIC = 500 USDC = $500 USD real money!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
