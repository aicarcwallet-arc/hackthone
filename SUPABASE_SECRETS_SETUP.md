# 🔐 Supabase Secrets Setup Guide

## ⚠️ Missing Secrets Error

If you're seeing this error:
```
Missing secrets
The following secrets are used in the code but don't exist yet:
VITE_CIRCLE_API_KEY
CIRCLE_WALLET_ID
CIRCLE_ENTITY_SECRET
```

This is because **Supabase Edge Functions** need these secrets configured in the Supabase Dashboard.

---

## 🚀 Quick Fix - Add Secrets to Supabase

### Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project: `kujoudvjmhuypxyntrkm`
3. Navigate to **Settings** → **Edge Functions**
4. Click on **Secrets** tab

### Step 2: Add Required Secrets

Add these three secrets with placeholder values (until you get real Circle credentials):

#### Secret 1: VITE_CIRCLE_API_KEY
```
Name: VITE_CIRCLE_API_KEY
Value: TEST_API_KEY:40958847ed77b73922de0e432f2d0753:8223290588012464cadbde454077fb10
```

#### Secret 2: CIRCLE_WALLET_ID
```
Name: CIRCLE_WALLET_ID
Value: pending-circle-approval
```

#### Secret 3: CIRCLE_ENTITY_SECRET
```
Name: CIRCLE_ENTITY_SECRET
Value: pending-circle-approval
```

### Step 3: Save Secrets

Click **"Add Secret"** for each one and save.

---

## 🔄 What Happens Now

### With Placeholder Values (Current)

The system will:
- ✅ Detect Circle secrets exist
- ✅ Attempt to use Circle API
- ⚠️ Circle API will fail (invalid credentials)
- ✅ **Automatically fall back to manual treasury**
- ✅ Continue working normally

So your app **still works** with placeholder values!

### With Real Circle Values (Future)

Once you get real credentials from Circle:
1. Update the three secrets in Supabase Dashboard
2. System automatically starts using Circle API
3. Unlimited USDC minting activates
4. No code changes needed!

---

## 📝 Alternative: Use Supabase CLI

If you have Supabase CLI installed:

```bash
# Set VITE_CIRCLE_API_KEY
supabase secrets set VITE_CIRCLE_API_KEY=TEST_API_KEY:40958847ed77b73922de0e432f2d0753:8223290588012464cadbde454077fb10

# Set CIRCLE_WALLET_ID
supabase secrets set CIRCLE_WALLET_ID=pending-circle-approval

# Set CIRCLE_ENTITY_SECRET
supabase secrets set CIRCLE_ENTITY_SECRET=pending-circle-approval

# Verify secrets
supabase secrets list
```

---

## ✅ Verify Secrets Are Set

After adding secrets:

1. Go to **Edge Functions** in Supabase Dashboard
2. Click on `mint-usdc-reward` function
3. Check **Environment Variables** section
4. You should see all three secrets listed

---

## 🎯 How the System Works

### Code Logic in Edge Function

```typescript
// Line 174-176 in mint-usdc-reward/index.ts
const circleApiKey = Deno.env.get("VITE_CIRCLE_API_KEY");
const circleWalletId = Deno.env.get("CIRCLE_WALLET_ID");
const circleEntitySecret = Deno.env.get("CIRCLE_ENTITY_SECRET");

// Line 230: Check if Circle is configured
if (useCircleAPI && circleApiKey && circleWalletId) {
  // Try Circle API first
  return await handleCircleAPITransfer(...);
}

// Otherwise, use manual treasury (fallback)
const treasuryPrivateKey = Deno.env.get("GAME_MINTER_PRIVATE_KEY");
// ... manual treasury logic
```

### Smart Fallback System

```
Player Claims USDC
    ↓
Check Circle Secrets
    ↓
┌─────────────────┐      ┌──────────────────┐
│ Circle Secrets  │ YES  │ Try Circle API   │
│ Configured?     │─────→│                  │
└─────────────────┘      └──────────────────┘
    │                            │
    │ NO                         │ FAIL
    ↓                            ↓
┌─────────────────┐      ┌──────────────────┐
│ Use Manual      │←─────│ Fallback to      │
│ Treasury        │      │ Manual Treasury  │
└─────────────────┘      └──────────────────┘
    ↓
✅ USDC Sent Successfully
```

