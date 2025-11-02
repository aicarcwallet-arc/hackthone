# Complete Testing Guide - Game to Cash Withdrawal

## YES, YOU NEED TO TEST THIS! Here's Your Complete Testing Checklist

## Pre-Test Setup Checklist

### 1. Environment Variables (Required!)
Check your `.env` file has:
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Arc Network
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
VITE_AIC_TOKEN_ADDRESS=0x... (your deployed AIC token)
VITE_AIC_CONVERTER_ADDRESS=0x... (your deployed converter)

# Treasury
GAME_MINTER_PRIVATE_KEY=0x... (treasury wallet private key)
TREASURY_WALLET_ADDRESS=0x... (treasury wallet address)

# Circle (Optional - for instant payouts)
VITE_CIRCLE_API_KEY=your_circle_api_key
CIRCLE_WALLET_ID=your_wallet_id
CIRCLE_ENTITY_SECRET=your_entity_secret (optional)

# Auto-Recharge (Optional - for automatic funding)
AUTO_RECHARGE_CONTRACT=0x... (if deployed)
OPERATOR_PRIVATE_KEY=0x... (wallet to trigger recharges)
```

### 2. Fund Treasury Wallet
**CRITICAL:** Your treasury wallet MUST have USDC!

On Arc Testnet:
```bash
# Treasury wallet address from TREASURY_WALLET_ADDRESS
# Needs USDC to pay out rewards
# Get testnet USDC from faucet or transfer from another wallet
```

Minimum recommended: **$1,000 USDC** to start testing

### 3. Deploy Edge Functions
```bash
# These are already created, just need to be deployed
cd supabase/functions

# Deploy all functions
supabase functions deploy validate-word
supabase functions deploy mint-usdc-reward
supabase functions deploy circle-instant-payout
supabase functions deploy monitor-treasury-balance
supabase functions deploy auto-fund-treasury
```

## Complete Flow Test (30 minutes)

### TEST 1: Connect Wallet ✓
**Expected Time:** 2 minutes

1. Open your app in browser
2. Click "Connect Wallet"
3. Select MetaMask (or your wallet)
4. Approve connection

**✓ Pass Criteria:**
- Wallet address displays
- "Connected" status shows
- No errors in console

---

### TEST 2: Switch to Arc Network ✓
**Expected Time:** 1 minute

1. If not on Arc Testnet, click "Switch to Arc Testnet"
2. Approve network switch in wallet
3. Wait for confirmation

**✓ Pass Criteria:**
- Network switches to Arc Testnet
- Green "Connected to Arc Testnet" banner shows
- No error messages

**Arc Testnet Details:**
- Chain ID: 5042002
- RPC: https://rpc.testnet.arc.network
- Currency: USDC

---

### TEST 3: Play Vocabulary Game ✓
**Expected Time:** 5 minutes

1. Click "Start Game" or "Play Now"
2. Type the word shown on screen
3. Submit answer
4. Repeat for 5-10 words

**✓ Pass Criteria:**
- Game starts successfully
- Words display correctly
- Timer counts down
- Each correct answer shows +10 AIC reward
- Total earnings update in real-time

**Look for:**
- "You earned 10 AIC!" message after each correct word
- Running total displays (e.g., "Total: 50 AIC")
- Database updates (check Supabase)

---

### TEST 4: Check Unclaimed Balance ✓
**Expected Time:** 1 minute

1. Finish game session
2. Look for "Cash Out Your Earnings!" section
3. Verify amount shows correctly

**✓ Pass Criteria:**
- Shows correct USD amount (e.g., "$50 USD")
- Shows AIC balance (e.g., "50 AIC")
- Green button says "Get Your $XX USD Now!"

---

### TEST 5: Cash Out to Wallet (USDC) ✓
**Expected Time:** 3 minutes

1. Click "Get Your $XX USD Now!"
2. Select "To Wallet (Instant)"
3. Wait for transaction to process

**✓ Pass Criteria:**
- Transaction processes without errors
- Success message appears
- Transaction hash/ID provided
- USDC appears in your wallet
- Balance updates in dashboard

**Check Your Wallet:**
```bash
# In MetaMask, add USDC token:
Token Address: 0x3600000000000000000000000000000000000000
Symbol: USDC
Decimals: 6
```

---

### TEST 6: Convert USDC (Optional) ✓
**Expected Time:** 2 minutes

1. Go to "Convert" section
2. Enter amount of AIC to convert
3. Click "Convert AIC to USDC"
4. Approve transaction

**✓ Pass Criteria:**
- Conversion processes successfully
- USDC balance increases
- AIC balance decreases
- 1:1 conversion rate applied

---

### TEST 7: Withdrawal to Virtual Card ✓
**Expected Time:** 5 minutes

**Note:** Requires Circle Programmable Wallets configured

1. Play game and earn AIC
2. Click "Get Your $XX USD Now!"
3. Select "Virtual Card (Spend Anywhere)"
4. Wait for processing

**✓ Pass Criteria:**
- Shows "Processing payout..." message
- Success message: "USDC sent via Circle!"
- Can see transaction ID
- Money loaded to virtual card

**Circle Integration Required:**
- Must have `VITE_CIRCLE_API_KEY` set
- Must have `CIRCLE_WALLET_ID` set

---

### TEST 8: Withdrawal to Bank Account ✓
**Expected Time:** 2 minutes (1-2 days for funds)

**Note:** Requires Circle Programmable Wallets configured

1. Play game and earn AIC
2. Click "Get Your $XX USD Now!"
3. Select "Bank Account (1-2 days)"
4. Wait for processing

**✓ Pass Criteria:**
- Shows "Processing payout..." message
- Success message appears
- Transaction initiated
- Estimated arrival time shown (1-2 business days)

---

### TEST 9: Check Treasury Balance ✓
**Expected Time:** 2 minutes

Test the monitoring system:

```bash
# Call monitor-treasury-balance function
curl https://your-project.supabase.co/functions/v1/monitor-treasury-balance
```

**✓ Pass Criteria:**
```json
{
  "treasuryAddress": "0x...",
  "balance": 950.50,
  "status": "healthy",
  "timestamp": "2025-11-02T..."
}
```

**Status Meanings:**
- `healthy`: Balance > $1,000
- `warning`: Balance $100 - $1,000
- `critical`: Balance < $100

---

### TEST 10: Auto-Recharge System ✓
**Expected Time:** 3 minutes

**Note:** Only if you deployed TreasuryAutoRecharge contract

Test automatic treasury funding:

```bash
# Trigger manual recharge
curl -X POST https://your-project.supabase.co/functions/v1/auto-fund-treasury
```

**✓ Pass Criteria:**
- If balance low: Recharge transaction triggered
- If balance good: Returns "sufficient balance" message
- Transaction hash provided (if recharged)
- Treasury balance increases

---

## Troubleshooting Common Issues

### Issue: "User not found" error
**Fix:**
1. Make sure you connected wallet first
2. User should be auto-created on first connection
3. Check Supabase `users` table has your wallet address

### Issue: "Treasury wallet not configured"
**Fix:**
1. Set `GAME_MINTER_PRIVATE_KEY` in Supabase secrets
2. Set `TREASURY_WALLET_ADDRESS` in environment
3. Restart edge functions

### Issue: "Insufficient treasury balance"
**Fix:**
1. Send USDC to treasury wallet
2. Get testnet USDC from faucet
3. Check treasury balance with monitor function

### Issue: Circle API errors
**Fix:**
1. Verify `VITE_CIRCLE_API_KEY` is set correctly
2. Verify `CIRCLE_WALLET_ID` is valid
3. Check Circle Dashboard for wallet status
4. System will fallback to direct treasury transfer

### Issue: Wrong network
**Fix:**
1. Click "Switch to Arc Testnet" button
2. Approve in MetaMask
3. If stuck, manually add Arc Testnet in MetaMask

### Issue: Game rewards not showing
**Fix:**
1. Check Supabase `word_submissions` table
2. Check edge function logs
3. Verify `validate-word` function deployed
4. Check API keys are correct

---

## Database Verification

### Check User Earnings
```sql
SELECT
  wallet_address,
  total_aic_earned,
  claimed_aic,
  (total_aic_earned - claimed_aic) as unclaimed
