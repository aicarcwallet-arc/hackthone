# Arc Testnet Treasury Strategy

## **Key Insight: Arc Uses USDC as Native Gas** ⛽

Arc Testnet is special:
- Native currency = **USDC** (not ETH!)
- Gas fees paid in USDC
- No need for wrapped tokens or bridges for gas

## **Why This Changes Everything**

### ❌ **CCTP V2 NOT Needed for Arc**

**Problem:** Arc Testnet is **NOT** on CCTP V2 yet!

CCTP V2 currently supports:
- Arbitrum, Avalanche, Base, Ethereum, OP Mainnet, Polygon, Solana, etc.
- **Arc is NOT listed** ⚠️

**Solution:** Use Arc's native USDC treasury system!

## **Recommended Strategy**

### **Option 1: MockUSDC (BEST for Testing)** ⭐

**Why:**
- ✅ Full control - unlimited minting
- ✅ Fast setup - 5 minutes
- ✅ No real money needed
- ✅ Perfect for demos/hackathons
- ✅ Same interface as real USDC

**Deploy:**
1. Use Remix IDE
2. Deploy `contracts/MockUSDC.sol` to Arc Testnet
3. Add treasury as minter
4. Mint unlimited test USDC

**See:** `DEPLOY_MOCKUSDC_REMIX.md`

---

### **Option 2: Circle Faucet USDC (Real USDC)** 💧

**Why:**
- ✅ Real USDC from Circle
- ✅ Tests production flow
- ✅ Free from faucet
- ❌ Limited daily amounts

**Get USDC:**
```
https://faucet.circle.com
→ Select "Arc Testnet"
→ Paste your treasury wallet
→ Get free USDC
```

---

### **Option 3: Your Existing Treasury** 🏦

**You already have:**
- Treasury wallet: `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
- Edge function: `mint-usdc-reward`
- Working system!

**Just fund it:**
```bash
# Transfer USDC from faucet or your wallet
# Treasury sends rewards directly
# No bridging needed!
```

---

## **The Arc Advantage**

### **Traditional L2 (Base, Optimism, Arbitrum):**
```
Need ETH for gas
↓
Bridge USDC from L1
↓
Pay ETH gas fees
↓
Complex setup
```

### **Arc Testnet:**
```
USDC IS the gas token!
↓
Just get USDC
↓
Pay USDC gas fees
↓
Simple setup ✅
```

---

## **When Would You Use CCTP?**

### **Future Scenario (When Arc Adds CCTP Support):**

```
User plays game on Arc
↓
Wants to cash out to Coinbase (Base)
↓
CCTP burns USDC on Arc
↓
Mints USDC on Base
↓
User withdraws to bank
```

**But for now:** Treasury ON Arc is the best solution!

---

## **Comparison: All Options**

| Method | Setup Time | Cost | Capacity | Best For |
|--------|-----------|------|----------|----------|
| **MockUSDC** | 5 min | Free | Unlimited | Testing/Demo |
| **Circle Faucet** | 1 min | Free | Limited | Quick tests |
| **Your Treasury** | 0 min | USDC transfer | Based on funds | Production |
| **CCTP V2** | N/A | N/A | N/A | Not available yet |

---

## **Recommended Setup for YOU**

### **For Hackathon/Demo (NOW):**

1. **Deploy MockUSDC** via Remix
2. **Mint 1M USDC** to treasury
3. **Test game rewards** unlimited times
4. **Show working demo** to judges

### **For Production (LATER):**

1. **Fund real treasury** on Arc
2. **Use existing `mint-usdc-reward`** function
3. **Monitor treasury balance**
4. **Refill from Circle Mint** or your wallet

---

## **Bottom Line**

**You don't need CCTP V2 for Arc!**

Arc's native USDC setup is actually **simpler** and **better** than traditional L2s:

1. **No ETH needed** for gas
2. **No bridging complexity**
3. **USDC is first-class citizen**
4. **Treasury lives where users are**

**Your existing system is already optimal!** 🎯

Just deploy MockUSDC for unlimited testing, then switch to real USDC treasury for production.

---

## **Future-Proofing**

### **If Arc Adds CCTP V2:**

Then you could offer:
- **Instant cash-outs** to Base/Ethereum
- **Cross-chain treasury** funding
- **Multi-chain rewards**

But until then, **native Arc treasury is the way!** ✅

---

**TL;DR:**
- ❌ Don't use CCTP V2 (Arc not supported)
- ✅ Deploy MockUSDC for testing (unlimited supply)
- ✅ Use native Arc treasury for production (simple & clean)
- ✅ Arc's USDC-as-gas is already better than most L2s!
