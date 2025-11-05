import { Mountain, Zap, Shield, Wallet, ArrowRight } from 'lucide-react';

interface AvalancheLandingPageProps {
  onGetStarted: () => void;
}

export function AvalancheLandingPage({ onGetStarted }: AvalancheLandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="pt-20 pb-16 sm:pt-32 sm:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-avax-gray-100 text-avax-gray-700 text-sm font-medium mb-8">
              <Mountain className="w-4 h-4 text-avax-red" />
              Powered by Avalanche
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-avax-black mb-6 tracking-tight">
              Mine vocabulary.
              <br />
              <span className="text-avax-red">Earn USDC.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-avax-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Type blockchain words to unlock AIC tokens from your personal smart contract.
              Swap to USDC and spend anywhere with your Avalanche Card.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group bg-avax-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-avax-gray-900 transition-all flex items-center gap-2 shadow-lg"
              >
                Start Mining
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://www.avalanchecard.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-avax-gray-300 text-avax-gray-900 hover:border-avax-gray-900 transition-all"
              >
                Get Avalanche Card
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-avax-black mb-4">
              How it works
            </h2>
            <p className="text-lg text-avax-gray-600 max-w-2xl mx-auto">
              From typing words to buying coffee in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-avax-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⛏️</span>
              </div>
              <h3 className="text-xl font-semibold text-avax-black mb-3">1. Mine Words</h3>
              <p className="text-avax-gray-600">
                Type blockchain vocabulary words to earn AIC tokens
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-avax-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔓</span>
              </div>
              <h3 className="text-xl font-semibold text-avax-black mb-3">2. Redeem Tokens</h3>
              <p className="text-avax-gray-600">
                Unlock AIC from your personal smart contract
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-avax-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-avax-black mb-3">3. Swap to USDC</h3>
              <p className="text-avax-gray-600">
                Convert AIC to USDC on Trader Joe DEX
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-avax-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold text-avax-black mb-3">4. Spend Anywhere</h3>
              <p className="text-avax-gray-600">
                Load your Avalanche Card and use at any merchant
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24 bg-avax-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-avax-gray-200">
                <div className="w-12 h-12 bg-avax-red/10 rounded-2xl flex items-center justify-center mb-6">
                  <Mountain className="w-6 h-6 text-avax-red" />
                </div>
                <h3 className="text-2xl font-bold text-avax-black mb-4">
                  Built on Avalanche
                </h3>
                <p className="text-avax-gray-600 leading-relaxed">
                  Lightning-fast transactions with sub-second finality. Gas fees under $0.10.
                  Proven infrastructure trusted by millions.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-avax-gray-200">
                <div className="w-12 h-12 bg-avax-red/10 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6 text-avax-red" />
                </div>
                <h3 className="text-2xl font-bold text-avax-black mb-4">
                  Your Personal Contract
                </h3>
                <p className="text-avax-gray-600 leading-relaxed">
                  Every user gets their own smart contract with 100,000 AIC allocation.
                  Full transparency. Complete control.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-avax-gray-200">
                <div className="w-12 h-12 bg-avax-red/10 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-avax-red" />
                </div>
                <h3 className="text-2xl font-bold text-avax-black mb-4">
                  Real-World Spending
                </h3>
                <p className="text-avax-gray-600 leading-relaxed">
                  Avalanche Card turns your crypto into spendable funds.
                  Physical and virtual Visa cards. Works everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 sm:py-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-avax-black mb-2">$0.05</div>
              <div className="text-avax-gray-600 font-medium">Average Gas Fee</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-avax-black mb-2">100K</div>
              <div className="text-avax-gray-600 font-medium">AIC Per User</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-avax-black mb-2">&lt;1s</div>
              <div className="text-avax-gray-600 font-medium">Transaction Time</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24">
          <div className="bg-avax-black rounded-3xl p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to start earning?
            </h2>
            <p className="text-xl text-avax-gray-300 mb-10 max-w-2xl mx-auto">
              Connect your wallet, mine vocabulary words, and withdraw USDC to your Avalanche Card.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-avax-red text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-red-600 transition-all inline-flex items-center gap-2 shadow-xl"
            >
              Start Mining Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-avax-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-avax-red" />
              <span className="font-semibold text-avax-black">AIC Mining Platform</span>
            </div>

            <div className="flex gap-8 text-sm text-avax-gray-600">
              <a href="https://www.avax.network/" target="_blank" rel="noopener noreferrer" className="hover:text-avax-black transition-colors">
                Avalanche Network
              </a>
              <a href="https://www.avalanchecard.com/" target="_blank" rel="noopener noreferrer" className="hover:text-avax-black transition-colors">
                Avalanche Card
              </a>
              <a href="https://traderjoexyz.com/" target="_blank" rel="noopener noreferrer" className="hover:text-avax-black transition-colors">
                Trader Joe DEX
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
