# 🧪 Avalanche Fuji Testnet Setup Guide

Complete guide to deploy and test on Avalanche Fuji testnet, then migrate to mainnet.

## 🎯 Strategy Overview

```
Phase 1: Deploy on Fuji Testnet
    ↓
Phase 2: Test Everything Thoroughly
    ↓
Phase 3: Switch to Mainnet (just change RPC!)
```

---

## 📍 Network Details

### Fuji Testnet (Start Here)
```
Network Name:    Avalanche Fuji Testnet
Chain ID:        43113 (0xa869)
RPC URL:         https://api.avax-test.network/ext/bc/C/rpc
Explorer:        https://testnet.snowtrace.io
Faucet:          https://faucet.avax.network/
Symbol:          AVAX
Decimals:        18
```

### C-Chain Mainnet (After Testing)
```
Network Name:    Avalanche C-Chain
Chain ID:        43114 (0xa86a)
RPC URL:         https://api.avax.network/ext/bc/C/rpc
Explorer:        https://snowtrace.io
Symbol:          AVAX
Decimals:        18
```

---

## 💰 Get Testnet AVAX

### Option 1: Official Faucet (Free)

1. Go to https://faucet.avax.network/
2. Select "Fuji Testnet"
3. Enter your wallet address
4. Complete CAPTCHA
5. Get 2 AVAX (enough for ~200 deployments!)

**Tip:** Request from faucet BEFORE using Tenderly funds

### Option 2: Tenderly Testnet (Your Plan)

1. Go to https://dashboard.tenderly.co/
2. Create account/login
3. Create new project
4. Go to "Faucets" section
5. Select "Avalanche Fuji"
6. Request testnet AVAX
7. You'll get $30 worth (~1 AVAX)

**Note:** Tenderly gives you gas for testing - perfect for development!

### Option 3: Multiple Faucets

- https://faucet.quicknode.com/avalanche/fuji
- https://faucet.paradigm.xyz/

---

## 🚀 Deployment Steps

### Step 1: Setup Environment

```bash
# Copy example env file
cp .env.avalanche.example .env.avalanche

# Edit .env.avalanche
nano .env.avalanche
```

**Set these values:**
```env
AVALANCHE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# FUJI TESTNET (default)
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43113
AVALANCHE_EXPLORER=https://testnet.snowtrace.io
AVALANCHE_NETWORK=fuji
```

### Step 2: Add Fuji to MetaMask

**Automatic (Recommended):**
1. Visit https://chainlist.org/
2. Search "Fuji"
3. Click "Connect Wallet"
4. Click "Add to MetaMask"

**Manual:**
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Fill in Fuji details (see above)
5. Save

### Step 3: Get Testnet AVAX

```bash
# Check your address
# In MetaMask, copy your address

# Visit faucet
https://faucet.avax.network/

# Paste address
# Select Fuji
# Click "Request AVAX"

# Wait 10 seconds
# Check MetaMask - you should have 2 AVAX!
```

### Step 4: Deploy Contracts

**Using Remix (Easiest for Testnet):**

1. Open https://remix.ethereum.org/
2. Load contracts from `contracts-avalanche/`
3. Compile all 3 contracts
4. Switch MetaMask to Fuji network
5. Deploy in order:
   - AICToken
   - AICVaultFactory (with token address)
6. Save all addresses!

**Cost on Fuji:**
```
AICToken:        ~0.01 AVAX
VaultFactory:    ~0.02 AVAX
Fund Factory:    ~0.001 AVAX
Create Vault:    ~0.001 AVAX each

Total for setup: ~0.03 AVAX
```

### Step 5: Save Deployment Info

```json
{
  "network": "fuji",
  "chainId": 43113,
  "timestamp": "2025-11-05",
  "contracts": {
    "aicToken": "0xYOUR_TOKEN_ADDRESS",
    "vaultFactory": "0xYOUR_FACTORY_ADDRESS"
  },
  "explorer": {
    "token": "https://testnet.snowtrace.io/address/0xYOUR_TOKEN",
    "factory": "https://testnet.snowtrace.io/address/0xYOUR_FACTORY"
  }
}
```

Save as `deployment-fuji.json`

---

## 🧪 Testing Checklist

### Smart Contract Tests

- [ ] **Deploy AICToken**
  - [ ] Verify total supply (1B)
  - [ ] Verify decimals (6)
  - [ ] Check owner address
  - [ ] Test transfer function

- [ ] **Deploy VaultFactory**
  - [ ] Verify token address set correctly
  - [ ] Check default allocation (100K)
  - [ ] Test factory balance

