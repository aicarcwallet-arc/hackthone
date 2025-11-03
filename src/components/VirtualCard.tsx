import { useState } from 'react';
import { CreditCard, Copy, Check, DollarSign, Globe, Zap, Shield, TrendingUp } from 'lucide-react';

interface VirtualCardProps {
  walletAddress?: string;
  usdcBalance: string;
}

export function VirtualCard({ walletAddress, usdcBalance }: VirtualCardProps) {
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardNumber = walletAddress
    ? `**** **** **** ${walletAddress.slice(-4).toUpperCase()}`
    : '**** **** **** ****';

  const cardholderName = walletAddress
    ? `${walletAddress.slice(2, 6).toUpperCase()} ${walletAddress.slice(-4).toUpperCase()}`
    : 'YOUR NAME';

  const handleCopyCardNumber = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          <CreditCard className="w-5 h-5" />
          AiC-Arc Visa Virtual Card
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
          Your Personalized Digital Financial Gateway
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-3">
          Spend your USDC anywhere Visa is accepted. Instant conversion from crypto to fiat at the point of sale.
        </p>
        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
          <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-5 h-5" />
          <span className="text-blue-400 text-sm font-semibold">Powered by Circle Partner Alliance</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col items-center">
          <div
            className="relative w-full max-w-md aspect-[1.586/1] cursor-pointer mb-6"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: '1000px' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 preserve-3d"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front of Card */}
              <div
                className="absolute inset-0 rounded-2xl shadow-[0_0_60px_rgba(34,211,238,0.6)] backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-cyan-900 to-blue-900 rounded-2xl p-6 sm:p-8 overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  </div>

                  {/* Card Content */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <img src="/aic toekn .png" alt="AiC" className="w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-300 text-xs sm:text-sm font-semibold">Powered by</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white font-bold text-sm sm:text-base">Visa</span>
                          <span className="text-cyan-400 text-xs">•</span>
                          <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Arc L1</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded opacity-80"></div>
                          <Zap className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-white text-xl sm:text-2xl md:text-3xl font-mono tracking-wider">
                          {cardNumber}
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-cyan-300 text-xs mb-1">CARDHOLDER</p>
                          <p className="text-white text-sm sm:text-base font-semibold">{cardholderName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-300 text-xs mb-1">BALANCE</p>
                          <p className="text-white text-lg sm:text-xl font-bold">${parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div
                className="absolute inset-0 rounded-2xl shadow-[0_0_60px_rgba(34,211,238,0.6)] backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 rounded-2xl overflow-hidden">
                  <div className="w-full h-12 sm:h-16 bg-black mt-6 sm:mt-8"></div>
                  <div className="p-6 sm:p-8">
                    <div className="bg-white h-10 sm:h-12 mb-4 flex items-center justify-end px-4 italic text-gray-700 text-sm sm:text-base">
                      {walletAddress ? walletAddress.slice(-6) : '***'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 space-y-2">
                      <p>• Instant USDC to USD conversion</p>
                      <p>• Zero foreign transaction fees</p>
                      <p>• 24/7 fraud protection by Arc L1</p>
                      <p>• Accepted at 70M+ merchants worldwide</p>
                    </div>
                    <div className="mt-4 sm:mt-6 flex justify-between items-center">
                      <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-10 h-10 opacity-70" />
                      <p className="text-cyan-300 text-xs">AiC-Arc Network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyCardNumber}
            className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-6 py-3 rounded-lg transition-all border border-cyan-500/30"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Card ID
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">Tap card to flip</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-cyan-400" />
              Top Up Your Card
            </h3>
            <div className="space-y-4">
              <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Available USDC</span>
                  <span className="text-cyan-400 font-bold text-lg">${parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(parseFloat(usdcBalance) / 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <button
                disabled={parseFloat(usdcBalance) === 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Auto Top-Up from USDC Balance
              </button>

              <div className="grid grid-cols-3 gap-3">
                {['$50', '$100', '$250'].map((amount) => (
                  <button
                    key={amount}
                    className="bg-gray-800 hover:bg-gray-700 text-cyan-400 font-semibold py-2 rounded-lg transition-all border border-cyan-500/30"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 text-center">
              <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Global</p>
              <p className="text-xs text-gray-400">Spend Anywhere</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 text-center">
              <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Instant</p>
              <p className="text-xs text-gray-400">Real-Time Top Up</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 text-center">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Secure</p>
              <p className="text-xs text-gray-400">Arc L1 Protected</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 text-center">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Rewards</p>
              <p className="text-xs text-gray-400">5% AiC Back</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-blue-900/30 to-cyan-900/30 rounded-3xl p-8 sm:p-10 border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(34,211,238,0.3)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]"></div>

        <div className="relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-6 py-2 rounded-full border border-cyan-400/40 mb-4">
              <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-6 h-6" />
              <span className="text-cyan-400 font-bold text-sm">Circle Partner Alliance Integration</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4">
              The Future of Digital Spending
            </h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Seamlessly bridge the gap between learning blockchain and spending real money. Your AiC-Arc Visa card turns educational achievements into purchasing power.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Zero Friction Spending</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Spend your USDC earnings instantly at 70M+ Visa merchants worldwide. From Amazon to your local coffee shop - if they take Visa, they take your AiC rewards.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Instant Top-Up Technology</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Auto-load your card from your USDC balance in real-time. No waiting, no delays. Arc L1's sub-second settlement means your learning rewards become spendable instantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Global Financial Freedom</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Zero foreign transaction fees. Spend in any currency, anywhere. Your card automatically converts USDC at real-time rates, giving you true global purchasing power.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Bank-Grade Security</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Every transaction secured by Arc L1 blockchain verification and Visa's fraud protection. Your funds are FDIC-insured through regulated banking partners.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-400/40 mb-8">
            <h4 className="text-xl font-bold text-center text-white mb-6">Your Journey: Learn to Spend in 4 Steps</h4>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(34,211,238,0.6)] border-4 border-cyan-400/20">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <p className="text-white font-bold mb-1">🎮 Play & Learn</p>
                <p className="text-sm text-gray-400">Type blockchain terms</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(34,211,238,0.6)] border-4 border-cyan-400/20">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <p className="text-white font-bold mb-1">💰 Swap to USDC</p>
                <p className="text-sm text-gray-400">1:1 guaranteed rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(34,211,238,0.6)] border-4 border-cyan-400/20">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <p className="text-white font-bold mb-1">💳 Load Your Card</p>
                <p className="text-sm text-gray-400">Instant auto top-up</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(34,211,238,0.6)] border-4 border-cyan-400/20">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <p className="text-white font-bold mb-1">🌍 Spend Anywhere</p>
                <p className="text-sm text-gray-400">70M+ global merchants</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/40">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <h4 className="text-2xl font-bold text-white">Exclusive Rewards Program</h4>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
                <p className="text-3xl font-bold text-cyan-400 mb-1">5%</p>
                <p className="text-sm text-gray-300">AiC Cashback on All Purchases</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
                <p className="text-3xl font-bold text-cyan-400 mb-1">2x</p>
                <p className="text-sm text-gray-300">Rewards on Educational Platforms</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
                <p className="text-3xl font-bold text-cyan-400 mb-1">$0</p>
                <p className="text-sm text-gray-300">Foreign Transaction Fees</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-cyan-400 italic">
              ✨ This premium financial experience will be enabled through Circle Partner Alliance to bring official Visa card issuance and regulated banking services to the AiC ecosystem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
