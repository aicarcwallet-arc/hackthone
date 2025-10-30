# USDC on Arc Testnet - Monitoring Guide

## Your Deployed Contracts

- **AIC Token**: `0x4B71cD610AfCCDf0B02d566dA0071C74444a8666`
- **AIC Swap**: `0xcdBF982762df8955fBBfc54232E41b3767b123DD`
- **USDC (Arc Testnet)**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

## Arc Testnet Network Details

```
Network Name: Arc Testnet
RPC URL: https://rpc.testnet.arc.network
Chain ID: 5042002 (0x4CE752)
Currency Symbol: USDC
Block Explorer: https://testnet.arcscan.app
```

## How USDC Works on Your App

### 1. Earning AIC Tokens
- Play the vocabulary game
- Earn 100-500 AIC tokens per word
- Tokens are stored in the database and your wallet balance

### 2. Swapping AIC to USDC (1:1)
- Go to "Swap" tab
- Connect MetaMask (it will prompt you to switch to Arc Testnet)
- Enter amount of AIC to swap
- Approve transaction in MetaMask
- USDC is sent **directly to your MetaMask wallet**

### 3. Monitoring on Arc Explorer

**Transaction Monitoring:**
```
https://testnet.arcscan.app/tx/YOUR_TX_HASH
```

**Wallet Balance:**
```
https://testnet.arcscan.app/address/YOUR_WALLET_ADDRESS
```

**USDC Contract:**
```
https://testnet.arcscan.app/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
```

**AIC Token Contract:**
```
https://testnet.arcscan.app/address/0x4B71cD610AfCCDf0B02d566dA0071C74444a8666
```

## Testing the Full Flow

### Step 1: Connect Wallet
1. Open the app
2. Connect MetaMask
3. App will auto-create a user in database

### Step 2: Play & Earn
1. Go to "Play" tab
2. Type blockchain words correctly
3. Earn AIC tokens (check "Total Earned" in blue panel)

### Step 3: Swap to USDC
1. Go to "Swap" tab
2. Enter AIC amount to swap
3. Click "Swap Tokens"
4. MetaMask will prompt:
   - **First**: Approve AIC token spending
   - **Second**: Confirm the swap transaction
5. After success, you'll see transaction hash

### Step 4: Monitor on Explorer
1. Click "View on Arc Explorer" button
2. You'll see:
   - Transaction status
   - Block number
   - Gas used
   - From/To addresses
   - Token transfers

### Step 5: Check USDC in MetaMask
1. Open MetaMask
2. Make sure you're on Arc Testnet
3. Click "Import tokens"
4. Enter USDC address: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
5. Your USDC balance will appear

## Key Features for Hackathon Demo

### ✅ Real-time Balance Updates
- Blue panel shows AIC balance
- USDC balance visible in MetaMask
- Total earned tracked in database

### ✅ On-chain Verification
- Every transaction viewable on Arc Explorer
- Transparent token movements
- Verifiable rewards distribution

### ✅ AI Agent Validation
- OpenAI validates every word submission
- Cognitive scoring system
- Anti-cheating detection

### ✅ Seamless UX
- No manual network switching needed
- Auto-prompts for Arc Testnet
- One-click token addition to MetaMask

## Troubleshooting

### USDC Not Showing in MetaMask?
1. Make sure you're on Arc Testnet network
2. Click "Add USDC to MetaMask" button in app
3. Or manually import: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

### Transaction Pending?
- Arc Testnet blocks are fast (~2-3 seconds)
- If stuck, check Arc Explorer for status
- May need to increase gas limit

### Swap Failed?
- Ensure you have enough AIC balance
- Approve token spending first
- Check if you have USDC for gas (Arc uses USDC as native currency)

## Monitoring Dashboard URLs

**Your Wallet:**
Replace `YOUR_ADDRESS` with your MetaMask address:
```
https://testnet.arcscan.app/address/YOUR_ADDRESS
```

**Recent Transactions:**
```
https://testnet.arcscan.app/txs
```

**AIC Token Analytics:**
```
https://testnet.arcscan.app/token/0x4B71cD610AfCCDf0B02d566dA0071C74444a8666
```

**Swap Contract Activity:**
```
https://testnet.arcscan.app/address/0xcdBF982762df8955fBBfc54232E41b3767b123DD
```

## What Judges Will See

1. **Play the game** → Earn AIC tokens → Visible in blue dashboard
2. **Swap AIC to USDC** → 1:1 conversion → Real transaction hash
3. **Check Explorer** → Transparent on-chain proof → Verifiable rewards
4. **Check MetaMask** → USDC balance increases → Real value transfer

This demonstrates:
- ✅ AI agent integration (OpenAI validation)
- ✅ Circle USDC integration (real stablecoin)
- ✅ Arc blockchain deployment (L1 testnet)
- ✅ Full DeFi flow (earn → swap → transfer)
- ✅ Production-ready UX (no complex steps)

## Quick Test Script

```bash
# 1. Connect wallet → Get address
# 2. Play game → Earn 300-500 AIC
# 3. Swap 100 AIC → Get 100 USDC
# 4. Check explorer: https://testnet.arcscan.app/address/YOUR_ADDRESS
# 5. Check MetaMask → See USDC balance
# 6. Send USDC to another address → Verify on explorer
```

## Important Notes

- **All transactions are on Arc Testnet** - not mainnet
- **USDC on Arc Testnet** - for testing only
- **1 AIC = 1 USDC** - pegged swap rate
- **Gas fees paid in USDC** - Arc's native currency
- **Explorer updates instantly** - real-time monitoring

---

**Ready for Hackathon Demo!** 🚀
