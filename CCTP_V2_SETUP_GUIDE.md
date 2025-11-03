# CCTP V2 Integration Guide

## What is CCTP V2?

Circle's **Cross-Chain Transfer Protocol V2** enables native USDC transfers across blockchains through a secure burn-and-mint mechanism. No wrapped tokens, no liquidity pools - just pure, native USDC teleported across chains.

## Why CCTP V2 for Treasury Funding?

### **Key Benefits:**

1. **Fast Transfer (8-20 seconds)** ⚡
   - Perfect for game rewards
   - Users get USDC almost instantly
   - Backed by Circle's Fast Transfer Allowance

2. **Native USDC** 🎯
   - No bridged/wrapped tokens
   - Same USDC everywhere
   - Full liquidity, zero fragmentation

3. **Programmable Hooks** 🔧
   - Attach custom logic to burns
   - Execute actions on destination
   - Track transactions automatically

4. **Low Fees** 💰
   - Fast Transfer: ~10 bps (0.1%)
   - Standard Transfer: 1 bps (0.01%)
   - No liquidity pool fees

## Architecture

```
┌──────────────────────────────────────────────────────┐
│   USER PLAYS VOCABULARY GAME & EARNS USDC           │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│   Edge Function: cctp-mint-reward                    │
│   • Calculate unclaimed rewards                      │
│   • Initiate CCTP V2 Fast Transfer                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│   STEP 1: Burn USDC on Source Chain                 │
│   (Treasury on Ethereum/Base)                        │
│   • depositForBurn() with Fast Transfer              │
│   • minFinalityThreshold = 1000                      │
│   • Hook data: {userId, gameReward, timestamp}       │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│   STEP 2: Circle Attestation Service                │
│   • Observes burn event                              │
│   • Issues signed attestation (8-20 sec)             │
│   • Backed by Fast Transfer Allowance                │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│   STEP 3: Mint USDC on Arc Testnet                  │
│   • receiveMessage() with attestation                │
│   • USDC arrives in user wallet                      │
│   • Hook executes: record transaction                │
└──────────────────────────────────────────────────────┘
```

## Setup Instructions

### **1. Treasury Wallet Setup**

You need a wallet with USDC on **Ethereum** or **Base** (recommended for lower fees).

**Testnet (for testing):**
- Get Base Sepolia ETH: https://www.alchemy.com/faucets/base-sepolia
- Get Base Sepolia USDC: https://faucet.circle.com

**Mainnet (production):**
- Fund wallet with real USDC on Base or Ethereum
- Ensure sufficient ETH/native gas for transactions

### **2. Configure Environment Variables**

Add to your `.env` file:

```bash
# CCTP V2 Treasury Wallet (Ethereum or Base)
CCTP_TREASURY_PRIVATE_KEY=0x...your_private_key_here...

# Source chain for CCTP burns (ethereum or baseSepolia)
CCTP_SOURCE_CHAIN=baseSepolia

# Circle API for attestation monitoring (optional)
CIRCLE_API_KEY=your_circle_api_key
```

### **3. Deploy CCTP Edge Function**

```bash
# Deploy the CCTP reward function
supabase functions deploy cctp-mint-reward
```

### **4. Update Frontend to Use CCTP**

Modify your reward claim component to call the CCTP function:

