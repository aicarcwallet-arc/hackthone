#!/bin/bash

# 🔐 Supabase Circle Secrets Setup Script
# This script helps you add the required Circle API secrets to Supabase

echo "🔐 Setting up Circle API secrets for Supabase Edge Functions"
echo ""
echo "⚠️  IMPORTANT: These are PLACEHOLDER values until you get real Circle credentials"
echo "   Your app will still work - it will use manual treasury as fallback"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "📋 Manual Setup Required:"
    echo ""
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Select your project"
    echo "3. Navigate to: Settings → Edge Functions → Secrets"
    echo "4. Add these three secrets:"
    echo ""
    echo "   Name: VITE_CIRCLE_API_KEY"
    echo "   Value: TEST_API_KEY:40958847ed77b73922de0e432f2d0753:8223290588012464cadbde454077fb10"
    echo ""
    echo "   Name: CIRCLE_WALLET_ID"
    echo "   Value: pending-circle-approval"
    echo ""
    echo "   Name: CIRCLE_ENTITY_SECRET"
    echo "   Value: pending-circle-approval"
    echo ""
    echo "5. Click 'Add Secret' for each one"
    echo ""
    echo "📖 See SUPABASE_SECRETS_SETUP.md for detailed instructions"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""
echo "Setting up placeholder secrets..."
echo ""

# Set VITE_CIRCLE_API_KEY (using the one from .env)
echo "1️⃣  Setting VITE_CIRCLE_API_KEY..."
supabase secrets set VITE_CIRCLE_API_KEY=TEST_API_KEY:40958847ed77b73922de0e432f2d0753:8223290588012464cadbde454077fb10

# Set CIRCLE_WALLET_ID (placeholder)
echo "2️⃣  Setting CIRCLE_WALLET_ID..."
supabase secrets set CIRCLE_WALLET_ID=pending-circle-approval

# Set CIRCLE_ENTITY_SECRET (placeholder)
echo "3️⃣  Setting CIRCLE_ENTITY_SECRET..."
supabase secrets set CIRCLE_ENTITY_SECRET=pending-circle-approval

echo ""
echo "✅ All secrets set successfully!"
echo ""
echo "🔍 Verifying secrets..."
supabase secrets list

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📊 What happens now:"
echo "  • Your app will try to use Circle API"
echo "  • Circle API will fail (placeholder values)"
echo "  • System automatically falls back to manual treasury"
echo "  • Everything still works perfectly!"
echo ""
echo "🎯 When you get real Circle credentials:"
echo "  1. Run: supabase secrets set VITE_CIRCLE_API_KEY=<real-key>"
echo "  2. Run: supabase secrets set CIRCLE_WALLET_ID=<real-wallet-id>"
echo "  3. Run: supabase secrets set CIRCLE_ENTITY_SECRET=<real-secret>"
echo "  4. System automatically switches to unlimited Circle minting!"
echo ""
echo "📖 See SUPABASE_SECRETS_SETUP.md for more details"
echo ""
