import { useState, useEffect, useRef } from 'react';
import { Trophy, Clock, Zap, Target, Coins, Play, X, ArrowLeft } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { useNetworkCheck } from '../hooks/useNetworkCheck';
import { NetworkStatusBanner } from './NetworkStatusBanner';

interface VocabularyGameProps {
  userId: string | null;
  walletAddress: string | null;
  onGoBack?: () => void;
}

export function VocabularyGame({ userId, walletAddress, onGoBack }: VocabularyGameProps) {
  const {
    isLoading,
    error,
    currentWord,
    wordsCompleted,
    totalEarned,
    isPlaying,
    startGame,
    nextWord,
    submitWord,
    endGame,
  } = useGame(userId);

  const [typedWord, setTypedWord] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPlaying && currentWord && !startTime) {
      setStartTime(Date.now());
      inputRef.current?.focus();
    }
  }, [isPlaying, currentWord, startTime]);

  const handleStartGame = async () => {
    console.log('Start Game button clicked');
    try {
      await startGame();
      console.log('Game started successfully');
    } catch (err) {
      console.error('Failed to start game:', err);
    }
  };

  const { isCorrectNetwork, switchToArcTestnet } = useNetworkCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submit button clicked');
    e.preventDefault();

    if (!currentWord || !startTime || !typedWord.trim()) return;

    if (!isCorrectNetwork) {
      try {
        await switchToArcTestnet();
      } catch (err) {
        console.error('Failed to switch network:', err);
        return;
      }
    }

    const timeTaken = Date.now() - startTime;
    const accuracy = calculateAccuracy(currentWord.word, typedWord);
    const wpm = calculateWPM(currentWord.word.length, timeTaken);

    const result = await submitWord(typedWord, timeTaken, accuracy, wpm, walletAddress || '');

    if (result) {
      setLastResult(result);
      setShowResult(true);
      setTypedWord('');
      setStartTime(null);
    }
  };

  const handleNextWord = () => {
    console.log('Next Word button clicked');
    setShowResult(false);
    setLastResult(null);
    nextWord();
    setStartTime(Date.now());
    inputRef.current?.focus();
    console.log('Loaded next word');
  };

  const handleEndGame = async () => {
    await endGame();
    setTypedWord('');
    setStartTime(null);
    setShowResult(false);
    setLastResult(null);
  };

  const calculateAccuracy = (original: string, typed: string): number => {
    if (original === typed) return 100;

    const maxLength = Math.max(original.length, typed.length);
    let matches = 0;

    for (let i = 0; i < Math.min(original.length, typed.length); i++) {
      if (original[i].toLowerCase() === typed[i].toLowerCase()) {
        matches++;
      }
    }

    return (matches / maxLength) * 100;
  };

  const calculateWPM = (wordLength: number, timeMs: number): number => {
    const minutes = timeMs / 60000;
    const words = wordLength / 5;
    return Math.round(words / minutes);
  };

  if (!walletAddress) {
    return (
      <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-lg opacity-50"></div>
            <Coins className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto relative" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Connect Wallet to Play
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-medium">
            Start earning AIC tokens by typing hackathon words!
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            All transactions visible on Arc Testnet Explorer
          </p>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50"></div>
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500 mx-auto relative" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Hackathon Word Game
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium max-w-2xl mx-auto px-2">
            Type AI Agent, Arc, Circle, USDC & more • Earn 100-500 AIC per word
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            1 AIC = 1 USDC • All rewards on Arc Testnet
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-cyan-500/20">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">Accuracy Matters</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Type words correctly to earn more tokens. 80%+ accuracy required.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-cyan-500/20">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">Speed Bonus</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Faster typing increases your cognitive score and rewards.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-cyan-500/20">
            <Coins className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">Earn Real Value</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              AIC tokens = USDC. Swap and withdraw to any chain anytime.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg touch-manipulation"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6" />
          Start Playing & Earning
        </button>
      </div>
    );
  }

  return (
    <>
      <NetworkStatusBanner />
      <div className="w-full bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.3)] border border-cyan-500/30 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-3 sm:gap-6">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center gap-1 sm:gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm sm:text-base touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div className="flex items-center gap-1 sm:gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="text-sm sm:text-base font-semibold text-white">{wordsCompleted} Words</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="text-sm sm:text-base font-semibold text-white">{(totalEarned || 0).toFixed(2)} AIC</span>
          </div>
        </div>
        <button
          onClick={handleEndGame}
          className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 active:text-red-800 font-medium text-sm sm:text-base touch-manipulation"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">End Game</span>
          <span className="sm:hidden">End</span>
        </button>
      </div>

      {showResult && lastResult ? (
        <div className={`p-8 rounded-xl mb-6 ${
          lastResult.validation_status === 'validated'
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              lastResult.validation_status === 'validated'
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              {lastResult.validation_status === 'validated' ? (
                <Coins className="w-10 h-10 text-green-600" />
              ) : (
                <X className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h3 className={`text-2xl font-bold mb-2 ${
              lastResult.validation_status === 'validated'
                ? 'text-green-900'
                : 'text-red-900'
            }`}>
              {lastResult.validation_status === 'validated'
                ? `+${parseFloat(lastResult.aic_reward) || 0} AIC Tokens!`
                : 'Try Again!'}
            </h3>

            {lastResult.wallet_balance && (
              <p className="text-sm text-green-700 mb-2">
                New Balance: {(parseFloat(lastResult.wallet_balance) || 0).toFixed(2)} AIC
              </p>
            )}

            <p className={`mb-6 ${
              lastResult.validation_status === 'validated'
                ? 'text-green-700'
                : 'text-red-700'
            }`}>
              {lastResult.message}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lastResult.accuracy_score.toFixed(0)}%
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">AI Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lastResult.ai_validation_score.toFixed(0)}%
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Cognitive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lastResult.cognitive_score.toFixed(0)}%
                </p>
              </div>
            </div>

            <button
              onClick={handleNextWord}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors touch-manipulation"
            >
              Next Word
            </button>
          </div>
        </div>
      ) : currentWord ? (
        <div>
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="inline-block px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-medium rounded-full border border-cyan-500/30">
                  {currentWord.category}
                </span>
                <span className="inline-block px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs sm:text-sm font-medium rounded-full border border-yellow-500/30 capitalize">
                  {currentWord.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">
                  {startTime ? ((Date.now() - startTime) / 1000).toFixed(1) : '0.0'}s
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 sm:p-6 mb-3 sm:mb-4">
              <p className="text-2xl sm:text-3xl font-bold text-white text-center tracking-wider mb-3 sm:mb-4 break-words">
                {currentWord.word}
              </p>
              <p className="text-sm sm:text-base text-gray-300 text-center">{currentWord.description}</p>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-400 mb-3 sm:mb-4">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-semibold">
                Base Reward: {currentWord.base_reward} AIC
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={typedWord}
              onChange={(e) => setTypedWord(e.target.value)}
              placeholder="Type the word here..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl border-2 border-cyan-500/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-center font-mono touch-manipulation placeholder-gray-500"
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              inputMode="text"
            />

            <button
              type="submit"
              disabled={isLoading || !typedWord.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] text-base sm:text-lg touch-manipulation"
            >
              {isLoading ? 'Validating...' : 'Submit Word'}
            </button>
          </form>
        </div>
      ) : null}

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      </div>
    </>
  );
}
