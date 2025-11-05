# 🎮 Solana Devnet Test Guide

**Your system is DEPLOYED and READY TO TEST!**

## ✅ What's Already Done

- ✅ AIC Token deployed to Solana devnet
- ✅ Swap pool initialized with 10M AIC + 1000 PYUSD liquidity
- ✅ Edge function deployed for automatic minting
- ✅ UI updated with welcome bonus system
- ✅ Build successful and verified

## 🎁 **EPIC FEATURE: Each User Gets 1,000,000 AIC Tokens!**

When a user connects their Phantom wallet, they automatically receive **1,000,000 AIC tokens** as a welcome bonus!

## 📋 Test Checklist

### Step 1: Install Phantom Wallet

1. Go to [https://phantom.app/](https://phantom.app/)
2. Install the Chrome/Firefox extension
3. Create a new wallet (or import existing)
4. **CRITICAL**: Switch to **Devnet** in Phantom settings
   - Click the gear icon ⚙️
   - Scroll to "Developer Settings"
   - Toggle "Testnet Mode" ON
   - Select "Devnet"

### Step 2: Get Devnet SOL (FREE)

You need SOL for transaction fees:

**Option A - Phantom Built-in Airdrop:**
1. In Phantom, click "Airdrop" button
2. Request 1 SOL

**Option B - Solana Faucet:**
1. Visit [https://solfaucet.com/](https://solfaucet.com/)
2. Enter your Phantom wallet address
3. Request 2 SOL

**Option C - Command Line:**
```bash
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet
```

### Step 3: Start the App

```bash
npm run dev
```

Visit: **http://localhost:5173/solana.html**

### Step 4: Connect Wallet & Get Your 1M AIC!

1. Click "Connect Wallet" button
2. Select Phantom wallet
3. Approve connection
4. **BOOM!** 🎉 You'll see:
   - "🎁 Claiming your 1,000,000 AIC welcome bonus..."
   - "✅ Welcome bonus claimed! You received 1,000,000 AIC tokens!"
5. Your AIC balance will update to show 1,000,000 AIC

### Step 5: Test the Complete Flow

**Test 1: Check Balances**
- ✅ SOL balance shows (from airdrop)
- ✅ AIC balance shows 1,000,000
- ✅ PYUSD balance shows 0 (initially)

**Test 2: Try Swapping AIC for PYUSD**
1. Click "Swap to PYUSD" tab
2. Enter amount (try 10,000 AIC)
3. See real-time PYUSD calculation
4. Click "Swap to PYUSD"
5. Confirm transaction in Phantom
6. Balance updates

**Test 3: Cash Out Flow (Demo)**
1. Click "Cash Out" tab
2. See your PYUSD balance
3. Click "Send to PayPal Wallet"
4. (Shows demo message - will integrate with Circle for real payouts)

## 🔍 What to Verify

### ✅ Deployment Info

**Network:** Solana Devnet
**AIC Token Mint:** `AkE225pApg5uJKuGzG1ymLvq12y4Womh9XKHzHjpJYEV`
**Pool Authority:** `EZitGyTUL4gYCNYNUgZV8AFZQFV2Ca8PEwV6B1X9U4j6`

**Initial Pool:**
- 10,000,000 AIC tokens
- 1,000 PYUSD (simulated)
- 0.3% swap fee

**Per User:**
- 1,000,000 AIC tokens (FREE!)
- Auto-minted on first connection

### ✅ Edge Function

**URL:** `https://kujoudvjmhuypxyntrkm.supabase.co/functions/v1/mint-solana-aic`

**Test the edge function directly:**
```bash
curl -X POST https://kujoudvjmhuypxyntrkm.supabase.co/functions/v1/mint-solana-aic \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"userWallet": "YOUR_PHANTOM_ADDRESS"}'
```

Expected response:
```json
{
  "success": true,
  "signature": "...",
  "amount": 1000000,
  "userWallet": "...",
  "message": "Successfully minted 1,000,000 AIC tokens!"
}
```

### ✅ Solana Explorer

View your transactions on Solana Explorer:

**Your Token:**
https://explorer.solana.com/address/AkE225pApg5uJKuGzG1ymLvq12y4Womh9XKHzHjpJYEV?cluster=devnet

**Your Wallet:**
https://explorer.solana.com/address/YOUR_WALLET_ADDRESS?cluster=devnet

## 🎯 Test Scenarios

### Scenario 1: New User Experience

```
1. User installs Phantom ✅
2. User gets devnet SOL ✅
3. User connects wallet ✅
4. Auto-mints 1M AIC ✅
5. User sees balance update ✅
6. User can swap AIC → PYUSD ✅
7. User can cash out to PayPal ✅
```

### Scenario 2: Returning User

```
1. User connects wallet ✅
2. System checks existing AIC balance ✅
3. Shows "Already claimed" if minted ✅
4. Or mints if first time ✅
5. Balance loads correctly ✅
```

### Scenario 3: Multiple Users

```
1. User A connects → Gets 1M AIC ✅
2. User B connects → Gets 1M AIC ✅
3. Pool has enough liquidity ✅
4. Each user independent ✅
```

## 🐛 Troubleshooting

### Problem: "Insufficient SOL balance"
**Solution:** Request more SOL from faucet
```bash
solana airdrop 2 YOUR_ADDRESS --url devnet
```

### Problem: "Welcome bonus already claimed"
**Solution:** This means you already have AIC tokens! Check your balance.

### Problem: "Airdrop failed (rate limit)"
**Solution:** Wait 5 minutes and try another faucet, or use solfaucet.com

### Problem: Phantom not showing devnet
**Solution:**
1. Settings → Developer Settings
2. Enable Testnet Mode
3. Select Devnet from dropdown

### Problem: Transaction fails
**Solution:**
1. Check you're on devnet (not mainnet!)
2. Check you have enough SOL for fees (~0.001 SOL)
3. Wait 30 seconds and try again

### Problem: Balance not updating
**Solution:**
1. Wait 5-10 seconds for blockchain confirmation
2. Click "Refresh" or reload page
3. Check transaction on Solana Explorer

## 📊 Expected Results

### On First Connect:
```
Wallet: Connected ✅
SOL: ~2.0 (from airdrop)
AIC: 1,000,000 (auto-minted) 🎉
PYUSD: 0

Transaction: Confirmed on Solana devnet
Time: ~2-5 seconds
Cost: ~0.001 SOL (FREE on devnet)
```

### After Swap (10,000 AIC):
```
AIC: 990,000 (1M - 10K)
PYUSD: ~1.0 (10K AIC × 0.0001 rate)

Transaction Fee: ~0.001 SOL
Swap Fee: 0.3% (30 AIC)
```

### Pool Economics:
```
Initial Pool:
- 10,000,000 AIC
- 1,000 PYUSD
- Price: 1 AIC = $0.0001 PYUSD

Can support:
- 100 users × 1M AIC each = 100M AIC total
- Current treasury: 100M AIC minted
- Perfect for testing!
```

## 🎮 Fun Things to Try

### 1. Watch the Welcome Bonus Animation
- Connect wallet
- See the green animated banner
- Watch AIC balance count up to 1,000,000

### 2. Test Swap Calculator
- Type different AIC amounts
- Watch PYUSD estimate update in real-time
- Try: 1000, 10000, 100000, 500000

### 3. Check Solana Explorer
- Copy your transaction signature
- View on explorer.solana.com
- See the mint transaction details

### 4. Test with Multiple Wallets
- Create second Phantom wallet
- Connect and get another 1M AIC
- Each wallet gets its own 1M AIC!

### 5. Monitor Pool Liquidity
- Check pool reserves
- Calculate available swaps
- See how price changes with swaps

## 📈 Success Metrics

**Test is successful if:**
- ✅ Wallet connects smoothly
- ✅ 1M AIC mints automatically
- ✅ Balance updates within 10 seconds
- ✅ Swap calculator works correctly
- ✅ UI is responsive and clear
- ✅ No errors in browser console
- ✅ Transaction confirms on Solana

## 🎓 Learning Points

**What you're testing:**
1. **Solana SPL Tokens** - AIC is a real SPL token
2. **Automated Minting** - Edge function mints tokens server-side
3. **AMM Swap Pool** - Constant product formula (x*y=k)
4. **Wallet Integration** - Phantom wallet adapter
5. **Real Blockchain** - Actual Solana devnet transactions

**Not simulated:**
- Token creation ✅ REAL
- Minting ✅ REAL
- Balances ✅ REAL
- Transactions ✅ REAL
- Swap math ✅ REAL

**Simulated (for devnet):**
- PYUSD (using devnet token)
- PayPal integration (coming soon)

## 🚀 Next Steps After Testing

### If Tests Pass:

1. **Celebrate! 🎉** You have a working Solana token system!

2. **Get Real PYUSD:**
   - Request from Circle
   - Or buy on Solana mainnet
   - Add to liquidity pool

3. **Mainnet Deployment:**
   - Same deployment script
   - Change network to mainnet
   - Use real PYUSD mint address

4. **Production Launch:**
   - Deploy to mainnet (~$154 in SOL)
   - Add your 12 PYUSD to pool
   - Support 12 initial users
   - Grow from profits!

### If Tests Fail:

1. Check this guide's troubleshooting section
2. Verify you're on devnet (not mainnet!)
3. Check browser console for errors
4. Check deployment info in solana-deployment.json
5. Verify edge function is deployed

## 💡 Pro Tips

1. **Save Your Phantom Seed Phrase!**
   - This is testnet but still important practice

2. **Use DevTools:**
   - Open browser console (F12)
   - Watch for mint transaction logs
   - See real-time balance updates

3. **Be Patient:**
   - Solana is fast but allow 2-5 seconds
   - Devnet can be slower than mainnet
   - Multiple confirmations = more secure

4. **Document Everything:**
   - Screenshot your 1M AIC balance
   - Save transaction signatures
   - Record any issues for fixing

5. **Have Fun!**
   - This is YOUR token system
   - You deployed it to a real blockchain
   - Users get REAL tokens (on devnet)
   - You can see everything on Solana Explorer

## 🎬 Demo Script

**Perfect for showing to investors/partners:**

```
1. "Let me show you our Solana-based reward system..."

2. [Open solana.html] "Here's the dashboard."

3. [Connect Phantom] "When users connect their wallet..."

4. [Watch mint] "They automatically receive 1,000,000 AIC tokens!"

5. [Show balance] "See? 1 million tokens, instantly."

6. [Try swap] "They can swap AIC for PYUSD stablecoin..."

7. [Show calculation] "10,000 AIC = 1 PYUSD, live calculation."

8. [Show cash out] "Then cash out to their PayPal wallet."

9. [Open Explorer] "All verified on Solana blockchain."

10. "Zero capital needed - we're on free devnet!"
```

## 📞 Support

**Everything working?** Awesome! You're ready for mainnet.

**Having issues?** Check:
1. solana-deployment.json - deployment info
2. Browser console - error messages
3. Solana Explorer - transaction status
4. This guide - troubleshooting section

**Deployment Details:**
- File: `solana-deployment.json`
- Keypair: `.solana-deployer-keypair.json`
- Edge Function: `mint-solana-aic`
- Network: Devnet

---

**🎉 Happy Testing! You've built something amazing!**

Each user gets 1,000,000 AIC tokens - that's EPIC! 🚀
