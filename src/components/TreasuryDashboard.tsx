import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Wallet, Activity, BarChart3 } from 'lucide-react';

interface TreasuryMetrics {
  arcBalance: number;
  lineaBalance: number;
  totalGasSpent: number;
  totalFeesCollected: number;
  netProfit: number;
  dailyUsers: number;
  monthlyProjection: number;
  needsRefill: boolean;
}

export default function TreasuryDashboard() {
  const [metrics, setMetrics] = useState<TreasuryMetrics>({
    arcBalance: 0,
    lineaBalance: 0,
    totalGasSpent: 0,
    totalFeesCollected: 0,
    netProfit: 0,
    dailyUsers: 0,
    monthlyProjection: 0,
    needsRefill: false
  });

  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTreasuryMetrics = async () => {
    try {
      // In production, fetch from your smart contracts
      // For now, showing example data structure

      // Simulated data - replace with actual contract calls
      const arcBalanceWei = 75; // ETH
      const lineaBalanceWei = 45; // ETH
      const gasSpentUSD = 450;
      const feesCollectedUSD = 850;

      setMetrics({
        arcBalance: arcBalanceWei,
        lineaBalance: lineaBalanceWei,
        totalGasSpent: gasSpentUSD,
        totalFeesCollected: feesCollectedUSD,
        netProfit: feesCollectedUSD - gasSpentUSD,
        dailyUsers: 127,
        monthlyProjection: (feesCollectedUSD - gasSpentUSD) * 30,
        needsRefill: arcBalanceWei < 50 || lineaBalanceWei < 30
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching treasury metrics:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasuryMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchTreasuryMetrics, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatETH = (amount: number) => {
    return `${amount.toFixed(2)} ETH`;
  };

  const getHealthStatus = () => {
    if (metrics.needsRefill) {
      return { color: 'text-red-500', bg: 'bg-red-500/10', text: 'Needs Refill', icon: AlertCircle };
    }
    if (metrics.netProfit > 0) {
      return { color: 'text-green-500', bg: 'bg-green-500/10', text: 'Profitable', icon: CheckCircle };
    }
    return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', text: 'Monitoring', icon: Activity };
  };

  const health = getHealthStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Treasury Metrics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Treasury Dashboard</h1>
              <p className="text-white/70">Real-time monitoring of your gasless treasury system</p>
            </div>
            <button
              onClick={() => fetchTreasuryMetrics()}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Health Status Banner */}
        <div className={`${health.bg} rounded-2xl p-6 mb-6 border border-white/20`}>
          <div className="flex items-center gap-4">
            <health.icon className={`w-12 h-12 ${health.color}`} />
            <div>
              <h2 className={`text-2xl font-bold ${health.color}`}>{health.text}</h2>
              <p className="text-white/70">
                {metrics.needsRefill
                  ? 'Treasury balance is below minimum threshold. Please refill.'
                  : metrics.netProfit > 0
                  ? `Generating ${formatCurrency(metrics.netProfit)} net profit`
                  : 'System operating normally'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Treasury Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Arc Treasury */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Arc Mainnet Treasury</h3>
              <Wallet className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-white mb-2">{formatETH(metrics.arcBalance)}</div>
              <div className="text-white/70">Minimum: 50 ETH</div>
            </div>
            <div className="bg-white/10 rounded-lg h-2 overflow-hidden">
              <div
                className={`h-full ${metrics.arcBalance >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min((metrics.arcBalance / 100) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
                Refill
              </button>
              <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition">
                Details
              </button>
            </div>
          </div>

          {/* Linea Treasury */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Linea Mainnet Treasury</h3>
              <Wallet className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-white mb-2">{formatETH(metrics.lineaBalance)}</div>
              <div className="text-white/70">Minimum: 30 ETH</div>
            </div>
            <div className="bg-white/10 rounded-lg h-2 overflow-hidden">
              <div
                className={`h-full ${metrics.lineaBalance >= 30 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min((metrics.lineaBalance / 60) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition">
                Refill
              </button>
              <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition">
                Details
              </button>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Gas Spent */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70">Total Gas Spent</h3>
              <Activity className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatCurrency(metrics.totalGasSpent)}</div>
            <div className="text-white/50 text-sm mt-2">Operating costs</div>
          </div>

          {/* Fees Collected */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70">Fees Collected</h3>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatCurrency(metrics.totalFeesCollected)}</div>
            <div className="text-white/50 text-sm mt-2">0.5% conversion fees</div>
          </div>

          {/* Net Profit */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70">Net Profit</h3>
              <TrendingUp className={`w-6 h-6 ${metrics.netProfit > 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <div className={`text-3xl font-bold ${metrics.netProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(metrics.netProfit)}
            </div>
            <div className="text-white/50 text-sm mt-2">Fees - Gas costs</div>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Users */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Active Users Today</h3>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-2">{metrics.dailyUsers}</div>
            <div className="text-white/70">Users with gasless transactions</div>
          </div>

          {/* Monthly Projection */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Monthly Projection</h3>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-5xl font-bold text-green-400 mb-2">{formatCurrency(metrics.monthlyProjection)}</div>
            <div className="text-white/70">Estimated monthly profit</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">System Health Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{((metrics.totalFeesCollected / metrics.totalGasSpent) * 100).toFixed(0)}%</div>
              <div className="text-white/70 text-sm">Fee Coverage Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">${(metrics.totalGasSpent / metrics.dailyUsers).toFixed(2)}</div>
              <div className="text-white/70 text-sm">Cost Per User</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">${(metrics.totalFeesCollected / metrics.dailyUsers).toFixed(2)}</div>
              <div className="text-white/70 text-sm">Revenue Per User</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{metrics.dailyUsers * 30}</div>
              <div className="text-white/70 text-sm">Projected Monthly Users</div>
            </div>
          </div>
        </div>

        {/* Auto-refresh Toggle */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mt-6 border border-white/20 flex items-center justify-between">
          <span className="text-white">Auto-refresh every 30 seconds</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg transition ${
              autoRefresh ? 'bg-green-500 text-white' : 'bg-white/20 text-white/70'
            }`}
          >
            {autoRefresh ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
}
