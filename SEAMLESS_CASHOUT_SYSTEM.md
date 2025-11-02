# Seamless Cash-Out System

Your platform now has a complete seamless cash-out system that automatically handles everything from game rewards to real money withdrawals.

## Complete Flow

### 1. User Plays Game & Earns
- User answers vocabulary questions correctly
- Earns 10 AIC tokens per correct answer
- AIC tokens are tracked in Supabase database

### 2. Automatic Conversion to Real Money
- When user clicks "Get Your $XX USD Now!"
- System shows 3 withdrawal options:
  - **To Wallet (Instant)**: USDC sent to user's wallet
  - **Virtual Card (Spend Anywhere)**: Load money onto virtual Visa card
  - **Bank Account (1-2 days)**: Direct deposit to checking account

### 3. Behind the Scenes
- AIC tokens automatically convert to USDC at 1:1 ratio
- Treasury wallet automatically funded via Circle Programmable Wallets
- Zero gas fees for users (paid by system)
- Instant processing

## Treasury Auto-Recharge System

### Smart Contract: TreasuryAutoRecharge.sol
Located: `/contracts/TreasuryAutoRecharge.sol`

**Features:**
- Monitors treasury wallet balance 24/7
- Automatically recharges when balance drops below $1,000 USDC
- Recharges with $5,000 USDC each time
- Owner can update thresholds
- Emergency withdrawal function

**How it works:**
1. Contract holds a reserve of USDC
2. Keeper checks treasury balance regularly
3. If balance < minimum threshold, contract sends USDC
4. Treasury always has funds for user payouts

### Edge Functions

#### 1. monitor-treasury-balance
**Path:** `/supabase/functions/monitor-treasury-balance/index.ts`

**What it does:**
- Checks treasury wallet USDC balance
- Monitors Circle Programmable Wallet balance
- Returns health status (healthy, warning, critical)
- Can be called anytime to check status

**Usage:**
```bash
curl https://your-project.supabase.co/functions/v1/monitor-treasury-balance
```

#### 2. auto-fund-treasury
**Path:** `/supabase/functions/auto-fund-treasury/index.ts`

**What it does:**
- Automatically triggers when treasury is low
- Calls TreasuryAutoRecharge smart contract
- Recharges treasury with USDC
- Can be triggered by cron job every hour

**Usage:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auto-fund-treasury
```

**Set up cron job:**
```bash
# Add to Supabase cron jobs (Project Settings → Edge Functions → Cron)
# Run every hour
0 * * * * auto-fund-treasury
```

#### 3. circle-instant-payout
**Path:** `/supabase/functions/circle-instant-payout/index.ts`

**What it does:**
- Converts user's AIC rewards to USDC instantly
- Sends USDC via Circle Programmable Wallets
- Supports 3 withdrawal methods:
  - `wallet`: Send to user's crypto wallet
  - `virtual_card`: Load onto virtual Visa card
  - `bank`: ACH transfer to bank account

**Usage:**
```javascript
const response = await fetch(`${supabaseUrl}/functions/v1/circle-instant-payout`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${anonKey}`,
  },
  body: JSON.stringify({
    walletAddress: '0x...',
    withdrawalMethod: 'virtual_card' // or 'wallet' or 'bank'
  }),
});
```

## User Experience

### Step 1: Play Game
User sees their earnings in real-time:
- "You earned 50 AIC tokens = $50 USD"

### Step 2: Click Cash Out
Big green button: "Get Your $50 USD Now!"

### Step 3: Choose Method
Three clear options with icons:
1. **Wallet** - Instant crypto transfer
2. **Virtual Card** - Spend anywhere Visa accepted
3. **Bank** - Traditional bank deposit

### Step 4: Get Money
- Instant confirmation
- Transaction link (for wallet option)
- Clear success message
- Money available immediately (or 1-2 days for bank)

## Setup Requirements

### 1. Deploy Smart Contract
```bash
# Deploy TreasuryAutoRecharge contract to Arc Testnet
# Set environment variable:
AUTO_RECHARGE_CONTRACT=0x...
```

### 2. Fund Auto-Recharge Contract
```bash
# Send USDC to the contract for automatic recharging
# Recommended: $50,000 USDC for stable operations
```

### 3. Configure Environment Variables
Add to Supabase Secrets:
```
AUTO_RECHARGE_CONTRACT=0x... (contract address)
OPERATOR_PRIVATE_KEY=0x... (wallet to trigger recharges)
TREASURY_WALLET_ADDRESS=0x... (main treasury wallet)
```

### 4. Set Up Circle Programmable Wallets
1. Go to Circle Developer Dashboard
2. Create a Programmable Wallet
3. Get API Key, Wallet ID, and Entity Secret
4. Add to Supabase Secrets:
```
VITE_CIRCLE_API_KEY=your_api_key
CIRCLE_WALLET_ID=your_wallet_id
CIRCLE_ENTITY_SECRET=your_entity_secret
```

### 5. Enable Cron Jobs
In Supabase Dashboard:
- Go to Edge Functions → Cron
- Add job: `auto-fund-treasury`
- Schedule: Every hour (`0 * * * *`)

## Testing the Complete Flow

### Test 1: Play Game & Earn
1. Connect wallet
2. Play vocabulary game
3. Answer questions correctly
4. See AIC balance increase

### Test 2: Check Treasury Balance
```bash
curl https://your-project.supabase.co/functions/v1/monitor-treasury-balance
```

### Test 3: Cash Out to Wallet
1. Click "Get Your $XX USD Now!"
2. Select "To Wallet (Instant)"
3. Confirm transaction
4. Check wallet for USDC

### Test 4: Virtual Card Withdrawal
1. Click "Get Your $XX USD Now!"
2. Select "Virtual Card"
3. Money loads to virtual card
4. Use card online or in stores

### Test 5: Bank Withdrawal
1. Click "Get Your $XX USD Now!"
2. Select "Bank Account"
3. Enter bank details (if not saved)
4. Wait 1-2 business days
5. Check bank account

## Monitoring & Maintenance

### Check Treasury Health
```bash
# Returns: healthy, warning, or critical
curl https://your-project.supabase.co/functions/v1/monitor-treasury-balance
```

### Manually Trigger Recharge
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auto-fund-treasury
```

### Check User Payouts
Query Supabase:
```sql
SELECT * FROM token_transactions
WHERE transaction_type = 'instant_payout'
ORDER BY created_at DESC;
```

## Benefits

✅ **Zero friction** - Users get money in seconds
✅ **Multiple options** - Wallet, card, or bank
✅ **Automatic** - Treasury always funded
✅ **Gasless** - Users pay no fees
✅ **Scalable** - Powered by Circle (unlimited USDC)
✅ **Secure** - Smart contract controlled
✅ **Monitored** - Real-time balance tracking

## Next Steps

1. Deploy contracts to mainnet
2. Fund treasury with production USDC
3. Configure Circle production credentials
4. Enable cron jobs for automatic recharging
5. Test all withdrawal methods
6. Launch to users!

---

**Your users can now seamlessly convert game earnings to real money through wallet, virtual card, or bank transfer - all automatically managed by your system!**
