import { useState } from 'react';
import { X, ArrowRightLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAICToken } from '../hooks/useAICToken';

interface QuickSwapModalProps {
  walletAddress: string;
  aicBalance: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuickSwapModal({ walletAddress, aicBalance, onClose, onSuccess }: QuickSwapModalProps) {
  const { swapAICForUSDC, getSwapQuote, loading } = useAICToken(walletAddress);
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState('0');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleAmountChange = async (value: string) => {
    setAmount(value);
    if (value && parseFloat(value) > 0) {
      const q = await getSwapQuote(value, 'AIC_TO_USDC');
      setQuote(q);
    } else {
      setQuote('0');
    }
  };

  const handleMaxClick = () => {
    handleAmountChange(aicBalance);
  };

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const hash = await swapAICForUSDC(amount);
      setTxHash(hash);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (error: any) {
      alert(error.message || 'Swap failed');
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-2xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-sm w-full p-6 sm:p-8 text-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Swap Successful!</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">Your USDC has been added to your wallet</p>
          <a
            href={`https://testnet.arcscan.net/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 active:text-cyan-300 sm:hover:text-cyan-300 text-xs sm:text-sm"
          >
            View on Explorer →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-t-3xl sm:rounded-2xl border-t sm:border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.3)] max-w-md w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h3 className="text-lg sm:text-xl font-bold text-white">Convert AIC to USDC</h3>
          <button
            onClick={onClose}
            className="p-2 active:bg-gray-800 sm:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm text-gray-400">You Pay</label>
              <button
                onClick={handleMaxClick}
                className="text-xs text-cyan-400 active:text-cyan-300 sm:hover:text-cyan-300 px-2 py-1 touch-manipulation"
              >
                MAX
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-white outline-none"
                step="0.01"
                min="0"
              />
              <div className="flex items-center gap-2 bg-gray-700/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0">
                <span className="text-white font-semibold text-sm sm:text-base">AIC</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">Balance: {parseFloat(aicBalance).toFixed(2)} AIC</p>
          </div>

          <div className="flex justify-center -my-2 sm:-my-3">
            <div className="bg-gray-800 p-2 rounded-lg">
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-blue-500/20">
            <label className="text-xs sm:text-sm text-gray-400 mb-2 block">You Receive</label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 text-xl sm:text-2xl font-bold text-white">
                {parseFloat(quote).toFixed(2)}
              </div>
              <div className="flex items-center gap-2 bg-gray-700/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0">
                <span className="text-white font-semibold text-sm sm:text-base">USDC</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">1 AIC = 0.997 USDC (0.3% fee)</p>
          </div>

          <div className="bg-cyan-500/10 rounded-lg p-3 sm:p-4 border border-cyan-500/20">
            <p className="text-xs sm:text-sm text-gray-300">
              <span className="text-cyan-400 font-semibold">Instant Conversion:</span> Your USDC will be available immediately after the transaction confirms.
            </p>
          </div>

          <button
            onClick={handleSwap}
            disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(aicBalance)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 active:from-cyan-400 active:to-blue-500 sm:hover:from-cyan-400 sm:hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:shadow-none flex items-center justify-center gap-2 touch-manipulation min-h-[52px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm sm:text-base">Converting...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base">Convert to USDC</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
