# Circle Programmable Wallet - Setup Checklist

## Current Status: ⚠️ NOT CONFIGURED

---

## ❌ ISSUES FOUND:

### 1. **Circle Wallet ID**: `not-configured`
**Problem**: No Circle wallet created yet
**Fix**: Run setup script

### 2. **Circle API Key**: Has test key but might be placeholder
**Current**: `TEST_API_KEY:63d81c0488a9afc5625b320b468631fa:2c5fdfd00a58ced8a41e7c718c663395`
**Fix**: Verify this is YOUR real API key from Circle Console

### 3. **Supabase Secrets**: Not checked yet
**Problem**: Edge function needs secrets to work
**Fix**: Add to Supabase dashboard

---

## ✅ WHAT'S WORKING:

- ✅ Edge function deployed: `circle-instant-payout`
- ✅ Setup script ready: `npm run setup-circle`
- ✅ Entity secret exists (but might need regeneration)
- ✅ Treasury wallet has 24 USDC ready

---

## 🚀 STEP-BY-STEP FIX (Do in order):

### **Step 1: Verify Circle API Key**

1. Go to: https://console.circle.com/
2. Login or sign up
3. Go to **Developer Settings** → **API Keys**
4. Check if your current key matches:
   ```
   TEST_API_KEY:63d81c0488a9afc5625b320b468631fa:2c5fdfd00a58ced8a41e7c718c663395
   ```
5. If NOT → Create new key and update `.env`

---

### **Step 2: Run Setup Script**

This will:
- Generate proper entity secret
- Register with Circle
- Create wallet
- Update .env automatically

```bash
npm run setup-circle
```

**Expected output:**
```
✅ Entity Secret generated
✅ Registration Status: success
✅ Wallet created!
   Wallet ID: abc-123-def-456
   Address: 0x1234...
✅ .env file updated!
```

---

### **Step 3: Update Supabase Secrets**

After setup script finishes, it will show you secrets to add.

Go to:
https://supabase.com/dashboard/project/kujoudvjmhuypxyntrkm/settings/secrets

Click **"Add new secret"** for each:

```
Name: CIRCLE_ENTITY_SECRET
Value: [copy from script output]

Name: CIRCLE_WALLET_ID
Value: [copy from script output]

Name: VITE_CIRCLE_API_KEY
Value: [your API key]
```

**IMPORTANT**: After adding secrets, you MUST **restart edge functions**:
- Go to Edge Functions tab
- Click restart icon on `circle-instant-payout`

---

### **Step 4: Fund Circle Wallet (Optional for Testing)**

To test real withdrawals, fund your Circle wallet:

1. Get wallet address from script output
2. Send testnet USDC to it
3. Or use Circle test faucet

---

### **Step 5: Test Withdrawal**

1. **Play game** → Earn AIC
2. **Claim AIC** → Mints to MetaMask
3. **Convert AIC to USDC** → Updates database
4. **Cash Out** → Should work now! 🎉

---

## 🔍 VERIFICATION CHECKLIST:

Before testing withdrawal, verify:

- [ ] Circle API key is YOUR real key from console.circle.com
- [ ] `npm run setup-circle` completed successfully
- [ ] .env shows real `CIRCLE_WALLET_ID` (not "not-configured")
- [ ] Supabase secrets added for all 3 values
- [ ] Edge function restarted after adding secrets
- [ ] (Optional) Circle wallet funded for testing

---

## 🚨 COMMON ERRORS & FIXES:

### Error: "Circle Programmable Wallets not configured"
**Cause**: Wallet ID still says "not-configured"
**Fix**: Run setup script

### Error: "Entity secret registration failed"
**Cause**: API key invalid or already used
**Fix**:
1. Get new API key from Circle
2. Delete old entity secret
3. Run setup again

### Error: "No response from Circle API"
**Cause**: Supabase secrets not updated
**Fix**:
1. Add all 3 secrets to Supabase
2. Restart edge function
3. Try again

### Withdrawal does nothing
**Cause**: Database balance but no real funds
**Fix**: This is expected! Your $5001.13 is database-tracked. You can only withdraw what's actually in Circle wallet.

---

## 📊 CURRENT BALANCES:

- **Database USDC**: $5001.13 (virtual balance)
- **Treasury Wallet**: 24 USDC (real funds)
- **Circle Wallet**: Not created yet

Once Circle wallet is created and funded, you can withdraw!

---

## ⚡ QUICK START (If you just want to test):

```bash
# 1. Update API key in .env (use your real key)
# 2. Run setup
npm run setup-circle

# 3. Follow instructions shown by script
# 4. Update Supabase secrets
# 5. Test withdrawal!
```

---

## 🆘 NEED HELP?

- Circle Docs: https://developers.circle.com/wallets
- Circle Discord: Check their community
- Supabase Dashboard: https://supabase.com/dashboard
