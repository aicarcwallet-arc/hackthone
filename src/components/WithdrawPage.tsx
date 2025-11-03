import { useState } from 'react';
import { Send, CreditCard, Building2, DollarSign, ArrowDownUp } from 'lucide-react';
import { BridgeInterface } from './BridgeInterface';
import { VirtualCard } from './VirtualCard';
import { CircleBanking } from './CircleBanking';
import { DirectUSDCPayout } from './DirectUSDCPayout';
import { SimpleAICConverter } from './SimpleAICConverter';

interface WithdrawPageProps {
  walletAddress?: string;
  usdcBalance: string;
}

type WithdrawTab = 'convert' | 'payout' | 'bridge' | 'card' | 'bank';

export function WithdrawPage({ walletAddress, usdcBalance }: WithdrawPageProps) {
  const [activeTab, setActiveTab] = useState<WithdrawTab>('convert');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
          Withdraw Your USDC
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Choose how you want to use your funds - Bridge, Spend, or Save
        </p>
      </div>

      <div className="flex justify-center mb-8 px-2">
        <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-1 flex-col sm:flex-row gap-1 w-full sm:w-auto max-w-full">
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all touch-manipulation w-full sm:w-auto justify-start ${
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
            onClick={() => setActiveTab('payout')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all touch-manipulation w-full sm:w-auto justify-start ${
              activeTab === 'payout'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                : 'text-gray-300 hover:bg-green-500/20'
            }`}
          >
            <DollarSign className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold">Cash Out</div>
              <div className="text-xs opacity-75">Get your money</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all touch-manipulation w-full sm:w-auto justify-start ${
              activeTab === 'bridge'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                : 'text-gray-300 hover:bg-cyan-500/20'
            }`}
          >
            <Send className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold">Bridge</div>
              <div className="text-xs opacity-75">Cross-chain</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all touch-manipulation w-full sm:w-auto justify-start ${
              activeTab === 'card'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                : 'text-gray-300 hover:bg-cyan-500/20'
            }`}
          >
            <CreditCard className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold">Card</div>
              <div className="text-xs opacity-75">Spend</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-md font-medium text-sm transition-all touch-manipulation w-full sm:w-auto justify-start ${
              activeTab === 'bank'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                : 'text-gray-300 hover:bg-blue-500/20'
            }`}
          >
            <Building2 className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold">Bank</div>
              <div className="text-xs opacity-75">Save</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        {activeTab === 'convert' && walletAddress && (
          <div className="w-full max-w-2xl">
            <div className="mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <ArrowDownUp className="w-5 h-5" />
                Step 1: Convert AIC to USDC
              </h3>
              <p className="text-gray-300 text-sm">
                First, convert your claimed AIC tokens into USDC at a 1:1 ratio. Then you can withdraw the USDC.
              </p>
            </div>
            <SimpleAICConverter walletAddress={walletAddress} />
          </div>
        )}

        {activeTab === 'payout' && walletAddress && (
          <DirectUSDCPayout walletAddress={walletAddress} />
        )}

        {activeTab === 'bridge' && (
          <div className="w-full">
            <div className="mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Bridge Your USDC to Any Chain
              </h3>
              <p className="text-gray-300 text-sm">
                Transfer USDC from Arc to Ethereum, Arbitrum, Base, Optimism, and more using Circle's CCTP technology.
              </p>
            </div>
            <BridgeInterface />
          </div>
        )}

        {activeTab === 'card' && (
          <div className="w-full">
            <div className="mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                AiC-Arc Visa Virtual Card
              </h3>
              <p className="text-gray-300 text-sm">
                Load USDC onto your virtual card and spend at 70+ million merchants worldwide. Earn 5% AiC cashback on every purchase!
              </p>
              <div className="mt-2 inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30">
                <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-4 h-4" />
                <span className="text-xs text-blue-400">Circle Partner Alliance</span>
              </div>
            </div>
            <VirtualCard walletAddress={walletAddress} usdcBalance={usdcBalance} />
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="w-full">
            <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                AiC-Circle Banking System
              </h3>
              <p className="text-gray-300 text-sm">
                Withdraw USDC to your traditional bank account via ACH (free), Wire ($15), or Instant Transfer ($2.50). Bridge crypto to fiat seamlessly.
              </p>
              <div className="mt-2 inline-flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30">
                <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-4 h-4" />
                <span className="text-xs text-purple-400">Circle Partner Alliance</span>
              </div>
            </div>
            <CircleBanking walletAddress={walletAddress} usdcBalance={usdcBalance} />
          </div>
        )}
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 border cursor-pointer transition-all ${
          activeTab === 'bridge'
            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            : 'bg-gray-800/30 border-gray-700 hover:border-cyan-500/30'
        }`} onClick={() => setActiveTab('bridge')}>
          <Send className="w-8 h-8 text-cyan-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Cross-Chain Bridge</h4>
          <p className="text-xs text-gray-400">Access any blockchain ecosystem with CCTP</p>
        </div>

        <div className={`rounded-lg p-4 border cursor-pointer transition-all ${
          activeTab === 'card'
            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            : 'bg-gray-800/30 border-gray-700 hover:border-cyan-500/30'
        }`} onClick={() => setActiveTab('card')}>
          <CreditCard className="w-8 h-8 text-cyan-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Virtual Card</h4>
          <p className="text-xs text-gray-400">Spend crypto anywhere Visa is accepted</p>
        </div>

        <div className={`rounded-lg p-4 border cursor-pointer transition-all ${
          activeTab === 'bank'
            ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
            : 'bg-gray-800/30 border-gray-700 hover:border-purple-500/30'
        }`} onClick={() => setActiveTab('bank')}>
          <Building2 className="w-8 h-8 text-purple-400 mb-2" />
          <h4 className="font-bold text-white mb-1">Banking System</h4>
          <p className="text-xs text-gray-400">Withdraw to your traditional bank account</p>
        </div>
      </div>
    </div>
  );
}
