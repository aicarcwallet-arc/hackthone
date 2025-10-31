import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Clock, XCircle, TrendingUp, ArrowDownUp, RefreshCw } from 'lucide-react';
import { supabase, type TokenTransaction } from '../lib/supabase';
import { getExplorerUrl } from '../lib/blockchain';

interface TransactionHistoryProps {
  userId: string | null;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadTransactions();
    }
  }, [userId]);

  const loadTransactions = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reward':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'swap':
      case 'bridge':
        return <ArrowDownUp className="w-5 h-5 text-blue-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTxExplorerUrl = (txHash: string, chainId?: number) => {
    if (!txHash) return null;
    return getExplorerUrl(txHash);
  };

  if (!userId) {
    return (
      <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8">
        <div className="text-center text-sm sm:text-base text-gray-300">
          Connect your wallet to view transaction history
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">Transaction History</h2>
          <p className="text-xs sm:text-sm text-gray-300">All transactions on Arc Testnet blockchain</p>
        </div>
        <button
          onClick={loadTransactions}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-medium text-xs sm:text-sm rounded-lg transition-colors touch-manipulation"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-400">
          No transactions yet. Start playing to earn AIC tokens!
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 border border-cyan-500/20 bg-gray-800/30 backdrop-blur-sm rounded-lg hover:bg-cyan-500/10 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full">
                <div className="flex-shrink-0">
                  <div className="hidden sm:block">{getTypeIcon(tx.transaction_type)}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm sm:text-base font-semibold text-white capitalize">
                      {tx.transaction_type}
                    </p>
                    {tx.from_token && tx.to_token && (
                      <span className="text-xs sm:text-sm text-gray-400">
                        {tx.from_token} → {tx.to_token}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                  {tx.tx_hash && (
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-gray-400 font-mono truncate max-w-[150px] sm:max-w-xs">
                        {tx.tx_hash}
                      </p>
                      {getTxExplorerUrl(tx.tx_hash, tx.chain_id) && (
                        <a
                          href={getTxExplorerUrl(tx.tx_hash, tx.chain_id)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          title="View on Arc Explorer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-xs">View</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right ml-auto">
                  <p className="font-bold text-white text-base sm:text-lg">
                    {tx.transaction_type === 'reward' ? '+' : ''}
                    {tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {tx.to_token || 'AIC'}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {getStatusIcon(tx.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-cyan-500/20">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-cyan-300 font-medium mb-2">🔗 Arc Testnet Explorer</p>
          <p className="text-xs sm:text-sm text-gray-300 mb-2">
            All transactions are permanently recorded on Arc Testnet blockchain with sub-second finality.
            Click transaction hash to view on <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Arc Explorer</a>.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-gray-800/50 px-2 py-1 rounded">
              <span className="text-gray-400">Chain ID:</span>{' '}
              <span className="text-white font-mono">5042002</span>
            </div>
            <div className="bg-gray-800/50 px-2 py-1 rounded max-w-full">
              <span className="text-gray-400">RPC:</span>{' '}
              <span className="text-white font-mono truncate inline-block max-w-[180px] sm:max-w-none align-bottom">rpc.testnet.arc.network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
