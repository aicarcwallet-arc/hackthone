# Complete MockUSDC Setup via Remix - Step by Step

## Overview
This guide shows you how to deploy MockUSDC on Arc Testnet using Remix IDE, fund the treasury with 5000 USDC, and set up automatic reward minting for users.

---

## STEP 1: Deploy MockUSDC Contract

### 1.1 Open Remix IDE
- Go to https://remix.ethereum.org
- Wait for Remix to load completely

### 1.2 Create MockUSDC Contract File
1. In the left sidebar, click the "File Explorer" icon (📁)
2. Click the "+" icon to create a new file
3. Name it: `MockUSDC.sol`
4. Copy and paste this code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockUSDC {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        // Mint 1 million USDC to deployer for testing
        _mint(msg.sender, 1000000 * 10**6);
    }

    function mint(address to, uint256 amount) public returns (bool) {
        _mint(to, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
```

### 1.3 Compile the Contract
1. Click the "Solidity Compiler" icon (📝) in the left sidebar
2. Set compiler version to **0.8.20** or higher
3. Click **"Compile MockUSDC.sol"** button
4. Wait for green checkmark - means compilation successful ✓

### 1.4 Connect MetaMask to Arc Testnet
1. Open MetaMask extension
2. Click network dropdown at top
3. If Arc Testnet isn't there, add it:
   - Click "Add Network" or "Custom RPC"
   - Network Name: `Arc Testnet`
   - RPC URL: `https://rpc-testnet.arcscan.net`
   - Chain ID: `1967`
   - Currency Symbol: `ARC`
   - Block Explorer: `https://testnet.arcscan.net`
4. Switch to Arc Testnet
5. Make sure you have testnet ARC tokens for gas (get from faucet if needed)

### 1.5 Deploy the Contract
1. Click "Deploy & Run Transactions" icon (🚀) in left sidebar
2. In ENVIRONMENT dropdown, select **"Injected Provider - MetaMask"**
3. Confirm MetaMask is connected to Arc Testnet (should show Chain ID 1967)
4. Under "CONTRACT" dropdown, select **MockUSDC**
5. Click orange **"Deploy"** button
6. MetaMask will pop up - click **"Confirm"** to sign transaction
7. Wait 5-10 seconds for transaction to confirm
8. Once deployed, you'll see the contract under "Deployed Contracts" section
9. **IMPORTANT: Copy the contract address!** It looks like: `0x1234...abcd`

### 1.6 Save the Contract Address
**Your MockUSDC Address:** `0x___________________` (write it down!)

---

## STEP 2: Mint 5000 USDC to Treasury Wallet

### Treasury Wallet Address
```
0x43909cce967BE2a4448336a0ad95A99b7040BF05
```

### 2.1 Use Remix to Mint
1. In Remix, under "Deployed Contracts", find your MockUSDC contract
2. Click the dropdown arrow to expand contract functions
3. Find the **`mint`** function (orange button)
4. Fill in the parameters:
   - **to (address):** `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
   - **amount (uint256):** `5000000000` (this is 5000 USDC with 6 decimals)
5. Click **"transact"** button
6. Confirm transaction in MetaMask
7. Wait for confirmation (5-10 seconds)

### 2.2 Verify Treasury Balance
1. In the same contract, find **`balanceOf`** function (blue button - it's a view function)
2. Enter treasury address: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
3. Click **"call"**
4. Should show: `5000000000` (= 5000 USDC)

**✓ Treasury now has 5000 USDC for user rewards!**

---

## STEP 3: Mint USDC Rewards to Users (When They Play)

### Option A: Manual Reward (For Testing)

**Test User Wallet:** Use your own wallet or test wallet

1. In Remix, use the **`mint`** function again
2. Parameters:
   - **to (address):** `[User's Wallet Address]`
   - **amount (uint256):** `100000000` (= 100 USDC reward)
3. Click **"transact"** → Confirm in MetaMask
4. User receives 100 USDC instantly!

### Option B: Automated Rewards (Production Setup)

**Using Supabase Edge Function (Already Built!)**

The edge function `mint-usdc-reward` can mint USDC automatically when users earn tokens.

**To enable automatic minting:**

1. Update your `.env` file:
```bash
VITE_MOCK_USDC_ADDRESS=0xYOUR_DEPLOYED_MOCKUSDC_ADDRESS
TREASURY_WALLET_PRIVATE_KEY=0xYOUR_TREASURY_PRIVATE_KEY
```

2. The edge function will mint USDC to users automatically when they:
   - Complete vocabulary words correctly
   - Earn AIC tokens
   - Request USDC conversion

---

## STEP 4: Add Minter Role (For Edge Function Automation)

### 4.1 Grant Minter Permission to Backend Wallet

**Backend Minter Wallet Address:**
```
0x5DC36C135485a81F72f4f965e306Fd69Cba4eE10
```

**Grant Permission:**
1. In Remix MockUSDC contract, you can simply use the `mint` function
2. Since MockUSDC allows anyone to call `mint()`, no additional permission needed!
3. The edge function can mint directly

**Alternative: Restrict Minting (More Secure)**

If you want to add access control, modify MockUSDC:

```solidity
address public owner;

constructor() {
    owner = msg.sender;
    _mint(msg.sender, 1000000 * 10**6);
}

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

function mint(address to, uint256 amount) public onlyOwner returns (bool) {
    _mint(to, amount);
    return true;
}

function transferOwnership(address newOwner) public onlyOwner {
    owner = newOwner;
}
```

Then transfer ownership to backend wallet or add it as authorized minter.

---

## STEP 5: Update Project Configuration

### 5.1 Update .env File

```bash
# Update this with your deployed MockUSDC address
VITE_MOCK_USDC_ADDRESS=0xYOUR_MOCKUSDC_ADDRESS_FROM_STEP_1

# Treasury wallet (already configured)
VITE_TREASURY_WALLET_ADDRESS=0x43909cce967BE2a4448336a0ad95A99b7040BF05
```

### 5.2 Update Supabase Edge Function Secrets

```bash
# If using Supabase for automated minting
npx supabase secrets set MOCK_USDC_ADDRESS=0xYOUR_MOCKUSDC_ADDRESS
npx supabase secrets set TREASURY_WALLET_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

---

## STEP 6: Test Complete Flow

### 6.1 Test User Earning Flow
1. User plays vocabulary game
2. User types word correctly
3. Backend validates with AI
4. **AIC tokens minted** to user's wallet (on-chain)
5. User can swap AIC → USDC anytime
6. **USDC minted** from treasury to user's wallet

### 6.2 Check Balances on Explorer
- Visit: https://testnet.arcscan.net
- Search for treasury address: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
- Search for your MockUSDC contract
- View all mint transactions and transfers

---

## STEP 7: Monitor Treasury Balance

### Check Treasury Balance in Remix
1. In MockUSDC contract, call `balanceOf`
2. Enter: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
3. Current balance shown in wei (divide by 1,000,000 for USDC amount)

### Refill Treasury When Low
1. Use `mint` function again
2. Mint more USDC to treasury address
3. Recommended: Keep treasury above 1000 USDC at all times

---

## Quick Reference Card

**MockUSDC Address:** `0x_______________` (fill in after deployment)

**Treasury Address:** `0x43909cce967BE2a4448336a0ad95A99b7040BF05`

**Arc Testnet RPC:** `https://rpc-testnet.arcscan.net`

**Chain ID:** `1967`

**Explorer:** `https://testnet.arcscan.net`

### Common Amounts (with 6 decimals):
- 1 USDC = `1000000`
- 10 USDC = `10000000`
- 100 USDC = `100000000`
- 1000 USDC = `1000000000`
- 5000 USDC = `5000000000`

### Important Functions:
- `mint(address to, uint256 amount)` - Create new USDC
- `balanceOf(address account)` - Check balance
- `transfer(address to, uint256 amount)` - Send USDC
- `approve(address spender, uint256 amount)` - Approve spending

---

## Troubleshooting

### "Transaction Failed" Error
- Make sure you have testnet ARC for gas
- Check you're on Arc Testnet (Chain ID 1967)
- Try increasing gas limit

### "Insufficient Balance" Error
- Check treasury has enough USDC minted
- Verify you're using correct treasury address

### Contract Not Showing in Remix
- Make sure you compiled successfully (green checkmark)
- Check ENVIRONMENT is "Injected Provider - MetaMask"
- Refresh Remix page if needed

### MetaMask Not Connecting
- Unlock MetaMask
- Switch to Arc Testnet manually
- Refresh browser page
- Check MetaMask is up to date

---

## Next Steps After Setup

1. **Test the Flow**: Play the vocabulary game and earn rewards
2. **Monitor Activity**: Watch transactions on Arc Explorer
3. **Scale Up**: Add more USDC to treasury as user base grows
4. **Mainnet Ready**: When ready, deploy real USDC contracts on Arc Mainnet
5. **Circle Integration**: Apply for Circle Mint for production USDC

---

## Need Help?

- Arc Testnet Faucet: Get testnet tokens for gas
- Arc Explorer: https://testnet.arcscan.net
- Remix Documentation: https://remix-ide.readthedocs.io
- MetaMask Support: https://support.metamask.io

**You're all set! Users can now earn real USDC rewards backed by treasury! 🎉**
