# 🚀 Quick Start: Fuji Testnet to Mainnet

Get your AIC mining platform running on Avalanche Fuji testnet, then switch to mainnet!

## ✅ Perfect Strategy!

You're taking the right approach:
1. ✅ Deploy on **Fuji testnet** first
2. ✅ Get **$30 testnet AVAX** from Tenderly
3. ✅ **Test everything** thoroughly
4. ✅ When perfect, just **change RPC** to mainnet
5. ✅ Redeploy with same contracts

---

## 🎯 Yes, Avalanche Fuji is the Testnet!

```
Fuji Testnet    = Test with fake money
    ↓
Test Everything
    ↓
C-Chain Mainnet = Launch with real money
```

---

## 💰 Get Your $30 Testnet AVAX

### Option 1: Tenderly (Your Plan)

**You mentioned getting $30 from Tenderly - Great choice!**

```bash
# 1. Create Tenderly account
https://dashboard.tenderly.co/

# 2. Create new project
Name: "AIC Mining Platform"

# 3. Get testnet funds
Go to: Virtual TestNets → Create → Avalanche Fuji
Or: Faucets → Request AVAX

# 4. You get $30 worth of testnet AVAX
About 0.8 AVAX (enough for extensive testing!)
```

**Read `TENDERLY_SETUP.md` for complete guide**

### Option 2: Free Faucet (Backup)

```bash
# If you need more funds
Visit: https://faucet.avax.network/
Select: Fuji Testnet
Get: 2 AVAX free (every 24 hours)
```

---

## 🚀 Deployment Steps (5 Minutes)

### Step 1: Setup Environment

```bash
# Copy environment template
cp .env.avalanche.example .env

# Edit .env
VITE_AVALANCHE_NETWORK=fuji  # ← Start with testnet!
AVALANCHE_PRIVATE_KEY=0xYOUR_KEY
```

### Step 2: Add Fuji to MetaMask

**Easiest way:**
```bash
Visit: https://chainlist.org/
Search: "Fuji"
Click: "Add to MetaMask"
Done!
```

**Or manually:**
```
Network: Avalanche Fuji Testnet
RPC:     https://api.avax-test.network/ext/bc/C/rpc
Chain:   43113
Symbol:  AVAX
```

### Step 3: Get Testnet AVAX

```bash
# From Tenderly (your $30)
https://dashboard.tenderly.co/ → Faucets

# Or from official faucet
https://faucet.avax.network/
```

### Step 4: Deploy Contracts

```bash
# Open Remix
https://remix.ethereum.org/

# Load your contracts
contracts-avalanche/AICToken.sol
contracts-avalanche/AICPersonalVault.sol
contracts-avalanche/AICVaultFactory.sol

# Compile (Solidity 0.8.20)

# Deploy to Fuji:
1. Switch MetaMask to Fuji
2. Deploy AICToken
3. Deploy AICVaultFactory(tokenAddress)

# Save addresses!
```

**Cost on Fuji: ~0.03 AVAX (~$1.20 with your $30 budget)**

### Step 5: Test Everything

```bash
# Fund factory
Approve 10M AIC → Factory
Transfer to factory

# Create test vault
Call: createVault(yourAddress)
Save vault address

# Test mining
Call: vault.mineTokens(1000000) # 1 AIC
Check balance increased

# Test redemption
Call: vault.redeemTokens(500000) # 0.5 AIC
Check tokens in wallet

# Verify on explorer
https://testnet.snowtrace.io/
```

---

## 🧪 Testing Phase

### With Your $30 Budget (~0.8 AVAX)

```
✅ Deploy contracts:        0.03 AVAX
✅ Create 100 test vaults:   0.1 AVAX
✅ 1000 mine operations:     0.5 AVAX
✅ 500 redemptions:          0.25 AVAX

Total testing budget:       0.88 AVAX
Your funds:                 0.8 AVAX

Perfect fit! Test everything thoroughly!
```

### Testing Checklist

```bash
- [ ] Deploy all contracts
- [ ] Fund factory with AIC
- [ ] Create multiple test vaults
- [ ] Mine tokens (different amounts)
- [ ] Redeem tokens (partial & full)
- [ ] Test error cases (insufficient balance, etc.)
- [ ] Check all balances on explorer
- [ ] Verify gas costs are acceptable
- [ ] Test frontend integration
- [ ] Run for 1 week without issues
```

---

## 🔄 Switch to Mainnet (When Ready)

### When to Switch

**Switch when:**
- ✅ All tests pass on Fuji
- ✅ No bugs found for 1 week
- ✅ Gas costs are acceptable
- ✅ Frontend works perfectly
- ✅ Everything verified on testnet explorer

### How to Switch (3 Easy Steps)

**Step 1: Update Environment**

