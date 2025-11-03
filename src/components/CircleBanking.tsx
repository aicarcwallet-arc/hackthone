import { useState } from 'react';
import { Building2, ArrowDownToLine, ArrowUpFromLine, Send, Clock, CheckCircle, DollarSign, Globe2, Zap } from 'lucide-react';

interface CircleBankingProps {
  walletAddress?: string;
  usdcBalance: string;
}

export function CircleBanking({ walletAddress, usdcBalance }: CircleBankingProps) {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'deposit'>('withdraw');
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'ach' | 'wire' | 'instant'>('instant');

  const accountNumber = walletAddress
    ? `****${walletAddress.slice(-6).toUpperCase()}`
    : '****XXXXX';

  const routingNumber = '026009593'; // Circle routing number

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <Building2 className="w-5 h-5" />
          AiC-Circle Banking System
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
          Your Personal Fintech Bank Account
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-3">
          Seamlessly bridge crypto and traditional finance. Withdraw USDC to fiat instantly via ACH, Wire, or Direct Deposit.
        </p>
        <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
          <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-5 h-5" />
          <span className="text-purple-400 text-sm font-semibold">Powered by Circle Partner Alliance</span>
        </div>
      </div>

      {/* Account Overview Card */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 rounded-2xl p-6 sm:p-8 mb-8 shadow-[0_0_60px_rgba(59,130,246,0.4)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-300 text-sm mb-1">AiC-Circle Bank Account</p>
              <h3 className="text-white text-2xl sm:text-3xl font-bold">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-semibold">ACTIVE</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-blue-300 text-xs mb-1">Available Balance</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">${parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-blue-200 text-xs mt-1">{parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-blue-300 text-xs mb-1">Account Number</p>
              <p className="text-white text-xl font-mono">{accountNumber}</p>
              <p className="text-blue-200 text-xs mt-1">Routing: {routingNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png" alt="Circle" className="w-8 h-8" />
            <div className="h-8 w-px bg-blue-400/30"></div>
            <span className="text-blue-300 text-sm font-semibold">FDIC Insured Partner Banks</span>
            <div className="h-8 w-px bg-blue-400/30"></div>
            <span className="text-blue-300 text-sm font-semibold">Arc L1 Network</span>
          </div>
        </div>
      </div>

      {/* Transaction Section */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Side - Transaction Form */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            {/* Tab Selector */}
            <div className="flex gap-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'withdraw'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowDownToLine className="w-5 h-5" />
                Withdraw to Bank
              </button>
              <button
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'deposit'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowUpFromLine className="w-5 h-5" />
                Deposit from Bank
              </button>
            </div>

            {activeTab === 'withdraw' && (
              <div className="space-y-6">
                <div>
                  <label className="text-white font-semibold mb-2 block">Amount (USDC)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-lg border border-blue-500/30 focus:border-blue-500 focus:outline-none text-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Available: <span className="text-blue-400 font-semibold">${parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </p>
                </div>

                <div>
                  <label className="text-white font-semibold mb-3 block">Withdrawal Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-blue-500/30 cursor-pointer hover:bg-gray-750 transition-all">
                      <input
                        type="radio"
                        name="method"
                        value="instant"
                        checked={withdrawMethod === 'instant'}
                        onChange={(e) => setWithdrawMethod(e.target.value as any)}
                        className="w-5 h-5 text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <span className="text-white font-semibold">Instant Transfer</span>
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Fastest</span>
                        </div>
                        <p className="text-sm text-gray-400">Arrives in seconds • $2.50 fee</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-blue-500/30 cursor-pointer hover:bg-gray-750 transition-all">
                      <input
                        type="radio"
                        name="method"
                        value="ach"
                        checked={withdrawMethod === 'ach'}
                        onChange={(e) => setWithdrawMethod(e.target.value as any)}
                        className="w-5 h-5 text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-semibold">ACH Transfer</span>
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Free</span>
                        </div>
                        <p className="text-sm text-gray-400">1-3 business days • No fees</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-blue-500/30 cursor-pointer hover:bg-gray-750 transition-all">
                      <input
                        type="radio"
                        name="method"
                        value="wire"
                        checked={withdrawMethod === 'wire'}
                        onChange={(e) => setWithdrawMethod(e.target.value as any)}
                        className="w-5 h-5 text-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Send className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-semibold">Wire Transfer</span>
                        </div>
                        <p className="text-sm text-gray-400">Same day • $15 fee • International OK</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold text-white mb-1">Fast & Secure</p>
                      <p>Your USDC is converted to USD and sent directly to your bank account via Circle's licensed payment infrastructure.</p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!amount || parseFloat(amount) > parseFloat(usdcBalance)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw ${amount || '0.00'} to Bank Account
                </button>
              </div>
            )}

            {activeTab === 'deposit' && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/30">
                  <h3 className="text-white font-bold text-lg mb-4">Your AiC-Circle Bank Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Account Number</span>
                      <span className="text-white font-mono">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Routing Number</span>
                      <span className="text-white font-mono">{routingNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Account Type</span>
                      <span className="text-white">Checking</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Bank Name</span>
                      <span className="text-white">Circle Internet Financial</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <h4 className="text-white font-semibold">Set Up Direct Deposit</h4>
                    </div>
                    <p className="text-sm text-gray-400 ml-13">
                      Provide these details to your employer for automatic paycheck deposits
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold">2</span>
                      </div>
                      <h4 className="text-white font-semibold">Link External Bank</h4>
                    </div>
                    <p className="text-sm text-gray-400 ml-13">
                      Connect your traditional bank account for easy transfers
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold">3</span>
                      </div>
                      <h4 className="text-white font-semibold">Receive Payments</h4>
                    </div>
                    <p className="text-sm text-gray-400 ml-13">
                      Get paid in USD, automatically converted to USDC on Arc L1
                    </p>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  Link External Bank Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-white font-bold text-lg mb-4">Why Choose AiC-Circle Banking?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Global Access</p>
                  <p className="text-sm text-gray-400">Send and receive money anywhere in the world</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Instant Settlements</p>
                  <p className="text-sm text-gray-400">Real-time USDC to USD conversion on Arc L1</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Low Fees</p>
                  <p className="text-sm text-gray-400">Most transactions free or minimal cost</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Regulated & Secure</p>
                  <p className="text-sm text-gray-400">Circle is a licensed money transmitter</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
            <h4 className="text-white font-bold mb-3">Unifying Liquidity</h4>
            <p className="text-sm text-gray-300 mb-4">
              AiC-Circle Banking bridges the gap between crypto and traditional finance, creating seamless money flow across the entire fiat-to-crypto ecosystem.
            </p>
            <p className="text-xs text-blue-400 italic mb-4">
              This fintech banking integration will be requested from Circle Partner Alliance to provide official ACH, Wire, and Direct Deposit capabilities
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400 font-semibold">USDC</span>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-purple-400 mx-2"></div>
              <span className="text-purple-400 font-semibold">USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
