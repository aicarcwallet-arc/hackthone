import { useState, useEffect } from 'react';
import { ArrowDownUp, Loader2, ExternalLink, Wallet } from 'lucide-react';
import { useAICToken } from '../hooks/useAICToken';
import { AIC_TOKEN_ADDRESS, AIC_SWAP_ADDRESS, USDC_ADDRESS } from '../config/contracts';
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
    setError('');
    setTxHash('');
    console.log('Direction switched');
  };

  const addUSDCToMetaMask = async () => {
    if (!window.ethereum || !USDC_ADDRESS) return;

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: USDC_ADDRESS,
            symbol: 'USDC',
            decimals: 6,
            image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
          },
        },
      });
    } catch (err) {
      console.error('Failed to add USDC to MetaMask:', err);
    }
  };

  const addAICToMetaMask = async () => {
    if (!window.ethereum || !AIC_TOKEN_ADDRESS) return;

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: AIC_TOKEN_ADDRESS,
            symbol: 'AIC',
            decimals: 6,
            image: '',
          },
        },
      });
    } catch (err) {
      console.error('Failed to add AIC to MetaMask:', err);
    }
  };

  const setMaxAmount = () => {
    console.log('Max button clicked');
    const balance = direction === 'AIC_TO_USDC' ? aicBalance : usdcBalance;
    setFromAmount(balance);
    console.log('Set max amount:', balance);
  };

  if (!contractsDeployed) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AIC Swap</h2>
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 text-center backdrop-blur-sm">
          <p className="text-gray-300 mb-4">
            Contracts not deployed yet. Please deploy AIC Token and Swap contracts first.
          </p>
          <a
            href="https://remix.ethereum.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-2"
          >
            Deploy with Remix <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8 max-w-md mx-auto">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Swap AIC ↔ USDC</h2>
          <div className="text-sm text-gray-300">
            1 AIC = {parseFloat(aicPrice).toFixed(4)} USDC
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addAICToMetaMask}
            className="flex-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Wallet className="w-3 h-3" />
            Add AIC to Wallet
          </button>
          <button
            onClick={addUSDCToMetaMask}
            className="flex-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Wallet className="w-3 h-3" />
            Add USDC to Wallet
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-300">From</span>
            <button
              onClick={setMaxAmount}
              className="text-sm text-cyan-400 hover:text-cyan-300"
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
              className="flex-1 text-2xl bg-transparent border-none outline-none text-white placeholder-gray-500"
              disabled={loading}
            />
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-4 py-2 font-semibold text-cyan-300">
              {direction === 'AIC_TO_USDC' ? 'AIC' : 'USDC'}
            </div>
          </div>
        </div>

        <button
          onClick={switchDirection}
          className="w-full flex items-center justify-center p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
          disabled={loading}
        >
          <ArrowDownUp className="w-6 h-6 text-cyan-400" />
        </button>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-300">To (estimated)</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 text-2xl bg-transparent border-none outline-none text-white placeholder-gray-500"
            />
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-4 py-2 font-semibold text-cyan-300">
              {direction === 'AIC_TO_USDC' ? 'USDC' : 'AIC'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {txHash && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm space-y-2">
            <p className="text-green-300 text-sm mb-2">Swap successful!</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`${getActiveArcExplorerUrl()}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-1"
              >
                View on Explorer <ExternalLink className="w-3 h-3" />
              </a>
              {direction === 'AIC_TO_USDC' && (
                <button
                  onClick={addUSDCToMetaMask}
                  className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-1"
                >
                  <Wallet className="w-3 h-3" />
                  Add USDC to MetaMask
                </button>
              )}
              {direction === 'USDC_TO_AIC' && (
                <button
                  onClick={addAICToMetaMask}
                  className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-1"
                >
                  <Wallet className="w-3 h-3" />
                  Add AIC to MetaMask
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2"
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

      <div className="mt-6 pt-6 border-t border-cyan-500/20">
        <div className="text-sm text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Price impact</span>
            <span className="text-white">{'< 0.1%'}</span>
          </div>
          <div className="flex justify-between">
            <span>Swap fee (0.3%)</span>
            <span className="text-white">
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
