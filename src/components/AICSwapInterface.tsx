import { useState, useEffect } from 'react';
import { ArrowDownUp, Loader2, ExternalLink } from 'lucide-react';
import { useAICToken } from '../hooks/useAICToken';
import { AIC_TOKEN_ADDRESS, AIC_SWAP_ADDRESS } from '../config/contracts';
import { getActiveArcExplorerUrl } from '../config/chains';

interface AICSwapInterfaceProps {
  walletAddress?: string;
}

export function AICSwapInterface({ walletAddress }: AICSwapInterfaceProps) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [direction, setDirection] = useState<'AIC_TO_USDC' | 'USDC_TO_AIC'>('AIC_TO_USDC');
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { aicBalance, usdcBalance, aicPrice, loading, swapAICForUSDC, swapUSDCForAIC, getSwapQuote } = useAICToken(walletAddress);

  const contractsDeployed = AIC_TOKEN_ADDRESS && AIC_SWAP_ADDRESS;

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      updateQuote();
    } else {
      setToAmount('');
    }
  }, [fromAmount, direction]);

  const updateQuote = async () => {
    try {
      const quote = await getSwapQuote(fromAmount, direction);
      setToAmount(quote);
    } catch (err) {
      console.error('Quote error:', err);
    }
  };

  const handleSwap = async () => {
    console.log('Swap button clicked', { direction, fromAmount, walletAddress });

    if (!walletAddress) {
      setError('Please connect your wallet');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError('');
    setTxHash('');

    try {
      console.log('Starting swap...');
      const hash = direction === 'AIC_TO_USDC'
        ? await swapAICForUSDC(fromAmount)
        : await swapUSDCForAIC(fromAmount);

      console.log('Swap successful, hash:', hash);
      setTxHash(hash);
      setFromAmount('');
      setToAmount('');
    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'Swap failed');
    }
  };

  const switchDirection = () => {
    console.log('Switch direction button clicked');
    setDirection(prev => prev === 'AIC_TO_USDC' ? 'USDC_TO_AIC' : 'AIC_TO_USDC');
    setFromAmount('');
    setToAmount('');
    console.log('Direction switched');
  };

  const setMaxAmount = () => {
    console.log('Max button clicked');
    const balance = direction === 'AIC_TO_USDC' ? aicBalance : usdcBalance;
    setFromAmount(balance);
    console.log('Set max amount:', balance);
  };

  if (!contractsDeployed) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">AIC Swap</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            Contracts not deployed yet. Please deploy AIC Token and Swap contracts first.
          </p>
          <a
            href="https://remix.ethereum.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-2"
          >
            Deploy with Remix <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Swap</h2>
        <div className="text-sm text-gray-600">
          1 AIC = {parseFloat(aicPrice).toFixed(4)} USDC
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">From</span>
            <button
              onClick={setMaxAmount}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Max: {direction === 'AIC_TO_USDC' ? aicBalance : usdcBalance}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 text-2xl bg-transparent border-none outline-none"
              disabled={loading}
            />
            <div className="bg-white rounded-lg px-4 py-2 font-semibold text-gray-800">
              {direction === 'AIC_TO_USDC' ? 'AIC' : 'USDC'}
            </div>
          </div>
        </div>

        <button
          onClick={switchDirection}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={loading}
        >
          <ArrowDownUp className="w-6 h-6 text-gray-600" />
        </button>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">To (estimated)</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 text-2xl bg-transparent border-none outline-none"
            />
            <div className="bg-white rounded-lg px-4 py-2 font-semibold text-gray-800">
              {direction === 'AIC_TO_USDC' ? 'USDC' : 'AIC'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {txHash && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm mb-2">Swap successful!</p>
            <a
              href={`${getActiveArcExplorerUrl()}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
            >
              View on Explorer <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Swapping...
            </>
          ) : (
            'Swap'
          )}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Price impact</span>
            <span className="text-gray-800">{'< 0.1%'}</span>
          </div>
          <div className="flex justify-between">
            <span>Swap fee (0.3%)</span>
            <span className="text-gray-800">
              {fromAmount ? (parseFloat(fromAmount) * 0.003).toFixed(6) : '0'} {direction === 'AIC_TO_USDC' ? 'AIC' : 'USDC'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Minimum received</span>
            <span className="text-gray-800">
              {toAmount ? (parseFloat(toAmount) * 0.95).toFixed(6) : '0'} {direction === 'AIC_TO_USDC' ? 'USDC' : 'AIC'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
