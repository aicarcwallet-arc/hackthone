import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Clock, CheckCircle, ExternalLink, Wallet, ArrowRight } from 'lucide-react';
import { InternetMinutesRewardsBox } from './InternetMinutesRewardsBox';
import { ClaimAICTokens } from './ClaimAICTokens';

interface RewardsPageProps {
  walletAddress: string | null;
  userId: string | null;
  onNavigate?: (page: string) => void;
}

export function RewardsPage({ walletAddress, userId, onNavigate }: RewardsPageProps) {
  const [totalAICEarned, setTotalAICEarned] = useState<number>(0);
  const [totalUSDCEarned, setTotalUSDCEarned] = useState<number>(0);
  const [claimedUSDC, setClaimedUSDC] = useState<number>(0);
  const [claimedAIC, setClaimedAIC] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (userId && walletAddress) {
      loadUserStats();
      loadRecentTransactions();
    }
  }, [userId, walletAddress]);

  const loadUserStats = async () => {
    if (!userId) return;

    try {
      const { supabase } = await import('../lib/supabase');
      const { data } = await supabase
        .from('users')
        .select('total_aic_earned, total_usdc_earned, claimed_usdc, claimed_aic, total_words_submitted')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setTotalAICEarned(parseFloat(data.total_aic_earned || '0'));
        setTotalUSDCEarned(parseFloat(data.total_usdc_earned || '0'));
        setClaimedUSDC(parseFloat(data.claimed_usdc || '0'));
        setClaimedAIC(parseFloat(data.claimed_aic || '0'));
        setTotalWords(data.total_words_submitted || 0);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadRecentTransactions = async () => {
    if (!userId) return;

    try {
      const { supabase } = await import('../lib/supabase');
      const { data } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setRecentTransactions(data);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleClaimSuccess = async () => {
    // Refresh immediately
    await loadUserStats();
    await loadRecentTransactions();

    // Refresh again after 2 seconds
    setTimeout(async () => {
      await loadUserStats();
      await loadRecentTransactions();
    }, 2000);

    // Final refresh after 5 seconds
    setTimeout(async () => {
      await loadUserStats();
      await loadRecentTransactions();
    }, 5000);
  };

  const unclaimedUSDC = totalUSDCEarned - claimedUSDC;
  const unclaimedAIC = totalAICEarned - claimedAIC;

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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Active Claimable Rewards
              </h2>

              {unclaimedAIC === 0 && unclaimedUSDC === 0 ? (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
                  <Coins className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No unclaimed rewards right now</p>
                  <p className="text-gray-500 text-xs mt-1">Play more games to earn new AIC tokens!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unclaimedAIC > 0 && (
                    <ClaimAICTokens
                      walletAddress={walletAddress}
                      unclaimedAmount={unclaimedAIC}
                      onSuccess={handleClaimSuccess}
                    />
                  )}

                  {unclaimedUSDC > 0 && (
                    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm rounded-xl p-6 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 p-3 rounded-full">
                            <Wallet className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">{unclaimedUSDC.toFixed(2)} USDC</p>
                            <p className="text-sm text-green-400">Ready to Withdraw</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate?.('withdraw')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2"
                      >
                        <Wallet className="w-5 h-5" />
                        Withdraw ${unclaimedUSDC.toFixed(2)} USD
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Game Statistics (All-Time)
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <Coins className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-3xl font-bold text-white">{totalAICEarned.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total AIC Earned</p>
                  <p className="text-xs text-gray-600 mt-1">Claimed: {claimedAIC.toFixed(2)}</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <TrendingUp className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-3xl font-bold text-white">{totalUSDCEarned.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total USDC Earned</p>
                  <p className="text-xs text-gray-600 mt-1">Withdrawn: {claimedUSDC.toFixed(2)}</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <CheckCircle className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-3xl font-bold text-white">{totalWords}</p>
                  <p className="text-sm text-gray-500">Words Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/30 overflow-hidden">
              <div className="p-6 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold text-cyan-400">Recent Transactions</h2>
              </div>

              {recentTransactions.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-800">
                    {recentTransactions.map((tx, index) => {
                      const txDate = new Date(tx.created_at);
                      const now = new Date();
                      const diffMs = now.getTime() - txDate.getTime();
                      const diffMins = Math.floor(diffMs / 60000);
                      const timeAgo = diffMins < 1 ? 'Just now' :
                                     diffMins < 60 ? `${diffMins} min${diffMins > 1 ? 's' : ''} ago` :
                                     diffMins < 1440 ? `${Math.floor(diffMins / 60)} hr${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago` :
                                     `${Math.floor(diffMins / 1440)} day${Math.floor(diffMins / 1440) > 1 ? 's' : ''} ago`;

                      return (
                        <div
                          key={index}
                          className="p-6 hover:bg-cyan-500/5 transition-colors"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                tx.transaction_type === 'mint' ? 'bg-green-500/20' :
                                tx.transaction_type === 'swap' ? 'bg-blue-500/20' :
                                'bg-purple-500/20'
                              }`}>
                                <Coins className={`w-6 h-6 ${
                                  tx.transaction_type === 'mint' ? 'text-green-400' :
                                  tx.transaction_type === 'swap' ? 'text-blue-400' :
                                  'text-purple-400'
                                }`} />
                              </div>

                              <div>
                                <p className="font-semibold text-white capitalize">{tx.transaction_type}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{timeAgo}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-green-400">
                                {tx.from_token ? `${tx.from_token} → ${tx.to_token}` : tx.to_token}
                              </p>
                              <p className="text-sm text-gray-400">{tx.amount.toFixed(2)} {tx.to_token}</p>
                              {tx.tx_hash && (
                                <a
                                  href={`https://testnet.arcscan.app/tx/${tx.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-1"
                                >
                                  View TX
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-6 text-center border-t border-cyan-500/20">
                    <p className="text-sm text-gray-400">All transactions are recorded on Arc Testnet blockchain</p>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Coins className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Transactions Yet</h3>
                  <p className="text-gray-400">Start playing to earn AIC tokens and see your transaction history here</p>
                </div>
              )}
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
