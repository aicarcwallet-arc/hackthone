# Deploy Both Systems: MockUSDC + CCTP V2

This guide sets up both testing (MockUSDC) and production (CCTP V2) treasury systems.

---

## SYSTEM 1: MockUSDC (Testing - 5 minutes) ✅

### **When to Use:**
- Testing game mechanics
- Demo/hackathon presentations
- Local development
- No real money needed

### **Quick Deploy:**

#### 1. Get Arc Testnet Gas
- Go to: https://faucet.circle.com
- Select "Arc Testnet"
- Paste: `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`
- Get free testnet USDC

#### 2. Deploy MockUSDC via Remix
- Open: https://remix.ethereum.org
- Create file: `MockUSDC.sol`
- Copy contract from `contracts/MockUSDC.sol`
- Compile with Solidity 0.8.20+
- Deploy to Arc Testnet
- Add treasury as minter: `0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77`

#### 3. Update .env
```bash
VITE_MOCK_USDC_ADDRESS=0x...deployed_address...
```

#### 4. Mint Initial Treasury Supply
```javascript
// In Remix, call mint function:
mint(
  "0x0e8E0e9C8bb5E02F8c73e9f61CA66E56D1de8d77",
  "1000000000000" // 1M USDC (6 decimals)
)
```

**✅ Done! Your treasury now has unlimited test USDC.**

---

## SYSTEM 2: CCTP V2 (Production - 30 minutes) 🚀

### **When to Use:**
- Production deployment
- Real money transfers
- Cross-chain treasury
- Unlimited capacity

### **Prerequisites:**
- Base or Ethereum wallet with USDC
- Sufficient gas (ETH/native token)
- Supabase CLI installed

---

## CCTP V2 Setup Steps

### **Step 1: Fund Treasury Wallet**

#### For Testnet (Base Sepolia):
```bash
# 1. Get Base Sepolia ETH
https://www.alchemy.com/faucets/base-sepolia

# 2. Get Base Sepolia USDC
https://faucet.circle.com
Select: Base Sepolia
```

#### For Mainnet (Base):
```bash
# 1. Buy USDC on Base
# 2. Transfer to treasury wallet
# 3. Keep some ETH for gas
```

### **Step 2: Configure Environment**

Add to `.env`:

```bash
# CCTP V2 Treasury Wallet (Base or Ethereum)
CCTP_TREASURY_PRIVATE_KEY=0x...your_private_key...

# Source chain (baseSepolia for testing, ethereum or base for production)
CCTP_SOURCE_CHAIN=baseSepolia

# Circle API key (optional, for monitoring)
CIRCLE_API_KEY=your_api_key
```

### **Step 3: Set Supabase Secrets**

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref kujoudvjmhuypxyntrkm

# Set secrets
npx supabase secrets set CCTP_TREASURY_PRIVATE_KEY=0x...
npx supabase secrets set CCTP_SOURCE_CHAIN=baseSepolia
```

### **Step 4: Deploy CCTP Edge Function**

```bash
# Deploy the function
npx supabase functions deploy cctp-mint-reward

# Verify deployment
npx supabase functions list
```

### **Step 5: Update Frontend**

Create a component to use CCTP rewards:

```typescript
// src/components/ClaimCCTPReward.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function ClaimCCTPReward({ walletAddress }: { walletAddress: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const claimViaCCTP = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cctp-mint-reward', {
        body: {
          walletAddress,
          sourceChain: 'baseSepolia', // or 'ethereum' or 'base'
        },
      });

      if (error) throw error;
      setResult(data);
      console.log('CCTP Transfer:', data);
    } catch (err) {
      console.error('CCTP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={claimViaCCTP}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        {loading ? 'Processing CCTP Transfer...' : 'Claim via CCTP V2'}
      </button>

      {result && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold">Transfer Complete!</h3>
          <p>Amount: {result.amountSent} USDC</p>
          <p>Method: {result.method}</p>
          <p>Fee: {result.fee} USDC</p>
          <p>Status: USDC arriving in 8-20 seconds</p>
          <a
            href={`https://testnet.arcscan.app/tx/${result.burnTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Transaction
          </a>
        </div>
      )}
    </div>
  );
}
```

### **Step 6: Test CCTP Transfer**

1. **Claim a reward** via your game
2. **Click "Claim via CCTP V2"**
3. **Watch the logs:**
   ```
   Burning USDC on baseSepolia...
   Burn successful: 0x123...
   Waiting for attestation (8-20 seconds)...
   Attestation received!
   USDC minted on Arc Testnet!
   ```
4. **Check your wallet** - USDC should arrive in 8-20 seconds

### **Step 7: Monitor Transfers**

Check CCTP status:
```bash
# Get attestation status
curl "https://iris-api-sandbox.circle.com/v2/messages?txHash=0x..."

# Check Fast Transfer allowance
curl "https://iris-api-sandbox.circle.com/v2/fastBurn/USDC/allowance"
```

---

## Comparison: MockUSDC vs CCTP V2

| Feature | MockUSDC | CCTP V2 |
|---------|----------|---------|
| **Setup Time** | 5 minutes | 30 minutes |
| **Cost** | Free (testnet) | Gas fees + 0.1% |
| **Speed** | Instant | 8-20 seconds |
| **Capacity** | Unlimited (mint) | Based on treasury |
| **Use Case** | Testing/Demo | Production |
| **Cross-Chain** | ❌ No | ✅ Yes |
| **Real Money** | ❌ No | ✅ Yes |
| **Complexity** | Low | Medium |

---

## Production Strategy

### **Phase 1: Testing (NOW)**
```
Use MockUSDC on Arc Testnet
↓
Test game mechanics
↓
Demo to users/investors
```

### **Phase 2: Staging (NEXT)**
```
Deploy CCTP on Base Sepolia
↓
Test cross-chain transfers
↓
Verify attestations working
```

### **Phase 3: Production (LAUNCH)**
```
Fund treasury on Base Mainnet
↓
Deploy CCTP to production
↓
Switch frontend to CCTP
↓
Monitor transfers
```

---

## Troubleshooting

### MockUSDC Issues:
- **Can't deploy:** Check Arc Testnet gas
- **Mint fails:** Verify minter address
- **Transfer fails:** Check treasury balance

### CCTP Issues:
- **Attestation timeout:** Check Circle status
- **Insufficient balance:** Fund treasury wallet
- **Wrong domain:** Verify Arc domain ID with team

---

## Next Steps

1. ✅ Deploy MockUSDC (for testing NOW)
2. 🚀 Setup CCTP V2 (for production SOON)
3. 🎮 Test entire game flow
4. 📊 Monitor treasury balances
5. 🚢 Launch to production!

---

**You now have TWO treasury systems:**
- **MockUSDC**: Instant testing with unlimited supply
- **CCTP V2**: Production-ready cross-chain transfers

**Choose the right tool for the job!** 🎯
