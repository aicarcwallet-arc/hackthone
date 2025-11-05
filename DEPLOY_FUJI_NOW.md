# 🚀 Deploy to Avalanche Fuji NOW - You're Funded!

## 🎉 You Have $35 in Fuji AVAX!

Perfect! Let's deploy your AIC mining platform to Avalanche Fuji testnet right now!

### Your Budget:
```
Available:               $35.00 (0.92 AVAX)
Deployment:              $1.44  (contracts)
Testing (100 vaults):    $32.30 (extensive)
────────────────────────────────────
Total Budget Needed:     $33.74
You Have:                $35.00

✅ PERFECT FIT!
```

---

## 🎯 Deployment Steps (15 Minutes)

### Step 1: Verify MetaMask (1 min)

**Check you have:**
1. Open MetaMask
2. Check you're on **"Avalanche Fuji Testnet"**
3. See **0.92 AVAX** in balance
4. Chain ID should be **43113**

**If Fuji not added:**
```bash
Visit: https://chainlist.org/
Search: "Fuji"
Click: "Add to MetaMask"
```

---

### Step 2: Open Remix IDE (1 min)

```bash
1. Visit: https://remix.ethereum.org/
2. Click "File Explorer" (folder icon, left sidebar)
3. Create workspace: "AIC-Avalanche-Fuji"
```

---

### Step 3: Load Contracts (2 min)

**You need 3 contracts from your `contracts-avalanche/` folder:**

1. **AICToken.sol**
2. **AICPersonalVault.sol**
3. **AICVaultFactory.sol**

**How to add them to Remix:**

```bash
# For each contract:
1. In Remix, right-click "contracts" folder
2. Click "New File"
3. Name it (e.g., "AICToken.sol")
4. Copy content from your local file
5. Paste into Remix
6. Repeat for all 3 files
```

---

### Step 4: Compile Contracts (2 min)

```bash
1. Click "Solidity Compiler" icon (left sidebar, 2nd from top)
2. Select compiler version: **0.8.20**
3. Enable "Optimization": **200 runs**
4. Click "Compile AICToken.sol"
   ✅ Should show green checkmark
5. Click "Compile AICPersonalVault.sol"
   ✅ Green checkmark
6. Click "Compile AICVaultFactory.sol"
   ✅ Green checkmark

All compiled successfully!
```

---

### Step 5: Deploy AICToken (3 min)

```bash
1. Click "Deploy & Run" icon (left sidebar, 3rd from top)
2. Environment: Select "Injected Provider - MetaMask"
3. MetaMask will pop up → Confirm connection
4. Verify it says "Custom (43113) network" (Fuji)
5. Select contract dropdown: "AICToken"
6. Click orange "Deploy" button
7. MetaMask pops up → Review:
   - Gas fee: ~0.012 AVAX (~$0.46)
   - Network: Avalanche Fuji Testnet
8. Click "Confirm"
9. Wait 2-3 seconds...
10. ✅ See "view on etherscan" link below

SUCCESS! AICToken deployed!
```

**CRITICAL: Save Token Address!**

```bash
# Under "Deployed Contracts", you'll see your AICToken
# Click the "copy" icon next to it

TOKEN_ADDRESS = _____________________________________

Paste it somewhere safe! You'll need it in 1 minute.
```

---

### Step 6: Deploy VaultFactory (3 min)

```bash
1. Still in "Deploy & Run"
2. Contract dropdown: Select "AICVaultFactory"
3. You'll see a deploy form with "_aicToken" field
4. Paste your TOKEN_ADDRESS from Step 5
5. Click orange "Deploy" button
6. MetaMask pops up:
   - Gas fee: ~0.025 AVAX (~$0.95)
7. Click "Confirm"
8. Wait 2-3 seconds...
9. ✅ VaultFactory deployed!
```

**CRITICAL: Save Factory Address!**

```bash
# Copy the VaultFactory address (same way as token)

FACTORY_ADDRESS = _____________________________________

Save it! You'll need it for the frontend.
```

---

### Step 7: Fund Factory with AIC (3 min)

**Now we give the factory 10 million AIC tokens to distribute:**

