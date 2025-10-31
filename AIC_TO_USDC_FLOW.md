# AIC to USDC Conversion & Withdrawal Flow

## Complete User Journey: From Game Rewards to Your Wallet

### Overview
This document explains how users earn AIC cognitive rewards, convert them to USDC, and withdraw to their Arc Testnet wallet.

---

## 🎮 Step 1: Play & Earn AIC Rewards

**How It Works:**
1. User plays the vocabulary game
2. Answers questions correctly
3. AI validates answers via OpenAI
4. AIC rewards are credited to user's account
5. **Rewards stored in database** (`users.total_aic_earned`)

**Behind the Scenes:**
- Each correct answer earns AIC tokens
- Balance tracked in Supabase database
- No blockchain transaction yet (saves gas!)
- AIC balance shown in "Your Balances" section

---

## 💱 Step 2: Convert AIC to USDC

**User Action:**
1. Go to "Bridge" tab
2. See your AIC balance (from game rewards)
3. Click **"Convert X AIC to USDC"** button
4. Wait for conversion to complete
5. ✅ Success! USDC sent to your wallet

**What Happens:**
```
User clicks "Convert AIC to USDC"
         ↓
Frontend calls mint-usdc-reward edge function
         ↓
Edge function:
  - Checks unclaimed AIC balance in database
  - Treasury wallet sends USDC to user's wallet
  - Updates claimed_aic in database
  - Records transaction in token_transactions table
         ↓
USDC appears in user's Arc Testnet wallet
         ↓
User can now bridge USDC to other chains!
```

**Technical Details:**
- **Edge Function**: `mint-usdc-reward`
- **Treasury Wallet**: Holds USDC reserves
- **Conversion Rate**: 1 AIC = 1 USDC (1:1 peg)
- **Gas**: Paid by treasury (user pays nothing!)
- **Network**: Arc Testnet (Chain ID: 5042002)
- **USDC Contract**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

---

## 💰 Step 3: USDC in Your Wallet (Already There!)

**Important:** After conversion, USDC is **already in your Arc Testnet wallet**!

**Check Your Balance:**
1. Open MetaMask
2. Switch to Arc Testnet
3. See USDC balance
4. Or check on Arc Explorer: https://testnet.arcscan.app

**No Additional Withdrawal Needed:**
- USDC is sent directly to your wallet address
- It's on Arc Testnet (Layer 1)
- Ready to use immediately
- Can be bridged to other chains

---

## 🌉 Step 4: Bridge USDC to Other Chains (Optional)