- [ ] **Fund Factory**
  - [ ] Approve factory to spend AIC
  - [ ] Transfer 10M AIC to factory
  - [ ] Verify factory balance
  - [ ] Check vaults remaining (should be 100)

- [ ] **Create Test Vault**
  - [ ] Call createVault(yourAddress)
  - [ ] Get vault address
  - [ ] Verify vault initialized
  - [ ] Check allocation (100K AIC)

- [ ] **Test Mining**
  - [ ] Call mineTokens(1000000) - 1 AIC
  - [ ] Check totalMined increased
  - [ ] Verify available balance
  - [ ] Test multiple mine calls

- [ ] **Test Redemption**
  - [ ] Call redeemTokens(500000) - 0.5 AIC
  - [ ] Verify AIC sent to wallet
  - [ ] Check updated balances
  - [ ] Test multiple redemptions

### Frontend Tests

- [ ] **Wallet Connection**
  - [ ] Connect MetaMask
  - [ ] Switch to Fuji network
  - [ ] Display correct address
  - [ ] Show AVAX balance

- [ ] **Mining Interface**
  - [ ] Type vocabulary words
  - [ ] See mined tokens increase
  - [ ] Display correct balances
  - [ ] Show locked tokens

- [ ] **Redemption Flow**
  - [ ] Click "Redeem" button
  - [ ] Enter amount
  - [ ] Confirm transaction
  - [ ] See balance update
  - [ ] View on explorer

### Integration Tests

- [ ] **Complete User Flow**
  1. New user connects wallet
  2. Backend creates vault
  3. User mines 10 words
  4. Backend credits tokens
  5. User redeems 5 AIC
  6. Tokens arrive in wallet
  7. All visible on Snowtrace

- [ ] **Error Handling**
  - [ ] Wrong network detection
  - [ ] Insufficient gas
  - [ ] Invalid amounts
  - [ ] Already has vault
  - [ ] No mined tokens available

- [ ] **Gas Cost Tracking**
  - [ ] Log all transaction costs
  - [ ] Calculate average per user
  - [ ] Estimate mainnet costs
  - [ ] Budget for scaling

---

## 🔧 Tenderly Integration (Optional)

Tenderly provides advanced testing features:

### Setup Tenderly

```bash
# Install Tenderly CLI
npm install -g @tenderly/cli

# Login
tenderly login

# Initialize project
tenderly init
```

### Create Virtual Testnet

1. Go to https://dashboard.tenderly.co/
2. Create new project
3. Go to "Virtual TestNets"
4. Click "Create Virtual TestNet"
5. Select "Avalanche Fuji"
6. Get RPC URL

### Use Tenderly RPC

```env
# In .env.avalanche
AVALANCHE_RPC_URL=https://rpc.vnet.tenderly.co/devnet/YOUR_ID
TENDERLY_PROJECT_SLUG=your-project
TENDERLY_ACCESS_KEY=your-key
```

### Tenderly Benefits

✅ **Transaction Simulation** - Test before sending
✅ **Gas Profiling** - Optimize costs
✅ **Debugger** - Step through transactions
✅ **Monitoring** - Real-time alerts
✅ **Forking** - Test on mainnet state

---

## 📊 Cost Comparison

### Fuji Testnet
```
Gas Price:       ~25 nAVAX (gwei)
AVAX Price:      Free! (testnet)

Deploy Token:    ~0.01 AVAX = FREE
Deploy Factory:  ~0.02 AVAX = FREE
Create Vault:    ~0.001 AVAX = FREE
Mine Tokens:     ~0.0005 AVAX = FREE
Redeem:          ~0.0005 AVAX = FREE

Per user cost:   ~0.001 AVAX = FREE
100 users:       ~0.1 AVAX = FREE
```

### Mainnet (Estimated)
```
Gas Price:       ~25 nAVAX (gwei)
AVAX Price:      $38 (example)

Deploy Token:    ~0.01 AVAX = $0.38
Deploy Factory:  ~0.02 AVAX = $0.76
Create Vault:    ~0.001 AVAX = $0.038
Mine Tokens:     ~0.0005 AVAX = $0.019
Redeem:          ~0.0005 AVAX = $0.019

Per user cost:   ~0.001 AVAX = $0.038
100 users:       ~0.1 AVAX = $3.80
1000 users:      ~1 AVAX = $38
```

**Much cheaper than Arc/Circle treasury!**

---

## 🔄 Migration to Mainnet

When your Fuji testing is complete and perfect:

### Step 1: Update Environment

```env
# Comment out Fuji
# AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
# AVALANCHE_CHAIN_ID=43113

# Uncomment Mainnet
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43114
AVALANCHE_EXPLORER=https://snowtrace.io
AVALANCHE_NETWORK=mainnet
```

