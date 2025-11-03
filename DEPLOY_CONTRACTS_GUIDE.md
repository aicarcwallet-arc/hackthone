# Contract Deployment Guide

## Step 1: Deploy MockUSDC Contract

### Via Remix IDE

1. **Open Remix**: Go to https://remix.ethereum.org
2. **Create MockUSDC.sol**:
   - Copy the contract from `contracts/MockUSDC.sol`
   - Paste into a new file in Remix
3. **Compile**:
   - Select Solidity Compiler 0.8.20+
   - Click "Compile MockUSDC.sol"
4. **Deploy**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask"
   - Ensure MetaMask is on Arc Testnet (Chain ID: 1967)
   - Click "Deploy"
   - Confirm transaction in MetaMask
5. **Copy Address**: Save the deployed contract address

**Expected Result**: MockUSDC contract deployed with 1,000,000 USDC minted to deployer

### Update Configuration

After deploying, update these files:

1. `.env` file:
```
VITE_USDC_ADDRESS=0xYOUR_MOCKUSDC_ADDRESS
```

2. `mint-mock-usdc.html` (line 113):
```javascript
const MOCK_USDC_ADDRESS = '0xYOUR_MOCKUSDC_ADDRESS';
```

## Step 2: Mint 5000 USDC to Treasury

### Option A: Via Remix

1. In Remix, find the deployed MockUSDC contract
2. Expand the contract functions
3. Find the `mint` function
4. Enter parameters:
   - `to`: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
   - `amount`: `5000000000` (5000 USDC with 6 decimals)
5. Click "transact" and confirm in MetaMask

### Option B: Via mint-mock-usdc.html

1. Open `mint-mock-usdc.html` in browser
2. Click "Connect Wallet"
3. Enter treasury address: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
4. Enter amount: `5000`
5. Click "Mint MockUSDC"
6. Confirm transaction in MetaMask

## Step 3: Deploy TreasuryAutoRecharge Contract

### Via Remix IDE

1. **Create TreasuryAutoRecharge.sol**:
   - Copy from `contracts/TreasuryAutoRecharge.sol`
   - Note: This contract imports OpenZeppelin contracts
2. **Install Dependencies**:
   - In Remix, the imports will auto-resolve from GitHub
3. **Compile**:
   - Select Solidity Compiler 0.8.20+
   - Click "Compile TreasuryAutoRecharge.sol"
4. **Deploy**:
   - Constructor parameters:
     - `_usdc`: Your MockUSDC address
     - `_treasuryWallet`: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
   - Click "Deploy"
   - Confirm transaction
5. **Copy Address**: Save the TreasuryAutoRecharge contract address

### Update Configuration

Add to `.env`:
```
VITE_TREASURY_AUTO_RECHARGE_ADDRESS=0xYOUR_AUTO_RECHARGE_ADDRESS
```

## Step 4: Fund Auto-Recharge Contract

The TreasuryAutoRecharge contract needs USDC to perform auto-recharges.

### Via Remix

1. Use MockUSDC contract
2. Call `mint` function:
   - `to`: TreasuryAutoRecharge contract address
   - `amount`: `10000000000` (10000 USDC - enough for 2 recharges)
3. Confirm transaction

## Step 5: Test Auto-Recharge System

### Check Treasury Status

In Remix, using TreasuryAutoRecharge contract:

1. Call `getTreasuryStatus()`
2. Returns:
   - `needsRecharge`: boolean
   - `treasuryBalance`: current treasury USDC
   - `contractBalance`: auto-recharge contract USDC

### Trigger Manual Recharge (if needed)

1. Call `checkAndRecharge()`
2. This will:
   - Check if treasury < 1000 USDC
   - If yes, transfer 5000 USDC from contract to treasury
   - Emit `TreasuryRecharged` event

### Verify on Block Explorer

- Arc Testnet Explorer: https://testnet.arcscan.net
- Check treasury address: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
- Verify USDC balance increased

## Contract Addresses

After deployment, your addresses should look like:

```
MockUSDC: 0x...
TreasuryAutoRecharge: 0x...
Treasury Wallet: 0x43909cce967BE2a4448336a0ad95A99b7040BF05 (fixed)
```

## Automation Setup (Optional)

For automatic recharging, you can:

1. **Supabase Edge Function**:
   - Create a cron function that calls `checkAndRecharge()` periodically
   - Use the existing `monitor-treasury-balance` function as template

2. **Manual Monitoring**:
   - Periodically check treasury balance
   - Call `checkAndRecharge()` when needed

## Troubleshooting

### "Insufficient contract funds for recharge"
- Fund the TreasuryAutoRecharge contract with more USDC
- Use MockUSDC.mint() to add funds

### "Transfer failed"
- Ensure TreasuryAutoRecharge has enough USDC balance
- Check that MockUSDC contract is correct

### Transaction fails
- Verify you're on Arc Testnet (Chain ID: 1967)
- Check you have enough testnet tokens for gas
- Use Arc Testnet faucet if needed

## Next Steps

After successful deployment:
1. Update all frontend components with correct addresses
2. Test the vocabulary game → earn AIC → swap to USDC flow
3. Monitor treasury balance over time
4. Set up automated monitoring if desired
