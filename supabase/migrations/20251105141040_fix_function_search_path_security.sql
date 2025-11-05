/*
  # Fix Function Search Path Security

  1. Security Fixes
    - Add `SET search_path = ''` to `claim_aic_tokens` function
    - Add `SET search_path = ''` to `convert_aic_to_pyusd` function
    - This prevents search path injection attacks
    - Fully qualify all table references with schema name

  2. Changes
    - Both functions now have immutable search paths
    - All table references use `public.` prefix for clarity
    - Functions remain SECURITY DEFINER but are now secure

  3. Notes
    - This fixes the Supabase security audit warnings
    - No functional changes, only security hardening
    - Existing functionality preserved
*/

-- Fix claim_aic_tokens function with secure search_path
CREATE OR REPLACE FUNCTION public.claim_aic_tokens(user_wallet text, amount numeric)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result json;
BEGIN
  INSERT INTO public.solana_users (wallet_address, aic_balance, total_earned, tasks_completed)
  VALUES (user_wallet, amount, amount, 1)
  ON CONFLICT (wallet_address)
  DO UPDATE SET
    aic_balance = public.solana_users.aic_balance + amount,
    total_earned = public.solana_users.total_earned + amount,
    tasks_completed = public.solana_users.tasks_completed + 1,
    updated_at = now();

  INSERT INTO public.solana_transactions (wallet_address, tx_type, amount, token_type, status)
  VALUES (user_wallet, 'claim', amount, 'AIC', 'confirmed');

  SELECT json_build_object(
    'success', true,
    'amount', amount,
    'message', 'AIC tokens claimed successfully'
  ) INTO result;

  RETURN result;
END;
$$;

-- Fix convert_aic_to_pyusd function with secure search_path
CREATE OR REPLACE FUNCTION public.convert_aic_to_pyusd(user_wallet text, aic_amount numeric)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_aic numeric;
  pyusd_amount numeric;
  result json;
BEGIN
  SELECT aic_balance INTO current_aic
  FROM public.solana_users
  WHERE wallet_address = user_wallet;

  IF current_aic IS NULL OR current_aic < aic_amount THEN
    RAISE EXCEPTION 'Insufficient AIC balance';
  END IF;

  pyusd_amount := aic_amount * 0.00001;

  UPDATE public.solana_users
  SET
    aic_balance = aic_balance - aic_amount,
    pyusd_balance = pyusd_balance + pyusd_amount,
    updated_at = now()
  WHERE wallet_address = user_wallet;

  INSERT INTO public.solana_transactions (wallet_address, tx_type, amount, token_type, status)
  VALUES 
    (user_wallet, 'convert', aic_amount, 'AIC', 'confirmed'),
    (user_wallet, 'convert', pyusd_amount, 'PYUSD', 'confirmed');

  SELECT json_build_object(
    'success', true,
    'aic_amount', aic_amount,
    'pyusd_amount', pyusd_amount,
    'message', 'Conversion successful'
  ) INTO result;

  RETURN result;
END;
$$;