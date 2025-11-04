import { useState, useEffect } from 'react';
import {
  Play, Coins, DollarSign, CheckCircle2, Loader2,
  Trophy, Zap, TrendingUp, ArrowRight, Wallet, CreditCard, Download, Smartphone, Home, ArrowLeft
} from 'lucide-react';

interface LiteDemoPageProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
  onBackToHome?: () => void;
}

interface GameStats {
  wordsCompleted: number;
  aicEarned: number;
  usdcEarned: number;
  usdcWithdrawn: number;
}

export function LiteDemoPage({ walletAddress, onConnectWallet, onBackToHome }: LiteDemoPageProps) {
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
  const [withdrawMethod, setWithdrawMethod] = useState<'wallet' | 'card'>('wallet');

  const demoWords = [
    {
      word: 'BLOCKCHAIN',
      reward: 100,
      definition: 'A decentralized digital ledger that records transactions across multiple computers securely and transparently.'
    },
    {
      word: 'DEFI',
      reward: 150,
      definition: 'Decentralized Finance - Financial services built on blockchain technology without traditional intermediaries like banks.'
    },
    {
      word: 'SMART CONTRACT',
      reward: 120,
      definition: 'Self-executing code on a blockchain that automatically enforces agreements when predetermined conditions are met.'
    },
    {
      word: 'WALLET',
      reward: 100,
      definition: 'A digital tool that stores your private keys and allows you to send, receive, and manage cryptocurrency.'
    },
    {
      word: 'TOKEN',
      reward: 110,
      definition: 'A digital asset created and managed on a blockchain that can represent value, utility, or ownership.'
    },
    {
      word: 'GAS',
      reward: 90,
      definition: 'The fee required to execute a transaction or smart contract on a blockchain network.'
    },
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
    if (!typedWord.trim()) {
      return;
    }

    const normalizedTyped = typedWord.trim().toUpperCase();
    const normalizedTarget = currentWord.toUpperCase();

    if (normalizedTyped !== normalizedTarget) {
      alert('Try again! Type the word exactly as shown.');
      setTypedWord('');
      return;
    }

    setIsLoading(true);
    const reward = demoWords[stats.wordsCompleted % demoWords.length].reward;

    try {
      const { supabase } = await import('../lib/supabase');

      // Update user stats directly in Supabase
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('wallet_balance, total_words_validated')
        .eq('wallet_address', walletAddress?.toLowerCase())
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
      }

      const currentBalance = parseFloat(userData?.wallet_balance || '0');
      const currentWords = parseInt(userData?.total_words_validated || '0');

      const { error: updateError } = await supabase
        .from('users')
        .update({
          wallet_balance: currentBalance + reward,
          total_words_validated: currentWords + 1,
        })
        .eq('wallet_address', walletAddress?.toLowerCase());

      if (updateError) {
        console.error('Error updating user:', updateError);
        alert('Failed to save progress. Please try again.');
        setIsLoading(false);
        return;
      }

      // Update local stats
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
    } catch (err) {
      console.error('Submit failed:', err);
      alert('An error occurred. Please try again.');
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
        <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8 md:p-12 relative">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Site</span>
            </button>
          )}
          <div className="text-center mb-8 pt-8 sm:pt-0">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-2xl opacity-50"></div>
              <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-400 mx-auto relative" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent mb-4 px-4">
              AI Cognitive Game
            </h1>
            <p className="text-lg sm:text-2xl text-gray-300 font-medium mb-2 px-4">
              Learn Vocabulary • Earn Real USDC
            </p>
            <p className="text-base sm:text-lg text-gray-400 px-4">
              Built on Arc Network with Circle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-4 sm:p-6 border border-cyan-500/30">
              <Play className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2">1. Play Game</h3>
              <p className="text-sm sm:text-base text-gray-300 text-center">Type words, earn AIC tokens</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-4 sm:p-6 border border-blue-500/30">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2">2. Convert</h3>
              <p className="text-sm sm:text-base text-gray-300 text-center">AIC → USDC instantly</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl p-4 sm:p-6 border border-green-500/30">
              <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2">3. Cash Out</h3>
              <p className="text-sm sm:text-base text-gray-300 text-center">Real USDC in your wallet</p>
            </div>
          </div>

          <button
            onClick={handleStartPlaying}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg sm:text-xl font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3 touch-manipulation"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
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
        <div className="max-w-3xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8 relative">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </button>
          )}
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
                  <div className="bg-gray-900/50 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-cyan-500/20">
                <p className="text-3xl sm:text-5xl font-bold text-white text-center mb-3 sm:mb-4 tracking-wider break-words">
                  {currentWord}
                </p>
                <div className="bg-cyan-500/10 rounded-lg p-4 mb-4 border border-cyan-500/30">
                  <p className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-wide">Definition</p>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {demoWords[stats.wordsCompleted % demoWords.length].definition}
                  </p>
                </div>
                <p className="text-center text-gray-400 text-xs sm:text-sm">Type this blockchain term to earn {demoWords[stats.wordsCompleted % demoWords.length].reward} AIC tokens</p>
              </div>

              <input
                type="text"
                value={typedWord}
                onChange={(e) => setTypedWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading && typedWord.trim()) {
                    e.preventDefault();
                    handleSubmitWord();
                  }
                }}
                placeholder="Type here..."
                className="w-full bg-gray-900/50 border-2 border-cyan-500/30 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl text-white text-center font-mono focus:border-cyan-400 focus:outline-none mb-4 sm:mb-6 touch-manipulation"
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />

              <button
                onClick={handleSubmitWord}
                disabled={isLoading || !typedWord.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-lg sm:text-xl font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
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
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8 relative">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </button>
          )}
          <div className="text-center mb-6 sm:mb-8 pt-8 sm:pt-0">
            <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Great Job!</h2>
            <p className="text-lg sm:text-xl text-gray-300">You earned {stats.aicEarned} AIC tokens</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="text-center flex-1">
                <Coins className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs sm:text-sm mb-1">You Have</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{stats.aicEarned} AIC</p>
              </div>

              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />

              <div className="text-center flex-1">
                <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Get</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{usdcAmount.toFixed(2)} USDC</p>
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs sm:text-sm">
              Exchange Rate: 2 AIC = 1 USDC
            </p>
          </div>

          <button
            onClick={handleConvertToUSDC}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-lg sm:text-xl font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
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
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8 relative">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </button>
          )}
          <div className="text-center mb-6 sm:mb-8 pt-8 sm:pt-0">
            <DollarSign className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">Ready to Cash Out!</h2>
            <p className="text-lg sm:text-xl text-gray-300">Choose your withdrawal method</p>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl p-8 mb-8 border border-green-500/30">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">Available to Withdraw</p>
              <p className="text-5xl font-bold text-white mb-2">{stats.usdcEarned.toFixed(2)} USDC</p>
              <p className="text-gray-400 text-sm">≈ ${stats.usdcEarned.toFixed(2)} USD</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setWithdrawMethod('wallet')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  withdrawMethod === 'wallet'
                    ? 'border-green-500 bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'border-gray-600 hover:border-green-500/50'
                }`}
              >
                <Wallet className="w-10 h-10 mx-auto mb-3 text-green-400" />
                <div className="text-white font-bold text-lg mb-1">Arc Wallet</div>
                <div className="text-gray-400 text-sm">Direct to wallet</div>
                <div className="text-green-400 text-xs mt-2 font-semibold">Instant</div>
              </button>

              <button
                onClick={() => setWithdrawMethod('card')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  withdrawMethod === 'card'
                    ? 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                    : 'border-gray-600 hover:border-cyan-500/50'
                }`}
              >
                <CreditCard className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
                <div className="text-white font-bold text-lg mb-1">Virtual Card</div>
                <div className="text-gray-400 text-sm">Spend anywhere</div>
                <div className="text-green-400 text-xs mt-2 font-semibold">Instant</div>
              </button>
            </div>

            {withdrawMethod === 'wallet' ? (
              <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/20">
                <p className="text-xs text-gray-400 mb-1">Sending to Arc Wallet:</p>
                <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-4 border border-cyan-500/20">
                <p className="text-xs text-gray-400 mb-1">Card Deposit Method:</p>
                <p className="text-white text-sm">Instant deposit to Circle virtual card</p>
                <p className="text-gray-400 text-xs mt-2">Spend at any merchant accepting Mastercard</p>
              </div>
            )}
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {withdrawMethod === 'wallet' ? <Wallet className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                {withdrawMethod === 'wallet' ? 'Send to Arc Wallet' : 'Load Virtual Card'}
              </>
            )}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            {withdrawMethod === 'wallet' ? 'Transaction completes in 5-10 seconds' : 'Card loads instantly'}
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-8 relative">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </button>
          )}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <CheckCircle2 className="w-32 h-32 text-green-400 mx-auto relative" />
            </div>

            <h2 className="text-5xl font-semibold text-white mb-4">Success!</h2>
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

            <div className="space-y-4">
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

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/30">
                <Smartphone className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2 text-center">Install Mobile App</h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Install AIC Token app on your phone and earn anywhere!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={window.location.origin}
                    className="flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-3 px-4 rounded-lg transition-all border border-blue-500/30"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Android</span>
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'AIC Token - Learn & Earn',
                          text: 'Learn English and earn USDC!',
                          url: window.location.origin
                        });
                      }
                    }}
                    className="flex items-center justify-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold py-3 px-4 rounded-lg transition-all border border-purple-500/30"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">iOS PWA</span>
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-3 text-center">
                  Play offline, get push notifications for rewards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
