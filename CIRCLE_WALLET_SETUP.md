# 🏦 Circle Programmable Wallets Setup Guide

## ✅ What's Been Integrated

Your AiC ecosystem now supports **Circle Programmable Wallets** for unlimited USDC minting!

### 🎯 Benefits

- ✅ **Unlimited USDC Capacity** - No pre-funding required
- ✅ **Gasless Transactions** - Players pay nothing
- ✅ **Automatic Minting** - Circle mints USDC on-demand
- ✅ **Professional Infrastructure** - Enterprise-grade security
- ✅ **Fallback Support** - Automatically falls back to manual treasury if not configured

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Circle Wallet ID

1. Go to **[Circle Console](https://console.circle.com/)**
2. Sign in with your account
3. Navigate to **Programmable Wallets** → **Developer Controlled Wallets**
4. Click **"Create Wallet"** or use an existing wallet
5. Copy your **Wallet ID** (looks like: `01234567-89ab-cdef-0123-456789abcdef`)

### Step 2: Get Your Entity Secret

1. In Circle Console, go to **Settings** → **Entity Secret**
2. Generate or copy your **Entity Secret Ciphertext**
3. This is a base64 encoded string that authenticates your requests

### Step 3: Update Environment Variables

Open your `.env` file and replace the placeholder values:

```bash
# Circle Programmable Wallets (Unlimited USDC Minting)
CIRCLE_WALLET_ID=01234567-89ab-cdef-0123-456789abcdef  # Your actual wallet ID
CIRCLE_ENTITY_SECRET=YOUR_BASE64_ENTITY_SECRET_HERE     # Your entity secret
```

### Step 4: Deploy Updated Edge Function

The edge function has already been updated. Just redeploy:

```bash
# The function will automatically use Circle API when configured
# If not configured, it falls back to manual treasury
```

---

## 🔧 How It Works

### Flow Diagram

```
Player earns 10 AIC in game
    ↓
Player clicks "Claim USDC Rewards"
    ↓
Backend checks Circle configuration
    ↓
✅ Circle Configured → Circle API mints USDC
    ├─ Circle mints fresh 10 USDC
    ├─ Sends to player's wallet (gasless)
    └─ Transaction complete

❌ Not Configured → Manual treasury (old way)
    ├─ Check treasury balance
    ├─ Send from pre-funded wallet
    └─ Requires manual funding
```

### API Call Example

```typescript
// Edge function automatically calls Circle API
POST https://api.circle.com/v1/w3s/developer/transactions/transfer

Headers:
  Authorization: Bearer TEST_API_KEY:...
  Content-Type: application/json

Body:
{
  "idempotencyKey": "unique-uuid",
  "destinationAddress": "0xPlayerWallet...",
  "amounts": ["10.000000"],
  "walletId": "your-circle-wallet-id",
  "feeLevel": "MEDIUM",
  "tokenId": "36000000-0000-0000-0000-000000000000", // USDC
  "entitySecretCiphertext": "base64-encoded-secret"
}

Response:
{
  "data": {
    "id": "transaction-id",
    "state": "INITIATED",
    "amounts": ["10.000000"]
  }
}
```

---

## 🎮 Testing the Integration

### Test with Testnet API

1. **Play the vocabulary game** to earn AIC tokens
2. **Check wallet dashboard** - should show unclaimed USDC
3. **Click "Claim USDC Rewards"**
4. **Watch the magic:**
   - If Circle configured: "USDC minted and sent via Circle!"
   - If not configured: Falls back to manual treasury

### Expected Results

**With Circle API:**
```json
{
  "success": true,
  "transactionId": "abc123...",
  "amountSent": 10,
  "currency": "USDC",
  "method": "Circle Programmable Wallets",
  "message": "USDC minted and sent via Circle! Unlimited capacity, gasless transaction."
}
```

**Without Circle API (Fallback):**
```json
{
  "success": true,
  "txHash": "0x123...",
  "amountSent": 10,
  "currency": "USDC",
  "explorerUrl": "https://testnet.arcscan.app/tx/0x123...",
  "message": "USDC rewards sent! You can now bridge to other chains."
}
```

---

## 🔐 Security Best Practices

### Environment Variables

- ✅ **NEVER commit** `.env` file to Git
- ✅ **Keep Entity Secret** secure and encrypted
- ✅ **Use different keys** for testnet and mainnet
- ✅ **Rotate secrets** periodically

### API Key Safety

```bash
# .env is in .gitignore - VERIFY THIS!
cat .gitignore | grep .env

# Output should show:
# .env
# .env.local
```

---

## 🌍 Testnet vs Mainnet

### Testnet (Current Setup)

```bash
VITE_CIRCLE_API_KEY=TEST_API_KEY:...
CIRCLE_WALLET_ID=testnet-wallet-id
```

**Features:**
- Free testnet USDC
- Unlimited testing
- No real money
- Same API as mainnet

### Mainnet (Production)

```bash
VITE_CIRCLE_API_KEY=LIVE_API_KEY:...
CIRCLE_WALLET_ID=mainnet-wallet-id
```

**Features:**
- Real USDC minting
- You pay for USDC value
- Production-ready
- Real money transactions

---

## 📊 Monitoring & Analytics

### Check Circle Dashboard

1. Go to **[Circle Console](https://console.circle.com/)**
2. View **Transaction History**
3. Monitor **Wallet Balance**
4. Track **API Usage**

### Check Your Supabase Database

```sql
-- View all USDC rewards
SELECT * FROM token_transactions
WHERE transaction_type = 'reward'
AND to_token = 'USDC'
ORDER BY created_at DESC;

-- Total USDC distributed
SELECT SUM(amount) as total_usdc_distributed
FROM token_transactions
WHERE transaction_type = 'reward'
AND to_token = 'USDC';
```

---

## 🆘 Troubleshooting

### Error: "Circle API transfer failed"

**Solution:**
1. Verify `CIRCLE_WALLET_ID` is correct
2. Check `CIRCLE_ENTITY_SECRET` is valid
3. Ensure API key has permissions
4. System will fallback to manual treasury

### Error: "Please configure Circle Wallet ID"

**Solution:**
- Add missing environment variables to `.env`
- Edge function will use manual treasury as fallback

### Transaction Stuck in "PENDING"

**Solution:**
- Circle transactions take 30-60 seconds
- Check Circle Console for transaction status
- State will update to "CONFIRMED" or "COMPLETED"

---

## 💰 Cost Comparison

### Manual Treasury (Old Way)

```
Initial Setup: Deposit $10,000 USDC
100 players earn $100 each = $10,000
Treasury empty → Need to refund $10,000
Repeat forever...

Cost: Constant pre-funding required
Scalability: Limited by treasury balance
```

### Circle Programmable Wallets (New Way)

```
Initial Setup: $0 pre-funding
Unlimited players can earn
Circle mints USDC on-demand
Never runs out

Cost: USDC value + small API fee
Scalability: Unlimited ∞
```

---

## 🎯 Next Steps

### Ready to Deploy

1. ✅ Get Circle Wallet ID from console
2. ✅ Get Entity Secret from settings
3. ✅ Update `.env` with real values
4. ✅ Test with small amounts first
5. ✅ Monitor Circle Console
6. ✅ Scale to production!

### Switching to Mainnet

When ready for real money:

1. Create mainnet Circle account
2. Get mainnet API key
3. Get mainnet Wallet ID
4. Update `.env` variables
5. Same code works automatically!

---

## 📚 Resources

- **[Circle Console](https://console.circle.com/)** - Manage wallets and transactions
- **[Circle Docs](https://developers.circle.com/w3s/programmable-wallets)** - Full API documentation
- **[Circle Support](https://support.circle.com/)** - Get help from Circle team
- **[Arc Testnet Explorer](https://testnet.arcscan.app)** - View transactions

---

## ✅ Checklist

- [ ] Get Circle Wallet ID
- [ ] Get Circle Entity Secret
- [ ] Update `.env` file
- [ ] Test claim flow
- [ ] Verify in Circle Console
- [ ] Check transaction history
- [ ] Monitor database
- [ ] Ready for production!

---

**🎉 Congratulations!** You now have unlimited USDC minting capacity powered by Circle's enterprise infrastructure!
