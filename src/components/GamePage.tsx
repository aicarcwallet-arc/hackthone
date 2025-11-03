import { VocabularyGame } from './VocabularyGame';
import { Trophy, Zap, Target, Coins, Star, Brain, Award } from 'lucide-react';

interface GamePageProps {
  userId: string | null;
  walletAddress: string | null;
  onNavigate?: (page: string) => void;
}

export function GamePage({ userId, walletAddress, onNavigate }: GamePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Play & Earn AIC Tokens
            </h1>
            <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8 px-4">
            Test your blockchain knowledge and earn real AIC tokens instantly. Every correct answer mints tokens to your wallet on Arc Network.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all">
              <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Accuracy</p>
              <p className="text-xs text-gray-400">80%+ Required</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all">
              <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Speed Bonus</p>
              <p className="text-xs text-gray-400">Fast = More AIC</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all">
              <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">100-500 AIC</p>
              <p className="text-xs text-gray-400">Per Word</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">AI Validated</p>
              <p className="text-xs text-gray-400">OpenAI GPT-4</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-full border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-white font-bold text-sm">GAME ARENA</span>
                    <Star className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
              </div>

              <VocabularyGame
                userId={userId}
                walletAddress={walletAddress}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => onNavigate?.('leaderboard')}
            className="group bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all text-left"
          >
            <Trophy className="w-10 h-10 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Leaderboard</h3>
            <p className="text-sm text-gray-400">See top players and track your rank</p>
          </button>

          <button
            onClick={() => onNavigate?.('rewards')}
            className="group bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all text-left"
          >
            <Coins className="w-10 h-10 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">My Rewards</h3>
            <p className="text-sm text-gray-400">View your earnings and claim history</p>
          </button>

          <button
            onClick={() => onNavigate?.('how')}
            className="group bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all text-left"
          >
            <Brain className="w-10 h-10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">How to Play</h3>
            <p className="text-sm text-gray-400">Learn the rules and strategies</p>
          </button>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Game Rules
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 font-bold text-xs">1</span>
              </div>
              <div>
                <p className="font-semibold text-white">Type Accurately</p>
                <p className="text-xs">Match the blockchain term exactly as shown</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 font-bold text-xs">2</span>
              </div>
              <div>
                <p className="font-semibold text-white">Speed Matters</p>
                <p className="text-xs">Faster typing increases your cognitive score</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 font-bold text-xs">3</span>
              </div>
              <div>
                <p className="font-semibold text-white">AI Validation</p>
                <p className="text-xs">OpenAI validates your cognitive understanding</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 font-bold text-xs">4</span>
              </div>
              <div>
                <p className="font-semibold text-white">Instant Rewards</p>
                <p className="text-xs">AIC tokens minted directly to your wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
