import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolanaWallet } from '../hooks/useSolanaWallet';
import { Wallet, ArrowRightLeft, Send, TrendingUp, DollarSign, Coins } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

interface UserBalances {
  sol: number;
  aic: number;
  pyusd: number;
}

export const SolanaPYUSDDashboard: React.FC = () => {
  const { wallet, isConnected, publicKey, getPYUSDBalance, getAICBalance, getSolBalance } = useSolanaWallet();

  const [balances, setBalances] = useState<UserBalances>({
    sol: 0,
    aic: 0,
    pyusd: 0,
  });

  const [aicToSwap, setAicToSwap] = useState<string>('');
  const [estimatedPYUSD, setEstimatedPYUSD] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'earn' | 'swap' | 'cashout'>('earn');
  const [mintingStatus, setMintingStatus] = useState<string>('');
  const [hasMinted, setHasMinted] = useState(false);

  const AIC_MINT_ADDRESS = import.meta.env.VITE_AIC_TOKEN_MINT || '';

  useEffect(() => {
    if (isConnected && publicKey) {
      claimWelcomeBonus();
      loadBalances();
    }
  }, [isConnected, publicKey]);

  const claimWelcomeBonus = async () => {
    if (hasMinted || !publicKey) return;

    try {
      setMintingStatus('🎁 Claiming your 1,000,000 AIC welcome bonus...');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mint-solana-aic`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userWallet: publicKey.toBase58(),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setMintingStatus('✅ Welcome bonus claimed! You received 1,000,000 AIC tokens!');
        setHasMinted(true);
        setTimeout(() => {
          setMintingStatus('');
          loadBalances();
        }, 5000);
      } else {
        if (result.error?.includes('already minted') || result.error?.includes('balance')) {
          setMintingStatus('✅ Welcome bonus already claimed!');
          setHasMinted(true);
        } else {
          setMintingStatus(`⚠️  ${result.error || 'Could not claim bonus'}`);
        }
        setTimeout(() => setMintingStatus(''), 5000);
      }
    } catch (error) {
      console.error('Minting error:', error);
      setMintingStatus('⚠️  Bonus claim pending...');
      setTimeout(() => setMintingStatus(''), 3000);
    }
  };

  const loadBalances = async () => {
    try {
      const [sol, pyusd] = await Promise.all([
        getSolBalance(),
        getPYUSDBalance(),
      ]);

      let aic = 0;
      if (AIC_MINT_ADDRESS) {
        aic = await getAICBalance(new PublicKey(AIC_MINT_ADDRESS));
      }

      setBalances({ sol, aic, pyusd });
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  useEffect(() => {
    if (aicToSwap) {
      const amount = parseFloat(aicToSwap);
      if (!isNaN(amount)) {
        const swapRate = 0.0001;
        setEstimatedPYUSD(amount * swapRate);
      }
    } else {
      setEstimatedPYUSD(0);
    }
  }, [aicToSwap]);

  const handleEarnAIC = async () => {
    alert('Complete tasks to earn AIC tokens! (Demo: Would integrate with vocabulary game, ads, etc.)');
  };

  const handleSwap = async () => {
    if (!aicToSwap || parseFloat(aicToSwap) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      alert(`Swap functionality coming soon! You would swap ${aicToSwap} AIC for ${estimatedPYUSD.toFixed(6)} PYUSD`);
      await loadBalances();
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCashout = async () => {
    if (balances.pyusd <= 0) {
      alert('No PYUSD balance to cash out');
      return;
    }

    setLoading(true);
    try {
      alert(`Cashout functionality coming soon! ${balances.pyusd.toFixed(2)} PYUSD would be sent to your PayPal wallet`);
      await loadBalances();
    } catch (error) {
      console.error('Cashout error:', error);
      alert('Cashout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {mintingStatus && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg animate-pulse">
            <p className="text-lg font-semibold">{mintingStatus}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Solana + PYUSD Dashboard
            </h1>
            <p className="text-gray-600">
              Earn AIC tokens, swap for PYUSD, cash out to PayPal
            </p>
          </div>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
        </div>

        {!isConnected ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Wallet className="w-20 h-20 mx-auto mb-6 text-blue-600" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Solana Wallet</h2>
            <p className="text-gray-600 mb-8">
              Connect Phantom or another Solana wallet to get started
            </p>
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-lg !px-8 !py-4" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Coins className="w-8 h-8 opacity-80" />
                  <span className="text-sm opacity-80">AIC Balance</span>
                </div>
                <div className="text-3xl font-bold">{balances.aic.toLocaleString()}</div>
                <div className="text-sm opacity-80 mt-2">AIC Tokens</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <span className="text-sm opacity-80">PYUSD Balance</span>
                </div>
                <div className="text-3xl font-bold">${balances.pyusd.toFixed(2)}</div>
                <div className="text-sm opacity-80 mt-2">PayPal USD</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <span className="text-sm opacity-80">SOL Balance</span>
                </div>
                <div className="text-3xl font-bold">{balances.sol.toFixed(4)}</div>
                <div className="text-sm opacity-80 mt-2">Solana</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('earn')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'earn'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Coins className="w-5 h-5 inline mr-2" />
                  Earn AIC
                </button>
                <button
                  onClick={() => setActiveTab('swap')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'swap'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ArrowRightLeft className="w-5 h-5 inline mr-2" />
                  Swap to PYUSD
                </button>
                <button
                  onClick={() => setActiveTab('cashout')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'cashout'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Send className="w-5 h-5 inline mr-2" />
                  Cash Out
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'earn' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Earn AIC Tokens</h3>
                    <p className="text-gray-600 mb-6">
                      Complete tasks and activities to earn AIC tokens
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
                        <h4 className="font-bold text-lg mb-2">Vocabulary Game</h4>
                        <p className="text-gray-600 mb-4">Earn 100 AIC per word</p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Play Now
                        </button>
                      </div>

                      <div className="border-2 border-green-100 rounded-xl p-6 hover:border-green-300 transition-colors cursor-pointer">
                        <h4 className="font-bold text-lg mb-2">Watch Ads</h4>
                        <p className="text-gray-600 mb-4">Earn 50 AIC per ad</p>
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Watch Ads
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleEarnAIC}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      View All Ways to Earn
                    </button>
                  </div>
                )}

                {activeTab === 'swap' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Swap AIC for PYUSD</h3>
                    <p className="text-gray-600 mb-6">
                      Convert your AIC tokens to PayPal USD (PYUSD)
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-4">
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Amount of AIC to Swap
                      </label>
                      <input
                        type="number"
                        value={aicToSwap}
                        onChange={(e) => setAicToSwap(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                      />
                      <div className="mt-2 text-sm text-gray-600">
                        Available: {balances.aic.toLocaleString()} AIC
                      </div>
                    </div>

                    {estimatedPYUSD > 0 && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-semibold">You will receive:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ${estimatedPYUSD.toFixed(6)} PYUSD
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSwap}
                      disabled={loading || !aicToSwap || parseFloat(aicToSwap) <= 0}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Swapping...' : 'Swap to PYUSD'}
                    </button>
                  </div>
                )}

                {activeTab === 'cashout' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Cash Out to PayPal</h3>
                    <p className="text-gray-600 mb-6">
                      Send your PYUSD directly to your PayPal wallet
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-600 mb-2">Available to Cash Out</div>
                        <div className="text-4xl font-bold text-blue-600">
                          ${balances.pyusd.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">PYUSD</div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> PYUSD will be sent to your PayPal wallet instantly.
                        Once in PayPal, you can use it anywhere PayPal is accepted or transfer to your bank account.
                      </p>
                    </div>

                    <button
                      onClick={handleCashout}
                      disabled={loading || balances.pyusd <= 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Send to PayPal Wallet'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h4 className="font-bold mb-2">Earn AIC Tokens</h4>
                  <p className="text-blue-100">
                    Complete vocabulary games, watch ads, or participate in activities
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold mb-2">Swap for PYUSD</h4>
                  <p className="text-blue-100">
                    Convert AIC tokens to PayPal USD using our instant swap pool
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold mb-2">Cash Out to PayPal</h4>
                  <p className="text-blue-100">
                    Send PYUSD to your PayPal wallet and use it anywhere
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
