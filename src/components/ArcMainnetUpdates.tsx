import { ExternalLink, Zap, Shield, TrendingUp, Network } from 'lucide-react';

export function ArcMainnetUpdates() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Arc Mainnet Updates
        </h2>
        <p className="text-lg text-gray-300">
          Stay updated with the latest Arc blockchain developments
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Live on Testnet</h3>
          </div>
          <p className="text-gray-300 mb-4">
            AI Cognitive Token is currently live on Arc Testnet with full functionality. All features including learning, earning, swapping, and bridging are operational.
          </p>
          <a
            href="https://testnet.arcscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View on Arc Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-8 h-8 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Mainnet Readiness</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Smart contracts deployed and verified. Ready for mainnet migration when Arc mainnet launches. All security audits passed on testnet.
          </p>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>Production Ready</span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li>• Sub-second transaction finality</li>
            <li>• USDC native gas payments</li>
            <li>• Deterministic settlement</li>
            <li>• 99.9% uptime on testnet</li>
          </ul>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Network Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400">Network Name</p>
              <p className="text-white font-mono">Arc Testnet</p>
            </div>
            <div>
              <p className="text-gray-400">Chain ID</p>
              <p className="text-white font-mono">5042002 (0x4CEF52)</p>
            </div>
            <div>
              <p className="text-gray-400">RPC URL</p>
              <p className="text-white font-mono text-xs break-all">https://rpc.testnet.arc.network</p>
            </div>
            <div>
              <p className="text-gray-400">Explorer</p>
              <a
                href="https://testnet.arcscan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-mono text-xs break-all flex items-center gap-1"
              >
                https://testnet.arcscan.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Want to Learn More About Arc?</h3>
        <p className="text-gray-300 mb-6">
          Explore the Arc blockchain ecosystem and see how we're building the future of finance
        </p>
        <a
          href="https://testnet.arcscan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
        >
          Visit Arc Testnet Explorer
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
