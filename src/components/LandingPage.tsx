import { ArrowRight, Wallet, Brain, DollarSign, Zap, Shield, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-cyan-500/30">
              <img src="/aic toekn .png" alt="AiC Token Logo" className="w-10 h-10" />
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AiC Token Logo</span>
            </div>
            <p className="text-sm sm:text-base text-cyan-400 mb-8">
              AI Validation • Arc Blockchain • USDC Rewards
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                Type Blockchain Words.
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                Earn AiC Tokens.
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                Swap to USDC.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Learn blockchain vocabulary and earn 300-500 AiC per word
            </p>
            <p className="text-sm text-gray-400 mb-12">
              AI validates • 1:1 USDC pegging • Send to Arc Testnet • Track on Arcscan Explorer
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mt-16">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">AI-Powered</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <Wallet className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">In-House Wallet</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <DollarSign className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">1:1 USDC Pegging</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Circle SDK Powered</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Arc Testnet Verified</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Live Explorer Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 py-12 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">💰</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$300-500</div>
              <div className="text-sm text-cyan-100">USDC Per Word</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">⚡</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">&lt;1s</div>
              <div className="text-sm text-cyan-100">Settlement Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">🔥</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$0.01</div>
              <div className="text-sm text-cyan-100">Gas Fees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">✅</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-cyan-100">Blockchain Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Banner */}
      <section className="bg-black py-4 overflow-hidden border-y border-cyan-500/30">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block text-cyan-400 font-semibold px-8">Play & Earn USDC</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
          <span className="inline-block text-cyan-400 font-semibold px-8">Get Your AiC Arc Virtual Card</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
          <span className="inline-block text-cyan-400 font-semibold px-8">5% Rewards on Every Purchase</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
          <span className="inline-block text-cyan-400 font-semibold px-8">Spend Anywhere Visa Accepted</span>
          <span className="inline-block text-blue-300 px-2">•</span>
          <span className="inline-block text-white font-semibold px-8">Circle Alliance Partner</span>
          <span className="inline-block text-blue-300 px-2">•</span>
          <span className="inline-block text-white font-semibold px-8">Stablecoin Finance</span>
          <span className="inline-block text-blue-300 px-2">•</span>
          <span className="inline-block text-white font-semibold px-8">Global Payments</span>
          <span className="inline-block text-blue-300 px-2">•</span>
        </div>
      </section>

      {/* Why AiC Token Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Why AiC Token?
            </h2>
            <p className="text-lg text-gray-300">
              The intersection of AI, blockchain, and financial freedom
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Wealthy Gaming Economy</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Earn $300-500 USDC per blockchain word</li>
                <li>• AI validates your knowledge instantly</li>
                <li>• Create real income streams from learning</li>
                <li>• Build wealth while expanding blockchain skills</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Circle Arc Blockchain</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Built on Circle's secure Layer-1 blockchain</li>
                <li>• Instant USDC settlements with low fees</li>
                <li>• Enterprise-grade security and transparency</li>
                <li>• Every transaction publicly verifiable</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">AI-Powered Validation</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• OpenAI validates every word submission</li>
                <li>• Real-time accuracy checking</li>
                <li>• Learn through AI feedback</li>
                <li>• Contribute to next-gen AI training data</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Real Money, Real Freedom</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• 1:1 AiC to USDC conversion</li>
                <li>• Backed by Circle's trusted stablecoin</li>
                <li>• Withdraw to any wallet anytime</li>
                <li>• True financial independence through crypto</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              Simple steps to start earning
            </p>
            <p className="text-xl font-semibold text-cyan-400">
              Play → Earn → Swap → Withdraw
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Circle SDK Wallet + Arc Testnet
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                01
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Sign Up & Get Your Wallet</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">Circle SDK In-House Wallet</p>
                <p className="text-gray-300">
                  Create your account and get an automatic Circle SDK wallet. Your User ID persists across sessions. Secure, non-custodial, powered by Circle - no MetaMask popups needed!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                02
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Type Blockchain Vocabulary</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">Blockchain Education Game</p>
                <p className="text-gray-300">
                  Learn blockchain terms like CONSENSUS, SMART-CONTRACT, DEFI. Type manually - our AI agent detects copy-paste. Real learning = real earning!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                03
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">AI Agent Validates & Rewards</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">Instant Token Rewards</p>
                <p className="text-gray-300">
                  OpenAI validates your work and instantly credits 300-500 AiC tokens to your Circle wallet. No popups, no delays - just pure gameplay! Track everything on Arc Explorer.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                04
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Swap to USDC Anytime</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">1:1 Pegging with USDC</p>
                <p className="text-gray-300">
                  Visit the Swap page to exchange AiC for USDC at 1:1 ratio. All swaps happen on-chain via Arc Testnet. Pay ultra-low gas fees in native USDC!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                05
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Withdraw to Your Wallet</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">Cash Out via MetaMask</p>
                <p className="text-gray-300">
                  Ready to cash out? Use MetaMask ONLY for final withdrawal to your Arc Testnet address. All your earnings are verifiable on-chain. Build real wealth through blockchain education!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Powered by Industry Leaders
            </h2>
            <p className="text-lg text-gray-300">
              Enterprise-grade technology stack for secure, transparent operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Circle Arc L1</h3>
              <p className="text-gray-300">
                Native blockchain infrastructure built for programmable money and seamless USDC integration
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">OpenAI API</h3>
              <p className="text-gray-300">
                Advanced AI validation ensuring 99.8% accuracy in word verification and quality control
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">USDC Stablecoin</h3>
              <p className="text-gray-300">
                Fully-backed dollar stablecoin providing real value and financial stability to your earnings
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Smart Contracts</h3>
              <p className="text-gray-300">
                Transparent blockchain verification and automated reward distribution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_80px_rgba(34,211,238,0.4)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Shape the Future of Intelligent Finance
          </h2>
          <p className="text-xl text-cyan-100 mb-4">
            Join the AI + Arc Revolution
          </p>
          <p className="text-lg text-cyan-100 mb-8">
            Play, earn AiC tokens, swap to USDC, and cash out - all powered by Circle SDK and Arc blockchain. No complex setup required.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">🔁</div>
              <h3 className="text-lg font-bold text-white mb-2">On-chain Actions</h3>
              <p className="text-sm text-cyan-100">AI agents interact with DeFi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">USDC Payments</h3>
              <p className="text-sm text-cyan-100">Instant stablecoin settlement</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Native</h3>
              <p className="text-sm text-cyan-100">Natural language to payments</p>
            </div>
          </div>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Getting Started</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://docs.circle.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Circle Docs ↗</a></li>
                <li><a href="https://testnet.arcscan.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Arc Explorer ↗</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.circle.com/en/usdc" target="_blank" rel="noopener noreferrer" className="hover:text-white">About USDC ↗</a></li>
                <li><a href="https://developers.circle.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Circle SDK ↗</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Arc L1 ↗</a></li>
                <li><a href="#" className="hover:text-white">GitHub ↗</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2025 AiC Token Project. All rights reserved. Built for AI Agents on Arc with USDC hackathon by Shazia Sayeed
          </div>
        </div>
      </footer>
    </div>
  );
}