**7a. Approve Factory to Spend**

```bash
1. Under "Deployed Contracts", expand "AICToken"
2. Find "approve" function (orange button)
3. Fill in two fields:
   - spender: [Paste FACTORY_ADDRESS]
   - amount: 10000000000000
     ^^^ That's 10M AIC (with 6 decimals)
4. Click "transact"
5. MetaMask: Confirm (~$0.02 gas)
6. ✅ Approved!
```

**7b. Transfer AIC to Factory**

```bash
1. Still in AICToken contract
2. Find "transfer" function (orange button)
3. Fill in two fields:
   - to: [Paste FACTORY_ADDRESS]
   - amount: 10000000000000
     ^^^ Same 10M AIC
4. Click "transact"
5. MetaMask: Confirm (~$0.03 gas)
6. ✅ Transferred!
```

**7c. Verify Factory Has Funds**

```bash
1. Still in AICToken
2. Find "balanceOf" function (blue button - it's free!)
3. Fill in: [FACTORY_ADDRESS]
4. Click "call" (no transaction, just query)

Result should show: 10000000000000

✅ Factory now has 10M AIC!
   Ready to create 100 vaults (100K each)!
```

---

## 🎊 Deployment Complete!

### What You Just Deployed:

```
✅ AICToken Contract
   - 1 Billion total supply
   - 6 decimals
   - Owner: Your address
   - Cost: $0.46

✅ AICVaultFactory Contract
   - Connected to AICToken
   - Funded with 10M AIC
   - Can create 100 vaults
   - Cost: $0.95

✅ Factory Funded
   - Approved + Transferred
   - Cost: $0.05

Total Deployment Cost: $1.46
Remaining Budget: $33.54
```

---

## 🧪 Create Your First Test Vault

### Step 1: Create Vault

```bash
1. Under "Deployed Contracts", expand "AICVaultFactory"
2. Find "createVault" function (orange button)
3. Fill in:
   - userAddress: [YOUR_WALLET_ADDRESS]
     (Copy from MetaMask - top of window)
4. Click "transact"
5. MetaMask: Confirm (~$0.038 gas)
6. Wait 2 seconds...
7. ✅ Vault created!
```

### Step 2: Get Your Vault Address

```bash
1. In VaultFactory, find "userVaults" function (blue button)
2. Fill in: [YOUR_WALLET_ADDRESS]
3. Click "call" (free query)

Result shows: 0xYourVaultAddress...

VAULT_ADDRESS = _____________________________________

Copy and save it!
```

### Step 3: Load Vault in Remix

```bash
1. Scroll to bottom of "Deploy & Run"
2. Find "At Address" section
3. Contract dropdown: Select "AICPersonalVault"
4. Paste: [VAULT_ADDRESS]
5. Click pink "At Address" button
6. ✅ Your vault appears under "Deployed Contracts"!
```

---

## ⛏️ Test Mining

### Mine Your First Token!

```bash
1. Expand your "AICPersonalVault" contract
2. Find "mineTokens" function (orange button)
3. Fill in:
   - amount: 1000000
     ^^^ That's 1 AIC (with 6 decimals)
4. Click "transact"
5. MetaMask: Confirm (~$0.02 gas)
6. ✅ You mined 1 AIC!
```

### Check Your Mined Balance

```bash
1. In your vault, find "totalMined" (blue button)
2. Click "call"

Result: 1000000 (that's 1 AIC!)

3. Find "getAvailableBalance" (blue button)
4. Click "call"

Result: 1000000 (1 AIC ready to redeem!)
```

---

## 💸 Test Redemption

### Redeem to Your Wallet

```bash
1. In your vault, find "redeemTokens" (orange button)
2. Fill in:
   - amount: 500000
     ^^^ That's 0.5 AIC
3. Click "transact"
4. MetaMask: Confirm (~$0.024 gas)
5. ✅ 0.5 AIC sent to your wallet!
```

### Verify in MetaMask

**Add AIC Token to MetaMask:**

