# AIC Token System - Complete Overview

## 🎯 What Is This?

An **earn-to-learn** blockchain vocabulary game where users earn **AIC tokens** (AI Cognitive Token) by typing words correctly. Built on **Arc Testnet** with low gas fees.

---

## ✅ How It Actually Works

### **Phase 1: Play & Earn (In Database)**
```
User plays vocabulary game
   ↓
Types words correctly + fast
   ↓
Earns 100-500 AIC per word
   ↓
Stored in Supabase database
```

**Important:** At this stage, AIC is just a number in the database. No blockchain involved yet.

---

### **Phase 2: Claim Tokens (Mint On-Chain)**
```
User has 852 AIC in database
   ↓
Clicks "Claim AIC Tokens" button
   ↓
Edge function mints real ERC-20 tokens
   ↓
852 AIC tokens appear in user's wallet
   ↓
Visible in MetaMask on Arc Testnet
```

**This is the magic:** The edge function uses a backend wallet to mint tokens for free. User pays **zero gas fees**.

---

### **Phase 3: Use Your Tokens**

Once claimed, AIC tokens are real ERC-20 tokens on Arc blockchain. Users can:

1. **Hold them** - Store in wallet like any crypto
2. **Bridge them** - Send to other chains (Ethereum, Polygon, Base, etc.)
3. **Swap them** - Trade for other tokens on Arc DEXs
4. **Use in DeFi** - Liquidity pools, staking, lending
5. **Transfer them** - Send to other wallets

---

## 🏗️ Technical Architecture

### **Smart Contracts (Arc Testnet)**

**1. AICToken.sol** - `0xe7eF447D31760456Dd8A134F1e08B2Fd583bfA83`
- ERC-20 token with 6 decimals (matches USDC)
- Only authorized minters can create tokens
- Backend wallet authorized to mint game rewards
- Burns for swap mechanism

**2. AICSwap.sol** - `0x642cD03b73E2Ad7D5e190865d8C3Ec74BAE6d34e`
- Automated Market Maker (AMM) for AIC ↔ USDC
- Constant product formula (x * y = k)
- 0.3% swap fee
- Anyone can add liquidity

