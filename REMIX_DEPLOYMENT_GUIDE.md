# 🎨 Remix Deployment Guide - Avalanche Mainnet

Complete step-by-step guide to deploy your mining contracts using Remix IDE.

## 🎯 Why Remix?

- ✅ No local setup needed
- ✅ Visual interface
- ✅ Built-in compiler
- ✅ Direct MetaMask integration
- ✅ Immediate deployment
- ✅ Perfect for beginners

## 📋 Prerequisites

### 1. MetaMask Setup

**Install MetaMask:**
- Go to https://metamask.io/
- Install browser extension
- Create/import wallet

**Add Avalanche C-Chain:**
```
Network Name: Avalanche C-Chain
RPC URL: https://api.avax.network/ext/bc/C/rpc
Chain ID: 43114
Symbol: AVAX
Explorer: https://snowtrace.io/
```

**Add to MetaMask:**
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter details above
5. Save

### 2. Get AVAX

**You need ~$30 worth of AVAX for:**
- Deploy AICToken: ~$10
- Deploy Factory: ~$10
- Fund factory: ~$1
- Create vaults: ~$1 each
- Buffer: ~$8

**Where to Buy AVAX:**
1. Coinbase, Binance, Kraken, etc.
2. Buy AVAX
3. Withdraw to your MetaMask (C-Chain!)
4. Verify it shows in MetaMask

## 🚀 Deployment Steps

### Step 1: Open Remix

1. Go to https://remix.ethereum.org/
2. You'll see the Remix IDE

### Step 2: Create Files

**Create folder structure:**
1. In file explorer (left sidebar)
2. Right-click on "contracts"
3. New Folder: "AvalancheContracts"

**Create AICToken.sol:**
1. Right-click "AvalancheContracts"
2. New File: "AICToken.sol"
3. Copy contents from `/contracts-avalanche/AICToken.sol`
4. Paste into Remix

**Create AICPersonalVault.sol:**
1. New File: "AICPersonalVault.sol"
2. Copy from `/contracts-avalanche/AICPersonalVault.sol`
3. Paste

**Create AICVaultFactory.sol:**
1. New File: "AICVaultFactory.sol"
2. Copy from `/contracts-avalanche/AICVaultFactory.sol`
3. Paste

### Step 3: Import OpenZeppelin

Remix auto-imports from GitHub!