```bash
1. Open MetaMask
2. Scroll to bottom → "Import tokens"
3. Tab: "Custom token"
4. Fill in:
   - Token contract: [TOKEN_ADDRESS]
   - Token symbol: AIC
   - Token decimal: 6
5. Click "Add custom token"
6. Click "Import tokens"

✅ Now you'll see: 0.5 AIC in your wallet!
```

**Check Vault Balance:**

```bash
1. In Remix, vault contract
2. Call "getAvailableBalance"

Result: 500000 (0.5 AIC remaining)

Perfect! You had 1 AIC, redeemed 0.5, have 0.5 left.
```

---

## 🔍 View Everything on Snowtrace

### See Your Deployment Live!

```bash
Visit: https://testnet.snowtrace.io/

Search for each address:

1. Token Contract:
   https://testnet.snowtrace.io/address/[TOKEN_ADDRESS]

2. Factory Contract:
   https://testnet.snowtrace.io/address/[FACTORY_ADDRESS]

3. Your Vault:
   https://testnet.snowtrace.io/address/[VAULT_ADDRESS]

4. Your Wallet:
   https://testnet.snowtrace.io/address/[YOUR_WALLET]

You'll see ALL transactions, balances, contract code!
```

---

## 📊 What You've Accomplished

```
✅ Deployed AICToken (1B supply)
✅ Deployed VaultFactory
✅ Funded factory with 10M AIC
✅ Created your personal vault (100K AIC allocated)
✅ Mined 1 AIC
✅ Redeemed 0.5 AIC to wallet
✅ Verified everything on Snowtrace
✅ All in 15 minutes!

Cost so far: $1.50
Remaining: $33.50 for testing!
```

---

## 📝 Save Your Deployment Info

**Create file: `deployment-fuji.json`**

```json
{
  "network": "Avalanche Fuji Testnet",
  "chainId": 43113,
  "timestamp": "2025-11-05",
  "deployer": "YOUR_WALLET_ADDRESS",

  "contracts": {
    "aicToken": "TOKEN_ADDRESS",
    "vaultFactory": "FACTORY_ADDRESS"
  },

  "testVaults": [
    {
      "user": "YOUR_WALLET_ADDRESS",
      "vault": "VAULT_ADDRESS",
      "allocation": "100000000000",
      "mined": "1000000",
      "redeemed": "500000"
    }
  ],

  "stats": {
    "totalSupply": "1000000000000000",
    "factoryBalance": "10000000000000",
    "vaultsCreated": 1,
    "totalAllocated": "100000000000"
  },

  "links": {
    "token": "https://testnet.snowtrace.io/address/TOKEN_ADDRESS",
    "factory": "https://testnet.snowtrace.io/address/FACTORY_ADDRESS",
    "vault": "https://testnet.snowtrace.io/address/VAULT_ADDRESS"
  },

  "gasUsed": {
    "tokenDeploy": "~1200000 gas (~0.012 AVAX)",
    "factoryDeploy": "~2500000 gas (~0.025 AVAX)",
    "vaultCreate": "~250000 gas (~0.0025 AVAX)",
    "mineTokens": "~52000 gas (~0.0005 AVAX)",
    "redeemTokens": "~63000 gas (~0.0006 AVAX)"
  }
}
```

---

## 🚀 Update Your Frontend

**Edit `.env` file:**

```env
VITE_AVALANCHE_NETWORK=fuji
VITE_AIC_TOKEN_ADDRESS=YOUR_TOKEN_ADDRESS
VITE_VAULT_FACTORY_ADDRESS=YOUR_FACTORY_ADDRESS
```

**Rebuild:**

```bash
npm run build
```

**Test locally:**

```bash
npm run dev
```

Now your frontend will connect to Fuji testnet!

---

## 🎯 Next Steps - Scale Testing

### With $33.50 Remaining Budget:

**Week 1: Core Testing ($10)**
```
✅ Create 20 more vaults ($0.76)
✅ Test 100 mine operations ($2.00)
✅ Test 50 redemptions ($1.20)
✅ Test error cases ($1.00)
✅ Document findings ($0)
✅ Remaining buffer: $5.04
```

