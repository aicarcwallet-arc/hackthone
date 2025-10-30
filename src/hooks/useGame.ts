import { useState, useCallback, useEffect } from 'react';
import { supabase, type BlockchainVocabulary } from '../lib/supabase';
import { getAICBalance, switchToArcNetwork, isOnArcNetwork, getExplorerUrl } from '../lib/blockchain';
import type { Address } from 'viem';

interface GameState {
  isLoading: boolean;
  error: string | null;
  currentWord: BlockchainVocabulary | null;
  sessionId: string | null;
  wordsCompleted: number;
  totalEarned: number;
  isPlaying: boolean;
}

export function useGame(userId: string | null) {
  const [state, setState] = useState<GameState>({
    isLoading: false,
    error: null,
    currentWord: null,
    sessionId: null,
    wordsCompleted: 0,
    totalEarned: 0,
    isPlaying: false,
  });

  const [vocabulary, setVocabulary] = useState<BlockchainVocabulary[]>([]);

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      const { data, error } = await supabase
        .from('blockchain_vocabulary')
        .select('*')
        .order('difficulty', { ascending: true });

      if (error) throw error;
      setVocabulary(data || []);
    } catch (err: any) {
      console.error('Failed to load vocabulary:', err);
    }
  };

  const startGame = useCallback(async () => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: 'Please connect wallet first' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: userId,
          words_completed: 0,
          total_aic_earned: 0,
          average_accuracy: 0,
          session_duration_ms: 0,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];

      setState((prev) => ({
        ...prev,
        isLoading: false,
        sessionId: session.id,
        currentWord: randomWord,
        isPlaying: true,
        wordsCompleted: 0,
        totalEarned: 0,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to start game',
      }));
    }
  }, [userId, vocabulary]);

  const nextWord = useCallback(() => {
    if (vocabulary.length === 0) return;
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setState((prev) => ({ ...prev, currentWord: randomWord }));
  }, [vocabulary]);

  const submitWord = useCallback(
    async (
      typedWord: string,
      timeTakenMs: number,
      accuracyScore: number,
      typingSpeedWpm: number,
      walletAddress: string
    ) => {
      if (!userId || !state.currentWord || !state.sessionId) {
        return null;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      const onArcNetwork = await isOnArcNetwork();
      if (!onArcNetwork) {
        try {
          await switchToArcNetwork();
        } catch (err) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Please switch to Arc Testnet network',
          }));
          return null;
        }
      }

      try {
        const { data: submission, error: submissionError } = await supabase
          .from('word_submissions')
          .insert({
            user_id: userId,
            word: state.currentWord.word,
            typed_word: typedWord,
            accuracy_score: accuracyScore,
            typing_speed_wpm: typingSpeedWpm,
            time_taken_ms: timeTakenMs,
            validation_status: 'pending',
            aic_reward: 0,
            ai_validation_score: 0,
            cognitive_score: 0,
          })
          .select()
          .single();

        if (submissionError) throw submissionError;

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-word`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            submission_id: submission.id,
            user_id: userId,
            word: state.currentWord.word,
            typed_word: typedWord,
            accuracy_score: accuracyScore,
            typing_speed_wpm: typingSpeedWpm,
            base_reward: state.currentWord.base_reward,
            difficulty: state.currentWord.difficulty,
          }),
        });

        if (!response.ok) {
          throw new Error('AI validation failed');
        }

        const validationResult = await response.json();

        if (validationResult.validation_status === 'validated' && validationResult.aic_reward > 0) {
          const updatedBalance = await getAICBalance(walletAddress as Address);
          validationResult.wallet_balance = updatedBalance;
          validationResult.explorer_base_url = getExplorerUrl('');
        }

        const rewardAmount = parseFloat(validationResult.aic_reward) || 0;

        setState((prev) => ({
          ...prev,
          isLoading: false,
          wordsCompleted: prev.wordsCompleted + 1,
          totalEarned: prev.totalEarned + rewardAmount,
        }));

        return validationResult;
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Submission failed',
        }));
        return null;
      }
    },
    [userId, state.currentWord, state.sessionId]
  );

  const endGame = useCallback(async () => {
    if (!state.sessionId) return;

    try {
      await supabase
        .from('game_sessions')
        .update({
          ended_at: new Date().toISOString(),
          words_completed: state.wordsCompleted,
          total_aic_earned: state.totalEarned,
        })
        .eq('id', state.sessionId);

      setState((prev) => ({
        ...prev,
        isPlaying: false,
        sessionId: null,
        currentWord: null,
      }));
    } catch (err: any) {
      console.error('Failed to end game:', err);
    }
  }, [state.sessionId, state.wordsCompleted, state.totalEarned]);

  return {
    ...state,
    vocabulary,
    startGame,
    nextWord,
    submitWord,
    endGame,
  };
}
