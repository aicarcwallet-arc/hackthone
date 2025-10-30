# AIC Burn Peg System - USDC Deflationary Mechanism

## 🔥 Core Concept

**BURN USDC → MINT AIC → CREATE VALUE**

This system permanently **removes USDC from circulation** by burning it to the dead address, creating **deflationary pressure** that backs AIC's value.

Perfect for **Arc Network** where USDC is the native gas token!

---

## 💡 How It Works

### The Burn-to-Mint Process:

```
1. User sends 1000 USDC to contract
2. Contract takes 0.5% fee (5 USDC to treasury)
3. Contract sends 995 USDC to BURN ADDRESS (0x...dEaD)
4. Contract mints 995 AIC to user
5. USDC is PERMANENTLY REMOVED from circulation
```

### Why This Creates Value:

| Action | Effect | Result |
|--------|--------|--------|
| USDC Burned | Supply decreases | USDC becomes scarcer |
| AIC Minted | Backed by burned USDC | AIC has provable value |
| Gas Token Deflation | Less USDC on Arc Network | Higher gas token value |
| AIC Peg | 1 AIC = 1 burned USDC | Algorithmic price floor |

---

## 🎁 Bonus Tiers (Incentivize Large Burns)

Burn more USDC = Get bonus AIC!

| Burn Amount | Bonus | Example |
|-------------|-------|---------|
| < 1,000 USDC | 0% | Burn 500 USDC → Get 500 AIC |
| 1,000 - 9,999 USDC | +1% | Burn 1,000 USDC → Get 1,010 AIC |
| 10,000 - 99,999 USDC | +3% | Burn 10,000 USDC → Get 10,300 AIC |
| 100,000+ USDC | +5% | Burn 100,000 USDC → Get 105,000 AIC |

---

## 🚀 Deployment Steps

### Step 1: Deploy AICBurnPeg Contract

1. Open `AICBurnPeg.sol` in Remix
2. Compile with Solidity 0.8.20+
3. Deploy with constructor parameters:
   ```
   _aicToken: [YOUR_AIC_TOKEN_ADDRESS]
   _usdcToken: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
   _treasury: [YOUR_TREASURY_WALLET_ADDRESS]
   ```

### Step 2: Authorize BurnPeg as Minter

1. Open AICToken contract (use "At Address")
2. Call `addMinter`:
   ```
   minter: [BURN_PEG_CONTRACT_ADDRESS]
   ```

### Step 3: Start Burning!

Users can now burn USDC to mint AIC!

---

## 📱 Usage Guide

### For Users - Burn USDC to Get AIC:

#### Step 1: Approve USDC
```solidity
// In USDC Contract (0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238)
approve(BURN_PEG_ADDRESS, 1000000000) // 1000 USDC (6 decimals)
```

#### Step 2: Burn for AIC
```solidity
// In AICBurnPeg Contract
burnUSDCForAIC(1000000000) // Burn 1000 USDC
```

#### Step 3: Receive AIC
- You get AIC instantly!
- USDC is burned forever (check dead address)
- View your bonus if you burned large amount

---

## 🔍 Transparency Features

### Verify Burns On-Chain:

```solidity
// Check total USDC in dead address
getTotalBurned() // Returns USDC in 0x...dEaD

// Get burn statistics
getBurnStats()
// Returns:
// - totalUSDCBurned
// - totalAICMinted
// - burnedInDeadAddress (verifiable!)
// - burnToMintRatio

// Get quote before burning
getBurnQuote(1000000000)
// Returns:
// - aicAmount: How much AIC you'll get
// - fee: Protocol fee amount
// - bonus: Bonus percentage
```

### Dead Address:
```
0x000000000000000000000000000000000000dEaD
```
Anyone can verify USDC sent here is **permanently removed** from circulation!

---

## 💰 Economics Explained

### Traditional Stablecoin:
```
1 USDC locked in contract = 1 token minted
USDC still exists, can be withdrawn
No deflationary pressure
```

### AIC Burn Peg:
```
1 USDC BURNED (gone forever) = 1 AIC minted
USDC destroyed permanently
Creates scarcity-based value
Deflationary for Arc Network gas token
```

### Price Mechanism:

**If AIC drops below $1:**
- People will burn cheap USDC to get AIC at $1
- Creates buy pressure on AIC
- Price rises back to $1

**AIC has intrinsic value:**
- Every AIC represents 1 USDC removed from Arc Network
- As USDC becomes scarcer, AIC becomes more valuable
- Provable on-chain (check dead address)

---

## 🛡️ Security Features

### Safety Limits:
- ✅ Min burn: 1 USDC
- ✅ Max burn per tx: 100,000 USDC
- ✅ Daily limit: 1,000,000 USDC
- ✅ Emergency pause function
- ✅ ReentrancyGuard protection

