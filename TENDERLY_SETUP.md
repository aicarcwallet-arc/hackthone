# 🔧 Tenderly Setup Guide for Avalanche Testing

Complete guide to use Tenderly's advanced testing tools with your Avalanche project.

## 🎯 What is Tenderly?

Tenderly is a development platform that provides:
- **Virtual TestNets** - Get testnet funds instantly
- **Transaction Simulation** - Test before sending
- **Gas Profiling** - Optimize costs
- **Debugger** - Step through transactions
- **Monitoring** - Real-time alerts
- **Forking** - Test on mainnet state

## 💰 Your $30 Tenderly Funds

You mentioned getting $30 in Fuji testnet AVAX from Tenderly - perfect for testing!

---

## 🚀 Quick Setup

### Step 1: Create Tenderly Account

1. Go to https://dashboard.tenderly.co/
2. Click "Sign Up"
3. Use GitHub, Google, or email
4. Verify email (if using email signup)

### Step 2: Create Project

1. Click "Create Project"
2. Name: "AIC Mining Platform"
3. Select "Blockchain" project type
4. Click "Create"

### Step 3: Get Testnet Funds

**Option A: Virtual TestNet (Recommended)**

1. In your project, go to "Virtual TestNets"
2. Click "Create Virtual TestNet"
3. Select "Avalanche Fuji"
4. Click "Create"
5. Copy the RPC URL
6. Fund your address (they give you testnet AVAX)

**Option B: Faucet Integration**

1. Go to "Faucets" section
2. Select "Avalanche Fuji"
3. Enter your wallet address
4. Request funds (up to $30 worth)
5. Funds appear in ~10 seconds

### Step 4: Save Configuration

```env
# .env.avalanche
TENDERLY_PROJECT_SLUG=aic-mining-platform
TENDERLY_USERNAME=your_username
TENDERLY_ACCESS_KEY=your_access_key
TENDERLY_FORK_RPC=https://rpc.vnet.tenderly.co/devnet/YOUR_ID
```

---

## 🧪 Using Virtual TestNet

### What is a Virtual TestNet?

A Virtual TestNet is a dedicated Avalanche Fuji instance that:
- ✅ Runs on Tenderly's infrastructure
- ✅ Has no rate limits
- ✅ Gives you testnet AVAX instantly
- ✅ Records all transactions automatically
- ✅ Provides debugging tools
- ✅ Allows unlimited testing

### Setup Virtual TestNet

```bash
# 1. Create virtual testnet in Tenderly dashboard
# 2. Get RPC URL (looks like):
https://rpc.vnet.tenderly.co/devnet/abc-123-def-456

# 3. Use it in MetaMask
Network Name: Tenderly Fuji TestNet
RPC URL: [your tenderly RPC]
Chain ID: 43113
Symbol: AVAX
Explorer: https://testnet.snowtrace.io

# 4. Add to .env
VITE_AVALANCHE_RPC_URL=https://rpc.vnet.tenderly.co/devnet/YOUR_ID
```

### Benefits

- **Instant funds** - No waiting for faucet
- **No rate limits** - Test as much as you want
- **Full monitoring** - Every transaction logged
- **Debugger** - Step through each transaction
- **Simulation** - Test before sending real tx

---

## 🔍 Transaction Simulation

Test transactions BEFORE sending them:

### In Tenderly Dashboard

1. Go to "Simulator"
2. Select "Avalanche Fuji"
3. Enter:
   - From address (your address)
   - To address (contract address)
   - Function (e.g., createVault)
   - Parameters
4. Click "Simulate"
5. See what will happen!

### Shows You:

- ✅ Will it succeed or fail?
- ✅ How much gas will it cost?
- ✅ What state changes will happen?
- ✅ What events will be emitted?
- ✅ Line-by-line execution

### Example: Test Vault Creation

```javascript
// Before calling on-chain
// Simulate in Tenderly:

Function: createVault
Parameters: 0xYourUserAddress
From: 0xYourManagerAddress

// Results show:
✅ Success: true
💰 Gas Used: 247,891
📝 Events: VaultCreated(...)
🔄 State Changes: userVaults[0xUser] = 0xVault...
```

