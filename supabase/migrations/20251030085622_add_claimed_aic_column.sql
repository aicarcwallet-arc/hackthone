/*
  # Add claimed_aic tracking column

  1. Changes
    - Add `claimed_aic` column to `users` table to track minted AIC tokens
    - Default to '0' for existing users
  
  2. Purpose
    - Track which AIC tokens have been claimed/minted on-chain
    - Calculate unclaimed tokens: total_aic_earned - claimed_aic
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'claimed_aic'
  ) THEN
    ALTER TABLE public.users ADD COLUMN claimed_aic numeric DEFAULT '0';
  END IF;
END $$;
