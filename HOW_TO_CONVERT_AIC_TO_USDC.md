# How to Convert AIC to USDC and Withdraw

## Your Current Status

**Wallet:** `0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd`

**AIC Earned:** 852 AIC
**USDC Balance:** 0 USDC
**Status:** ❌ Not converted yet

---

## Complete Withdrawal Flow

### 🎮 Step 1: Play & Earn (DONE ✅)
You've already earned **852 AIC** by playing the vocabulary game!

### 💰 Step 2: Convert AIC to USDC

#### Option A: Using the App (Easy)
1. Go to **Bridge** tab
2. Click **"Connect Wallet"**
3. You'll see: `Convert 852.00 AIC to USDC` button
4. Click the button
5. Wait 3-5 seconds
6. ✅ **852 USDC** sent to your Arc wallet!

#### Option B: What Happens Behind the Scenes
```
1. Edge function checks: You have 852 unclaimed AIC ✅
2. Treasury sends: 852 USDC to your wallet
3. Database updates: Marks AIC as "claimed"
4. Result: You now have 852 USDC on Arc Testnet
```

### ⚠️ Treasury Issue

**The treasury wallet currently has 0 USDC!**

Treasury Address: `0x7bb3ab6016684ea21ca59fd45a8b93e4af88f116`

**To fund the treasury:**
1. Get testnet USDC from Circle Faucet: https://faucet.circle.com
2. Send USDC to treasury address above
3. Then you can convert your AIC!

---

### 🌉 Step 3: Bridge or Spend Your USDC

Once you have USDC in your Arc wallet, you have 3 options:

#### **Option 1: Cross-Chain Bridge**
- Bridge USDC to any chain:
  - Ethereum Sepolia
  - Base Sepolia
  - Arbitrum Sepolia
  - Optimism Sepolia
  - Polygon Amoy
  - Avalanche Fuji
- Uses Circle's CCTP protocol
- Takes 15-20 minutes

#### **Option 2: AiC-Arc Virtual Card**
- Load USDC onto virtual Visa card
- Spend at 70+ million merchants worldwide
- Earn 5% AIC cashback
- Powered by Circle

#### **Option 3: AiC-Circle Banking**
- Withdraw to traditional bank account
- ACH (Free, 3-5 days)
- Wire ($15 fee, same day)
- Instant Transfer ($2.50 fee, minutes)

---

## Quick Commands to Check Status

### Check Your AIC Balance in Database
```sql
SELECT
  wallet_address,
  total_aic_earned,
  claimed_aic,
  (total_aic_earned::numeric - COALESCE(claimed_aic::numeric, 0)) as unclaimed_aic
FROM users
WHERE wallet_address = '0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd';
```

**Result:**
```
wallet: 0x996a...
total_earned: 852 AIC
claimed: 0
unclaimed: 852 AIC ← You can convert this!
```

### Check Your USDC Balance on Arc
```bash
# Using RPC
curl -X POST https://rpc.testnet.arc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      "data": "0x70a08231000000000000000000000000996a7ac2e9f37173f2b2131fa720f04fdacbb0cd"
    }, "latest"],
    "id": 1
  }'
```

**Result:** `0x` (means 0 USDC currently)

### Check Treasury Balance
```bash
curl -X POST https://rpc.testnet.arc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      "data": "0x70a082310000000000000000000000007bb3ab6016684ea21ca59fd45a8b93e4af88f116"
    }, "latest"],
    "id": 1
  }'
```

**Result:** `0x` (Treasury needs funding!)

---

## Error Messages Explained

### "Insufficient treasury balance"
```
Error: Treasury needs funding!

Required: 852 USDC
Available: 0 USDC

Please send USDC to treasury:
0x7bb3ab6016684ea21ca59fd45a8b93e4af88f116

Get testnet USDC: https://faucet.circle.com
```

**Solution:** Fund the treasury wallet with at least 852 USDC

### "No unclaimed USDC"
```
Error: No unclaimed USDC
totalEarned: 852
alreadyClaimed: 852
```

**Solution:** You already converted! Check your USDC balance

### "User not found"
```
Error: User not found
```

**Solution:** Wallet not registered. Play the game first!

---

## Testing the Full Flow

### Test Conversion API
```bash
curl -X POST "${SUPABASE_URL}/functions/v1/mint-usdc-reward" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -d '{"walletAddress": "0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd"}'
```

**Expected Response (if treasury funded):**
```json
{
  "success": true,
  "txHash": "0x...",
  "amountSent": 852,
  "currency": "USDC",
  "explorerUrl": "https://testnet.arcscan.app/tx/0x...",
  "message": "USDC rewards sent! You can now bridge to other chains."
}
```

---

## How the Edge Function Works

### mint-usdc-reward Function Flow

```typescript
1. Receive walletAddress from frontend
2. Check database for unclaimed AIC:
   - total_aic_earned: 852
   - claimed_aic: 0
   - unclaimed: 852

3. Check treasury USDC balance:
   - Treasury address: 0x7bb3...
   - Balance: 0 USDC ❌ (needs funding!)

4. If balance sufficient:
   - Send 852 USDC to your wallet
   - Update database: claimed_aic = 852
   - Record transaction in token_transactions
   - Return success + txHash

5. If insufficient:
   - Return error with treasury info
   - Show funding instructions
```

---

## Next Steps

### 1. Fund Treasury (Required)
```
Send at least 852 USDC to:
0x7bb3ab6016684ea21ca59fd45a8b93e4af88f116

Get USDC from:
- Circle Faucet: https://faucet.circle.com
- Bridge from other testnet
- Use existing testnet USDC
```

### 2. Convert Your AIC
```
1. Open app → Bridge tab
2. Connect wallet
3. Click "Convert 852 AIC to USDC"
4. Wait for confirmation
5. Check balance - should show 852 USDC!
```

### 3. Use Your USDC
```
Bridge to other chains:
- Deploy DeFi apps
- Test cross-chain protocols
- Bridge back and forth

Or spend it:
- Virtual card spending
- Bank withdrawals (simulated)
- P2P transfers
```

---

## Summary

**What You Have:**
- ✅ 852 AIC earned from games
- ✅ Account registered in database
- ❌ 0 USDC (not converted yet)

**What You Need:**
- ⚠️ Fund treasury with 852+ USDC
- Then convert AIC → USDC
- Then bridge/spend!

**Quick Action:**
1. Fund treasury: `0x7bb3ab6016684ea21ca59fd45a8b93e4af88f116`
2. Open app and click "Convert AIC to USDC"
3. Enjoy your 852 USDC! 🎉

---

## Support

**Treasury Address:** `0x7bb3ab6016684ea21ca59fd45a8b93e4af88f116`
**USDC Contract (Arc):** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
**Your Wallet:** `0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd`

**Get Testnet USDC:**
- Circle Faucet: https://faucet.circle.com
- Arc Testnet Faucet: https://faucet.testnet.arc.network

**Block Explorers:**
- Arc Testnet: https://testnet.arcscan.app
- Your Address: https://testnet.arcscan.app/address/0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd
- Treasury: https://testnet.arcscan.app/address/0x7bb3ab6016684ea21ca59fd45a8b93e4af88f116
