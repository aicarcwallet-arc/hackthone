import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { InternetMinutesRewardsBox } from './InternetMinutesRewardsBox';

interface RewardsPageProps {
  walletAddress: string | null;
  userId: string | null;
}

export function RewardsPage({ walletAddress, userId }: RewardsPageProps) {
  const [totalAICEarned, setTotalAICEarned] = useState<number>(0);
  const [totalUSDCEarned, setTotalUSDCEarned] = useState<number>(0);
  const [claimedUSDC, setClaimedUSDC] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);

  useEffect(() => {
    if (userId && walletAddress) {
      loadUserStats();
    }
  }, [userId, walletAddress]);

  const loadUserStats = async () => {
    if (!userId) return;

    try {
      const { supabase } = await import('../lib/supabase');
      const { data } = await supabase
        .from('users')
        .select('total_aic_earned, total_usdc_earned, claimed_usdc, total_words_submitted')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setTotalAICEarned(parseFloat(data.total_aic_earned || '0'));
        setTotalUSDCEarned(parseFloat(data.total_usdc_earned || '0'));
        setClaimedUSDC(parseFloat(data.claimed_usdc || '0'));
        setTotalWords(data.total_words_submitted || 0);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleClaimSuccess = async () => {
    await loadUserStats();
  };

  const unclaimedUSDC = totalUSDCEarned - claimedUSDC;
  const recentEarnings = [
    { word: 'CONSENSUS', aic: 450, timestamp: '2 mins ago', txHash: '0x1234...5678' },
    { word: 'DEFI', aic: 380, timestamp: '5 mins ago', txHash: '0x8765...4321' },
    { word: 'SMART-CONTRACT', aic: 500, timestamp: '8 mins ago', txHash: '0xabcd...ef01' },
    { word: 'LIQUIDITY', aic: 420, timestamp: '12 mins ago', txHash: '0x2468...1357' },
    { word: 'VALIDATOR', aic: 410, timestamp: '15 mins ago', txHash: '0x9876...5432' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm px-6 py-3 rounded-full mb-4 border border-green-500/30">
            <Coins className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              My Rewards
            </h1>
          </div>
          <p className="text-gray-300">Track your AIC token earnings and claim history</p>
        </div>

        {!walletAddress ? (
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-12 text-center">
            <Coins className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
            <p className="text-gray-400">Connect your wallet to view your rewards and earning history</p>
          </div>
        ) : (
          <>
            <InternetMinutesRewardsBox
              walletAddress={walletAddress}
              unclaimedUSDC={unclaimedUSDC}
              onClaimSuccess={handleClaimSuccess}
            />

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <Coins className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-3xl font-bold text-white">{totalAICEarned.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Total AIC Earned</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
                <p className="text-3xl font-bold text-white">{totalUSDCEarned.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Total USDC Earned</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <CheckCircle className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-3xl font-bold text-white">{totalWords}</p>
                <p className="text-sm text-gray-400">Words Completed</p>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/30 overflow-hidden">
              <div className="p-6 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold text-cyan-400">Recent Earnings</h2>
              </div>

              <div className="divide-y divide-gray-800">
                {recentEarnings.map((earning, index) => (
                  <div
                    key={index}
                    className="p-6 hover:bg-cyan-500/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Coins className="w-6 h-6 text-green-400" />
                        </div>

                        <div>
                          <p className="font-semibold text-white">{earning.word}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{earning.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-green-400">+{earning.aic} AIC</p>
                        <a
                          href={`https://testnet.arcscan.net/tx/${earning.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                        >
                          View TX
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 text-center border-t border-cyan-500/20">
                <p className="text-sm text-gray-400">All rewards are minted directly to your wallet on Arc Testnet</p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">What can I do with AIC tokens?</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-400 font-bold text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Swap to USDC</p>
                    <p className="text-xs">Convert AIC to USDC at 1:1 ratio anytime</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-400 font-bold text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Bridge to Other Chains</p>
                    <p className="text-xs">Use Circle CCTP to move to Ethereum, Base, etc.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-400 font-bold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Use in DeFi</p>
                    <p className="text-xs">Trade, lend, or stake on Arc ecosystem</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan-400 font-bold text-xs">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Hold for Future</p>
                    <p className="text-xs">Keep in wallet for upcoming AIC utilities</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
