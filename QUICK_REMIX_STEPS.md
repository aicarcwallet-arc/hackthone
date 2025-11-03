# 🚀 QUICK START: Deploy MockUSDC & Fund Treasury (5 Minutes)

## Step 1: Deploy MockUSDC on Remix
1. Go to **https://remix.ethereum.org**
2. Create new file: `MockUSDC.sol`
3. Copy contract from `/contracts/MockUSDC.sol`
4. Compile with Solidity **0.8.20+**
5. Connect MetaMask to **Arc Testnet** (Chain ID: 1967)
6. Click **Deploy**
7. **COPY CONTRACT ADDRESS!** → Save it!

## Step 2: Mint 5000 USDC to Treasury
1. In Remix, expand deployed MockUSDC contract
2. Find `mint` function
3. Enter:
   - **to:** `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
   - **amount:** `5000000000`
4. Click **transact**
5. Confirm in MetaMask

## Step 3: Verify Treasury Balance
1. Find `balanceOf` function
2. Enter: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
3. Click **call**
4. Should show: `5000000000` ✓

## Step 4: Update Your Project
In `.env`:
```bash
VITE_MOCK_USDC_ADDRESS=0xYOUR_CONTRACT_ADDRESS_HERE
```

## Step 5: Test User Rewards
1. Play the vocabulary game
2. Earn AIC tokens
3. Swap AIC → USDC
4. Check your wallet balance

---

## 💡 Quick Tips

**Treasury Address (memorize this):**
```
0x43909cce967BE2a4448336a0ad95A99b7040BF05
```

**USDC Amounts (6 decimals):**
- 100 USDC = `100000000`
- 500 USDC = `500000000`
- 1000 USDC = `1000000000`
- 5000 USDC = `5000000000`

**To mint rewards to a user:**
```javascript
mint(userWallet, 100000000) // 100 USDC reward
```

**Arc Testnet Info:**
- RPC: `https://rpc-testnet.arcscan.net`
- Chain ID: `1967`
- Explorer: `https://testnet.arcscan.net`

---

## 🎯 Complete Setup in Order

1. ✓ Deploy MockUSDC
2. ✓ Mint 5000 USDC to treasury
3. ✓ Update .env with contract address
4. Test vocabulary game
5. Watch rewards flow to users!

**That's it! Treasury is funded and ready! 🎉**