FROM users
WHERE wallet_address = '0xyour_address';
```

### Check Game Sessions
```sql
SELECT
  started_at,
  words_completed,
  total_aic_earned,
  average_accuracy
FROM game_sessions
ORDER BY started_at DESC
LIMIT 10;
```

### Check Transactions
```sql
SELECT
  transaction_type,
  amount,
  to_token,
  status,
  tx_hash,
  confirmed_at
FROM token_transactions
ORDER BY confirmed_at DESC
LIMIT 20;
```

---

## Success Metrics

After complete testing, you should see:

### Frontend ✓
- ✅ Wallet connects successfully
- ✅ Game plays smoothly
- ✅ Rewards display in real-time
- ✅ Cash-out button shows USD value
- ✅ Multiple withdrawal options work
- ✅ Success messages appear
- ✅ Balances update correctly

### Backend ✓
- ✅ Users table has entries
- ✅ Word submissions recorded
- ✅ AIC rewards calculated correctly
- ✅ Token transactions logged
- ✅ Treasury balance tracked
- ✅ Edge functions responding

### Blockchain ✓
- ✅ USDC transfers on Arc Network
- ✅ Transactions confirm quickly
- ✅ No failed transactions
- ✅ Correct amounts sent
- ✅ Gas fees covered by treasury

---

## Quick Test Script (5 minutes)

Fastest way to verify everything works:

```bash
# 1. Connect wallet (manual)
# 2. Play one game (manual)
# 3. Check balance
curl https://your-project.supabase.co/functions/v1/monitor-treasury-balance

# 4. Query unclaimed amount
psql -h your-supabase-db -c "SELECT total_aic_earned, claimed_aic FROM users WHERE wallet_address = '0x...';"

# 5. Test cash-out (manual - click button)

# 6. Verify transaction
# Check your wallet for USDC
```

---

## Production Checklist (Before Launch)

Before going live with real users:

- [ ] Deploy all contracts to mainnet
- [ ] Fund production treasury with real USDC ($10,000+ recommended)
- [ ] Configure Circle production API keys
- [ ] Test with real money (small amounts first)
- [ ] Set up monitoring alerts
- [ ] Enable auto-recharge cron job
- [ ] Test all withdrawal methods
- [ ] Verify gas costs reasonable
- [ ] Set up backup treasury wallet
- [ ] Document emergency procedures
- [ ] Test with multiple users
- [ ] Load test with 100+ users

---

## Support Commands

```bash
# Check treasury
curl https://your-project.supabase.co/functions/v1/monitor-treasury-balance

# Trigger recharge
curl -X POST https://your-project.supabase.co/functions/v1/auto-fund-treasury

# Check function logs
supabase functions logs validate-word
supabase functions logs mint-usdc-reward

# Check database
psql -h your-db-host
```

---

**START TESTING NOW!** Follow TEST 1 through TEST 10 above.

Each test should take 1-5 minutes. Complete all 10 tests in about 30 minutes total.

Report any issues you find!
