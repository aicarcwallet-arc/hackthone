# Set Supabase Edge Function Secrets

The deployment system requires these secrets to be configured in your Supabase project.

## Option 1: Set Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `kujoudvjmhuypxyntrkm`
3. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
4. Add these three secrets:

### Required Secrets:

```
VITE_CIRCLE_API_KEY=TEST_API_KEY:40958847ed77b73922de0e432f2d0753:8223290588012464cadbde454077fb10
CIRCLE_WALLET_ID=not-configured
CIRCLE_ENTITY_SECRET=not-configured
```

## Option 2: Set Via Supabase CLI

If you have Supabase CLI installed and linked:

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref kujoudvjmhuypxyntrkm

# Set the secrets
npx supabase secrets set VITE_CIRCLE_API_KEY="TEST_API_KEY:40958847ed77b73922de0e432f2d0753:8223290588012464cadbde454077fb10"
npx supabase secrets set CIRCLE_WALLET_ID="not-configured"
npx supabase secrets set CIRCLE_ENTITY_SECRET="not-configured"
```

## Why These Values?

- **VITE_CIRCLE_API_KEY**: Your existing Circle test API key from `.env`
- **CIRCLE_WALLET_ID**: Placeholder value (app will use treasury wallet fallback)
- **CIRCLE_ENTITY_SECRET**: Placeholder value (app will use treasury wallet fallback)

## After Setting Secrets

Once you've set these secrets in Supabase:

1. The "Missing secrets" warning will disappear
2. Your edge functions will deploy successfully
3. The app will work with treasury wallet for USDC rewards
4. Later, you can update `CIRCLE_WALLET_ID` and `CIRCLE_ENTITY_SECRET` with real values when you set up Circle Programmable Wallets

## Verify Secrets Are Set

```bash
npx supabase secrets list
```

You should see all three secrets listed.
