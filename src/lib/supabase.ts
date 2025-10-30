import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  wallet_address: string;
  total_words_submitted: number;
  total_aic_earned: number;
  created_at: string;
  updated_at: string;
}

export interface BlockchainVocabulary {
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  base_reward: number;
  description: string;
  created_at: string;
}

export interface WordSubmission {
  id: string;
  user_id: string;
  word: string;
  typed_word: string;
  accuracy_score: number;
  typing_speed_wpm: number;
  time_taken_ms: number;
  validation_status: 'pending' | 'validated' | 'rejected';
  aic_reward: number;
  ai_validation_score: number;
  cognitive_score: number;
  submitted_at: string;
  validated_at?: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  submission_id?: string;
  transaction_type: 'reward' | 'swap' | 'bridge' | 'withdrawal';
  amount: number;
  from_token?: string;
  to_token?: string;
  tx_hash?: string;
  chain_id?: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at?: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  words_completed: number;
  total_aic_earned: number;
  average_accuracy: number;
  session_duration_ms: number;
  started_at: string;
  ended_at?: string;
}