---

## 📊 Gas Profiling

Optimize your contract gas usage:

### View Gas Reports

1. Go to "Transactions" in Tenderly
2. Click any transaction
3. View "Gas Profiler" tab
4. See breakdown:
   - Function calls
   - Storage operations
   - External calls
   - Loop iterations

### Optimize Based on Data

```solidity
// Example: If gas profiler shows
// 80% of gas in storage writes

// Before (expensive)
for(uint i = 0; i < users.length; i++) {
    userData[users[i]] = value; // Multiple SSTORE
}

// After (cheaper)
mapping(address => uint) temp;
for(uint i = 0; i < users.length; i++) {
    temp[users[i]] = value;
}
// Batch commit
```

---

## 🐛 Debugging Transactions

Step through failed transactions:

### Debug a Failed Transaction

1. Transaction fails on-chain
2. Copy transaction hash
3. Go to Tenderly "Debugger"
4. Paste transaction hash
5. Click "Debug"

### What You See:

- **Call Stack** - Function calls hierarchy
- **State Changes** - What variables changed
- **Gas Usage** - Per operation
- **Line by Line** - Exact execution path
- **Revert Reason** - Why it failed

### Example Debug Session

```
1. createVault() called
2. ✓ Check vault doesn't exist
3. ✓ Calculate allocation
4. ❌ REVERT: Insufficient factory balance

Reason: Factory balance (50,000 AIC)
        < Required allocation (100,000 AIC)

Fix: Fund factory before creating vaults
```

---

## 📈 Monitoring & Alerts

Get notified of important events:

### Setup Alerts

1. Go to "Alerts" in Tenderly
2. Click "Create Alert"
3. Select trigger:
   - Transaction failed
   - Function called
   - Event emitted
   - Gas above threshold
4. Choose notification:
   - Email
   - Slack
   - Webhook
   - Telegram

### Example Alerts

**Alert 1: Factory Low Balance**
```
Trigger: Factory balance < 1,000,000 AIC
Action: Email notification
Message: "Factory running low, refill soon!"
```

**Alert 2: Large Redemption**
```
Trigger: redeemTokens called with amount > 10,000 AIC
Action: Slack notification
Message: "Large redemption detected!"
```

**Alert 3: Failed Transaction**
```
Trigger: Any transaction fails
Action: Email + Slack
Message: "Transaction failed, check immediately"
```

---

## 🍴 Forking Mainnet

Test with real mainnet data:

### What is Forking?

Fork mainnet to test:
- How your contracts work with real tokens
- Interactions with real DEXs
- Real-world scenarios
- Without spending real money

### Create a Fork

1. Go to "Forks" in Tenderly
2. Click "Create Fork"
3. Select "Avalanche C-Chain"
4. Choose block number (or latest)
5. Click "Create"

### Use the Fork

```env
# Use Tenderly fork RPC
AVALANCHE_RPC_URL=https://rpc.tenderly.co/fork/YOUR_FORK_ID
```

### Example: Test DEX Integration

```javascript
// On Tenderly Fork:
// 1. Your contracts are deployed
// 2. Trader Joe contracts exist (from mainnet)
// 3. You have test AVAX
// 4. Test swap AIC → USDC
// 5. See if it works with real DEX!

// All without spending real money!
```

---

## 💻 CLI Integration

Use Tenderly from command line:

### Install CLI

```bash
npm install -g @tenderly/cli

# Login
tenderly login

# Initialize
cd /path/to/your/project
tenderly init
```

### Useful Commands

```bash
# Export transaction
tenderly export [tx_hash]

# Simulate transaction
tenderly simulate [tx_hash]

# Deploy contracts
tenderly deploy

# Run fork
tenderly fork

# View gas report
tenderly gas-report [tx_hash]
```

---

## 📊 Cost Tracking

Track how much testing costs:

### View Costs in Tenderly