```bash
# Edit .env
VITE_AVALANCHE_NETWORK=mainnet  # ← Change this line!

# That's it for code changes!
```

**Step 2: Get Real AVAX**

```bash
# Buy on exchange
Coinbase, Binance, Kraken, etc.

# Amount needed:
~1 AVAX (~$38) for:
  - Deploy contracts: $1.50
  - 100 user vaults: $4.00
  - Buffer: $32.50
```

**Step 3: Deploy to Mainnet**

```bash
# Exact same process as Fuji!
1. Switch MetaMask to "Avalanche C-Chain"
2. Deploy AICToken (same contract!)
3. Deploy AICVaultFactory (same contract!)
4. Fund factory
5. Test with 1 real vault

# Save mainnet addresses
# Update frontend config
# Launch! 🚀
```

### What Changes

**Code:** Nothing! Same contracts, same frontend
**Config:** Just RPC URL and Chain ID
**Network:** Fuji (43113) → Mainnet (43114)
**Explorer:** testnet.snowtrace.io → snowtrace.io

**That's it!**

---

## 📋 Configuration File

### Fuji Testnet (.env)

```env
VITE_AVALANCHE_NETWORK=fuji
AVALANCHE_PRIVATE_KEY=0xYOUR_KEY

# Frontend will auto-connect to:
RPC: https://api.avax-test.network/ext/bc/C/rpc
Chain ID: 43113
Explorer: https://testnet.snowtrace.io
```

### Mainnet (.env)

```env
VITE_AVALANCHE_NETWORK=mainnet
AVALANCHE_PRIVATE_KEY=0xYOUR_KEY

# Frontend will auto-connect to:
RPC: https://api.avax.network/ext/bc/C/rpc
Chain ID: 43114
Explorer: https://snowtrace.io
```

---

## 💡 Pro Tips

### Testing on Fuji

1. **Test extensively** - It's free!
2. **Create multiple vaults** - Test scaling
3. **Try edge cases** - What breaks?
4. **Monitor gas costs** - Will mainnet be affordable?
5. **Test for 1 week** - Find all bugs
6. **Document everything** - What did you learn?

### Before Mainnet

1. **Audit contracts** - Or have others review
2. **Calculate costs** - Can you afford scaling?
3. **Backup plan** - What if something fails?
4. **Support ready** - Can you help users?
5. **Marketing ready** - Ready to launch?

### After Mainnet

1. **Start small** - 10-100 users first
2. **Monitor closely** - Watch for issues
3. **Support users** - Be available
4. **Optimize** - Reduce costs if possible
5. **Scale gradually** - Don't rush

---

## 📊 Cost Comparison

### Your Testing Budget

```
Tenderly Funds: $30 (0.8 AVAX)
Fuji Faucet:    Free (2 AVAX/day)

Total available: ~2.8 AVAX for testing
Total needed:    ~0.88 AVAX

You're covered! Test everything!
```

### Mainnet Costs

```
Setup (one-time):
  Deploy Token:        $1.50
  Deploy Factory:      $1.00
  Fund Factory:        $0.10
  Total:               $2.60

Per User:
  Create Vault:        $0.038

Scaling:
  100 users:           $6.40
  1000 users:          $40.60
  10000 users:         $382.60

Much cheaper than alternatives!
```

---

## 🎯 Your Action Plan

### Today (Day 1)

```bash
✅ Get $30 testnet AVAX from Tenderly
✅ Add Fuji network to MetaMask
✅ Deploy contracts via Remix
✅ Create first test vault
✅ Test mine + redeem flow
```

### This Week (Days 2-7)

```bash
✅ Create 100 test vaults
✅ Test all features extensively
✅ Find and fix any bugs
✅ Optimize gas costs
✅ Test frontend integration
✅ Document learnings
```

### Next Week (Day 8+)

```bash
✅ Review all test results
✅ Decide: ready for mainnet?
✅ Buy 1 AVAX for mainnet
✅ Switch config to mainnet
✅ Deploy to mainnet
✅ Launch! 🚀
```

---

## 📚 Documentation

**Read these guides:**

1. `FUJI_TESTNET_SETUP.md` - Complete Fuji guide
2. `TENDERLY_SETUP.md` - Use your $30 effectively
3. `AVALANCHE_BUILD.md` - Full platform overview
4. `REMIX_DEPLOYMENT_GUIDE.md` - Step-by-step deployment

---

## 🎉 You're Ready!

Perfect strategy:
- ✅ Fuji testnet first (free testing)
- ✅ $30 Tenderly funds (extensive testing)
- ✅ Same contracts for mainnet
- ✅ Just change RPC when ready
- ✅ Low-cost scaling

**Start with Fuji today, launch mainnet next week!** 🚀🏔️
