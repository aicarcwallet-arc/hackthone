# CCTP On-Chain Rewards Setup Guide

## ✅ What's Already Done

1. **`.env` file updated** with `CCTP_TREASURY_PRIVATE_KEY`
2. **Rewards popup restored** - shows when you have unclaimed USDC
3. **CCTP edge function** ready to burn USDC on Base Sepolia

## 🔧 What You Need To Do

### Step 1: Fund Treasury Wallet with USDC on Base Sepolia

**Treasury Address:** `0x43909cce967BE2Ba4D44836A99b67040BF53f05a`

1. Go to https://faucet.circle.com
2. Select **Base Sepolia** network
3. Enter treasury address: `0x43909cce967BE2Ba4D44836A99b67040BF53f05a`
4. Request USDC (you'll get testnet USDC)
5. Wait for confirmation

You can check the balance here:
https://sepolia.basescan.org/address/0x43909cce967BE2Ba4D44836A99b67040BF53f05a

### Step 2: Set Supabase Secret

You need to add `CCTP_TREASURY_PRIVATE_KEY` to Supabase secrets.

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to https://supabase.com/dashboard/project/kujoudvjmhuypxyntrkm/settings/secrets
2. Click "Add new secret"
3. Name: `CCTP_TREASURY_PRIVATE_KEY`
4. Value: `0xa10c91b6875b231ef3888cecabd0c31e1efca683c879bb8f32b7aa640ca1ab99`
5. Click "Save"
6. **Restart Edge Functions** (click "Restart all functions")

**Option B: Via Supabase CLI**

```bash
# If you have Supabase CLI and are logged in:
supabase secrets set CCTP_TREASURY_PRIVATE_KEY=0xa10c91b6875b231ef3888cecabd0c31e1efca683c879bb8f32b7aa640ca1ab99
```

### Step 3: Test The Flow

1. **Hard refresh** the app (`Ctrl + Shift + R`)
2. You should see a **green "Rewards Ready!" popup** on the home page
3. It shows your **4908 USDC** unclaimed
4. Click **"Claim 4908 USDC"**
5. Wait 10-30 seconds for:
   - USDC to burn on Base Sepolia
   - Circle CCTP attestation
   - USDC to mint on Arc Testnet

### Step 4: See On-Chain Transactions! 🎉

After claiming, you'll get a success message with:

- **Burn TX hash** (Base Sepolia) - See it on Basescan
- **Explorer link** (Arc Testnet) - See the minted USDC in your wallet

**Base Sepolia Explorer:**
https://sepolia.basescan.org/address/0x43909cce967BE2Ba4D44836A99b67040BF53f05a

**Arc Testnet Explorer:**
https://testnet.arcscan.app/address/0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd

## 🔍 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  1. You click "Claim USDC"                                  │
│  2. Edge function burns USDC on Base Sepolia                │
│  3. Circle CCTP creates attestation (8-20 seconds)          │
│  4. USDC automatically mints to your wallet on Arc Testnet  │
│  5. You see both transactions on block explorers!           │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Current State

```
Database:
  - total_aic_earned: 4908
  - claimed_aic: 4908
  - total_usdc_earned: 4908
  - claimed_usdc: 0

On-Chain (Arc Testnet):
  - AIC Token: 4908 (already minted)
  - USDC: 0 (will be minted via CCTP)

Treasury (Base Sepolia):
  - Needs: ~5000 USDC for rewards
  - Will burn USDC and send to your wallet on Arc
```

## ❓ Troubleshooting

**Error: "No unclaimed USDC"**
- This means your database shows 0 available. Already claimed or not earned yet.

**Error: "Insufficient USDC balance"**
- Treasury wallet needs USDC on Base Sepolia
- Go to https://faucet.circle.com and fund the treasury

**Error: "CCTP treasury wallet not configured"**
- Need to set `CCTP_TREASURY_PRIVATE_KEY` in Supabase secrets (Step 2)

**No popup showing**
- Check that `total_usdc_earned` > `claimed_usdc` in database
- Hard refresh the page

## 🎯 Expected Result

After setup:
1. Popup shows with "Claim 4908 USDC" button
2. Click claim → See "Converting to USDC..." loading
3. Success alert with:
   - Burn TX hash (Base Sepolia)
   - Fee (~0.1%)
   - Arrival time (8-20 seconds)
   - Explorer link
4. Wait ~15 seconds
5. Check Arc Testnet explorer - see 4908 USDC in your wallet! 🎉

## 🔗 Important Links

- **Circle USDC Faucet:** https://faucet.circle.com
- **Base Sepolia Explorer:** https://sepolia.basescan.org
- **Arc Testnet Explorer:** https://testnet.arcscan.app
- **Supabase Secrets:** https://supabase.com/dashboard/project/kujoudvjmhuypxyntrkm/settings/secrets
- **Treasury Wallet:** 0x43909cce967BE2Ba4D44836A99b67040BF53f05a
- **Your Gamer Wallet:** 0x996a7ac2e9f37173f2b2131fa720f04fdacbb0cd