1. Go to "Analytics"
2. View graphs:
   - Total gas used
   - Average gas per function
   - Cost over time
   - Per-user costs

### Export Data

```bash
# Export to CSV
tenderly export-analytics --format csv

# Results:
Date,Function,GasUsed,Count
2025-11-05,createVault,247891,10
2025-11-05,mineTokens,52341,100
2025-11-05,redeemTokens,63521,50
```

### Estimate Mainnet Costs

```javascript
// From Tenderly data
Average gas per vault: 247,891
Current AVAX price: $38
Gas price: 25 nAVAX

Cost per vault = (247,891 * 25) / 1e9 * $38
              = 0.00062 AVAX * $38
              = $0.0236 per vault

100 vaults = $2.36
1000 vaults = $23.60
```

---

## 🎯 Testing Workflow

### Complete Testing Flow

```bash
# 1. Deploy to Tenderly Virtual TestNet
Deploy contracts via Remix to Tenderly RPC

# 2. Run Tests
Create test vaults
Mine tokens
Redeem tokens

# 3. Monitor in Tenderly
View all transactions
Check gas usage
Debug any failures

# 4. Optimize
Use gas profiler
Reduce expensive operations
Re-test

# 5. Simulate Edge Cases
What if vault has 0 balance?
What if user tries double-redeem?
What if factory runs out?

# 6. When Perfect
Switch to regular Fuji faucet
Final testing round
Deploy to mainnet
```

---

## 🔒 Security Testing

Test security scenarios:

### Test Attack Vectors

```javascript
// Scenario 1: Can user drain others' vaults?
Try: redeemTokens from wrong address
Expected: Revert with "Only user can call"

// Scenario 2: Can user redeem more than available?
Try: redeemTokens(1000000000)
Expected: Revert with "Insufficient mined tokens"

// Scenario 3: Can non-owner mine tokens?
Try: mineTokens from user address
Expected: Revert with "Only manager can call"
```

### Use Tenderly to Verify

1. Simulate each attack
2. Confirm it fails correctly
3. Check revert reasons
4. Ensure state unchanged

---

## 📚 Advanced Features

### Web3 Actions

Automate responses to events:

```javascript
// Example: Auto-refill factory
// When factory balance < 1M AIC
// Automatically transfer 10M AIC

// Setup in Tenderly dashboard
```

### API Access

Query data programmatically:

```javascript
// Get transaction data
fetch('https://api.tenderly.co/api/v1/account/YOUR_ACCOUNT/project/YOUR_PROJECT/transactions', {
  headers: {
    'X-Access-Key': 'YOUR_KEY'
  }
})
```

---

## 💡 Best Practices

### Do's

✅ **Use Virtual TestNet** for unlimited testing
✅ **Simulate first** before real transactions
✅ **Monitor everything** with alerts
✅ **Profile gas** to optimize costs
✅ **Debug failures** to understand why
✅ **Test edge cases** thoroughly
✅ **Document findings** for mainnet

### Don'ts

❌ Don't skip simulation step
❌ Don't ignore gas costs
❌ Don't deploy without debugging
❌ Don't forget to test failures
❌ Don't use same keys for testnet/mainnet

---

## 🎉 Summary

Tenderly gives you:

1. **$30 testnet AVAX** - Start testing immediately
2. **Virtual TestNet** - Unlimited testing, no rate limits
3. **Simulation** - Test before sending
4. **Debugging** - Find and fix issues fast
5. **Monitoring** - Know what's happening
6. **Gas Profiling** - Optimize costs
7. **Forking** - Test with real data

**With your $30 in Tenderly funds, you can test everything thoroughly before mainnet!** 🚀

---

## 🔗 Resources

- **Tenderly Dashboard:** https://dashboard.tenderly.co/
- **Documentation:** https://docs.tenderly.co/
- **CLI Docs:** https://github.com/Tenderly/tenderly-cli
- **Discord:** https://discord.gg/tenderly
- **Twitter:** @TenderlyApp

**Ready to start testing on Tenderly!** 🔧
