import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Zap, Calculator } from 'lucide-react';

export default function TreasuryProfitCalculator() {
  const [dailyUsers, setDailyUsers] = useState(100);
  const [avgConversionSize, setAvgConversionSize] = useState(50);
  const [conversionsPerUser, setConversionsPerUser] = useState(2);
  const [feePercentage, setFeePercentage] = useState(0.5);

  // Gas costs (estimated)
  const GAS_COST_PER_MINT = 0.03; // $0.03 per AIC mint
  const GAS_COST_PER_CONVERSION = 0.05; // $0.05 per conversion
  const GAS_COST_PER_BRIDGE = 0.07; // $0.07 per bridge transaction

  // Calculate metrics
  const dailyConversions = dailyUsers * conversionsPerUser;
  const dailyVolumeUSD = dailyConversions * avgConversionSize;
  const dailyFeesCollected = dailyVolumeUSD * (feePercentage / 100);

  const dailyGasCosts =
    (dailyUsers * GAS_COST_PER_MINT) + // Minting AIC
    (dailyConversions * GAS_COST_PER_CONVERSION) + // Converting AIC→USDC
    (dailyConversions * 0.3 * GAS_COST_PER_BRIDGE); // 30% bridge to Linea

  const dailyNetProfit = dailyFeesCollected - dailyGasCosts;
  const monthlyNetProfit = dailyNetProfit * 30;
  const yearlyNetProfit = dailyNetProfit * 365;

  const profitMargin = dailyFeesCollected > 0 ? (dailyNetProfit / dailyFeesCollected) * 100 : 0;
  const breakEvenUsers = Math.ceil(dailyGasCosts / ((avgConversionSize * conversionsPerUser * feePercentage / 100)));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-2">
          <Calculator className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Treasury Profit Calculator</h2>
        </div>
        <p className="text-white/70">Model your gasless treasury economics and profitability</p>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Users */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <label className="flex items-center gap-2 text-white mb-3">
            <Users className="w-5 h-5 text-blue-400" />
            Daily Active Users
          </label>
          <input
            type="range"
            min="10"
            max="10000"
            step="10"
            value={dailyUsers}
            onChange={(e) => setDailyUsers(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="text-2xl font-bold text-white">{dailyUsers.toLocaleString()}</div>
        </div>

        {/* Average Conversion Size */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <label className="flex items-center gap-2 text-white mb-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            Avg Conversion Size (USDC)
          </label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={avgConversionSize}
            onChange={(e) => setAvgConversionSize(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="text-2xl font-bold text-white">{formatCurrency(avgConversionSize)}</div>
        </div>

        {/* Conversions Per User */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <label className="flex items-center gap-2 text-white mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            Conversions Per User (Monthly)
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={conversionsPerUser}
            onChange={(e) => setConversionsPerUser(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="text-2xl font-bold text-white">{conversionsPerUser}x</div>
        </div>

        {/* Fee Percentage */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <label className="flex items-center gap-2 text-white mb-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Conversion Fee (%)
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={feePercentage}
            onChange={(e) => setFeePercentage(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="text-2xl font-bold text-white">{feePercentage.toFixed(1)}%</div>
        </div>
      </div>

      {/* Results Dashboard */}
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <h3 className="text-2xl font-bold text-white mb-6">Profitability Analysis</h3>

        {/* Daily Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm mb-1">Daily Volume</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(dailyVolumeUSD)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm mb-1">Daily Fees Collected</div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(dailyFeesCollected)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm mb-1">Daily Gas Costs</div>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(dailyGasCosts)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white/70 text-sm mb-1">Daily Net Profit</div>
            <div className={`text-2xl font-bold ${dailyNetProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(dailyNetProfit)}
            </div>
          </div>
        </div>

        {/* Long-term Projections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-white/70 mb-2">Monthly Profit</div>
            <div className={`text-4xl font-bold ${monthlyNetProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(monthlyNetProfit)}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-white/70 mb-2">Yearly Profit</div>
            <div className={`text-4xl font-bold ${yearlyNetProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(yearlyNetProfit)}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-white/70 mb-2">Profit Margin</div>
            <div className={`text-4xl font-bold ${profitMargin > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white font-semibold mb-1">Break-Even Point</div>
            <div className="text-white/80">
              You need <span className="text-blue-400 font-bold">{breakEvenUsers}</span> daily users to cover gas costs
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white font-semibold mb-1">Revenue Per User</div>
            <div className="text-white/80">
              Each user generates <span className="text-green-400 font-bold">{formatCurrency(dailyFeesCollected / dailyUsers)}</span> in daily fees
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-white font-semibold mb-1">Cost Per User</div>
            <div className="text-white/80">
              Gas costs <span className="text-red-400 font-bold">{formatCurrency(dailyGasCosts / dailyUsers)}</span> per user daily
            </div>
          </div>

          {dailyNetProfit > 0 ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 font-semibold mb-1">✓ System is Profitable!</div>
              <div className="text-white/80">
                Your treasury is self-sustaining with positive cash flow of {formatCurrency(dailyNetProfit)} per day
              </div>
            </div>
          ) : (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 font-semibold mb-1">⚠ System Needs Adjustment</div>
              <div className="text-white/80">
                Consider increasing fee percentage, user count, or conversion size to achieve profitability
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Settings */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Recommended Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 rounded-xl p-4">
            <div className="text-blue-400 font-semibold mb-2">Conservative (Safe Launch)</div>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• 50-100 daily users</li>
              <li>• 0.5% conversion fee</li>
              <li>• $50 average conversion</li>
              <li>• Monthly profit: ~$450-900</li>
            </ul>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4">
            <div className="text-green-400 font-semibold mb-2">Growth (Scaling Phase)</div>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• 500-1,000 daily users</li>
              <li>• 0.5% conversion fee</li>
              <li>• $75 average conversion</li>
              <li>• Monthly profit: ~$5,000-10,000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
