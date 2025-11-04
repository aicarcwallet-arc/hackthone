import { useState, useEffect } from 'react';
import {
  Play, Coins, DollarSign, CheckCircle2, Loader2,
  Trophy, Zap, TrendingUp, ArrowRight, Wallet
} from 'lucide-react';

interface LiteDemoPageProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
}

interface GameStats {
  wordsCompleted: number;
  aicEarned: number;
  usdcEarned: number;
  usdcWithdrawn: number;
}

export function LiteDemoPage({ walletAddress, onConnectWallet }: LiteDemoPageProps) {
  const [step, setStep] = useState<'welcome' | 'playing' | 'convert' | 'withdraw' | 'success'>('welcome');
  const [stats, setStats] = useState<GameStats>({
    wordsCompleted: 0,
    aicEarned: 0,
    usdcEarned: 0,
    usdcWithdrawn: 0,
  });
  const [currentWord, setCurrentWord] = useState('');
  const [typedWord, setTypedWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [showReward, setShowReward] = useState(false);

  const demoWords = [
    { word: 'BLOCKCHAIN', reward: 100 },
    { word: 'DEFI', reward: 150 },
    { word: 'SMART', reward: 120 },
  ];

  useEffect(() => {
    if (walletAddress) {
      loadUserStats();
    }
  }, [walletAddress]);

  const loadUserStats = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress?.toLowerCase())
        .maybeSingle();

      if (data) {
        setStats({
          wordsCompleted: parseInt(data.total_words_validated || '0'),
          aicEarned: parseFloat(data.wallet_balance || '0'),
          usdcEarned: parseFloat(data.total_usdc_earned || '0'),
          usdcWithdrawn: parseFloat(data.claimed_usdc || '0'),
        });
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleStartPlaying = () => {
    if (!walletAddress) {
      onConnectWallet();
      return;
    }
    setStep('playing');
    setCurrentWord(demoWords[stats.wordsCompleted % demoWords.length].word);
  };

  const handleSubmitWord = async () => {
    if (typedWord.toUpperCase() !== currentWord) {
      alert('Try again! Type the word exactly as shown.');
      return;
    }

    setIsLoading(true);
    const reward = demoWords[stats.wordsCompleted % demoWords.length].reward;

    try {
      const { supabase } = await import('../lib/supabase');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-word`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            word: currentWord,
            typed_word: typedWord,
            wallet_address: walletAddress,
            time_taken: 3000,
          }),
        }
      );

      if (response.ok) {
        setStats(prev => ({
          ...prev,
          wordsCompleted: prev.wordsCompleted + 1,
          aicEarned: prev.aicEarned + reward,
        }));
        setShowReward(true);
        setTimeout(() => {
          setShowReward(false);
          if (stats.wordsCompleted + 1 >= 3) {
            setStep('convert');
          } else {
            setCurrentWord(demoWords[(stats.wordsCompleted + 1) % demoWords.length].word);
          }
          setTypedWord('');
        }, 2000);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToUSDC = async () => {
    setIsLoading(true);
    try {
      const { supabase } = await import('../lib/supabase');
      const aicAmount = stats.aicEarned;
      const usdcAmount = aicAmount / 2;

      const { data, error } = await supabase
        .from('users')
        .update({
          total_usdc_earned: stats.usdcEarned + usdcAmount,
          wallet_balance: 0,
        })
        .eq('wallet_address', walletAddress?.toLowerCase())
        .select()
        .single();

      if (!error) {
        setStats(prev => ({
          ...prev,
          aicEarned: 0,
          usdcEarned: prev.usdcEarned + usdcAmount,
        }));
        setTimeout(() => {
          setStep('withdraw');
        }, 1500);
      }
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mint-usdc-reward`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            walletAddress: walletAddress,
            useCircleAPI: false,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.transactionHash) {
        setTxHash(result.transactionHash);
        setStats(prev => ({
          ...prev,
          usdcWithdrawn: prev.usdcEarned,
        }));
        setStep('success');
      }
    } catch (err) {
      console.error('Withdrawal failed:', err);
      alert('Withdrawal failed. Make sure treasury has funds!');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-2xl opacity-50"></div>
              <Trophy className="w-24 h-24 text-cyan-400 mx-auto relative" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Cognitive Token
            </h1>
            <p className="text-2xl text-gray-300 font-medium mb-2">
              Learn English • Earn Real USDC
            </p>
            <p className="text-lg text-gray-400">
              Built on Arc Network with Circle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-6 border border-cyan-500/30">
              <Play className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white text-center mb-2">1. Play Game</h3>
              <p className="text-gray-300 text-center">Type words, earn AIC tokens</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-6 border border-blue-500/30">
              <Zap className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white text-center mb-2">2. Convert</h3>
              <p className="text-gray-300 text-center">AIC → USDC instantly</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl p-6 border border-purple-500/30">
              <DollarSign className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white text-center mb-2">3. Cash Out</h3>
              <p className="text-gray-300 text-center">Real USDC in your wallet</p>
            </div>
          </div>

          <button
            onClick={handleStartPlaying}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xl font-bold py-6 px-8 rounded-2xl transition-all shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.8)] flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6" />
            {walletAddress ? 'Start Earning USDC' : 'Connect Wallet to Start'}
          </button>

          {walletAddress && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{stats.wordsCompleted}/3</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">{stats.aicEarned} AIC</span>
              </div>
            </div>
          </div>

          {showReward ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-green-400 mb-2">Correct!</h2>
              <p className="text-2xl text-white">+{demoWords[stats.wordsCompleted - 1]?.reward || 100} AIC</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-900/50 rounded-2xl p-8 mb-8 border border-cyan-500/20">
                <p className="text-5xl font-bold text-white text-center mb-4 tracking-wider">
                  {currentWord}
                </p>
                <p className="text-center text-gray-400">Type this word to earn AIC tokens</p>
              </div>

              <input
                type="text"
                value={typedWord}
                onChange={(e) => setTypedWord(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitWord()}
                placeholder="Type here..."
                className="w-full bg-gray-900/50 border-2 border-cyan-500/30 rounded-xl px-6 py-4 text-2xl text-white text-center font-mono focus:border-cyan-400 focus:outline-none mb-6"
                autoFocus
              />

              <button
                onClick={handleSubmitWord}
                disabled={isLoading || !typedWord.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-xl font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    Submit Word
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === 'convert') {
    const usdcAmount = stats.aicEarned / 2;
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8">
          <div className="text-center mb-8">
            <TrendingUp className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">Great Job!</h2>
            <p className="text-xl text-gray-300">You earned {stats.aicEarned} AIC tokens</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl p-8 mb-8 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <Coins className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm mb-1">You Have</p>
                <p className="text-3xl font-bold text-white">{stats.aicEarned} AIC</p>
              </div>

              <ArrowRight className="w-8 h-8 text-gray-400" />

              <div className="text-center flex-1">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm mb-1">Get</p>
                <p className="text-3xl font-bold text-white">{usdcAmount.toFixed(2)} USDC</p>
              </div>
            </div>

            <p className="text-center text-gray-400 text-sm">
              Exchange Rate: 2 AIC = 1 USDC
            </p>
          </div>

          <button
            onClick={handleConvertToUSDC}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-xl font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                Convert to USDC
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'withdraw') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8">
          <div className="text-center mb-8">
            <Wallet className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Cash Out!</h2>
            <p className="text-xl text-gray-300">Send USDC to your wallet</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-2xl p-8 mb-8 border border-purple-500/30">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">Available to Withdraw</p>
              <p className="text-5xl font-bold text-white mb-2">{stats.usdcEarned.toFixed(2)} USDC</p>
              <p className="text-gray-400 text-sm">≈ ${stats.usdcEarned.toFixed(2)} USD</p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
              <p className="text-xs text-gray-400 mb-1">Sending to:</p>
              <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-xl font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Sending USDC...
              </>
            ) : (
              <>
                <DollarSign className="w-6 h-6" />
                Send to My Wallet
              </>
            )}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Transaction completes in 5-10 seconds
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <CheckCircle2 className="w-32 h-32 text-green-400 mx-auto relative" />
            </div>

            <h2 className="text-5xl font-bold text-white mb-4">Success!</h2>
            <p className="text-2xl text-gray-300 mb-8">USDC is now in your wallet</p>

            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/30 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <span className="text-4xl font-bold text-white">{stats.usdcEarned.toFixed(2)} USDC</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Check your MetaMask wallet!</p>

              {txHash && (
                <div className="bg-gray-900/50 rounded-lg p-3 border border-green-500/20">
                  <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                  <a
                    href={`https://testnet.arcscan.net/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-mono text-xs break-all"
                  >
                    {txHash}
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setStep('welcome');
                setStats({
                  wordsCompleted: 0,
                  aicEarned: 0,
                  usdcEarned: 0,
                  usdcWithdrawn: 0,
                });
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xl font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