### Fees:
- Burn fee: 0.5% (to treasury)
- Max fee: 5% (owner can't exceed)
- Treasury for protocol sustainability

### Transparency:
- All burns visible on-chain
- Dead address balance public
- Burn ratios adjustable by owner (50-200%)

---

## 📊 Integration Example (Frontend)

```typescript
import { ethers } from 'ethers';

// Get burn quote
async function getBurnQuote(usdcAmount: string) {
  const burnPeg = new ethers.Contract(BURN_PEG_ADDRESS, ABI, provider);
  const [aicAmount, fee, bonus] = await burnPeg.getBurnQuote(usdcAmount);

  console.log(`Burn ${usdcAmount} USDC`);
  console.log(`Get ${aicAmount} AIC`);
  console.log(`Fee: ${fee} USDC`);
  console.log(`Bonus: ${bonus}%`);
}

// Burn USDC for AIC
async function burnForAIC(usdcAmount: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // 1. Approve USDC
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
  const approveTx = await usdc.approve(BURN_PEG_ADDRESS, usdcAmount);
  await approveTx.wait();

  // 2. Burn USDC
  const burnPeg = new ethers.Contract(BURN_PEG_ADDRESS, BURN_PEG_ABI, signer);
  const burnTx = await burnPeg.burnUSDCForAIC(usdcAmount);
  await burnTx.wait();

  console.log('USDC burned! AIC minted!');
}

// Check burn stats
async function getBurnStats() {
  const burnPeg = new ethers.Contract(BURN_PEG_ADDRESS, ABI, provider);
  const stats = await burnPeg.getBurnStats();

  console.log('Total USDC Burned:', stats.totalBurned);
  console.log('Total AIC Minted:', stats.totalMinted);
  console.log('Burned in Dead Address:', stats.burnedInDeadAddress);
}
```

---

## 🎮 Perfect for Arc Network

### Why This System Fits Arc:

1. **USDC is Native Gas Token**
   - Burning USDC = Deflating gas token
   - Less USDC = Higher transaction costs
   - Benefits early adopters who hold AIC

2. **Provable Value**
   - Every AIC backed by burned USDC
   - Verifiable on-chain (dead address)
   - Transparent and trustless

3. **Game Integration**
   - Players earn AIC through vocabulary game
   - Can burn USDC to get more AIC
   - Creates dual acquisition paths

4. **Network Effect**
   - More burns = More valuable AIC
   - More valuable AIC = More burns
   - Positive feedback loop

---

## 📈 Comparison: Burn Peg vs Traditional Peg

| Feature | Traditional Peg | Burn Peg |
|---------|----------------|----------|
| Collateral | Locked (recoverable) | Burned (destroyed) |
| USDC Supply | Unchanged | Decreases |
| Value Source | Backing ratio | Scarcity + backing |
| Gas Impact | None | Deflationary |
| Reversible | Yes (withdraw) | No (permanent) |
| Verification | Trust contract | Verify dead address |
| Network Effect | Neutral | Positive |

---

## 🎯 Strategy Guide

### For Users:
1. **Small Burns**: Burn USDC when you need AIC for games
2. **Large Burns**: Wait for 1000+ USDC to get bonuses
3. **Arbitrage**: If AIC < $1 on market, buy cheap and burn USDC
4. **Long-term**: Hold AIC as USDC becomes scarcer

### For Developers:
1. Integrate burn functionality in wallet
2. Show real-time dead address balance
3. Display bonus tiers prominently
4. Create burn leaderboards
5. Gamify the burning process

---

## 🔗 Smart Contract Addresses

```
AIC Token:      [YOUR_DEPLOYED_ADDRESS]
USDC Token:     0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
Burn Peg:       [DEPLOY_THIS_CONTRACT]
Dead Address:   0x000000000000000000000000000000000000dEaD
Treasury:       [YOUR_TREASURY_ADDRESS]
```

---

## ⚠️ Important Notes

1. **Irreversible**: Burned USDC cannot be recovered
2. **Different from staking**: No unlock period, instant AIC
3. **Complementary systems**:
   - Burn Peg = Value creation through scarcity
   - AMM = Trading and liquidity
   - Game = User acquisition
4. **Network impact**: Benefits entire Arc ecosystem
5. **Transparency**: Anyone can verify burns in dead address

---

## 📞 Support

- Contract code: `/contracts/AICBurnPeg.sol`
- Dead address verification: [Arc Block Explorer]
- Test on Sepolia before mainnet
- Audit recommended before large-scale deployment

---

## 🌟 The Vision

By burning USDC (Arc's gas token), we:
1. Create permanent value for AIC holders
2. Make Arc Network more valuable (scarce gas)
3. Provide provable, verifiable backing
4. Build trust through transparency
5. Enable sustainable tokenomics

**Every AIC is backed by USDC that was permanently removed from existence.**
