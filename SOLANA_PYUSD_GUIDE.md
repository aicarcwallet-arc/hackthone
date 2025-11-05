# Solana + PYUSD + PayPal Integration Guide

Complete guide for the Solana-based AIC token system with PYUSD swap and PayPal cashout.

## Overview

This system allows users to:
1. **Earn AIC tokens** - Complete tasks (vocabulary games, watch ads, etc.)
2. **Swap to PYUSD** - Convert AIC tokens to PayPal USD on Solana
3. **Cash out** - Send PYUSD to PayPal wallet, then to debit card or bank

## Architecture

### Smart Contracts (Solana Programs)

```
┌─────────────────────────────────────────────────────────────┐
│                    Solana Blockchain                         │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ AIC Token    │───▶│ PYUSD Swap   │───▶│ Payout       │ │
│  │ (SPL Token)  │    │ Pool (AMM)   │    │ Manager      │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Circle API      │
                    │  (PYUSD Bridge)  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  PayPal Wallet   │
                    └──────────────────┘
```

### Key Components

#### 1. AIC Token (`src/lib/solana-aic-token.ts`)
- SPL token on Solana
- Controlled mint authority
- Used as reward currency

#### 2. PYUSD Swap Pool (`src/lib/solana-pyusd-swap.ts`)
- Automated Market Maker (AMM)
- Swaps AIC ↔ PYUSD
- Configurable fees (default 0.3%)
- Constant product formula: `x * y = k`

#### 3. PayPal Payout Manager (`src/lib/solana-paypal-payout.ts`)
- Integrates with Circle API
- Sends PYUSD to Circle wallets
- Tracks payout history in Supabase
- Validates user eligibility

## Setup Instructions

### 1. Install Dependencies

Already installed! The project includes:
- `@solana/web3.js` - Solana blockchain interaction
- `@solana/spl-token` - Token program
- `@solana/wallet-adapter-*` - Wallet integration
- `@coral-xyz/anchor` - Solana development framework

### 2. Deploy to Solana Devnet (FREE Testing)

```bash
npm run deploy-solana
```

This will:
1. Generate or load deployer keypair
2. Request devnet SOL airdrop (free)
3. Create AIC token
4. Mint initial supply
5. Initialize swap pool
6. Save deployment info

**Output:**
```
✅ AIC Token Created: [TOKEN_ADDRESS]
✅ Swap Pool Created
📝 Environment Variables:
   VITE_AIC_TOKEN_MINT=[YOUR_TOKEN]
   VITE_POOL_AUTHORITY=[YOUR_AUTHORITY]
```

### 3. Update Environment Variables

Add the generated addresses to `.env`:

```bash
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_AIC_TOKEN_MINT=[FROM_DEPLOYMENT]
VITE_POOL_AUTHORITY=[FROM_DEPLOYMENT]
```

### 4. Run the App

```bash
npm run dev
```

Then visit:
- Main app: `http://localhost:5173/`
- Solana app: `http://localhost:5173/solana.html`

## User Flow

### Step 1: Connect Wallet

Users connect their Solana wallet (Phantom, Solflare, etc.)

```typescript
// Automatically handled by @solana/wallet-adapter-react
<WalletMultiButton />
```

### Step 2: Earn AIC Tokens

Users complete tasks to earn AIC:

```typescript
// Example: Mint AIC tokens as reward
const aicToken = new AICSolanaToken();
await aicToken.mintTokens(
  aicMint,
  userPublicKey,
  authority,
  100 // 100 AIC tokens
);
```

### Step 3: Swap AIC for PYUSD

Users swap AIC tokens for PYUSD:

```typescript
const swapPool = new PYUSDSwapPool();
const result = await swapPool.swapAICForPYUSD(
  userKeypair,
  1000 // Swap 1000 AIC
);

console.log(`Received: ${result.pyusdReceived} PYUSD`);
```

**Pricing Formula:**
```
PYUSD_out = (AIC_in × (1 - fee)) × PYUSD_reserve / AIC_reserve
```

### Step 4: Cash Out to PayPal

Users send PYUSD to their PayPal wallet:

```typescript
const payoutManager = new SolanaPayPalPayoutManager();
const result = await payoutManager.processPayoutRequest({
  userId: userAddress,
  amount: 10, // 10 PYUSD
  destinationWalletId: circleWalletId,
  email: 'user@example.com'
});

// PYUSD appears in PayPal wallet instantly
```

### Step 5: PayPal to Bank/Card

Once PYUSD is in PayPal:
1. **Instant use**: Spend with PayPal debit card
2. **Transfer**: Move to bank account (1-3 days)
3. **Convert**: PayPal auto-converts PYUSD to USD

## Cost Analysis

### Devnet Testing (FREE)
```
SOL for deployment:     FREE (airdrop)
SOL for transactions:   FREE (airdrop)
PYUSD for testing:      Use devnet PYUSD
Total cost:             $0
```

### Mainnet Production

**One-time Deployment:**
```
Create AIC token:       ~0.5 SOL  ($70)
Deploy swap pool:       ~0.3 SOL  ($42)
Deploy payout system:   ~0.2 SOL  ($28)
Initialize pool:        ~0.1 SOL  ($14)
─────────────────────────────────────
Total:                  ~1.1 SOL  ($154)
```

