import { useState } from 'react';
import { Heart, Loader2, CheckCircle, DollarSign, Users, TrendingUp, Zap, ExternalLink } from 'lucide-react';

interface TreasuryFunderProps {
  walletAddress?: string;
  usdcBalance: string;
}

export function TreasuryFunder({ walletAddress, usdcBalance }: TreasuryFunderProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const treasuryAddress = '0x43909cce967BE2a4448336a0ad95A99b7040BF05';
  const treasuryFunderAddress = '0xYourTreasuryFunderContract'; // Deploy and update this

  const handleFund = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = window.ethereum;

      // USDC contract address on Arc Testnet
      const usdcAddress = '0x3600000000000000000000000000000000000000';

      // ERC20 ABI for approve and transfer
      const erc20Abi = [
        {
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];

      // Convert amount to proper decimals (6 for USDC)
      const amountInWei = (parseFloat(amount) * 1_000_000).toString();

      // Direct transfer to treasury (gasless via Arc's USDC)
      const transferData = {
        from: walletAddress,
        to: usdcAddress,
        data: `0xa9059cbb${treasuryAddress.slice(2).padStart(64, '0')}${BigInt(amountInWei).toString(16).padStart(64, '0')}`
      };

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transferData]
      });

      setTxHash(hash as string);
      setSuccess(true);
      setAmount('');
    } catch (err: any) {
      console.error('Funding error:', err);
      setError(err.message || 'Failed to fund treasury');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
          <Heart className="w-5 h-5" />
          Fund Game Rewards
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent mb-3">
          Support Players, Grow the Ecosystem
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Contribute USDC to the treasury and help fund vocabulary game rewards. Your contribution helps players earn while they learn!
        </p>
      </div>

      {/* Treasury Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-cyan-400" />
            <span className="text-gray-300 text-sm">Treasury Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">7.04 USDC</p>
          <p className="text-xs text-gray-400 mt-1">Available for rewards</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-pink-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-pink-400" />
            <span className="text-gray-300 text-sm">Total Contributors</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-xs text-gray-400 mt-1">Community supporters</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span className="text-gray-300 text-sm">Rewards Paid</span>
          </div>
          <p className="text-2xl font-bold text-white">1,153 USDC</p>
          <p className="text-xs text-gray-400 mt-1">To players via AIC</p>
        </div>
      </div>

      {/* Funding Form */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-pink-500/30 mb-6">
        <h3 className="text-xl font-bold text-white mb-6">Contribute USDC</h3>

        <div className="mb-6">
          <label className="text-white font-semibold mb-2 block">Amount (USDC)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={!walletAddress || isLoading}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-lg border border-pink-500/30 focus:border-pink-500 focus:outline-none text-lg disabled:opacity-50"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-400">
              Your balance: <span className="text-pink-400 font-semibold">{parseFloat(usdcBalance).toFixed(2)} USDC</span>
            </p>
            <button
              onClick={() => setAmount(usdcBalance)}
              disabled={!walletAddress || isLoading}
              className="text-xs text-pink-400 hover:text-pink-300 font-semibold disabled:opacity-50"
            >
              Max
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setAmount('10')}
            disabled={!walletAddress || isLoading}
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all border border-pink-500/30 disabled:opacity-50"
          >
            10 USDC
          </button>
          <button
            onClick={() => setAmount('50')}
            disabled={!walletAddress || isLoading}
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all border border-pink-500/30 disabled:opacity-50"
          >
            50 USDC
          </button>
          <button
            onClick={() => setAmount('100')}
            disabled={!walletAddress || isLoading}
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all border border-pink-500/30 disabled:opacity-50"
          >
            100 USDC
          </button>
        </div>

        <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/30 mb-6">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-white mb-1">Gasless on Arc Network</p>
              <p>Arc uses USDC for gas, making this transaction essentially free. Your USDC goes directly to funding player rewards!</p>
            </div>
          </div>
        </div>

        {!walletAddress ? (
          <button
            disabled
            className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold py-4 rounded-lg opacity-50 cursor-not-allowed"
          >
            Connect Wallet to Fund Treasury
          </button>
        ) : (
          <button
            onClick={handleFund}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(usdcBalance) || isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500 text-white font-bold py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending USDC...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Fund Treasury with {amount || '0'} USDC
              </>
            )}
          </button>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && txHash && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300 font-semibold">Thank you for your contribution!</p>
            </div>
            <p className="text-sm text-gray-300">
              Your USDC has been sent to the treasury. Players will benefit from your generosity!
            </p>
            <a
              href={`https://testnet.arcscan.app/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-pink-400 hover:text-pink-300 underline inline-flex items-center gap-1"
            >
              View Transaction
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
        <h3 className="text-xl font-bold text-white mb-6">How Treasury Funding Works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">1</span>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Send USDC to Treasury</p>
              <p className="text-sm text-gray-400">Your USDC is sent directly to the game treasury wallet</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">2</span>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Players Earn AIC Rewards</p>
              <p className="text-sm text-gray-400">Players complete vocabulary challenges and earn AIC tokens</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">3</span>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Convert AIC to USDC</p>
              <p className="text-sm text-gray-400">Treasury sends USDC to players when they convert their AIC rewards</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-400 font-bold">4</span>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Players Bridge or Spend</p>
              <p className="text-sm text-gray-400">Players can bridge USDC to other chains or use virtual cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Treasury Address */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400 mb-1">Treasury Address:</p>
        <p className="text-sm font-mono text-gray-300 break-all">{treasuryAddress}</p>
      </div>
    </div>
  );
}
