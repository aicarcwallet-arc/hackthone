import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

export function LeaderboardPage() {
  const topPlayers = [
    { rank: 1, address: '0x1234...5678', words: 142, aic: 52800, accuracy: 98 },
    { rank: 2, address: '0x8765...4321', words: 128, aic: 48200, accuracy: 96 },
    { rank: 3, address: '0xabcd...ef01', words: 115, aic: 43500, accuracy: 95 },
    { rank: 4, address: '0x2468...1357', words: 98, aic: 37100, accuracy: 94 },
    { rank: 5, address: '0x9876...5432', words: 87, aic: 33200, accuracy: 93 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-sm px-6 py-3 rounded-full mb-4 border border-yellow-500/30">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Global Leaderboard
            </h1>
          </div>
          <p className="text-gray-300">Top players ranked by total AIC earned</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
            <p className="text-2xl font-bold text-white">1,247</p>
            <p className="text-sm text-gray-400">Total Players</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <Star className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">45,892</p>
            <p className="text-sm text-gray-400">Words Completed</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">1.8M</p>
            <p className="text-sm text-gray-400">AIC Distributed</p>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/30 overflow-hidden">
          <div className="p-6 border-b border-cyan-500/20">
            <h2 className="text-xl font-bold text-cyan-400">Top 100 Players</h2>
          </div>

          <div className="divide-y divide-gray-800">
            {topPlayers.map((player) => (
              <div
                key={player.rank}
                className="p-6 hover:bg-cyan-500/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gray-700'
                    }`}>
                      {player.rank <= 3 ? (
                        <Medal className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold">#{player.rank}</span>
                      )}
                    </div>

                    <div>
                      <p className="font-mono text-white font-semibold">{player.address}</p>
                      <p className="text-sm text-gray-400">{player.words} words completed</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{player.aic.toLocaleString()} AIC</p>
                    <p className="text-sm text-gray-400">{player.accuracy}% accuracy</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 text-center border-t border-cyan-500/20">
            <p className="text-sm text-gray-400">Updated in real-time • Your rank will appear here once you start playing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