**Per Transaction:**
```
Mint AIC:              ~$0.001
Swap AIC→PYUSD:        ~$0.007
Send PYUSD:            ~$0.001
─────────────────────────────────────
Total per user:        ~$0.01
```

**Liquidity Requirements:**

Option A - Small Scale:
```
1,000,000 AIC tokens (free to mint)
+ 10 PYUSD
= Support 1,000 users
```

Option B - Medium Scale:
```
10,000,000 AIC tokens (free to mint)
+ 100 PYUSD
= Support 10,000 users
```

## Revenue Model

### Self-Sustaining System

```
User completes task → Platform earns $1-5 (ads/sponsors)
Platform pays 1 PYUSD → User gets real money
Platform keeps profit → Reinvest in liquidity pool
```

**Example:**
```
100 users × $2 revenue = $200 earned
100 users × $1 payout = $100 paid
─────────────────────────────────────
Net profit: $100
```

Reinvest profit to grow pool and support more users!

## Technical Details

### Token Standards

**AIC Token:**
- Type: SPL Token (Solana's token standard)
- Decimals: 6
- Supply: Controlled by mint authority
- Transfers: Standard SPL token transfers

**PYUSD:**
- Type: SPL Token
- Decimals: 6
- Mainnet: `2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo`
- Devnet: `CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM`

### Swap Pool Mechanics

**Constant Product AMM:**
```
x × y = k

Where:
x = AIC reserve
y = PYUSD reserve
k = constant
```

**Price Calculation:**
```typescript
const aicPrice = pyusdReserve / aicReserve;
const pyusdPrice = aicReserve / pyusdReserve;
```

**With Fees:**
```typescript
const inputWithFee = inputAmount × (1 - feePercent/100);
const output = (inputWithFee × outputReserve) / (inputReserve + inputWithFee);
```

### Security Considerations

1. **Mint Authority**: Keep deployer keypair secure
2. **Pool Authority**: Controls liquidity, keep secure
3. **Rate Limiting**: Prevent spam/abuse
4. **Validation**: Check balances before operations
5. **Monitoring**: Track pool health and liquidity

## API Reference

### AICSolanaToken

```typescript
class AICSolanaToken {
  // Create new AIC token
  async createToken(payer: Keypair): Promise<{mint: PublicKey, authority: PublicKey}>

  // Mint tokens to user
  async mintTokens(mint: PublicKey, destination: PublicKey, authority: Keypair, amount: number): Promise<string>

  // Get user balance
  async getBalance(mint: PublicKey, owner: PublicKey): Promise<number>

  // Get token info
  async getTokenInfo(mint: PublicKey): Promise<TokenInfo>
}
```

### PYUSDSwapPool

```typescript
class PYUSDSwapPool {
  // Initialize pool with liquidity
  async initializePool(authority: Keypair, aicMint: PublicKey, initialAIC: number, initialPYUSD: number, fee: number): Promise<SwapPoolConfig>

  // Calculate swap output
  calculateAICToPYUSD(aicAmount: number): number
  calculatePYUSDToAIC(pyusdAmount: number): number

  // Execute swaps
  async swapAICForPYUSD(user: Keypair, aicAmount: number): Promise<{pyusdReceived: number, signature: string}>
  async swapPYUSDForAIC(user: Keypair, pyusdAmount: number): Promise<{aicReceived: number, signature: string}>

  // Get pool info
  getPoolInfo(): PoolInfo
}
```

### SolanaPayPalPayoutManager

```typescript
class SolanaPayPalPayoutManager {
  // Process payout request
  async processPayoutRequest(request: PayoutRequest): Promise<PayoutResult>

  // Batch multiple payouts
  async batchPayouts(requests: PayoutRequest[]): Promise<PayoutResult[]>

  // Get user payout history
  async getPayoutHistory(userId: string, limit: number): Promise<Payout[]>

  // Validate eligibility
  async validatePayoutEligibility(userId: string, amount: number): Promise<{eligible: boolean, reason?: string}>
}
```

## Troubleshooting

### "Insufficient SOL balance"
**Solution:** Request airdrop on devnet:
```bash
solana airdrop 2 [YOUR_ADDRESS] --url devnet
```

### "Pool not initialized"
**Solution:** Run deployment script:
```bash
npm run deploy-solana
```

### "Circle API error"
**Solution:** Check Circle credentials in `.env`:
```
VITE_CIRCLE_API_KEY=your_api_key
CIRCLE_ENTITY_SECRET=your_secret
```

### "Wallet not connected"
**Solution:** Install Phantom wallet extension and connect

## Next Steps

1. ✅ Deploy to devnet and test
2. ✅ Test full user flow
3. ⏳ Get real PYUSD for testing
4. ⏳ Apply for Circle production access
5. ⏳ Deploy to mainnet
6. ⏳ Launch with initial liquidity

## Resources

- [Solana Docs](https://docs.solana.com/)
- [SPL Token Guide](https://spl.solana.com/token)
- [Circle PYUSD](https://www.circle.com/en/usdc)
- [Phantom Wallet](https://phantom.app/)
- [Solana Devnet Faucet](https://solfaucet.com/)

## Support

Questions? Issues?
- Check the troubleshooting section
- Review the code examples
- Test on devnet first
- Reach out for help!
