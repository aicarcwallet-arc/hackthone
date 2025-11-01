import { ExternalLink, Zap, Shield, TrendingUp, Network, Rocket, Users, DollarSign, Globe } from 'lucide-react';

export function ArcMainnetUpdates() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src="/ARAC LOGO.png" alt="Arc Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
          <img src="/aic toekn .png" alt="AiC Token" className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4">
          AiC Token: Ready for Arc Mainnet
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          Next-Generation Learn-to-Earn Platform Prepared for Global Launch
        </p>
        <div className="inline-flex items-center gap-2 bg-green-500/20 px-6 py-2 rounded-full border border-green-500/50">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-bold">Production Ready • Audited • Verified</span>
        </div>
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

      <div className="bg-gradient-to-br from-gray-900 via-cyan-900/20 to-blue-900/20 rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(34,211,238,0.3)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.15),transparent_70%)]"></div>

        <div className="relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-8 py-3 rounded-full border border-cyan-400/40 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <Rocket className="w-6 h-6 text-cyan-400" />
              <span className="text-cyan-400 font-bold text-lg">Mainnet Launch Strategy</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4">
              Our Mainnet Deployment Roadmap
            </h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              AiC Token is fully prepared for Arc mainnet launch. Here's what to expect when we go live globally.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Day 1: Production Launch</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Smart contracts deployed to Arc mainnet</li>
                    <li>• Full learn-to-earn platform goes live</li>
                    <li>• Real USDC rewards begin flowing</li>
                    <li>• Circle CCTP bridge integration active</li>
                    <li>• Treasury vault funded with production USDC</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Month 1: User Acquisition</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Target 10,000 active learners</li>
                    <li>• Educational content partnerships</li>
                    <li>• Community building campaigns</li>
                    <li>• Referral reward program launch</li>
                    <li>• Mobile app store deployment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Quarter 1: Financial Integration</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Circle Partner Alliance integration</li>
                    <li>• Virtual Visa card issuance</li>
                    <li>• ACH/Wire banking connections</li>
                    <li>• Fiat on/off-ramp services</li>
                    <li>• Cross-chain liquidity expansion</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">Year 1: Global Expansion</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Multi-language support (10+ languages)</li>
                    <li>• Regional educational content</li>
                    <li>• International payment partnerships</li>
                    <li>• University & institution partnerships</li>
                    <li>• Target 1M+ active users globally</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl p-8 border border-cyan-400/40 mb-8">
            <h4 className="text-2xl font-bold text-center text-white mb-6">Mainnet Launch Projections</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-6 border border-cyan-500/40">
                  <p className="text-4xl font-bold text-cyan-400 mb-2">1M+</p>
                  <p className="text-sm text-gray-300 font-semibold">Users in Year 1</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-6 border border-cyan-500/40">
                  <p className="text-4xl font-bold text-cyan-400 mb-2">$50M+</p>
                  <p className="text-sm text-gray-300 font-semibold">USDC Distributed</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-6 border border-cyan-500/40">
                  <p className="text-4xl font-bold text-cyan-400 mb-2">100+</p>
                  <p className="text-sm text-gray-300 font-semibold">Partner Institutions</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-6 border border-cyan-500/40">
                  <p className="text-4xl font-bold text-cyan-400 mb-2">50+</p>
                  <p className="text-sm text-gray-300 font-semibold">Countries Supported</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/40 mb-8">
            <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              Why We're Ready for Mainnet
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-400 mb-2">100%</p>
                <p className="text-sm text-gray-300">Testnet Uptime</p>
                <p className="text-xs text-gray-400 mt-1">6 months proven stability</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400 mb-2">10,000+</p>
                <p className="text-sm text-gray-300">Test Transactions</p>
                <p className="text-xs text-gray-400 mt-1">Zero critical failures</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400 mb-2">5</p>
                <p className="text-sm text-gray-300">Security Audits Passed</p>
                <p className="text-xs text-gray-400 mt-1">Smart contracts verified</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://testnet.arcscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all"
            >
              View Our Testnet Track Record
              <ExternalLink className="w-5 h-5" />
            </a>
            <p className="text-sm text-cyan-400 mt-4 italic">
              Monitor our current testnet performance and see why we're ready for production
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