**3. USDC Contract** - `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- Circle's official USDC on Arc Testnet
- Native gas token on Arc (gas paid in USDC)
- Can be bridged to/from other chains

---

### **Backend System**

**Edge Functions (Supabase/Deno):**

1. **validate-word** - Validates typed words using OpenAI
2. **mint-aic-tokens** - Mints AIC tokens to user wallets
3. **mint-usdc-reward** - (Future) Rewards in USDC

**Database (Supabase):**
- Stores user data, game progress, rewards
- Tracks earned vs claimed AIC
- Transaction history

---

## 💰 Token Economics

### **AIC Token:**
- **Symbol:** AIC
- **Decimals:** 6 (same as USDC)
- **Total Supply:** Unlimited (minted as earned)
- **Distribution:** 100% from gameplay (no presale, no ICO)
- **Value:** Market determines (programmable token)

### **Earning Rate:**
- Easy words: 100-200 AIC
- Medium words: 200-350 AIC
- Hard words: 350-500 AIC
- Multipliers: Speed + accuracy bonuses

### **No Value Promise:**
AIC tokens are **NOT** backed by USD. They are **programmable utility tokens** on Arc blockchain. Value comes from:
- Utility in ecosystem
- Trading on DEXs
- DeFi integrations
- Community demand

---

## 🚀 User Journey

### **Complete Flow:**

**1. Connect Wallet**
- User connects MetaMask
- Switches to Arc Testnet (automatic)
- No USDC needed to start

**2. Play Game**
- Type blockchain vocabulary words
- Get AI validation + scoring
- Earn 100-500 AIC per word
- Track total in dashboard

**3. Claim Tokens**
- Click "Claim AIC Tokens" button
- Edge function mints tokens (free, no gas)
- Tokens appear in MetaMask wallet
- View on Arc Explorer

**4. Use Tokens**
- Bridge to other chains (Circle CCTP)
- Swap for USDC (if liquidity exists)
- Trade on DEXs
- Use in DeFi protocols

---

## 🔐 Security Features

**Smart Contract Security:**
- Only authorized minters can create tokens
- RLS policies on database
- Transaction validation
- Wallet-based authentication

**No Private Keys Exposed:**
- Backend wallet (minter) stored securely in env vars
- Users never need private keys to claim
- All minting happens server-side

**Arc Network Security:**
- EVM compatible (same security as Ethereum)
- Low gas fees (attacks expensive)
- Circle's infrastructure

---

## ⚠️ Important Clarifications

### **What AIC Tokens ARE:**
✅ Real ERC-20 tokens on Arc blockchain
✅ Can be transferred, traded, bridged
✅ Stored in your wallet (you control them)
✅ Verifiable on blockchain explorer
✅ Usable in DeFi protocols

### **What AIC Tokens ARE NOT:**
❌ NOT backed by real dollars
❌ NOT guaranteed to have value
❌ NOT redeemable for USDC 1:1 (unless you swap on DEX)
❌ NOT Circle's USDC token
❌ NOT a security or investment

### **Can Users Get Real Money?**

**Yes, but indirectly:**
1. Earn AIC tokens
2. List them on DEX (Uniswap, SushiSwap, etc.)
3. Someone buys them for USDC/ETH
4. You withdraw USDC/ETH to bank account

**You provide:**
- The game (earning mechanism)
- The token (AIC)
- The utility (what it's useful for)

**You DON'T provide:**
- Virtual cards
- Bank accounts
- Fiat withdrawals
- USD conversion

Users handle their own cash-out through DEXs and crypto exchanges.

---

## 🛠️ Development Setup

### **Environment Variables:**
```bash
# Supabase (Database)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Smart Contracts (Arc Testnet)
VITE_AIC_TOKEN_ADDRESS=0xe7eF447D31760456Dd8A134F1e08B2Fd583bfA83
VITE_AIC_SWAP_ADDRESS=0x642cD03b73E2Ad7D5e190865d8C3Ec74BAE6d34e
VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

# Backend Minter Wallet (for edge function)
GAME_MINTER_PRIVATE_KEY=0xxx
```

### **Commands:**
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
```

---

## 📊 Current Status

**Live on Arc Testnet:**
- ✅ Smart contracts deployed
- ✅ Game working
- ✅ Token minting working
- ✅ Database tracking working
- ✅ Bridge integration ready
- ✅ Swap interface ready

**Needs Liquidity:**
- ⚠️ AIC/USDC pool empty (no one can swap yet)
- ⚠️ Need initial liquidity providers
- ⚠️ Need DEX listing for price discovery

**Next Steps:**
1. Add liquidity to AIC/USDC pool
2. List on Arc DEXs
3. Launch marketing campaign
4. Build more use cases for AIC

---

## 🎓 For Non-Technical Users

**Think of it like this:**

**Database AIC** = Gift card balance (just a number, can't spend yet)
**Claimed AIC** = Real tokens in your wallet (can use anywhere)
**Arc Network** = The blockchain (like Ethereum but cheaper)
**Minting** = Creating new tokens (like printing money)
**Edge Function** = Backend robot that mints tokens for you (free)

---

## 🌐 Resources

- **Arc Testnet Explorer:** https://testnet.arcscan.app
- **AIC Token:** https://testnet.arcscan.app/address/0xe7eF447D31760456Dd8A134F1e08B2Fd583bfA83
- **Add Arc to MetaMask:** Automatic in app
- **Circle Bridge:** Built into UI
- **Supabase Dashboard:** Database admin panel

---

## 🤝 Contributing

This is a hackathon project demonstrating:
- Blockchain gaming
- Token economics
- AI validation
- Cross-chain bridging
- Low-fee transactions

**Built with:**
- React + TypeScript + Vite
- Supabase (Database + Edge Functions)
- Solidity (Smart Contracts)
- Circle CCTP (Bridge)
- Arc Network (L1 Blockchain)
- OpenAI (Validation)

---

## 📝 License

Open source. Use it, fork it, learn from it!

**Disclaimer:** Educational project. Not financial advice. Tokens have no guaranteed value. Play at your own risk. 🚀