**If you want USDC on another chain:**
1. Stay on Bridge tab
2. Token selector shows **USDC only** (AIC can't be bridged!)
3. Select "From Chain" (Arc Testnet - when available)
4. Select "To Chain" (Base, Arbitrum, etc.)
5. Enter amount
6. Click "Bridge Tokens"
7. Circle CCTP handles cross-chain transfer
8. ✅ USDC arrives on destination chain!

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     AIC COGNITIVE ECOSYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: EARN                Step 2: CONVERT             Step 3: USE
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│              │           │              │           │              │
│  Play Game   │           │   Convert    │           │   Bridge     │
│  Answer      │  ──────>  │   AIC to     │  ──────>  │   USDC to    │
│  Questions   │           │   USDC       │           │   Other      │
│              │           │              │           │   Chains     │
│  Earn AIC    │           │ (Treasury)   │           │   (Circle)   │
│  (Database)  │           │              │           │              │
└──────────────┘           └──────────────┘           └──────────────┘
      ↓                           ↓                          ↓
  Database               Arc Testnet Wallet            Destination
  Balance                     (USDC)                       Chain
```

---

## 🔧 Technical Implementation

### Database Schema

**users table:**
```sql
- wallet_address: Ethereum address
- total_aic_earned: Total AIC earned from game
- claimed_aic: Total AIC converted to USDC
- Unclaimed = total_aic_earned - claimed_aic
```

**token_transactions table:**
```sql
- user_id: Foreign key to users
- transaction_type: 'reward' (AIC → USDC conversion)
- amount: USDC amount sent
- from_token: NULL
- to_token: 'USDC'
- tx_hash: Transaction hash on Arc
- chain_id: 5042002 (Arc Testnet)
- status: 'confirmed'
```

### Edge Function: mint-usdc-reward

**Purpose:** Convert AIC rewards to USDC

**Process:**
1. Receives wallet address
2. Queries user's unclaimed AIC balance
3. Checks treasury wallet has enough USDC
4. Sends USDC from treasury to user
5. Updates claimed_aic in database
6. Records transaction
7. Returns transaction hash

**Environment Variables:**
- `GAME_MINTER_PRIVATE_KEY`: Treasury wallet private key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key

**Security:**
- Treasury private key stored in Supabase secrets
- Only called from authenticated frontend
- User can only claim their own rewards
- Database tracks all conversions

---

## 🎯 Why This Design?

### Advantages:

1. **Gas Efficient:**
   - Game rewards in database (no gas fees)
   - One transaction converts all AIC to USDC
   - User never pays gas for earning rewards

2. **User Friendly:**
   - Simple one-click conversion
   - USDC appears directly in wallet
   - No complex contract interactions

3. **Flexible:**
   - Users accumulate AIC over time
   - Convert when ready
   - No minimum amount required

4. **Secure:**
   - Treasury wallet controlled by backend
   - Can't be exploited by users
   - All transactions auditable

5. **Bridgeable:**
   - USDC is Circle CCTP compatible
   - Can bridge to any supported chain
   - AIC stays on Arc (app-specific token)

---

## ❓ Common Questions

**Q: Where is my AIC balance stored?**
A: In the Supabase database, tracked by your wallet address.

**Q: Are AIC tokens on-chain?**
A: No, AIC rewards are database records until converted to USDC.

**Q: Can I bridge AIC tokens?**
A: No, only USDC can be bridged. Convert AIC to USDC first.

**Q: Do I pay gas fees?**
A: No, the treasury wallet pays all gas fees.

**Q: What if treasury runs out of USDC?**
A: Conversion will fail. Treasury needs to be refunded.

**Q: Is conversion instant?**
A: Takes ~1-5 seconds (one Arc transaction).

**Q: Can I convert partial AIC?**
A: Currently converts all unclaimed AIC. Partial coming soon.

**Q: What's the conversion rate?**
A: 1 AIC = 1 USDC (always 1:1 peg)

**Q: Where does USDC go?**
A: Directly to your connected wallet address on Arc Testnet.

**Q: Can I convert multiple times?**
A: Yes, every time you earn more AIC, convert again.

---

## 🚀 User Experience Flow

### First Time User:
```
1. Connect wallet to Arc Testnet
2. Play vocabulary game
3. Earn 10 AIC rewards
4. See "AIC Balance: 10 AIC"
5. Click "Convert 10 AIC to USDC"
6. Wait 3 seconds
7. ✅ Success! 10 USDC in wallet
8. Can now bridge to Base, Arbitrum, etc.
```

### Returning User:
```
1. Play more games
2. Earn 5 more AIC
3. Total: 5 unclaimed AIC
4. Click "Convert 5 AIC to USDC"
5. ✅ 5 more USDC added to wallet
6. Total wallet: 15 USDC
```

---

## 📝 Important Notes

### AIC vs USDC:

**AIC (AI Cognitive Token):**
- Earned from playing games
- Stored in database
- App-specific reward token
- Cannot be bridged
- Must convert to USDC

**USDC (USD Coin):**
- Native gas token on Arc
- ERC-20 token
- Can be bridged via Circle CCTP
- Real value, widely accepted
- Used for all transactions

### Treasury Management:

**Treasury Wallet:**
- Holds USDC reserves
- Sends USDC to users on conversion
- Needs periodic refills
- Monitored by edge function
- Fails gracefully if empty

**Funding Treasury:**
1. Get treasury address from error message
2. Send USDC to that address on Arc
3. Users can convert again
4. Monitor treasury balance regularly

---

## 🎉 Summary

**The Complete Journey:**
1. 🎮 Play game → Earn AIC (database)
2. 💱 Convert AIC → Receive USDC (wallet)
3. 🌉 Bridge USDC → Other chains (optional)
4. 💰 Use USDC → Anywhere!

**Key Points:**
- ✅ AIC rewards stored in database (no gas)
- ✅ Convert anytime with one click
- ✅ USDC sent directly to your wallet
- ✅ Ready to bridge to other chains
- ✅ No gas fees for users
- ✅ Simple, secure, fast

**No smart contract deployment needed!** The edge function handles everything using Circle's native USDC on Arc Testnet.
