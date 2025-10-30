/*
  # AIC Vocabulary Game Schema

  ## Overview
  This migration creates the complete database schema for the AI-powered blockchain vocabulary game
  where users earn AIC tokens (pegged 1:1 with USDC) by typing blockchain-related vocabulary words.

  ## Tables Created

  ### 1. users
  Stores user profile and wallet information
  - `id` (uuid, primary key) - Unique user identifier
  - `wallet_address` (text, unique) - User's connected wallet address
  - `total_words_submitted` (integer) - Total number of words submitted
  - `total_aic_earned` (numeric) - Total AIC tokens earned
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. blockchain_vocabulary
  Master list of blockchain vocabulary words for validation
  - `id` (uuid, primary key) - Unique word identifier
  - `word` (text, unique) - The blockchain vocabulary word
  - `category` (text) - Category (e.g., "consensus", "defi", "layer2")
  - `difficulty` (text) - Difficulty level (easy, medium, hard, expert)
  - `base_reward` (numeric) - Base AIC reward for this word (100-500)
  - `description` (text) - Word definition/explanation
  - `created_at` (timestamptz) - When word was added

  ### 3. word_submissions
  Records of user word submissions and validations
  - `id` (uuid, primary key) - Unique submission identifier
  - `user_id` (uuid, foreign key) - User who submitted
  - `word` (text) - The word submitted by user
  - `typed_word` (text) - Exact text typed by user
  - `accuracy_score` (numeric) - Typing accuracy (0-100)
  - `typing_speed_wpm` (numeric) - Words per minute
  - `time_taken_ms` (integer) - Time taken in milliseconds
  - `validation_status` (text) - Status: pending, validated, rejected
  - `aic_reward` (numeric) - AIC tokens awarded
  - `ai_validation_score` (numeric) - AI validation score (0-100)
  - `cognitive_score` (numeric) - Cognitive skill score (0-100)
  - `submitted_at` (timestamptz) - Submission timestamp
  - `validated_at` (timestamptz) - Validation timestamp

  ### 4. token_transactions
  Records all AIC token transactions and rewards
  - `id` (uuid, primary key) - Unique transaction identifier
  - `user_id` (uuid, foreign key) - User involved in transaction
  - `submission_id` (uuid, foreign key) - Related word submission
  - `transaction_type` (text) - Type: reward, swap, bridge, withdrawal
  - `amount` (numeric) - Token amount
  - `from_token` (text) - Source token (AIC, USDC)
  - `to_token` (text) - Destination token
  - `tx_hash` (text) - Blockchain transaction hash
  - `chain_id` (integer) - Blockchain chain ID
  - `status` (text) - Status: pending, confirmed, failed
  - `created_at` (timestamptz) - Transaction creation time
  - `confirmed_at` (timestamptz) - Blockchain confirmation time

  ### 5. game_sessions
  Tracks individual game sessions
  - `id` (uuid, primary key) - Unique session identifier
  - `user_id` (uuid, foreign key) - User playing
  - `words_completed` (integer) - Words completed in session
  - `total_aic_earned` (numeric) - AIC earned in session
  - `average_accuracy` (numeric) - Average accuracy score
  - `session_duration_ms` (integer) - Session duration
  - `started_at` (timestamptz) - Session start time
  - `ended_at` (timestamptz) - Session end time

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
  - Insert/update policies enforce data ownership
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  total_words_submitted integer DEFAULT 0,
  total_aic_earned numeric(20, 6) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blockchain_vocabulary table
CREATE TABLE IF NOT EXISTS blockchain_vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  base_reward numeric(10, 2) NOT NULL CHECK (base_reward >= 100 AND base_reward <= 500),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create word_submissions table
CREATE TABLE IF NOT EXISTS word_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word text NOT NULL,
  typed_word text NOT NULL,
  accuracy_score numeric(5, 2) NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  typing_speed_wpm numeric(6, 2) DEFAULT 0,
  time_taken_ms integer NOT NULL,
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected')),
  aic_reward numeric(10, 2) DEFAULT 0,
  ai_validation_score numeric(5, 2) DEFAULT 0,
  cognitive_score numeric(5, 2) DEFAULT 0,
  submitted_at timestamptz DEFAULT now(),
  validated_at timestamptz
);

-- Create token_transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_id uuid REFERENCES word_submissions(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('reward', 'swap', 'bridge', 'withdrawal')),
  amount numeric(20, 6) NOT NULL,
  from_token text,
  to_token text,
  tx_hash text,
  chain_id integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  words_completed integer DEFAULT 0,
  total_aic_earned numeric(10, 2) DEFAULT 0,
  average_accuracy numeric(5, 2) DEFAULT 0,
  session_duration_ms integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_word_submissions_user ON word_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_word_submissions_status ON word_submissions(validation_status);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_status ON token_transactions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address')
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS Policies for blockchain_vocabulary (public read access)
CREATE POLICY "Anyone can view vocabulary"
  ON blockchain_vocabulary FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for word_submissions
CREATE POLICY "Users can view own submissions"
  ON word_submissions FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

CREATE POLICY "Users can insert own submissions"
  ON word_submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- RLS Policies for token_transactions
CREATE POLICY "Users can view own transactions"
  ON token_transactions FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

CREATE POLICY "Users can insert own transactions"
  ON token_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- RLS Policies for game_sessions
CREATE POLICY "Users can view own sessions"
  ON game_sessions FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

CREATE POLICY "Users can insert own sessions"
  ON game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

CREATE POLICY "Users can update own sessions"
  ON game_sessions FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Insert sample blockchain vocabulary words
INSERT INTO blockchain_vocabulary (word, category, difficulty, base_reward, description) VALUES
  ('blockchain', 'fundamentals', 'easy', 100, 'A distributed ledger technology that maintains a continuously growing list of records'),
  ('consensus', 'fundamentals', 'easy', 120, 'Agreement among distributed network nodes on the current state of the blockchain'),
  ('mining', 'fundamentals', 'easy', 110, 'Process of validating transactions and adding new blocks to the blockchain'),
  ('cryptocurrency', 'fundamentals', 'easy', 100, 'Digital or virtual currency secured by cryptography'),
  ('wallet', 'fundamentals', 'easy', 100, 'Digital tool to store and manage cryptocurrency'),
  ('smartcontract', 'fundamentals', 'medium', 200, 'Self-executing contract with terms directly written into code'),
  ('defi', 'defi', 'medium', 220, 'Decentralized Finance - financial services without intermediaries'),
  ('ethereum', 'platforms', 'easy', 150, 'Decentralized platform for smart contracts and dapps'),
  ('solidity', 'development', 'medium', 250, 'Programming language for writing smart contracts'),
  ('gas', 'technical', 'medium', 180, 'Fee required to execute transactions on Ethereum'),
  ('layer2', 'scaling', 'hard', 300, 'Secondary framework built on top of blockchain to improve scalability'),
  ('rollup', 'scaling', 'hard', 320, 'Layer 2 scaling solution that bundles multiple transactions'),
  ('staking', 'consensus', 'medium', 200, 'Locking cryptocurrency to support network operations and earn rewards'),
  ('validator', 'consensus', 'medium', 210, 'Node responsible for verifying transactions in proof-of-stake'),
  ('merkletree', 'technical', 'hard', 350, 'Data structure for efficiently verifying data integrity'),
  ('nonce', 'technical', 'medium', 190, 'Number used once in cryptographic communication'),
  ('dao', 'governance', 'medium', 230, 'Decentralized Autonomous Organization governed by smart contracts'),
  ('nft', 'tokens', 'easy', 150, 'Non-Fungible Token representing unique digital assets'),
  ('erc20', 'standards', 'medium', 240, 'Standard for fungible tokens on Ethereum'),
  ('oracle', 'infrastructure', 'hard', 310, 'Service providing external data to smart contracts'),
  ('crosschain', 'interoperability', 'hard', 340, 'Ability to transfer assets between different blockchains'),
  ('zeroknowledge', 'privacy', 'expert', 450, 'Cryptographic method proving knowledge without revealing information'),
  ('sharding', 'scaling', 'expert', 420, 'Database partitioning technique for blockchain scalability'),
  ('mev', 'technical', 'expert', 480, 'Maximal Extractable Value from transaction ordering'),
  ('bridge', 'interoperability', 'medium', 260, 'Protocol connecting two blockchains for asset transfers')
ON CONFLICT (word) DO NOTHING;
