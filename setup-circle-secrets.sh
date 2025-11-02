#!/bin/bash

# 🔵 Circle Integration - Supabase Secrets Setup
# Run this script to configure your real Circle credentials

echo "🔵 Circle Integration Setup"
echo "============================"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "📋 Manual Setup (via Supabase Dashboard):"
    echo ""
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Select your project: kujoudvjmhuypxyntrkm"
    echo "3. Navigate to: Settings → Edge Functions → Secrets"
    echo "4. Add these secrets with YOUR values from Circle Console:"
    echo ""
    echo "   VITE_CIRCLE_API_KEY"
    echo "   CIRCLE_WALLET_ID"
    echo "   CIRCLE_ENTITY_SECRET"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""
echo "You'll need these from Circle Console:"
echo "1. API Key (TEST_API_KEY:... or LIVE_API_KEY:...)"
echo "2. Wallet ID (018xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
echo "3. Entity Secret (optional but recommended)"
echo ""

# Prompt for Circle API Key
read -p "Enter Circle API Key: " CIRCLE_API_KEY
if [ -z "$CIRCLE_API_KEY" ]; then
    echo "❌ API Key is required!"
    exit 1
fi

# Prompt for Circle Wallet ID
read -p "Enter Circle Wallet ID: " CIRCLE_WALLET_ID
if [ -z "$CIRCLE_WALLET_ID" ]; then
    echo "❌ Wallet ID is required!"
    exit 1
fi

# Prompt for Entity Secret (optional)
read -p "Enter Circle Entity Secret (press Enter to skip): " CIRCLE_ENTITY_SECRET
if [ -z "$CIRCLE_ENTITY_SECRET" ]; then
    CIRCLE_ENTITY_SECRET="not-configured"
fi

echo ""
echo "🔑 Setting Supabase Secrets..."

# Set secrets in Supabase
supabase secrets set VITE_CIRCLE_API_KEY="$CIRCLE_API_KEY"
supabase secrets set CIRCLE_WALLET_ID="$CIRCLE_WALLET_ID"
supabase secrets set CIRCLE_ENTITY_SECRET="$CIRCLE_ENTITY_SECRET"

echo ""
echo "✅ Circle secrets configured!"
echo ""
echo "🔍 Verifying secrets..."
supabase secrets list

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Deploy edge functions: supabase functions deploy circle-instant-payout"
echo "2. Fund Circle wallet with USDC"
echo "3. Test the payout flow"
echo ""
