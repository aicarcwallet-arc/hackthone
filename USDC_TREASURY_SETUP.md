# 🏦 USDC Treasury Setup Guide

## Treasury Wallet Information

**Treasury Address:** `0x97b554b7e0460b47004391a75f1561D353aA3435`

This wallet is used to distribute USDC rewards to players who earn points in the word game.

---

## ⚡ Quick Setup Steps

### 1. **Fund the Treasury Wallet with USDC**

You need to send USDC on **Arc Testnet** to the treasury address.

#### Option A: Get Testnet USDC from Faucet
1. Go to Arc Testnet Faucet (if available)
2. Request USDC for address: `0x97b554b7e0460b47004391a75f1561D353aA3435`

#### Option B: Bridge USDC to Arc Testnet
1. Use Circle's Bridge SDK to transfer USDC from Sepolia/Base/Arbitrum to Arc
2. Send to: `0x97b554b7e0460b47004391a75f1561D353aA3435`

#### Option C: Transfer from Your Wallet
1. Connect MetaMask to Arc Testnet
2. Add USDC token: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
3. Send USDC to treasury: `0x97b554b7e0460b47004391a75f1561D353aA3435`

---

### 2. **Verify Treasury Balance**

Check the balance on Arc Explorer:
```
https://testnet.arcscan.app/address/0x97b554b7e0460b47004391a75f1561D353aA3435
```

---

### 3. **Test the Claim Flow**

Once funded:

1. **Play the word game** to earn USDC points
2. **Check your wallet dashboard** - you'll see "Unclaimed USDC"
3. **Click "Claim USDC Rewards"** button
4. **USDC is transferred** from treasury to your wallet
5. **View transaction** on Arc Explorer
6. **Use your USDC** - send to any address or bridge to other chains!

---

## 🔍 How It Works

```
1. User plays game → Earns points in database
2. User clicks "Claim" → Edge function triggered
3. Edge function checks:
   ✓ User has unclaimed rewards
   ✓ Treasury has sufficient USDC
4. Treasury transfers USDC to user's wallet
5. Transaction visible on Arc Explorer
6. User can now:
   - Send USDC to any address (pays Arc gas)
   - Bridge to other chains via Bridge Kit
```

---

## 💡 Benefits of This Approach

✅ **Real USDC** on Arc Layer 1 testnet
✅ **All transactions visible** on Arc Explorer
✅ **Flash transactions** with Arc's fast finality
✅ **Cheap gas fees** (few cents in Arc native USDC)
✅ **No custom tokens** - just real, programmable USDC
✅ **Direct bridging** via Circle's Bridge Kit

---

## 🚨 Important Notes

1. **Treasury needs funding** before users can claim
2. **Monitor treasury balance** to ensure it doesn't run out
3. **Each claim transaction** uses a tiny amount of Arc native USDC as gas
4. **Users need Arc network** added to MetaMask to see their USDC

---

## 📊 Recommended Treasury Funding

- Start with **1,000 USDC** for testing
- Monitor usage via Arc Explorer
- Refill when balance gets low
- Each word rewards 100-500 USDC points

---

## 🔗 Useful Links

- **Arc Testnet Explorer:** https://testnet.arcscan.app
- **Arc RPC:** https://rpc.testnet.arc.network
- **USDC Contract:** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **Treasury Wallet:** `0x97b554b7e0460b47004391a75f1561D353aA3435`

---

## ✅ Ready to Go!

Once the treasury is funded, the entire flow works automatically:
- Players earn → Click claim → Get USDC → Use anywhere

No additional setup needed!
