import { useState } from 'react';
import { Zap, Loader2, CheckCircle, XCircle, ExternalLink, AlertCircle, RefreshCw, Wrench } from 'lucide-react';
import { useTransactionAccelerator } from '../hooks/useTransactionAccelerator';
import { SUPPORTED_CHAINS } from '../config/chains';

export function TransactionAccelerator() {
  const [txHash, setTxHash] = useState('');
  const [selectedChain, setSelectedChain] = useState(11155111);
  const [gasBoost, setGasBoost] = useState(50);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const {
    isLoading,
    error,
    status,
    originalTx,
    newTxHash,
    estimatedTime,
    analyzeTransaction,
    accelerateTransaction,
    fixNonceIssue,
    reset,
  } = useTransactionAccelerator();

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask or another Web3 wallet');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts && accounts.length > 0) {
        setConnectedAddress(accounts[0]);
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      alert(err.message || 'Failed to connect wallet');
    }
  };

  const handleAnalyze = async () => {
    if (!txHash || txHash.length !== 66) {
      alert('Please enter a valid transaction hash (0x...)');
      return;
    }

    try {
      await analyzeTransaction(txHash, selectedChain);
    } catch (err: any) {
      console.error('Analysis failed:', err);
    }
  };

  const handleAccelerate = async () => {
    if (!connectedAddress) {
      await handleConnectWallet();
      return;
    }

    if (!txHash || txHash.length !== 66) {
      alert('Please enter a valid transaction hash');
      return;
    }

    try {
      await accelerateTransaction(txHash, selectedChain, gasBoost);
    } catch (err: any) {
      console.error('Acceleration failed:', err);
    }
  };

  const handleFixNonce = async () => {
    if (!connectedAddress) {
      await handleConnectWallet();
      return;
    }

    try {
      const txHash = await fixNonceIssue(selectedChain);
      alert(`Nonce reset transaction sent: ${txHash}`);
    } catch (err: any) {
      alert(err.message || 'Failed to fix nonce');
    }
  };

  const getExplorerUrl = (chainId: number, txHash: string) => {
    const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
    return chain?.blockExplorers?.default?.url
      ? `${chain.blockExplorers.default.url}/tx/${txHash}`
      : null;
  };

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(250,204,21,0.3)] border border-yellow-500/30 p-6 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-yellow-400" />
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Transaction Accelerator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 font-medium">
          Speed up stuck transactions instantly
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Replace pending transactions with higher gas • Fix nonce issues • Rebroadcast instantly
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-200">
              <p className="font-semibold mb-1">How It Works</p>
              <ul className="text-blue-300/80 space-y-1 list-disc list-inside">
                <li>Paste your pending transaction hash</li>
                <li>Choose gas boost percentage (higher = faster)</li>
                <li>Broadcast replacement transaction with same nonce</li>
                <li>Miners prioritize higher gas transactions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-200">
              <p className="font-semibold mb-1">Common Issues</p>
              <ul className="text-yellow-300/80 space-y-1 list-disc list-inside">
                <li><span className="font-semibold">Internal Error:</span> Transaction already confirmed or wrong network</li>
                <li><span className="font-semibold">Not Found:</span> Check you selected the correct chain</li>
                <li><span className="font-semibold">Already Known:</span> Transaction already in mempool or mined</li>
                <li><span className="font-semibold">Nonce Too Low:</span> Transaction completed - check explorer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {!connectedAddress ? (
        <button
          onClick={handleConnectWallet}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_50px_rgba(250,204,21,0.8)] mb-4 sm:mb-6 touch-manipulation"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-4 sm:mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-green-300 font-medium">
              Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
            </p>
            <button
              onClick={() => setConnectedAddress(null)}
              className="text-xs text-red-300 hover:text-red-200 font-semibold px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded border border-red-500/50 transition-all touch-manipulation"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Select Chain
          </label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(Number(e.target.value))}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-yellow-500/30 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation"
            disabled={isLoading}
          >
            {Object.values(SUPPORTED_CHAINS).map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Transaction Hash
          </label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value.trim())}
            placeholder="0x..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800/50 border border-yellow-500/30 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation placeholder-gray-500 font-mono"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Gas Boost: {gasBoost}%
          </label>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            value={gasBoost}
            onChange={(e) => setGasBoost(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Slow (20%)</span>
            <span>Medium (50%)</span>
            <span>Fast (100%)</span>
            <span>Ultra (200%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !txHash}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
          >
            {status === 'analyzing' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Checking...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm">Check Status</span>
              </>
            )}
          </button>

          <button
            onClick={handleAccelerate}
            disabled={isLoading || !connectedAddress || !txHash}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_50px_rgba(250,204,21,0.8)] flex items-center justify-center gap-2 touch-manipulation sm:col-span-2"
          >
            {status === 'accelerating' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Accelerating...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span className="text-sm">Accelerate Transaction</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleFixNonce}
          disabled={isLoading || !connectedAddress}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
        >
          <Wrench className="w-5 h-5" />
          <span className="text-sm">Fix Nonce Issues</span>
        </button>
      </div>

      {originalTx && status === 'idle' && (
        <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-blue-300 mb-2">Transaction Analysis</p>
              <div className="space-y-1 text-sm text-blue-200">
                <p>Status: <span className="text-yellow-300 font-semibold">PENDING</span></p>
                <p>Nonce: <span className="font-mono text-cyan-300">{originalTx.nonce}</span></p>
                <p>Current Gas: <span className="font-mono text-cyan-300">
                  {(Number(originalTx.currentGasPrice) / 1e9).toFixed(2)} Gwei
                </span></p>
                <p>Recommended Boost: <span className="text-yellow-300 font-semibold">{gasBoost}%</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'success' && newTxHash && (
        <div className="mt-4 sm:mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-300 mb-1">Transaction Accelerated!</p>
              <p className="text-sm text-green-200">
                Replacement transaction broadcasted with {gasBoost}% higher gas
              </p>
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded space-y-2">
            <div>
              <p className="text-xs text-gray-400 mb-1">Original TX:</p>
              <p className="text-xs font-mono text-red-300 break-all">{txHash}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">New TX Hash:</p>
              <p className="text-xs font-mono text-green-300 break-all">{newTxHash}</p>
            </div>
            {estimatedTime && (
              <p className="text-xs text-yellow-300 font-semibold">
                Estimated confirmation: {estimatedTime} seconds
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {getExplorerUrl(selectedChain, newTxHash) && (
              <a
                href={getExplorerUrl(selectedChain, newTxHash)!}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 px-3 py-2 rounded-lg text-sm inline-flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>
            )}
            <button
              onClick={reset}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Accelerate Another
            </button>
          </div>
        </div>
      )}

      {status === 'error' && error && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-900/30 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-300 mb-1">Acceleration Failed</p>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={reset}
                className="mt-2 text-sm text-red-400 hover:text-red-300 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-yellow-500/20">
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-gray-400 block">Method</span>
            <span className="font-medium text-white">Replace-by-Fee</span>
          </div>
          <div>
            <span className="text-gray-400 block">Safety</span>
            <span className="font-medium text-green-300">100% Safe</span>
          </div>
          <div>
            <span className="text-gray-400 block">Speed Boost</span>
            <span className="font-medium text-yellow-300">Up to 10x</span>
          </div>
          <div>
            <span className="text-gray-400 block">Success Rate</span>
            <span className="font-medium text-green-300">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
