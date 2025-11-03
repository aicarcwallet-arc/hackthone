import { useState, useEffect } from 'react';
import { Flame, Loader2, ExternalLink, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { createPublicClient, createWalletClient, custom, http, formatUnits, parseUnits } from 'viem';
import { SUPPORTED_CHAINS, getActiveArcExplorerUrl } from '../config/chains';
import { USDC_ADDRESS, ERC20_ABI } from '../config/contracts';

interface BurnPegInterfaceProps {
  walletAddress?: string;
}

const BURN_PEG_ADDRESS = import.meta.env.VITE_AIC_BURN_PEG_ADDRESS as `0x${string}` | undefined;
const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD' as const;

const BURN_PEG_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'usdcAmount', type: 'uint256' }],
    name: 'burnUSDCForAIC',
    outputs: [{ internalType: 'uint256', name: 'aicAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'usdcAmount', type: 'uint256' }],
    name: 'getBurnQuote',
    outputs: [
      { internalType: 'uint256', name: 'aicAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'fee', type: 'uint256' },
      { internalType: 'uint256', name: 'bonus', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalBurned',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBurnStats',
    outputs: [
      { internalType: 'uint256', name: 'totalBurned', type: 'uint256' },
      { internalType: 'uint256', name: 'totalMinted', type: 'uint256' },
      { internalType: 'uint256', name: 'burnedInDeadAddress', type: 'uint256' },
      { internalType: 'uint256', name: 'burnToMintRatio', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'usdcAmount', type: 'uint256' }],
    name: 'canBurn',
    outputs: [
      { internalType: 'bool', name: '', type: 'bool' },
      { internalType: 'string', name: 'reason', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRemainingDailyCapacity',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function BurnPegInterface({ walletAddress }: BurnPegInterfaceProps) {
  const [burnAmount, setBurnAmount] = useState('');
  const [aicQuote, setAicQuote] = useState('0');
  const [bonusPercent, setBonusPercent] = useState(0);
  const [fee, setFee] = useState('0');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [totalBurned, setTotalBurned] = useState('0');
  const [deadAddressBalance, setDeadAddressBalance] = useState('0');

  const publicClient = createPublicClient({
    chain: SUPPORTED_CHAINS.ARC_TESTNET,
    transport: http('https://rpc.testnet.arc.network'),
  });

  const contractsDeployed = BURN_PEG_ADDRESS && USDC_ADDRESS;

  useEffect(() => {
    if (walletAddress && contractsDeployed) {
      loadBalances();
      loadBurnStats();
    }
  }, [walletAddress, contractsDeployed]);

  useEffect(() => {
    if (burnAmount && parseFloat(burnAmount) > 0 && contractsDeployed) {
      getQuote();
    } else {
      setAicQuote('0');
      setFee('0');
      setBonusPercent(0);
    }
  }, [burnAmount, contractsDeployed]);

  const loadBalances = async () => {
    if (!walletAddress || !USDC_ADDRESS) return;

    try {
      const balance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      });

      setUsdcBalance(formatUnits(balance, 6));

      const deadBalance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [DEAD_ADDRESS],
      });

      setDeadAddressBalance(formatUnits(deadBalance, 6));
    } catch (err) {
      console.error('Error loading balances:', err);
    }
  };

  const loadBurnStats = async () => {
    if (!BURN_PEG_ADDRESS) return;

    try {
      const stats = await publicClient.readContract({
        address: BURN_PEG_ADDRESS,
        abi: BURN_PEG_ABI,
        functionName: 'getBurnStats',
      });

      setTotalBurned(formatUnits(stats[0], 6));
    } catch (err) {
      console.error('Error loading burn stats:', err);
    }
  };

  const getQuote = async () => {
    if (!BURN_PEG_ADDRESS || !burnAmount) return;

    try {
      const amount = parseUnits(burnAmount, 6);
      const quote = await publicClient.readContract({
        address: BURN_PEG_ADDRESS,
        abi: BURN_PEG_ABI,
        functionName: 'getBurnQuote',
        args: [amount],
      });

      setAicQuote(formatUnits(quote[0], 6));
      setFee(formatUnits(quote[1], 6));
      setBonusPercent(Number(quote[2]));
    } catch (err) {
      console.error('Error getting quote:', err);
    }
  };

  const handleBurn = async () => {
    if (!window.ethereum || !walletAddress || !BURN_PEG_ADDRESS || !USDC_ADDRESS) {
      setError('Please connect your wallet');
      return;
    }

    if (!burnAmount || parseFloat(burnAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(burnAmount) > parseFloat(usdcBalance)) {
      setError('Insufficient USDC balance');
      return;
    }

    setLoading(true);
    setError('');
    setTxHash('');

    try {
      const walletClient = createWalletClient({
        account: walletAddress as `0x${string}`,
        chain: SUPPORTED_CHAINS.ARC_TESTNET,
        transport: custom(window.ethereum),
      });

      const amount = parseUnits(burnAmount, 6);

      const allowance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [walletAddress as `0x${string}`, BURN_PEG_ADDRESS],
      });

      if (allowance < amount) {
        const approveHash = await walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [BURN_PEG_ADDRESS, amount],
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const hash = await walletClient.writeContract({
        address: BURN_PEG_ADDRESS,
        abi: BURN_PEG_ABI,
        functionName: 'burnUSDCForAIC',
        args: [amount],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setTxHash(hash);
      setBurnAmount('');
      await loadBalances();
      await loadBurnStats();
    } catch (err: any) {
      console.error('Burn error:', err);
      setError(err.message || 'Burn failed');
    } finally {
      setLoading(false);
    }
  };

  const getBonusTier = (amount: number) => {
    if (amount >= 100000) return { tier: 'TIER 3', bonus: '5%', color: 'text-purple-400' };
    if (amount >= 10000) return { tier: 'TIER 2', bonus: '3%', color: 'text-blue-400' };
    if (amount >= 1000) return { tier: 'TIER 1', bonus: '1%', color: 'text-green-400' };
    return { tier: 'BASE', bonus: '0%', color: 'text-gray-400' };
  };

  const currentTier = getBonusTier(parseFloat(burnAmount) || 0);

  if (!contractsDeployed) {
    return (
      <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-red-500/30 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Flame className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Burn-Peg (Not Deployed)</h2>
            <p className="text-sm text-gray-400">Deploy contracts to enable burn mechanism</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            The Burn-Peg contract is not deployed yet. See <strong>BURN_PEG_GUIDE.md</strong> for deployment instructions.
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
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Flame className="w-8 h-8 text-red-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Burn-Peg Mechanism</h2>
            <p className="text-gray-200 mb-3">
              <strong>Burn USDC → Mint AIC (1:1 + Bonus)</strong>
            </p>
            <p className="text-sm text-gray-300">
              USDC is permanently destroyed (sent to dead address), creating deflationary pressure and backing AIC value. No liquidity pool needed!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-red-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-red-400" />
            <p className="text-sm text-gray-400">Total USDC Burned</p>
          </div>
          <p className="text-2xl font-bold text-white">{parseFloat(totalBurned).toFixed(2)} USDC</p>
          <p className="text-xs text-gray-500 mt-1">Permanently removed from circulation</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-orange-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-5 h-5 text-orange-400" />
            <p className="text-sm text-gray-400">Dead Address Balance</p>
          </div>
          <p className="text-2xl font-bold text-white">{parseFloat(deadAddressBalance).toFixed(2)} USDC</p>
          <a
            href={`${getActiveArcExplorerUrl()}/address/${DEAD_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-1"
          >
            Verify on Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-green-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-sm text-gray-400">Your USDC Balance</p>
          </div>
          <p className="text-2xl font-bold text-white">{parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</p>
          <p className="text-xs text-gray-500 mt-1">Available to burn</p>
        </div>
      </div>

      {/* Main Burn Interface */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-red-500/30 p-8">
        {txHash ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Burn Successful!</h3>
                <p className="text-sm text-gray-400">Your USDC has been permanently burned</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">USDC Burned:</span>
                <span className="text-white font-semibold">{burnAmount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">AIC Received:</span>
                <span className="text-green-400 font-semibold">{aicQuote} AIC</span>
              </div>
              {bonusPercent > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bonus:</span>
                  <span className="text-purple-400 font-semibold">+{bonusPercent}%</span>
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 p-3 rounded">
              <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
              <p className="text-xs font-mono text-cyan-300 break-all">{txHash}</p>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={`${getActiveArcExplorerUrl()}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 px-4 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Arc Explorer
              </a>
              <a
                href={`${getActiveArcExplorerUrl()}/address/${DEAD_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Flame className="w-4 h-4" />
                View Dead Address (Burned USDC)
              </a>
              <button
                onClick={() => {
                  setTxHash('');
                  setError('');
                }}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2"
              >
                Burn More USDC
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Burn Amount Input */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="block text-sm text-gray-300 font-semibold">Burn Amount (USDC)</label>
                <button
                  onClick={() => setBurnAmount(usdcBalance)}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Max: {parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                </button>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/50 border border-red-500/30 rounded-lg px-4 py-4">
                <input
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 text-2xl bg-transparent border-none outline-none text-white placeholder-gray-500"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-300">USDC</span>
                </div>
              </div>
            </div>

            {/* Quote Display */}
            {parseFloat(burnAmount) > 0 && (
              <div className="mb-6 space-y-3">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/40 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">You will receive:</span>
                    <span className="text-2xl font-bold text-green-400">{parseFloat(aicQuote).toFixed(2)} AIC</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Bonus Tier</p>
                    <p className={`font-bold ${currentTier.color}`}>{currentTier.tier} ({currentTier.bonus})</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Protocol Fee</p>
                    <p className="font-bold text-white">{parseFloat(fee).toFixed(4)} USDC (0.5%)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bonus Tiers Info */}
            <div className="mb-6 bg-gray-800/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-300 mb-3">🎁 Bonus Tiers (Bigger Burns = More AIC)</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">1,000 - 9,999 USDC</span>
                  <span className="text-green-400 font-semibold">+1% Bonus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">10,000 - 99,999 USDC</span>
                  <span className="text-blue-400 font-semibold">+3% Bonus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">100,000+ USDC</span>
                  <span className="text-purple-400 font-semibold">+5% Bonus</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Warning */}
            <div className="mb-6 bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-orange-300 mb-1">⚠️ PERMANENT BURN</p>
                <p>USDC will be sent to the dead address (0x...dead) and <strong>CANNOT be recovered</strong>. This is permanent and irreversible!</p>
              </div>
            </div>

            {/* Burn Button */}
            <button
              onClick={handleBurn}
              disabled={loading || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > parseFloat(usdcBalance)}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Burning USDC...</span>
                </>
              ) : (
                <>
                  <Flame className="w-6 h-6" />
                  Burn USDC for AIC
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔥 This permanently removes USDC from circulation, creating real scarcity and backing AIC value
            </p>
          </>
        )}
      </div>
    </div>
  );
}