**Week 2: Scale Testing ($15)**
```
✅ Create 50 more vaults ($1.90)
✅ Test 300 mine operations ($6.00)
✅ Test 150 redemptions ($3.60)
✅ Stress test factory ($2.00)
✅ Remaining buffer: $1.50
```

**Week 3: Integration ($8.50)**
```
✅ Connect frontend ($0)
✅ Test complete user flows ($3.00)
✅ Mobile testing ($2.00)
✅ Bug fixes ($2.00)
✅ Final preparation ($1.50)
```

---

## 📋 Testing Checklist

### Smart Contract Tests

- [x] Deploy AICToken ✅
- [x] Deploy VaultFactory ✅
- [x] Fund factory ✅
- [x] Create vault ✅
- [x] Mine tokens ✅
- [x] Redeem tokens ✅
- [ ] Create 10 more test vaults
- [ ] Test with different mine amounts
- [ ] Test partial redemptions
- [ ] Test full redemptions
- [ ] Try edge cases (redeem more than available)
- [ ] Test non-owner operations (should fail)
- [ ] Verify all on Snowtrace

### Frontend Tests

- [ ] Connect wallet to Fuji
- [ ] Display correct balances
- [ ] Show vault info
- [ ] Mine through UI
- [ ] Redeem through UI
- [ ] View transactions
- [ ] Mobile responsive
- [ ] Error handling

---

## 💡 Pro Tips

### Testing Strategy

1. **Start Small**
   - Test with small amounts first (1 AIC)
   - Verify everything works
   - Then scale up

2. **Document Everything**
   - Save all addresses
   - Track gas costs
   - Note any issues
   - Record learnings

3. **Test Edge Cases**
   - Try to break it
   - Test limits
   - Test errors
   - Test failures

4. **Monitor Gas**
   - Track cost per operation
   - Estimate mainnet costs
   - Optimize if needed

### Budget Management

With $33.50 left, you can:
- Create 100+ more vaults
- Run 500+ mine operations
- Test 250+ redemptions
- Have plenty of buffer

Don't rush! Test thoroughly.

---

## 🐛 Troubleshooting

### "Gas estimation failed"
```
Common causes:
- Factory not funded
- User already has vault
- Wrong parameters

Solution: Check factory balance, verify user doesn't have vault
```

### "Transaction failed"
```
1. Copy transaction hash
2. View on testnet.snowtrace.io
3. Read error message
4. Fix and retry
```

### "Insufficient funds"
```
Check MetaMask AVAX balance
Should have 0.92 AVAX
If low, get more from faucet
```

### Contract function not visible
```
Make sure you:
1. Compiled the contract
2. Selected correct contract in dropdown
3. Deployed or loaded "At Address"
```

---

## 🎉 SUCCESS!

### You Now Have:

```
✅ AIC Token deployed on Fuji
✅ Vault Factory deployed and funded
✅ Your personal vault created
✅ Successfully mined tokens
✅ Successfully redeemed tokens
✅ Everything verified on Snowtrace
✅ $33.50 left for extensive testing

Ready for production testing!
```

### After 2-3 Weeks of Testing:

```
When everything is perfect:
1. Change .env: VITE_AVALANCHE_NETWORK=mainnet
2. Buy 1 AVAX (~$38)
3. Deploy same contracts to mainnet
4. Launch to real users!

Same contracts, same code, just different network!
```

---

## 📚 Resources

- **Fuji Explorer:** https://testnet.snowtrace.io/
- **Fuji Faucet:** https://faucet.avax.network/
- **Chainlist:** https://chainlist.org/
- **Remix IDE:** https://remix.ethereum.org/
- **Avalanche Docs:** https://docs.avax.network/

---

## 🚀 You're Live on Fuji Testnet!

**Start testing now with your $33.50 remaining budget!**

Deploy more vaults, test extensively, find any bugs, then launch on mainnet! 🏔️💎

**Questions? Check the other guides:**
- `FUJI_TESTNET_SETUP.md` - Complete guide
- `TESTNET_TO_MAINNET_STRATEGY.md` - Migration plan
- `QUICK_START_FUJI.md` - Quick reference
