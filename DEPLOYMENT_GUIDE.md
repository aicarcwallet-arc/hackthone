# 🚀 AIC Token System Deployment Guide - Arc Testnet

## ⚡ Quick Deploy with Remix IDE (Recommended for Hackathon)

### Prerequisites
- MetaMask with Arc Testnet configured (Chain ID: 5042002)
- Testnet USDC for gas: https://faucet.circle.com
- Your wallet address with USDC balance

---

## 📝 Step 1: Setup Arc Testnet in MetaMask

Add this network to MetaMask:
- **Network Name:** Arc Testnet
- **RPC URL:** https://rpc.testnet.arc.network
- **Chain ID:** 5042002
- **Currency Symbol:** USDC
- **Currency Decimals:** 6
- **Block Explorer:** https://testnet.arcscan.app

---

## 🔨 Step 2: Deploy AIC Token Contract

### Using Remix IDE

1. **Open Remix:** https://remix.ethereum.org

2. **Install OpenZeppelin:**
   - In Remix, go to "Plugin Manager"
   - Activate "Solidity Compiler" and "Deploy & Run Transactions"

3. **Create Contract File:**
   - Create new file: `AICToken.sol`
   - Copy contents from `contracts/AICToken.sol`

4. **Import OpenZeppelin (Remix will auto-import):**
   ```solidity
   import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
   import "@openzeppelin/contracts/access/Ownable.sol";
   ```

5. **Compile:**
   - Compiler version: `0.8.20+`
   - Enable optimization: 200 runs
   - Click "Compile AICToken.sol"

6. **Deploy:**
   - Environment: "Injected Provider - MetaMask"
   - Ensure MetaMask is on Arc Testnet
   - Select contract: `AICToken`
   - Click "Deploy"
   - Confirm transaction in MetaMask

7. **Copy deployed address:**
   ```
   AIC_TOKEN_ADDRESS = 0x...
   ```
   Save this! You'll need it.

8. **Verify on Explorer:**
   https://testnet.arcscan.app/address/<YOUR_AIC_TOKEN_ADDRESS>

---

## 🔨 Step 3: Deploy AIC Swap Contract

1. **Create Contract File:**
   - In Remix, create: `AICSwap.sol`
   - Copy contents from `contracts/AICSwap.sol`

2. **Compile:**
   - Compiler version: `0.8.20+`
   - Enable optimization: 200 runs
   - Click "Compile AICSwap.sol"

3. **Deploy with Constructor Args:**
   - Environment: "Injected Provider - MetaMask"
   - Contract: `AICSwap`
   - Constructor arguments:
     - `_aicToken`: `<YOUR_AIC_TOKEN_ADDRESS_FROM_STEP_2>`
     - `_usdcToken`: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
   - Click "Deploy"
   - Confirm in MetaMask

4. **Copy deployed address:**
   ```
   AIC_SWAP_ADDRESS = 0x...
   ```

5. **Verify on Explorer:**
   https://testnet.arcscan.app/address/<YOUR_AIC_SWAP_ADDRESS>

---

## ⚙️ Step 4: Configure Minter Permission

Your game backend needs permission to mint AIC rewards.

1. **In Remix, load AICToken:**
   - "At Address": paste your AIC_TOKEN_ADDRESS

2. **Call `addMinter`:**
   - Function: `addMinter`
   - Parameter: Your backend wallet address (the one that will mint rewards)
   - Click "transact"
   - Confirm in MetaMask

✅ Now your backend can mint AIC tokens!

---

## 💧 Step 5: Add Initial Liquidity (Optional but Recommended)

To enable AIC ↔ USDC swaps, add liquidity:

### 5.1: Get Testnet USDC
- https://faucet.circle.com
- Request USDC to your wallet

### 5.2: Approve Tokens

**Approve AIC:**
1. Load AICToken in Remix
2. Call `approve`:
   - `spender`: <YOUR_AIC_SWAP_ADDRESS>
   - `amount`: `100000000000` (100,000 AIC with 6 decimals)
3. Confirm in MetaMask

**Approve USDC:**
1. Add USDC contract in Remix:
   - Address: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
   - ABI: Standard ERC20
