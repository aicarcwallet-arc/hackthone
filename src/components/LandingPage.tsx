import { ArrowRight, Wallet, Brain, DollarSign, Zap, Shield, TrendingUp, Smartphone, Apple } from 'lucide-react';
import { Footer } from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (page: 'home' | 'play' | 'swap' | 'withdraw' | 'how' | 'arc-updates' | 'partners' | 'chat' | 'mainnet-ready' | 'fund-treasury') => void;
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32 relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gray-900/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6 border border-cyan-500/30">
              <img src="/aic toekn .png" alt="AI Cognitive Token Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Cognitive Token (AiC)</span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-cyan-400 mb-6 sm:mb-8 px-2">
              Learn • Earn • Bridge • Built on Circle's Arc L1
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                Type <span className="text-white font-bold drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">Blockchain</span> Words.
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                {' '}Earn <span className="text-white font-bold drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">AiC</span> Tokens.
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                {' '}Swap to <span className="text-white font-bold drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">USDC</span>.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              The first AI-powered cognitive token where learning blockchain terms earns you real money
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mb-8 sm:mb-12 px-4">
              OpenAI validates your knowledge • Circle's USDC powers rewards • Arc L1 ensures transparency
            </p>
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:shadow-[0_0_60px_rgba(34,211,238,1)] transition-all touch-manipulation active:scale-95 animate-pulse-slow"
              >
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
                <span>Enter Portal</span>
                <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-400 text-center">Get the Native App:</p>
                <div className="flex gap-3">
                  <a
                    href="/aic-token.apk"
                    download
                    className="group inline-flex items-center gap-2 bg-[#3DDC84] hover:bg-[#34c471] text-black font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base shadow-lg hover:shadow-[0_0_20px_rgba(61,220,132,0.5)] transition-all active:scale-95"
                  >
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Android APK</span>
                  </a>
                  <a
                    href="/aic-token.ipa"
                    download
                    className="group inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base shadow-lg border border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                  >
                    <Apple className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>iOS IPA</span>
                  </a>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 animate-bounce-slow">
                👆 Choose web portal or download native app
              </p>
            </div>
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
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$300-500</div>
              <div className="text-sm text-cyan-100">USDC Per Word</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">&lt;1s</div>
              <div className="text-sm text-cyan-100">Settlement Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$0.01</div>
              <div className="text-sm text-cyan-100">Gas Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-cyan-100">Blockchain Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Banner */}
      <section className="bg-black py-4 overflow-hidden border-y border-cyan-500/30">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block text-cyan-400 font-semibold px-8">AI Cognitive Token (AiC)</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
          <span className="inline-block text-white font-semibold px-8">Learn Blockchain & Earn USDC</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
          <span className="inline-block text-cyan-400 font-semibold px-8">Powered by OpenAI + Circle Arc</span>
          <span className="inline-block text-blue-300 px-2">•</span>
          <span className="inline-block text-white font-semibold px-8">Hackathon Project 2025</span>
          <span className="inline-block text-blue-300 px-2">•</span>
          <span className="inline-block text-cyan-400 font-semibold px-8">1:1 USDC Backing</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
          <span className="inline-block text-white font-semibold px-8">Bridge to Any Chain with CCTP</span>
          <span className="inline-block text-blue-300 px-2">•</span>
          <span className="inline-block text-cyan-400 font-semibold px-8">Native USDC Gas Fees</span>
          <span className="inline-block text-cyan-300 px-2">•</span>
        </div>
      </section>

      {/* Why AiC Token Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              What is AI Cognitive Token (AiC)?
            </h2>
            <p className="text-lg text-gray-300 mb-3">
              The world's first learn-to-earn token powered by artificial intelligence
            </p>
            <p className="text-base text-cyan-400 max-w-3xl mx-auto">
              AiC combines cognitive learning with blockchain rewards. Type blockchain vocabulary, get validated by OpenAI, and earn USDC-backed tokens instantly on Circle's Arc blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">AI Cognitive Learning</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Type blockchain terms like CONSENSUS, DEFI, SMART-CONTRACT</li>
                <li>• OpenAI validates your cognitive understanding</li>
                <li>• Earn 300-500 AiC tokens per correct word</li>
                <li>• No copy-paste - real learning equals real rewards</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Built on Circle's Arc L1</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Native USDC gas payments - no ETH needed</li>
                <li>• Sub-second finality with deterministic settlement</li>
                <li>• Circle Bridge Kit for cross-chain transfers</li>
                <li>• Every AiC token minted is verifiable on-chain</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Hackathon Innovation</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Submission for Circle's "AI Agents on Arc with USDC" hackathon</li>
                <li>• Demonstrates programmable USDC + AI integration</li>
                <li>• Real-world use case: education meets DeFi</li>
                <li>• Open-source and ready for production scaling</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">USDC-Backed Rewards</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• 1:1 AiC to USDC swap ratio guaranteed</li>
                <li>• Circle's programmable USDC powers all rewards</li>
                <li>• Bridge to Ethereum, Arbitrum, Base via Circle CCTP</li>
                <li>• Withdraw real stablecoin earnings anytime</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <div className="flex items-center gap-3 mb-4">
                <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-10 h-10" />
                <h3 className="text-2xl font-bold text-cyan-400">Circle Partner Alliance Features</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li>• 💳 Virtual Visa Card - Spend USDC globally at 70M+ merchants</li>
                <li>• 🏦 Fintech Banking - ACH, Wire, Direct Deposit integration</li>
                <li>• 🌍 Fiat-to-Crypto Bridge - Seamless USD ↔ USDC conversion</li>
                <li>• 🔐 FDIC-Insured Partners - Regulated banking infrastructure</li>
              </ul>
              <p className="text-sm text-cyan-400 italic mt-4">
                These features will be requested from Circle Partner Alliance to support the complete Circle ecosystem integration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              How AI Cognitive Token Works
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              5 simple steps to start learning and earning
            </p>
            <p className="text-xl font-semibold text-cyan-400">
              Connect → Learn → Validate → Swap → Bridge
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Powered by OpenAI + Circle Arc + Programmable USDC
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                01
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">MetaMask Integration</p>
                <p className="text-gray-300">
                  Connect your MetaMask wallet to Arc Testnet. Your wallet address is your unique learning profile. All AiC tokens and USDC rewards are stored securely on-chain.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                02
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Type Blockchain Terms</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">AI Cognitive Learning Game</p>
                <p className="text-gray-300">
                  Type blockchain vocabulary like CONSENSUS, SMART-CONTRACT, LIQUIDITY. Our AI detects copy-paste to ensure genuine cognitive learning. Only authentic typing earns rewards!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                03
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">OpenAI Validates Your Knowledge</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">AI-Powered Cognitive Assessment</p>
                <p className="text-gray-300">
                  OpenAI's GPT model validates your answer in real-time. Correct terms earn you 300-500 AiC tokens instantly minted to your wallet via Supabase edge functions. Every mint is recorded on Arc blockchain!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                04
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Swap AiC for USDC</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">1:1 USDC-Backed Conversion</p>
                <p className="text-gray-300">
                  Convert your AI Cognitive Tokens to Circle's USDC stablecoin at a guaranteed 1:1 ratio. All swaps execute on-chain with smart contracts. Gas fees paid in USDC - no ETH needed!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                05
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Bridge & Withdraw</h3>
                <p className="text-sm text-cyan-400 font-semibold mb-3">Circle CCTP Cross-Chain Transfer</p>
                <p className="text-gray-300">
                  Use Circle Bridge Kit to transfer USDC from Arc to Ethereum, Arbitrum, Base, or other chains. Or withdraw directly to your wallet on Arc. Your earnings, your choice!
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
              Hackathon Tech Stack
            </h2>
            <p className="text-lg text-gray-300 mb-2">
              Built for Circle's "AI Agents on Arc with USDC" Hackathon
            </p>
            <p className="text-sm text-cyan-400">
              Showcasing the future of AI-powered financial applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Circle Arc Layer 1</h3>
              <p className="text-gray-300">
                Lightning-fast L1 blockchain with native USDC gas payments. Sub-second finality and deterministic settlement for instant reward distribution.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">OpenAI GPT-4</h3>
              <p className="text-gray-300">
                Powers the cognitive validation engine. Assesses blockchain vocabulary understanding and detects copy-paste attempts for authentic learning.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Programmable USDC</h3>
              <p className="text-gray-300">
                Circle's flagship stablecoin backs all AiC token rewards. Used for gas, swaps, and cross-chain transfers via Circle CCTP.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Supabase Edge Functions</h3>
              <p className="text-gray-300">
                Serverless backend handles OpenAI validation and token minting. All transactions recorded in Postgres with row-level security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_80px_rgba(34,211,238,0.4)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Start Earning AI Cognitive Tokens Today
          </h2>
          <p className="text-xl text-cyan-100 mb-4">
            Learn Blockchain • Earn USDC • Built on Circle Arc
          </p>
          <p className="text-lg text-cyan-100 mb-8">
            The first educational platform where your knowledge literally becomes money. Type blockchain terms, get validated by AI, earn real USDC.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="text-lg font-bold text-white mb-2">Virtual Visa Card</h3>
              <p className="text-sm text-cyan-100">Spend USDC anywhere globally</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">🏦</div>
              <h3 className="text-lg font-bold text-white mb-2">Fintech Banking</h3>
              <p className="text-sm text-cyan-100">ACH, Wire, Direct Deposit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Crypto to Fiat</h3>
              <p className="text-sm text-cyan-100">Instant USDC to USD</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-bold text-white mb-2">Global Liquidity</h3>
              <p className="text-sm text-cyan-100">Unified fiat-crypto flow</p>
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

      <Footer onNavigate={onNavigate} />

      {/* Floating Enter Portal Button */}
      <button
        onClick={onGetStarted}
        className="fixed bottom-8 right-8 z-50 group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.8)] hover:shadow-[0_0_60px_rgba(34,211,238,1)] transition-all animate-bounce-slow hover:scale-110"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">Enter Portal</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
}
