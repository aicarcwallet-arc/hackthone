import { Building2, Sparkles, Infinity, Zap, TrendingUp, CheckCircle } from 'lucide-react';

interface CircleDemoWidgetProps {
  treasuryBalance?: number;
  pendingRequests?: number;
}

export function CircleDemoWidget({ treasuryBalance = 0, pendingRequests = 0 }: CircleDemoWidgetProps) {
  return (
    <div className="w-full bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl border-2 border-blue-500/30 p-6 mb-6 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Circle Programmable Wallets Demo
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </h3>
          <p className="text-sm text-blue-300">Ready for Partnership Integration</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Current System</span>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Limited</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">${treasuryBalance.toFixed(2)}</span>
            <span className="text-sm text-gray-400">USDC</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Manual Treasury Balance</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs text-gray-300 uppercase tracking-wide">With Circle API</span>
            <Infinity className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Unlimited</span>
          </div>
          <p className="text-xs text-blue-300 mt-2 relative z-10">Circle Mints On-Demand</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/30 mb-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-300 mb-1">System Ready for Integration</p>
            <p className="text-xs text-gray-300">
              Our edge functions are configured to use Circle Programmable Wallets API.
              Just need API credentials to enable unlimited USDC minting capacity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-black/20 rounded-lg p-3 text-center border border-purple-500/20">
          <Zap className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Gasless</p>
          <p className="text-sm font-bold text-purple-300">Users</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center border border-blue-500/20">
          <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Infinite</p>
          <p className="text-sm font-bold text-blue-300">Scalability</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center border border-pink-500/20">
          <Sparkles className="w-4 h-4 text-pink-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Auto</p>
          <p className="text-sm font-bold text-pink-300">Minting</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400 mb-2">
          Demo currently using manual treasury. With Circle API access, system enables unlimited capacity.
        </p>
        <a
          href="/CIRCLE_PARTNERSHIP_REQUEST.md"
          target="_blank"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <Building2 className="w-4 h-4" />
          View Partnership Request
        </a>
      </div>
    </div>
  );
}
