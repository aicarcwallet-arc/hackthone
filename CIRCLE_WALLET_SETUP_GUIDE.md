# Circle Programmable Wallet Setup Guide

Complete guide to set up Circle Developer-Controlled Wallets for instant USDC withdrawals.

## Prerequisites

1. **Circle Account**: Sign up at https://console.circle.com/
2. **API Key**: Get from Circle Console → Developer Settings
3. **Node.js**: Version 16+ installed

## Step 1: Get Circle API Key

1. Go to https://console.circle.com/
2. Navigate to **Developer Settings** → **API Keys**
3. Create new API key (Testnet for testing)
4. Copy the API key (starts with `TEST_API_KEY:...`)

## Step 2: Update .env File

Open `.env` and update:

```bash
VITE_CIRCLE_API_KEY=TEST_API_KEY:your_actual_key_here
```

Replace `your_actual_key_here` with your real Circle API key.

## Step 3: Run Setup Script

This script will automatically:
- Generate a proper entity secret (32 bytes hex)
- Register it with Circle API
- Create a programmable wallet
- Update your .env file
- Save recovery file

Run:

```bash
npm run setup-circle
```

**Expected Output:**

```
🔵 Circle Programmable Wallet Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ API Key found: TEST_API_KEY:63d81c0488a9...

📝 Step 1: Generating Entity Secret...
✅ Entity Secret generated: a3f2d8c4b1e5f7...

📝 Step 2: Registering Entity Secret with Circle...
✅ Registration Status: { success: true }
✅ Recovery file saved to: circle_recovery.dat

📝 Step 3: Creating Circle Programmable Wallet...
✅ Wallet created!
   Wallet ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   Address: 0x1234567890abcdef...

📝 Step 4: Updating .env file...
✅ .env file updated!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SETUP COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Summary:
   Entity Secret: a3f2d8c4b1e5f7...
   Wallet ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   Wallet Address: 0x1234567890abcdef...
```

## Step 4: Update Supabase Secrets

The script will show you the secrets to add. Go to:

https://supabase.com/dashboard/project/kujoudvjmhuypxyntrkm/settings/secrets

Add these secrets:

```
CIRCLE_ENTITY_SECRET = [your_generated_secret]
CIRCLE_WALLET_ID = [your_wallet_id]
VITE_CIRCLE_API_KEY = [your_api_key]
```

## Step 5: Fund Your Wallet (Optional for Testing)

To test withdrawals, your Circle wallet needs USDC:

1. Go to Circle Console → Wallets
2. Find your wallet ID
3. Send test USDC to the wallet address
4. Or use Circle's test faucet

## Step 6: Test Withdrawal

Now you can test instant USDC withdrawals:

1. Play game and earn AIC tokens
2. Convert AIC to USDC
3. Click "Instant Cash Out"
4. USDC sent via Circle Programmable Wallet!

## Troubleshooting

### Error: "Circle Programmable Wallets not configured"

**Solution**: Make sure you updated both `.env` AND Supabase secrets.

### Error: "Entity secret registration failed"

**Possible causes:**
1. Invalid API key
2. Entity secret already registered
3. Network issue

**Solution**:
- Verify API key is correct
- Try generating a new entity secret
- Check Circle API status

### Error: "Wallet creation failed"

**Solution**: Check Circle Console for your account limits and verification status.

### Recovery File Missing

**CRITICAL**: The `circle_recovery.dat` file is saved automatically.

**Back it up securely!** You need it to recover your wallet if something goes wrong.

## Important Notes

1. **Entity Secret**: 32-byte hex string, keep it secret!
2. **Recovery File**: Back it up securely
3. **API Key**: Never commit to git or share publicly
4. **Testnet**: Use testnet for development, mainnet for production

## References

- Circle Docs: https://developers.circle.com/wallets/dev-controlled/register-entity-secret
- Circle Console: https://console.circle.com/
- Supabase Dashboard: https://supabase.com/dashboard

## Need Help?

Check Circle's Discord or their developer docs for additional support.