2. Call `approve`:
   - `spender`: <YOUR_AIC_SWAP_ADDRESS>
   - `amount`: `100000000000` (100,000 USDC with 6 decimals)
3. Confirm in MetaMask

### 5.3: Add Liquidity

1. Load AICSwap in Remix
2. Call `addLiquidity`:
   - `aicAmount`: `50000000000` (50,000 AIC)
   - `usdcAmount`: `50000000000` (50,000 USDC)
   - This creates 1:1 peg initially
3. Confirm in MetaMask

✅ Liquidity pool is now live!

---

## 🔐 Step 6: Update Environment Variables

Add these to your `.env` file:

```bash
# Contract Addresses
VITE_AIC_TOKEN_ADDRESS=0x_YOUR_AIC_TOKEN_ADDRESS
VITE_AIC_SWAP_ADDRESS=0x_YOUR_SWAP_ADDRESS
VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

# Backend Minter (for edge function)
GAME_MINTER_PRIVATE_KEY=0x_YOUR_BACKEND_PRIVATE_KEY
```

---

## ✅ Step 7: Test Everything

### Test Token Minting:
```javascript
// From your authorized minter wallet
await aicToken.mintGameReward(
  playerAddress,
  1000000, // 1 AIC (6 decimals)
  "submission_123"
);
```

### Test Swap:
```javascript
// Swap 10 AIC for USDC
await aicSwap.swapAICForUSDC(
  10000000, // 10 AIC
  9000000   // Min 9 USDC out (10% slippage)
);
```

### Verify on Explorer:
All transactions visible at: https://testnet.arcscan.app

---

## 🎯 Integration with Your Game

### Frontend Integration (already built):
- User plays vocabulary game
- Earns AIC tokens automatically
- Sees balance in wallet dashboard
- Can swap AIC → USDC
- Can bridge USDC to other chains

### Backend Integration (to add):
- When user completes word: mint AIC tokens on-chain
- Update Supabase with transaction hash
- Track all on Arc Explorer

---

## 🔍 Verify Deployment Checklist

- [ ] AIC Token deployed and verified
- [ ] AIC Swap deployed and verified
- [ ] Minter permission granted
- [ ] Initial liquidity added (optional)
- [ ] Environment variables updated
- [ ] Test minting successful
- [ ] Test swapping successful
- [ ] All transactions visible on Arc Explorer

---

## 🆘 Troubleshooting

**Gas Issues:**
- Get USDC from faucet: https://faucet.circle.com
- Each transaction costs ~0.01 USDC

**Compilation Errors:**
- Use Solidity 0.8.20 or higher
- Enable optimization (200 runs)
- OpenZeppelin imports auto-resolve in Remix

**Transaction Failures:**
- Check you're on Arc Testnet (Chain ID: 5042002)
- Ensure sufficient USDC for gas
- Check approvals before swapping

**Can't See Tokens:**
- Add AIC token to MetaMask manually:
  - Token Address: <YOUR_AIC_TOKEN_ADDRESS>
  - Symbol: AIC
  - Decimals: 6

---

## 📊 Monitor Your Contracts

**Arc Explorer:**
- Token: https://testnet.arcscan.app/token/<AIC_TOKEN_ADDRESS>
- Swap: https://testnet.arcscan.app/address/<AIC_SWAP_ADDRESS>
- All transactions: Real-time on explorer

**Check Liquidity:**
```javascript
await aicSwap.aicReserve(); // AIC in pool
await aicSwap.usdcReserve(); // USDC in pool
await aicSwap.getAICPrice(); // Current price
```

---

## 🏆 Ready for Hackathon Demo!

Once deployed, you can show judges:
1. ✅ Real AIC token on Arc Testnet
2. ✅ Working swap mechanism (AIC ↔ USDC)
3. ✅ All transactions verifiable on Arc Explorer
4. ✅ Production-ready for Arc Mainnet migration

**Mainnet Migration Path:**
- Deploy same contracts to Arc Mainnet (2026)
- Real USDC liquidity
- Real value for players
- Cross-chain bridges via Bridge Kit

---

## 🎉 You're Ready to WIN! 🎉
