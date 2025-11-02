import { useState } from 'react';
import { Rocket, CheckCircle, Zap, DollarSign, Globe2, Code, Heart, Users, TrendingUp, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export function MainnetReadyPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'technical' | 'funding'>('overview');

  return (
    <div className="w-full min-h-screen pb-20">
      {/* Hero Section with Flashing Animation */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative text-center py-16 px-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-lg font-black mb-6 shadow-[0_0_40px_rgba(34,197,94,0.6)] animate-pulse">
            <Rocket className="w-6 h-6" />
            <span className="text-xl">ARC MAINNET READY</span>
            <Sparkles className="w-6 h-6" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
              100% Ready for
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
              Arc Mainnet Launch! 🚀
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Complete ecosystem with <span className="text-green-400 font-bold">gasless treasury funding</span>, vocabulary gaming, and instant USDC rewards. Deploy-ready in one click!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-green-500/20 border border-green-500/50 rounded-full px-6 py-3 backdrop-blur-sm">
              <p className="text-green-400 font-bold">✓ Smart Contracts Ready</p>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-full px-6 py-3 backdrop-blur-sm">
              <p className="text-emerald-400 font-bold">✓ Gasless Funding</p>
            </div>
            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-full px-6 py-3 backdrop-blur-sm">
              <p className="text-cyan-400 font-bold">✓ Mobile Optimized</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-8 px-4">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeSection === 'overview'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Overview
        </button>
        <button
          onClick={() => setActiveSection('technical')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeSection === 'technical'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Code className="w-5 h-5" />
          Technical
        </button>
        <button
          onClick={() => setActiveSection('funding')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeSection === 'funding'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5" />
          Gasless Funding
        </button>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-2xl p-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Complete Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Vocabulary Game
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  AIC Token Rewards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  USDC Conversion
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Cross-Chain Bridge
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Virtual Cards
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 rounded-2xl p-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gasless Magic</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  USDC as Gas Token
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  0.007 USDC per TX
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  No ETH Needed
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Single Currency
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Predictable Costs
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                <Globe2 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Production Ready</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Mobile Responsive
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  PWA Installable
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Database Ready
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Edge Functions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Full Documentation
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Mainnet Migration</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-black text-green-400 mb-2">1</p>
                <p className="text-gray-400">Variable to Change</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-emerald-400 mb-2">5</p>
                <p className="text-gray-400">Contracts to Deploy</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-cyan-400 mb-2">10</p>
                <p className="text-gray-400">Minutes to Launch</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-blue-400 mb-2">100%</p>
                <p className="text-gray-400">Ready to Scale</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Section */}
      {activeSection === 'technical' && (
        <div className="space-y-8 px-4">
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Code className="w-7 h-7 text-green-400" />
              Smart Contracts Deployed
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-green-400 font-bold">AICToken.sol</h4>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-gray-400 text-sm">ERC20 reward token with minting capabilities</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-emerald-400 font-bold">TreasuryFunder.sol</h4>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-gray-400 text-sm">Gasless USDC contributions with tracking</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-cyan-400 font-bold">AICSwap.sol</h4>
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-gray-400 text-sm">Swap AIC tokens for USDC rewards</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-blue-400 font-bold">AICCollateralVault.sol</h4>
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-gray-400 text-sm">1:1 USDC backing for AIC token</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-purple-400 font-bold">AICBurnPeg.sol</h4>
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-gray-400 text-sm">Price stability mechanism</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 border border-emerald-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Configuration System</h3>
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-sm">
              <div className="text-green-400 mb-2">// src/config/network.ts</div>
              <div className="text-gray-300">
                <span className="text-purple-400">export const</span> CURRENT_NETWORK = <span className="text-yellow-400">'mainnet'</span>;
              </div>
              <div className="text-gray-500 mt-4">// That's it! Everything else auto-configured ✨</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
              <h4 className="text-lg font-bold text-white mb-4">Backend Infrastructure</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Supabase Database
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Edge Functions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Real-time Updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  RLS Security
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30">
              <h4 className="text-lg font-bold text-white mb-4">Frontend Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  React + TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  Vite Build System
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  PWA Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Gasless Funding Section */}
      {activeSection === 'funding' && (
        <div className="space-y-8 px-4">
          <div className="bg-gradient-to-br from-pink-900/50 via-red-900/50 to-orange-900/50 rounded-2xl p-8 border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-3">Gasless Treasury Funding</h3>
              <p className="text-xl text-gray-300">Anyone can contribute USDC to fund player rewards!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/30 rounded-xl p-6 text-center border border-pink-500/20">
                <DollarSign className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-2">0.007%</h4>
                <p className="text-gray-400">Gas Cost</p>
              </div>
              <div className="bg-black/30 rounded-xl p-6 text-center border border-red-500/20">
                <Users className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-2">Anyone</h4>
                <p className="text-gray-400">Can Contribute</p>
              </div>
              <div className="bg-black/30 rounded-xl p-6 text-center border border-orange-500/20">
                <TrendingUp className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-white mb-2">100%</h4>
                <p className="text-gray-400">Transparent</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-pink-500/20">
              <h4 className="text-xl font-bold text-white mb-4">How It Works</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Contribute USDC</p>
                    <p className="text-gray-400 text-sm">Send any amount to treasury - costs only 0.007 USDC gas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Players Earn</p>
                    <p className="text-gray-400 text-sm">Players complete vocabulary challenges and earn AIC rewards</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Convert to USDC</p>
                    <p className="text-gray-400 text-sm">Treasury automatically sends USDC when players convert AIC</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Financial Freedom</p>
                    <p className="text-gray-400 text-sm">Players bridge USDC anywhere or use virtual cards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Why Arc Network?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <p className="text-white font-bold">USDC as Gas Token</p>
                    <p className="text-gray-400 text-sm">No need for ETH, MATIC, or other gas tokens</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-emerald-400 mt-1" />
                  <div>
                    <p className="text-white font-bold">Predictable Costs</p>
                    <p className="text-gray-400 text-sm">Gas prices stable at ~0.007 USDC per transaction</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe2 className="w-6 h-6 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-white font-bold">Circle Partnership</p>
                    <p className="text-gray-400 text-sm">Official USDC, CCTP bridge, banking APIs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-bold">Better UX</p>
                    <p className="text-gray-400 text-sm">Users only need one token - USDC for everything</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 text-center px-4">
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-8 border border-green-500/30 max-w-4xl mx-auto">
          <Rocket className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Deploy on Arc Mainnet</h3>
          <p className="text-xl text-gray-300 mb-6">
            Change one variable, update addresses, redeploy contracts. Launch in minutes!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
              View Documentation
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://testnet.arcscan.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-bold transition-all border border-green-500/30"
            >
              View on Explorer
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
