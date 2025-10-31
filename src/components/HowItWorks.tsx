import { BookOpen, Trophy, Repeat, CreditCard, Building2, Send, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          <BookOpen className="w-5 h-5" />
          How It Works
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Your Complete Financial Freedom Journey
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          From learning blockchain vocabulary to spending crypto globally - here's how AiC works
        </p>
      </div>

      <div className="space-y-8 mb-12">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Learn & Earn</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Play our AI-powered vocabulary game. Type blockchain terms correctly and earn 300-500 AiC tokens per word. OpenAI GPT-4 validates your cognitive understanding - no copy-paste allowed!
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
                <p className="text-sm text-cyan-400 font-semibold mb-2">Example:</p>
                <p className="text-sm text-gray-300">Type "CONSENSUS" correctly → Earn 400 AiC tokens → Learn what consensus means</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Repeat className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Swap to USDC</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Convert your earned AiC tokens to USDC at a guaranteed 1:1 ratio. Built on Circle's Arc L1 with native USDC gas payments. Sub-second finality and minimal fees.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/20">
                <p className="text-sm text-blue-400 font-semibold mb-2">Example:</p>
                <p className="text-sm text-gray-300">Earned 10,000 AiC? → Swap to 10,000 USDC ($10,000) → Ready to spend or save</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Spend Globally with Virtual Card</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Load your USDC onto the AiC-Arc Visa Virtual Card and spend at 70+ million merchants worldwide. Instant crypto-to-fiat conversion at point of sale. Earn 5% AiC cashback on every purchase!
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
                <p className="text-sm text-cyan-400 font-semibold mb-2">Example:</p>
                <p className="text-sm text-gray-300">Load $500 USDC → Buy coffee at Starbucks → Get 5% back in AiC tokens</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
                <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-4 h-4" />
                <span className="text-xs text-blue-400">Circle Partner Alliance Feature</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-2xl p-8 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Save with Banking System</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Withdraw USDC to your traditional bank account via ACH (free), Wire ($15), or Instant Transfer ($2.50). Set up direct deposit to receive paychecks directly into USDC. Complete fiat-to-crypto bridge!
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                <p className="text-sm text-purple-400 font-semibold mb-2">Example:</p>
                <p className="text-sm text-gray-300">Withdraw $2,000 USDC → ACH to bank (free) → Arrives in 1-3 days → Pay rent</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-500/30">
                <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-4 h-4" />
                <span className="text-xs text-purple-400">Circle Partner Alliance Feature</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-blue-600/10 rounded-2xl p-8 border border-green-500/30">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Bridge to Any Chain</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Use Circle's CCTP to bridge your USDC from Arc to Ethereum, Arbitrum, Base, Optimism, and more. Access DeFi protocols, NFT marketplaces, or any blockchain ecosystem.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20">
                <p className="text-sm text-green-400 font-semibold mb-2">Example:</p>
                <p className="text-sm text-gray-300">Bridge $5,000 USDC → From Arc to Base → Use in DeFi protocols → Earn yield</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">🎉 Complete Financial Freedom Achieved!</h3>
        <p className="text-lg text-gray-300 mb-6">
          You've learned blockchain, earned real money, spent it globally, saved in your bank, and accessed the entire crypto ecosystem.
        </p>
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(34,211,238,0.5)]">
          <Trophy className="w-6 h-6" />
          <span>Welcome to the Future of Finance</span>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/30">
          <h4 className="text-xl font-bold text-cyan-400 mb-4">Why AiC is Different</h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Earn crypto through learning, not speculation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>AI validates real cognitive understanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>1:1 USDC backing ensures stable value</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Spend crypto like cash with virtual card</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Bridge between crypto and traditional banking</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/30">
          <h4 className="text-xl font-bold text-blue-400 mb-4">Technology Stack</h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">⚡</span>
              <span>Circle Arc L1 - Lightning-fast blockchain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">⚡</span>
              <span>OpenAI GPT-4 - AI validation engine</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">⚡</span>
              <span>Programmable USDC - Smart stablecoin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">⚡</span>
              <span>Circle CCTP - Cross-chain transfers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">⚡</span>
              <span>Circle Partner Alliance - Card & Banking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
