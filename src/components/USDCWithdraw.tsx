import { useState } from 'react';
import { Send, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { createPublicClient, createWalletClient, custom, http, parseUnits } from 'viem';
import { SUPPORTED_CHAINS, getActiveArcExplorerUrl } from '../config/chains';
import { USDC_ADDRESS, ERC20_ABI } from '../config/contracts';

interface USDCWithdrawProps {
  walletAddress: string;
  usdcBalance: string;
  onSuccess?: () => void;
}

export function USDCWithdraw({ walletAddress, usdcBalance, onSuccess }: USDCWithdrawProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const publicClient = createPublicClient({
    chain: SUPPORTED_CHAINS.ARC_TESTNET,
    transport: http('https://rpc.testnet.arc.network'),
  });

  const handleWithdraw = async () => {
    if (!window.ethereum || !USDC_ADDRESS) {
      setError('MetaMask not connected or USDC contract not available');
      return;
    }

    if (!recipientAddress || !amount) {
      setError('Please enter recipient address and amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(usdcBalance)) {
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

      const amountInUnits = parseUnits(amount, 6);

      const hash = await walletClient.writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amountInUnits],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setTxHash(hash);
      setRecipientAddress('');
      setAmount('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Withdraw error:', err);
      setError(err.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(usdcBalance);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/20 p-2 rounded-lg">
          <Send className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Send USDC</h3>
          <p className="text-sm text-gray-400">Transfer to any Arc address</p>
        </div>
      </div>

      {txHash ? (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-green-400 font-semibold">Transfer Successful!</p>
          </div>
          <div className="bg-gray-800/50 p-2 rounded">
            <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
            <p className="text-xs font-mono text-cyan-300 break-all">{txHash}</p>
          </div>
          <a
            href={`${getActiveArcExplorerUrl()}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Arc Explorer
          </a>
          <button
            onClick={() => setTxHash('')}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors"
          >
            Send Another Transfer
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Recipient Address (Arc Testnet)
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm text-gray-300">Amount</label>
                <button
                  onClick={setMaxAmount}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                  disabled={loading}
                >
                  Max: {parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                </button>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  disabled={loading}
                />
                <span className="text-gray-300 font-semibold">USDC</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={loading || !recipientAddress || !amount || parseFloat(amount) <= 0}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sign in MetaMask...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send USDC
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            💡 This transfers USDC from your MetaMask wallet to another address on Arc Testnet
          </p>
        </>
      )}
    </div>
  );
}
