#!/bin/bash

echo "🔧 AIC Token Fix - Setting Supabase Secrets"
echo "============================================"
echo ""
echo "This will set the 2 required secrets so your tokens can be minted on-chain."
echo ""

# Check if logged in
echo "📝 Step 1: Checking Supabase login..."
if ! npx supabase projects list &>/dev/null; then
  echo ""
  echo "⚠️  You need to login first!"
  echo "👉 Running: npx supabase login"
  echo ""
  npx supabase login

  if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Login failed. Please make sure you have a Supabase account."
    echo "Visit: https://supabase.com/dashboard"
    exit 1
  fi
fi

echo "✅ Logged in!"
echo ""

# Link project
echo "📝 Step 2: Linking to your project..."
echo "👉 Running: npx supabase link --project-ref kujoudvjmhuypxyntrkm"
echo ""

npx supabase link --project-ref kujoudvjmhuypxyntrkm

if [ $? -ne 0 ]; then
  echo ""
  echo "⚠️  Link failed. This might mean:"
  echo "  1. You're already linked (that's OK!)"
  echo "  2. You need to enter your database password"
  echo "  3. You don't have access to this project"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo ""
echo "📝 Step 3: Setting secret #1 (Minter Private Key)..."
echo "👉 This key allows the backend to mint AIC tokens"
echo ""

npx supabase secrets set GAME_MINTER_PRIVATE_KEY="0x90e5340c08b03769795bdf15a0cf5f2f9f32090c650275ac9399bf7541819e61"

if [ $? -eq 0 ]; then
  echo "✅ GAME_MINTER_PRIVATE_KEY set!"
else
  echo "❌ Failed to set GAME_MINTER_PRIVATE_KEY"
  exit 1
fi

echo ""
echo "📝 Step 4: Setting secret #2 (AIC Token Address)..."
echo "👉 This is your AIC token contract address"
echo ""

npx supabase secrets set VITE_AIC_TOKEN_ADDRESS="0x4B71cD610AfCCDf0B02d566dA0071C74444a8666"

if [ $? -eq 0 ]; then
  echo "✅ VITE_AIC_TOKEN_ADDRESS set!"
else
  echo "❌ Failed to set VITE_AIC_TOKEN_ADDRESS"
  exit 1
fi

echo ""
echo "📝 Step 5: Verifying secrets..."
echo ""

npx supabase secrets list

echo ""
echo "============================================"
echo "✅ DONE! Secrets are set!"
echo "============================================"
echo ""
echo "🎉 Your 3184 AIC tokens are ready to claim!"
echo ""
echo "Next steps:"
echo "1. Go to your app's Rewards page"
echo "2. Refresh the page (F5)"
echo "3. Click 'Claim 3184 AIC Tokens'"
echo "4. Wait 2 seconds"
echo "5. Check Convert/Bridge pages - you'll see 3184 AIC!"
echo ""
echo "Need help? Check: FIX_ZERO_AIC_BALANCE.md"
echo ""
