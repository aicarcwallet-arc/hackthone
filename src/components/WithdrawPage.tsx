import { useState } from 'react';
import { Wallet, ArrowDownUp } from 'lucide-react';
import { SimpleAICConverter } from './SimpleAICConverter';
import { DirectUSDCPayout } from './DirectUSDCPayout';

interface WithdrawPageProps {
  walletAddress?: string;
  usdcBalance: string;
}

type WithdrawTab = 'convert' | 'withdraw';

export function WithdrawPage({ walletAddress, usdcBalance }: WithdrawPageProps) {
  const [activeTab, setActiveTab] = useState<WithdrawTab>('convert');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
          Cash Out Your Rewards
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Convert your AIC tokens to USDC and withdraw to your wallet
        </p>
      </div>

      <div className="flex justify-center mb-8 px-2">
        <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-1 gap-2 w-full sm:w-auto max-w-full">
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-2 px-6 sm:px-8 py-4 rounded-md font-medium text-base transition-all touch-manipulation flex-1 sm:flex-none justify-center ${
              activeTab === 'convert'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                : 'text-gray-300 hover:bg-cyan-500/20'
            }`}
          >
            <ArrowDownUp className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold">Convert</div>
              <div className="text-xs opacity-75">AIC to USDC</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex items-center gap-2 px-6 sm:px-8 py-4 rounded-md font-medium text-base transition-all touch-manipulation flex-1 sm:flex-none justify-center ${
              activeTab === 'withdraw'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                : 'text-gray-300 hover:bg-green-500/20'
            }`}
          >
            <Wallet className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold">Withdraw</div>
              <div className="text-xs opacity-75">To Wallet</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mb-6">
        {activeTab === 'convert' && walletAddress && (
          <SimpleAICConverter walletAddress={walletAddress} />
        )}

        {activeTab === 'withdraw' && walletAddress && (
          <DirectUSDCPayout walletAddress={walletAddress} />
        )}

        {!walletAddress && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <p className="text-yellow-400 font-medium">
              Please connect your wallet to continue
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ArrowDownUp className="w-5 h-5 text-cyan-400" />
          How It Works
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Play & Earn</h4>
              <p className="text-gray-400 text-sm">
                Play vocabulary games and earn AIC tokens as rewards
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Convert to USDC</h4>
              <p className="text-gray-400 text-sm">
                Click "Convert" to swap your AIC tokens to USDC instantly
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Withdraw to Wallet</h4>
              <p className="text-gray-400 text-sm">
                Click "Withdraw" to send USDC directly to your MetaMask wallet on Arc Network
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Use Anywhere</h4>
              <p className="text-gray-400 text-sm">
                Once in your wallet, send USDC anywhere, trade on DEX, or bridge to other chains
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <div className="flex items-start gap-2 text-cyan-400">
            <Wallet className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Your funds, your control.</strong> USDC goes directly to your MetaMask wallet.
              You can send it anywhere or use it on any dApp on Arc Network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