### Step 2: Get Real AVAX

Buy ~1 AVAX (~$38) for:
- Contract deployment (~$1.50)
- 100 user vaults (~$4)
- Buffer (~$30)

### Step 3: Deploy to Mainnet

**Use EXACT same process as Fuji:**
1. Same contracts (no changes needed!)
2. Same deployment order
3. Same funding process
4. Different RPC URL, that's all!

### Step 4: Update Frontend

```typescript
// In src/config/avalanche-networks.ts
export const CURRENT_NETWORK = 'mainnet'; // was 'fuji'
```

```bash
# Rebuild app
npm run build

# Redeploy
```

### Step 5: Verify Everything

- [ ] Contracts deployed on mainnet
- [ ] Factory funded with real AIC
- [ ] Test vault created successfully
- [ ] Frontend connects to mainnet
- [ ] All explorer links work
- [ ] Test complete flow with real AVAX

---

## 🎯 Your $30 Tenderly Funds

With $30 worth of testnet AVAX (~0.8 AVAX):

```
Contract deployments:    2  = 0.03 AVAX
Factory funding:         1  = 0.001 AVAX
Create 100 test vaults:  100 = 0.1 AVAX
Test 1000 mine calls:    1000 = 0.5 AVAX
Test 500 redemptions:    500 = 0.25 AVAX

Total usage:             ~0.88 AVAX
Your budget:             ~0.8 AVAX (perfect fit!)
```

You can test EVERYTHING thoroughly!

---

## 📝 Testing Script

```bash
# 1. Get testnet AVAX
echo "Visit https://faucet.avax.network/"
echo "Request 2 AVAX to your address"

# 2. Add Fuji network to MetaMask
echo "Visit https://chainlist.org/ and add Fuji"

# 3. Deploy contracts via Remix
echo "Open Remix and deploy to Fuji"

# 4. Save addresses
echo "Create deployment-fuji.json"

# 5. Update frontend config
echo "Set VITE_AVALANCHE_NETWORK=fuji"

# 6. Test everything
echo "Run through complete user flow"

# 7. When perfect, switch to mainnet
echo "Update .env to mainnet RPC"
echo "Redeploy contracts"
echo "Update frontend"
echo "Launch!"
```

---

## ⚠️ Important Notes

### Testnet vs Mainnet

**What's THE SAME:**
- ✅ Smart contracts (identical code)
- ✅ Deployment process
- ✅ Frontend code
- ✅ User experience
- ✅ Gas costs (approximately)

**What CHANGES:**
- ⚠️ RPC URL
- ⚠️ Chain ID
- ⚠️ Explorer URL
- ⚠️ AVAX costs real money
- ⚠️ Contract addresses

### DO NOT

❌ Deploy same contracts to both networks
❌ Mix testnet and mainnet addresses
❌ Use testnet AVAX on mainnet
❌ Share private keys
❌ Deploy mainnet before thorough testing

### DO

✅ Test everything on Fuji first
✅ Save all deployment addresses
✅ Document gas costs
✅ Test error cases
✅ Verify contracts on explorer
✅ Test with multiple users
✅ Keep separate configs for each network

---

## 🎉 Success Criteria

Before migrating to mainnet, ensure:

- [ ] All contracts deployed and verified on Fuji
- [ ] Factory funded with sufficient AIC
- [ ] Multiple test vaults created successfully
- [ ] Mining works correctly
- [ ] Redemption works correctly
- [ ] Frontend connects and displays properly
- [ ] All transactions visible on Snowtrace
- [ ] Gas costs documented
- [ ] Error handling tested
- [ ] Multi-user flow tested
- [ ] No bugs found in 1 week of testing

---

## 📚 Resources

- **Fuji Faucet:** https://faucet.avax.network/
- **Fuji Explorer:** https://testnet.snowtrace.io/
- **Chainlist:** https://chainlist.org/
- **Tenderly:** https://dashboard.tenderly.co/
- **Avalanche Docs:** https://docs.avax.network/
- **Remix IDE:** https://remix.ethereum.org/

---

## 🚀 Quick Start

```bash
# 1. Get testnet AVAX
Visit faucet.avax.network → Get 2 AVAX

# 2. Setup environment
cp .env.avalanche.example .env.avalanche
# Edit with your private key

# 3. Deploy via Remix
Open remix.ethereum.org
Load contracts-avalanche/
Deploy to Fuji

# 4. Test everything
Create vaults
Mine tokens
Redeem tokens

# 5. When perfect
Update .env to mainnet
Redeploy contracts
Launch! 🚀
```

**You're ready to build on Fuji testnet!** 🧪🏔️