```typescript
const claimRewards = async () => {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/cctp-mint-reward`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: userWallet,
        sourceChain: "baseSepolia", // or "ethereum"
      }),
    }
  );

  const result = await response.json();
  console.log(result);
};
```

## How It Works

### **Fast Transfer Flow:**

1. **User Claims Reward**
   - Frontend calls `cctp-mint-reward` edge function
   - Unclaimed USDC calculated from database

2. **Burn on Source Chain**
   - Edge function approves TokenMessengerV2
   - Calls `depositForBurn()` with:
     - Amount to send
     - Destination domain (Arc Testnet)
     - Recipient address (user wallet)
     - minFinalityThreshold = 1000 (Fast Transfer)
     - maxFee = 0.1% (covers Fast Transfer fee)
     - Hook data (user info for tracking)

3. **Attestation (8-20 seconds)**
   - Circle's Attestation Service observes burn
   - Issues signed attestation at soft finality
   - Fast Transfer Allowance backs the burn

4. **Mint on Destination**
   - CCTP automatically mints USDC on Arc Testnet
   - User receives native USDC
   - Hook data available for tracking

5. **Database Update**
   - Transaction recorded in Supabase
   - User's claimed balance updated

## CCTP V2 Contracts

### **Testnet (Base Sepolia → Arc Testnet)**

```
Base Sepolia:
- TokenMessengerV2: 0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5
- USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### **Mainnet (Base → Arc Mainnet)**

```
Base:
- TokenMessengerV2: [Get from Circle docs]
- USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## Domain IDs

CCTP uses domain IDs to identify chains:

```
Ethereum: 0
Base: 6
Arc Testnet: [TBD - check with Arc team]
```

## Fees

### **Fast Transfer:**
- Fee: ~10 bps (0.1%)
- Speed: 8-20 seconds
- Best for: User rewards, instant transfers

### **Standard Transfer:**
- Fee: 1 bps (0.01%)
- Speed: 13-19 minutes
- Best for: Treasury operations, bulk transfers

## Monitoring & APIs

### **Check Attestation Status:**

```bash
curl https://iris-api-sandbox.circle.com/v2/messages?txHash=0x...
```

### **Check Fast Transfer Allowance:**

```bash
curl https://iris-api-sandbox.circle.com/v2/fastBurn/USDC/allowance
```

### **Get Fee Information:**

```bash
curl https://iris-api-sandbox.circle.com/v2/burn/USDC/fees?source=6&destination=999
```

## Testing Checklist

- [ ] Treasury wallet funded with testnet USDC
- [ ] CCTP edge function deployed
- [ ] Environment variables configured
- [ ] Test burn transaction successful
- [ ] Attestation received within 20 seconds
- [ ] USDC minted on Arc Testnet
- [ ] Database updated correctly
- [ ] User balance reflects reward

## Production Readiness

### **Before Going Live:**

1. **Fund Production Treasury**
   - Transfer real USDC to treasury wallet on Base
   - Ensure sufficient gas (ETH) for transactions

2. **Update Domain IDs**
   - Confirm Arc Mainnet domain ID with Arc team
   - Update edge function configuration

3. **Security Review**
   - Audit treasury wallet security
   - Implement rate limiting
   - Add monitoring/alerts

4. **Compliance**
   - Ensure USDC usage complies with Circle TOS
   - Implement necessary KYC/AML if required

## Advantages Over Traditional Bridging

| Feature | CCTP V2 | Lock-and-Mint Bridges | Liquidity Pools |
|---------|---------|----------------------|-----------------|
| **Speed** | 8-20 sec (Fast) | Minutes to hours | Fast but risky |
| **Fees** | 0.1% | 0.1-1% | 0.3-1% |
| **Security** | Circle-backed | Third-party | Pool attacks |
| **Liquidity** | Unlimited | Limited by locks | Limited by pools |
| **USDC Type** | Native | Wrapped/synthetic | Native |
| **Trust** | Circle | Bridge operators | Pool operators |

## Resources

- [CCTP V2 Docs](https://developers.circle.com/cctp)
- [CCTP V2 White Paper](https://github.com/circlefin/evm-cctp-contracts/blob/master/whitepaper/CCTPV2_White_Paper.pdf)
- [Circle API Reference](https://developers.circle.com/cctp/reference)
- [CCTP GitHub](https://github.com/circlefin/evm-cctp-contracts)

## Support

- Circle Developer Discord: [Join](https://discord.gg/buildoncircle)
- Circle Support: https://support.circle.com
- CCTP Status: https://status.circle.com

---

**Built with CCTP V2 for secure, fast, native USDC transfers** 🚀