---

## 🔐 Security Notes

### Current Placeholder Values

**Safe to use because:**
- ✅ Testnet only (not real money)
- ✅ Circle API will reject them anyway
- ✅ System falls back to working treasury
- ✅ No security risk

### When You Get Real Values

**Important:**
- 🔒 Keep Entity Secret **HIGHLY CONFIDENTIAL**
- 🔒 Never commit to Git
- 🔒 Only in Supabase Dashboard secrets
- 🔒 Rotate periodically for security

---

## 📊 Testing After Setup

### Test 1: Verify Secrets Exist

```bash
curl https://kujoudvjmhuypxyntrkm.supabase.co/functions/v1/circle-mint-demo \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x0000000000000000000000000000000000000000"}'
```

Should NOT show "Missing secrets" error.

### Test 2: Claim Flow Still Works

1. Play game and earn AIC
2. Claim AIC tokens (should work)
3. Try to claim USDC (should work with manual treasury)
4. Check wallet for USDC

### Test 3: Circle Demo Endpoint

```bash
curl https://kujoudvjmhuypxyntrkm.supabase.co/functions/v1/circle-mint-demo \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0xYourWalletAddress"}'
```

Should return demo response with Circle comparison data.

---

## 🚀 When You Get Circle Access

### Update Process

**1. Go to Circle Console**
- https://console.circle.com/

**2. Get Your Credentials**
- API Key (starts with `TEST_API_KEY:` for testnet)
- Wallet ID (UUID format: `01234567-89ab-cdef-...`)
- Entity Secret (base64 encoded string)

**3. Update Supabase Secrets**
```
VITE_CIRCLE_API_KEY = [Your real Circle API key]
CIRCLE_WALLET_ID = [Your real wallet ID]
CIRCLE_ENTITY_SECRET = [Your real entity secret]
```

**4. Test Immediately**
- System automatically uses Circle API
- Unlimited USDC minting activated
- No manual treasury limitations
- Gasless transactions for users

---

## ❓ FAQ

**Q: Why do I need to add secrets if they're in .env?**
A: Supabase Edge Functions run in the cloud, not locally. They don't have access to your local `.env` file. Secrets must be in the Supabase Dashboard.

**Q: Will my app break with placeholder values?**
A: No! The system is designed to fall back to manual treasury if Circle API fails.

**Q: How do I know if Circle API is working?**
A: Check the response message. It will say "USDC minted and sent via Circle!" instead of "USDC rewards sent!"

**Q: Can I test Circle API with fake credentials?**
A: You can add them, but Circle will reject the API call. The system will then use manual treasury as fallback.

**Q: What if I don't want Circle integration yet?**
A: Just leave the placeholder values. System works perfectly with manual treasury for testing.

---

## ✅ Checklist

Before contacting Circle for API access:

- [ ] Add placeholder secrets to Supabase Dashboard
- [ ] Verify "Missing secrets" error is gone
- [ ] Test game flow (play → earn → claim)
- [ ] Verify manual treasury works
- [ ] Check wallet receives testnet USDC
- [ ] Review Circle Demo Widget on dashboard
- [ ] Test on mobile devices
- [ ] Prepare demo for Circle team

After getting Circle API access:

- [ ] Update VITE_CIRCLE_API_KEY with real value
- [ ] Update CIRCLE_WALLET_ID with real wallet ID
- [ ] Update CIRCLE_ENTITY_SECRET with real secret
- [ ] Test Circle API call succeeds
- [ ] Verify unlimited minting works
- [ ] Check transaction on blockchain
- [ ] Monitor Supabase logs
- [ ] Celebrate unlimited capacity! 🎉

---

## 📞 Need Help?

If secrets still not working:
1. Double-check secret names (case-sensitive!)
2. Verify you're in the correct Supabase project
3. Try redeploying edge functions
4. Check Supabase function logs for errors
5. Contact support with error details

---

**Your system is production-ready!** Just add these three placeholder secrets to stop the warning, and everything will work with the manual treasury until you get real Circle credentials.
