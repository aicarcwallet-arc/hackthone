import { useState, useEffect } from 'react';
import { ArrowDown, Loader2, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { createPublicClient, createWalletClient, custom, http, formatUnits, parseUnits } from 'viem';
import { SUPPORTED_CHAINS, getActiveArcExplorerUrl } from '../config/chains';
import { USDC_ADDRESS, ERC20_ABI } from '../config/contracts';

interface SimpleAICConverterProps {
  walletAddress?: string;
}

const AIC_TOKEN_ADDRESS = import.meta.env.VITE_AIC_TOKEN_ADDRESS as `0x${string}` | undefined;
const CONVERSION_RATE = 100;

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

  const arcChain = SUPPORTED_CHAINS.find(c => c.id === 5042002);

  useEffect(() => {
    if (walletAddress && AIC_TOKEN_ADDRESS) {
      loadAICBalance();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (aicAmount && !isNaN(parseFloat(aicAmount))) {
      const aic = parseFloat(aicAmount);
      const usdc = aic / CONVERSION_RATE;
      setUsdcAmount(usdc.toFixed(6));
    } else {
      setUsdcAmount('0');
    }
  }, [aicAmount]);

  const loadAICBalance = async () => {
    if (!walletAddress || !AIC_TOKEN_ADDRESS || !arcChain) return;

    setIsLoadingBalance(true);
    try {
      const publicClient = createPublicClient({
        chain: arcChain,
        transport: http(),
      });

      const balance = await publicClient.readContract({
        address: AIC_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      });

      setAicBalance(formatUnits(balance as bigint, 18));
    } catch (err) {
      console.error('Failed to load AIC balance:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleConvert = async () => {
    if (!walletAddress || !window.ethereum || !AIC_TOKEN_ADDRESS || !arcChain) {
      setError('Please connect your wallet first');
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
      const walletClient = createWalletClient({
        chain: arcChain,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain: arcChain,
        transport: http(),
      });

      const amountInWei = parseUnits(aicAmount, 18);

      const allowance = await publicClient.readContract({
        address: AIC_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [walletAddress as `0x${string}`, USDC_ADDRESS],
      });

      if ((allowance as bigint) < amountInWei) {
        const approveHash = await walletClient.writeContract({
          address: AIC_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [USDC_ADDRESS, amountInWei],
          account: walletAddress as `0x${string}`,
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const convertHash = await walletClient.writeContract({
        address: USDC_ADDRESS,
        abi: [
          {
            inputs: [{ internalType: 'uint256', name: 'aicAmount', type: 'uint256' }],
            name: 'convertAICToUSDC',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ] as const,
        functionName: 'convertAICToUSDC',
        args: [amountInWei],
        account: walletAddress as `0x${string}`,
      });

      await publicClient.waitForTransactionReceipt({ hash: convertHash });

      setTxHash(convertHash);
      setSuccess(true);
      setAicAmount('');
      await loadAICBalance();

      setTimeout(() => {
        setSuccess(false);
        setTxHash(null);
      }, 8000);
    } catch (err: any) {
      console.error('Conversion failed:', err);
      if (err.message?.includes('user rejected')) {
        setError('Transaction cancelled by user');
      } else if (err.message?.includes('insufficient funds')) {
        setError('Insufficient funds for gas');
      } else {
        setError('Conversion failed. The contract might not be deployed yet.');
      }
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Convert AIC to USDC
          </h2>
          <p className="text-gray-400 text-sm">
            Exchange Rate: 100 AIC = 1 USDC
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">From</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  Balance: {isLoadingBalance ? '...' : parseFloat(aicBalance).toFixed(2)} AIC
                </span>
                <button
                  onClick={() => loadAICBalance()}
                  disabled={isLoadingBalance}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={aicAmount}
                onChange={(e) => setAicAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
                disabled={isConverting}
              />
              <button
                onClick={handleMaxClick}
                className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors"
                disabled={isConverting}
              >
                MAX
              </button>
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                <img src="/aic toekn .png" alt="AIC" className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white">AIC</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-gray-800 rounded-full p-2 border border-cyan-500/30">
              <ArrowDown className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">To</label>
              <span className="text-sm text-gray-400">You'll receive</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={usdcAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
              />
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                <img
                  src="/usdc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-coin-cryptocurrency-symbol-crypto-coins-vol2-pack-science-technology-icons-7947905.webp"
                  alt="USDC"
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-bold text-white">USDC</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-medium">Conversion Successful!</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Your USDC is now in your wallet
                  </p>
                </div>
              </div>
              {txHash && (
                <a
                  href={`${getActiveArcExplorerUrl()}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mt-2"
                >
                  View Transaction
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={isConverting || !aicAmount || parseFloat(aicAmount) <= 0 || parseFloat(aicAmount) > parseFloat(aicBalance)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              'Convert AIC to USDC'
            )}
          </button>

          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2 text-sm">How it works:</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Enter amount of AIC you want to convert</li>
              <li>• Approve the transaction in MetaMask</li>
              <li>• Receive USDC instantly at 100:1 ratio</li>
              <li>• Use USDC to withdraw via Bridge, Card, or Bank</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