Your imports will work automatically:
```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

If issues, use:
```solidity
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC20/ERC20.sol";
```

### Step 4: Compile Contracts

**Open Solidity Compiler (left sidebar):**
1. Click compiler icon (2nd icon)
2. Set compiler: **0.8.20** or higher
3. Enable optimization: **200 runs**
4. EVM Version: **Paris**

**Compile each contract:**
1. Select AICToken.sol
2. Click "Compile AICToken.sol"
3. ✅ Green checkmark = success
4. Repeat for AICPersonalVault.sol
5. Repeat for AICVaultFactory.sol

**Fix any errors:**
- Usually import path issues
- Check OpenZeppelin version
- Ensure Solidity 0.8.20+

### Step 5: Connect MetaMask

**Deploy & Run (left sidebar):**
1. Click deploy icon (4th icon)
2. Environment: **Injected Provider - MetaMask**
3. MetaMask popup appears
4. Select your account
5. Ensure Avalanche C-Chain selected
6. Click "Connect"

**Verify connection:**
- Should show your address
- Should show AVAX balance
- Should say "Avalanche C-Chain"

### Step 6: Deploy AICToken

**In Deploy panel:**
1. Contract dropdown: Select **AICToken**
2. No constructor arguments needed!
3. Click **Deploy** (orange button)

**MetaMask popup:**
1. Review transaction
2. Gas fee: ~$10 (varies)
3. Click **Confirm**

**Wait for confirmation:**
- See transaction in MetaMask
- Wait for checkmark
- Contract appears in "Deployed Contracts"

**SAVE THIS ADDRESS!**
```
AICToken deployed at: 0x...
```
Copy to notepad!

**Verify deployment:**
1. Expand contract in Remix
2. Click "totalSupply"
3. Should show: 1000000000000000 (1B with 6 decimals)
4. Click "balanceOf" with your address
5. Should show: 1000000000000000 (all tokens are yours!)

### Step 7: Deploy AICVaultFactory

**In Deploy panel:**
1. Contract dropdown: Select **AICVaultFactory**
2. Constructor argument needed!
3. Paste your **AICToken address** (from Step 6)
   ```
   Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
   ```
4. Click **Deploy** (orange button)

**MetaMask popup:**
1. Review transaction
2. Gas fee: ~$10
3. Click **Confirm**

**Wait for confirmation:**
- Contract appears in "Deployed Contracts"

**SAVE THIS ADDRESS!**
```
VaultFactory deployed at: 0x...
```

**Verify deployment:**
1. Expand factory in Remix
2. Click "aicToken" (blue button)
3. Should show your AICToken address ✅
4. Click "defaultAllocation"
5. Should show: 100000000000 (100K AIC with 6 decimals) ✅

### Step 8: Fund Factory with AIC

**Approve factory to spend AIC:**

1. Expand **AICToken** contract
2. Find **approve** function
3. Fill parameters:
   ```
   spender: 0xFACTORY_ADDRESS
   amount: 10000000000000
   ```
   (10M AIC = 10,000,000 * 1,000,000)
4. Click **transact**
5. Confirm in MetaMask (~$0.50)

**Fund the factory:**

1. Expand **AICVaultFactory** contract
2. Find **fundFactory** function
3. Fill parameter:
   ```
   amount: 10000000000000
   ```
   (10M AIC)
4. Click **transact**
5. Confirm in MetaMask (~$1)

**Verify factory funded:**
1. Expand factory
2. Click **getFactoryBalance**
3. Should show: 10000000000000 ✅
4. Click **getVaultsRemaining**
5. Should show: 100 ✅

### Step 9: Create Test Vault

**Create vault for yourself:**

1. Copy your MetaMask address
2. In factory, find **createVault** function
3. Fill parameter:
   ```
   user: 0xYOUR_ADDRESS
   ```
4. Click **transact**
5. Confirm in MetaMask (~$1)

**Wait for confirmation!**

**Get your vault address:**
1. In factory, find **getVault** function
2. Fill parameter:
   ```
   user: 0xYOUR_ADDRESS
   ```
3. Click **call**
4. Returns: `0xVAULT_ADDRESS`

**SAVE THIS ADDRESS!**
```
Your test vault: 0x...
```

### Step 10: Verify Your Vault

**Load vault contract:**

1. Copy vault address from Step 9
2. In "At Address" field at bottom
3. Paste vault address
4. Ensure **AICPersonalVault** selected in dropdown
5. Click "At Address"

**Vault appears in deployed contracts!**

**Check vault info:**
1. Expand your vault
2. Click **getVaultInfo**
3. You'll see:
   ```
   user: 0xYOUR_ADDRESS
   totalAllocated: 100000000000 (100K AIC)
   totalMined: 0
   totalRedeemed: 0
   available: 0
   locked: 100000000000 (100K AIC)
   ```

**Perfect! Vault created successfully!** ✅

### Step 11: Test Mining

**Mine some test tokens:**

1. In your vault, find **mineTokens**
2. Fill parameter:
   ```
   amount: 1000000
   ```
   (1 AIC = 1,000,000 with 6 decimals)
3. Click **transact**
4. Confirm in MetaMask

**Check updated balance:**
1. Click **getVaultInfo** again
2. Now shows:
   ```
   totalMined: 1000000 (1 AIC mined!)
   available: 1000000 (1 AIC available!)
   locked: 99999000000 (99,999 AIC locked)
   ```

**Success! Mining works!** ✅

### Step 12: Test Redemption

**Redeem tokens to your wallet:**

1. In vault, find **redeemTokens**
2. Fill parameter:
   ```
   amount: 1000000
   ```
   (Redeem 1 AIC)
3. Click **transact**
4. Confirm in MetaMask

**Check your AIC balance:**
1. Back to **AICToken** contract
2. Click **balanceOf** with your address
3. Should increase by 1000000!

**Check vault:**
1. Click **getVaultInfo**
2. Shows:
   ```
   totalRedeemed: 1000000
   available: 0 (redeemed!)
   ```

**Perfect! Full flow works!** ✅

## 📝 Save Your Addresses

Create a file: `deployment-avalanche.json`

```json
{
  "network": "Avalanche C-Chain",
  "chainId": 43114,
  "timestamp": "2025-11-05",
  "contracts": {
    "aicToken": "0xYOUR_TOKEN_ADDRESS",
    "vaultFactory": "0xYOUR_FACTORY_ADDRESS",
    "testVault": "0xYOUR_VAULT_ADDRESS"
  },
  "urls": {
    "aicToken": "https://snowtrace.io/address/0xYOUR_TOKEN_ADDRESS",
    "factory": "https://snowtrace.io/address/0xYOUR_FACTORY_ADDRESS",
    "vault": "https://snowtrace.io/address/0xYOUR_VAULT_ADDRESS"
  }
}
```

## 🔍 Verify on Snowtrace

**View your contracts:**
1. Go to https://snowtrace.io/
2. Paste each address in search
3. See all transactions!

**Verify source code (optional):**
1. On Snowtrace contract page
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Copy/paste source from Remix
5. Enter compiler settings
6. Submit

## 🎉 You're Done!

### What You've Deployed:

✅ **AICToken** - Your main token (1B supply)
✅ **VaultFactory** - Creates personal vaults
✅ **Factory Funded** - 100 vaults ready
✅ **Test Vault** - Your personal contract
✅ **Tested Mining** - Confirmed working
✅ **Tested Redemption** - Confirmed working

### Total Cost:
```
AICToken:        ~$10 AVAX
VaultFactory:    ~$10 AVAX
Fund Factory:    ~$1 AVAX
Test Vault:      ~$1 AVAX
Total Spent:     ~$22 AVAX
```

### What's Next:

1. **Create vaults for users:**
   - Call `createVault(userAddress)` for each user
   - Costs ~$1 AVAX per user

2. **Mine tokens:**
   - Call `vault.mineTokens(amount)` as they type words
   - Credits their mining balance

3. **Users redeem:**
   - Users call `vault.redeemTokens(amount)` when ready
   - Sends AIC to their wallet

4. **Users swap:**
   - Users go to https://traderjoexyz.com/
   - Swap AIC → USDC
   - Load Avalanche Card
   - SPEND! 💳

## 🐛 Troubleshooting

### "Gas estimation failed"
- Check you have enough AVAX
- Check function parameters correct
- Check you're calling as owner (for owner-only functions)

### "Execution reverted"
- Read error message
- Common: "Insufficient balance", "Already exists", etc.
- Fix and retry

### "Insufficient funds"
- Need more AVAX
- Get more from exchange

### Contract won't compile
- Check OpenZeppelin imports
- Ensure Solidity 0.8.20+
- Check for typos

### Can't connect MetaMask
- Ensure Avalanche C-Chain added
- Refresh Remix page
- Try different browser

## 📚 Resources

- **Remix:** https://remix.ethereum.org/
- **MetaMask:** https://metamask.io/
- **Snowtrace:** https://snowtrace.io/
- **Avalanche Docs:** https://docs.avax.network/
- **Trader Joe:** https://traderjoexyz.com/
- **Avalanche Card:** https://www.avalanchecard.com/

## 🎯 Next Steps

See `AVALANCHE_BUILD.md` for:
- Frontend integration
- User onboarding flow
- DEX swap integration
- Avalanche Card setup
- Production deployment

**Congratulations! You've deployed a complete mining system on Avalanche mainnet!** 🎉🏔️
