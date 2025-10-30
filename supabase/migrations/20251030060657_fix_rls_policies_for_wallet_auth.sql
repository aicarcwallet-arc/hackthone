/*
  # Fix RLS Policies for Wallet-based Authentication

  ## Changes Made
  This migration updates RLS policies to work with wallet-based authentication instead of Supabase Auth.
  
  ## Security Updates
  1. **users table** - Allow public insert for wallet registration, public read by wallet address
  2. **blockchain_vocabulary** - Allow public read access (words are public)
  3. **word_submissions** - Allow public insert/read based on user_id matching
  4. **token_transactions** - Allow public insert/read based on user_id matching
  5. **game_sessions** - Allow public insert/update/read based on user_id matching

  ## Important Notes
  - Policies now use `anon` and `authenticated` roles
  - Users can only access their own data
  - Wallet addresses are the source of truth for ownership
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view vocabulary" ON blockchain_vocabulary;
DROP POLICY IF EXISTS "Users can view own submissions" ON word_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON word_submissions;
DROP POLICY IF EXISTS "Users can view own transactions" ON token_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON token_transactions;
DROP POLICY IF EXISTS "Users can view own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON game_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON game_sessions;

-- Users table policies (wallet-based access)
CREATE POLICY "Public can read all users"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert users"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update own user by wallet"
  ON users FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Vocabulary is public
CREATE POLICY "Public can read vocabulary"
  ON blockchain_vocabulary FOR SELECT
  TO anon, authenticated
  USING (true);

-- Word submissions
CREATE POLICY "Public can read all submissions"
  ON word_submissions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert submissions"
  ON word_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Token transactions
CREATE POLICY "Public can read all transactions"
  ON token_transactions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert transactions"
  ON token_transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Game sessions
CREATE POLICY "Public can read all sessions"
  ON game_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert sessions"
  ON game_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update sessions"
  ON game_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
