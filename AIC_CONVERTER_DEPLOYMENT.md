# AIC to USDC Converter - Deployment Guide

## 🎯 Overview

The AIC Converter allows players to convert their earned AIC tokens to USDC at a 1:1 ratio, enabling them to withdraw real money through Bridge, Virtual Card, or Circle Banking.

## 💰 How It Works

1. **Players Play Game** → Earn 10 AIC per correct word
2. **Convert to USDC** → 1 AIC = 1 USDC = $1 USD
3. **Withdraw Money** → Via Bridge, Card, or Bank

### Example:
- Play 50 words correctly → Earn 500 AIC
- Convert 500 AIC → Get 500 USDC ($500)
- Withdraw $500 via Virtual Card or Bridge to exchange

## 📋 Deployment Steps

### Step 1: Deploy AIC Token Contract

**File:** `contracts/AICToken.sol`

**Network:** Arc Testnet (Chain ID: 5042002)

**RPC:** `https://rpc.testnet.arc.network`

**Constructor Arguments:** None

**Using Remix IDE:**
1. Go to https://remix.ethereum.org
2. Create new file `AICToken.sol`
3. Paste contract code from `contracts/AICToken.sol`
4. Compile with Solidity 0.8.20+
5. Deploy to Arc Testnet
6. Save the deployed address

### Step 2: Deploy AIC Converter Contract

**File:** `contracts/AICConverter.sol`

**Constructor Arguments:**
- `_aicToken`: Your deployed AIC Token address from Step 1
- `_usdcToken`: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` (Arc Testnet USDC)

**Example:**
```solidity
AICConverter(
  "0xYourAICTokenAddress",
  "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
)
```

### Step 3: Setup Permissions

Call `AICToken.addMinter(YOUR_BACKEND_ADDRESS)` to allow your game backend to mint rewards.

### Step 4: Fund the Converter with USDC

The converter needs USDC liquidity to exchange for AIC tokens.

**Steps:**
1. Get testnet USDC from Circle Faucet: https://faucet.circle.com
2. Approve USDC to the AICConverter contract:
   ```
   USDC.approve(AICConverterAddress, amount)
   ```
3. Add liquidity to the converter:
   ```
   AICConverter.addLiquidity(10000000000)
   ```
   This adds 10,000 USDC (note: USDC has 6 decimals)

**USDC Decimals:**
- 1 USDC = 1,000,000 (6 decimals)
- 10 USDC = 10,000,000
- 100 USDC = 100,000,000
- 1,000 USDC = 1,000,000,000
- 10,000 USDC = 10,000,000,000

## 🔧 Environment Variables

Add these to your `.env` file:

```bash
# Contract Addresses
VITE_AIC_TOKEN_ADDRESS=0xYourAICTokenAddress
VITE_AIC_CONVERTER_ADDRESS=0xYourConverterAddress
VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

# Backend Minter (for game rewards)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🎮 How Players Use the System

### 1. Play Game & Earn AIC
- Players answer blockchain vocabulary questions
- Earn 10 AIC tokens per correct word
- AIC tokens automatically sent to their MetaMask wallet

### 2. Convert AIC to USDC
- Click "Convert" tab
- Enter amount of AIC to convert
- Approve transaction in MetaMask
- Receive USDC instantly at 1:1 ratio
- Example: 500 AIC → 500 USDC ($500)

### 3. Withdraw USDC
Three options:

**A. Bridge (Withdraw to Exchange)**
- Move USDC to Ethereum, Base, Arbitrum, etc.
- Send to Coinbase/Binance
- Cash out to bank account

**B. Virtual Visa Card**
- Get AiC-Arc virtual card
- Load USDC onto card
- Spend anywhere online
- Netflix, Amazon, etc.

**C. Circle Banking**
- Deposit USDC in Circle bank
- Earn interest on savings
- Secure storage

## 🔐 Contract Features

### AICConverter.sol Functions

**For Users:**
- `convertAICToUSDC(uint256 aicAmount)` - Convert AIC to USDC
- `getConversionQuote(uint256 aicAmount)` - Get USDC amount before converting
- `getAvailableLiquidity()` - Check available USDC
- `getUserConversions(address user)` - Check user's total conversions

**For Owner:**
- `addLiquidity(uint256 amount)` - Add USDC to fund conversions
- `removeLiquidity(uint256 amount)` - Remove USDC
- `withdrawAIC(uint256 amount)` - Withdraw accumulated AIC
- `emergencyWithdraw()` - Emergency recovery

### Conversion Math

**AIC Token:** 18 decimals (standard ERC20)
- 1 AIC = 1,000,000,000,000,000,000 (1e18)

**USDC Token:** 6 decimals
- 1 USDC = 1,000,000 (1e6)

**Conversion Rate:** 1:1 VALUE ratio
- 1 AIC (1e18) = 1 USDC (1e6)
- Contract converts: `usdcAmount = aicAmount / 1e12`

## ✅ Verification

After deployment, verify contracts on Arc Explorer:
- Testnet: https://testnet.arcscan.app
- Mainnet: https://arcscan.app (when available)

## 🚀 Mainnet Migration

When Arc Mainnet launches:

1. Deploy contracts to mainnet
2. Update `.env`:
   ```bash
   VITE_USE_ARC_MAINNET=true
   VITE_AIC_TOKEN_ADDRESS=0xMainnetAICAddress
   VITE_AIC_CONVERTER_ADDRESS=0xMainnetConverterAddress
   VITE_USDC_ADDRESS=0xMainnetUSDCAddress
   ```
3. Fund converter with real USDC
4. System automatically switches to mainnet

## 💡 Economics

**Player Perspective:**
- Play game for free
- Earn AIC tokens (educational value)
- Convert to real USDC money
- Withdraw and spend/save

**Platform Perspective:**
- Need to fund converter with USDC
- 1 AIC earned = 1 USDC cost
- Plan liquidity based on user growth
- Example: 100 active players × 50 words × 10 AIC = 50,000 AIC = $50,000 USDC needed

## 🔄 Adding More Liquidity

As your platform grows, add more USDC:

```javascript
// Example: Add 50,000 USDC liquidity
const amount = 50000000000; // 50,000 USDC (6 decimals)

// 1. Approve USDC
await usdcContract.approve(converterAddress, amount);

// 2. Add liquidity
await converterContract.addLiquidity(amount);
```

## 📊 Monitoring

Check converter stats:
```javascript
const stats = await converterContract.getStats();
// Returns:
// - totalAICConverted: Total AIC exchanged
// - totalUSDCDistributed: Total USDC given out
// - availableLiquidity: Remaining USDC balance
```

## 🎉 Success!

Your players can now:
- ✅ Play games and earn AIC
- ✅ Convert AIC to USDC at 1:1 ratio
- ✅ Withdraw real money via Bridge/Card/Bank
- ✅ Build real digital wealth through education!

---

**Need Help?**
- Testnet USDC: https://faucet.circle.com
- Arc Network Docs: https://docs.arc.network
- Block Explorer: https://testnet.arcscan.app
