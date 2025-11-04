import { ArrowRight, Wallet, Brain, DollarSign, Zap, Shield, TrendingUp, Smartphone, Apple, GraduationCap, Trophy } from 'lucide-react';
import { Footer } from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate?: (page: 'home' | 'play' | 'withdraw' | 'how' | 'arc-updates' | 'partners' | 'chat' | 'mainnet-ready' | 'fund-treasury' | 'lite-demo') => void;
}

export function LandingPage({ onGetStarted, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32 relative">
          <div className="text-center mb-8">
            <div className="mb-6 sm:mb-8">
              <img src="/aic toekn .png" alt="AI Cognitive Token Logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto" />
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-5 border border-cyan-500/30">
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Programmable Stablecoin • Layer 1 Token</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 px-2 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                Learn & Earn AiC Rewards
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mb-3 max-w-xl mx-auto px-4 leading-relaxed">
              AiC Token: 1:1 pegged to USDC. A programmable stablecoin on Arc Network Layer 1 where your knowledge becomes real currency.
            </p>
            <p className="text-xs sm:text-sm font-medium text-cyan-400 mb-8 max-w-lg mx-auto px-4">
              Join the Stablecoin Revolution • Partners: Circle & Arc Network
            </p>
            <div className="flex flex-col items-center gap-2.5">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('lite-demo')}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-medium px-6 py-2.5 rounded-md text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <span>Game Launchpad</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium px-6 py-2.5 rounded-md text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-2">
                <a
                  href={window.location.origin}
                  download
                  className="inline-flex items-center gap-1.5 bg-gray-800/40 hover:bg-gray-800 text-gray-400 hover:text-white font-normal px-3 py-1.5 rounded-md text-xs border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android</span>
                </a>

                <a
                  href={window.location.origin}
                  download
                  className="inline-flex items-center gap-1.5 bg-gray-800/40 hover:bg-gray-800 text-gray-400 hover:text-white font-normal px-3 py-1.5 rounded-md text-xs border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span>iOS</span>
                </a>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mt-16">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/30 text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
              <GraduationCap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Learn Blockchain</p>
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
              <p className="text-sm font-semibold text-white">Lightning-Fast Arc</p>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              How it works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Learn blockchain vocabulary, earn AIC tokens instantly, and convert to real USDC. Powered by Circle and Arc Network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Learn vocabulary</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Type blockchain terms and learn their meanings. Each correct word validates your knowledge.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn tokens instantly</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Get AIC tokens immediately for every correct word. 300-500 tokens per word, verified on-chain.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-3xl p-8 border border-cyan-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Convert to USDC</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Exchange AIC tokens for real USDC anytime. Powered by Circle on Arc Network Layer 1.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-3xl p-1">
            <div className="bg-white rounded-3xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Built on Circle technology</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Leverages Circle's USDC and Arc Network for instant, secure, and verified transactions with sub-second settlement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Circle Features */}
      <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-12 h-12" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Powered by Circle</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Real USDC rewards, instant settlements, and global accessibility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <DollarSign className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real USDC</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Convert your earned tokens to USDC instantly. 1:1 backing guaranteed by Circle's technology.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & verified</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Every transaction is verified on Arc Network blockchain with sub-second finality.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <TrendingUp className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant access</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Withdraw or spend your earnings immediately with no delays or waiting periods.
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
