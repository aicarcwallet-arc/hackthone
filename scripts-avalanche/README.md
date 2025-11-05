# 🏔️ Avalanche Deployment Scripts

TypeScript scripts for deploying and managing the mining vault system on Avalanche C-Chain.

## 📋 Prerequisites

1. **AVAX for gas** (~$20-30 worth)
2. **Private key** with AVAX balance
3. **Node.js** and TypeScript installed
4. **Compiled contracts** (use Remix)

## 🔧 Setup

### 1. Install Dependencies

```bash
cd /tmp/cc-agent/59424910/project
npm install
```

### 2. Configure Environment

```bash
cp .env.avalanche.example .env.avalanche
```

Edit `.env.avalanche`:
```env
AVALANCHE_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43114
```

## 🚀 Deployment Process

### Step 1: Deploy Contracts

**Note:** The current script requires compiled bytecode. Use Remix for now.

#### Using Remix (Recommended)

1. Go to https://remix.ethereum.org
2. Load all contracts from `contracts-avalanche/`
3. Compile with Solidity 0.8.20+
4. Connect to Avalanche via Injected Provider (MetaMask)
5. Deploy in order:
   - Deploy **AICToken** first
   - Copy AICToken address
   - Deploy **AICVaultFactory** with AICToken address
   - Save both addresses

#### Manual Script Usage (Future)

```bash
cd scripts-avalanche
AVALANCHE_PRIVATE_KEY=0x... tsx deploy-avalanche.ts
```

Outputs: `deployment-avalanche.json` with addresses

### Step 2: Fund Factory

Fund the factory with AIC tokens so it can create vaults:

```bash
tsx fund-factory.ts
```

This will:
- Approve factory to spend your AIC
- Transfer 10M AIC to factory
- Enable creation of 100 vaults (100K AIC each)

**Cost:** ~$1 AVAX gas

### Step 3: Create User Vaults

For each user, create their personal mining vault:

```bash
tsx create-vault.ts 0xUSER_WALLET_ADDRESS
```

This will:
- Create new AICPersonalVault contract
- Transfer 100K AIC to the vault
- Initialize vault for the user

**Cost:** ~$1 AVAX per vault

## 📊 Script Details

### deploy-avalanche.ts

Deploys all contracts to Avalanche mainnet.

**Usage:**
```bash
AVALANCHE_PRIVATE_KEY=0x... tsx deploy-avalanche.ts
```

**Output:**
```json
{
  "network": "Avalanche C-Chain",
  "chainId": 43114,
  "timestamp": "2025-11-05T...",
  "deployer": "0x...",
  "contracts": {
    "aicToken": "0x...",
    "vaultFactory": "0x..."
  },
  "transactions": {
    "aicToken": "0x...",
    "vaultFactory": "0x..."
  }
}
```

### fund-factory.ts

Funds factory with AIC tokens.

**Requirements:**
- `deployment-avalanche.json` must exist
- You must have AIC tokens
- Factory must be deployed

**Usage:**
```bash
tsx fund-factory.ts
```

**Default:** Funds with 10M AIC (100 vaults)

### create-vault.ts

Creates a personal mining vault for a user.

**Requirements:**
- `deployment-avalanche.json` must exist
- Factory must be funded with AIC
- User address must not already have vault

**Usage:**
```bash
tsx create-vault.ts 0xUSER_ADDRESS
```

**Checks:**
- If user already has vault, displays existing
- If not, creates new vault with 100K AIC

## 💰 Gas Costs

| Operation | Gas Used | Cost (AVAX) | Cost (USD) |
|-----------|----------|-------------|------------|
| Deploy AICToken | ~1.2M | ~0.03 | ~$10 |
| Deploy Factory | ~2.5M | ~0.05 | ~$10 |
| Fund Factory | ~80K | ~0.002 | ~$1 |
| Create Vault | ~250K | ~0.005 | ~$1 |

**Total Setup:** ~$22
**Per User:** ~$1

## 🔍 Verification

### Check Deployment

View on Snowtrace:
```
https://snowtrace.io/address/CONTRACT_ADDRESS
```

### Check Vault Status

```bash
tsx create-vault.ts 0xUSER_ADDRESS
```

Even if vault exists, script shows current status.

### Factory Statistics

Add to scripts:
```typescript
const stats = await publicClient.readContract({
  address: factoryAddress,
  abi: FACTORY_ABI,
  functionName: 'getFactoryStats'
});

console.log('Vaults Created:', stats[0].toString());
console.log('Vaults Remaining:', stats[3].toString());
```

## 🐛 Troubleshooting

### "Insufficient AVAX balance"
**Solution:** Get more AVAX. Need at least 0.1 AVAX for deployment.

### "deployment-avalanche.json not found"
**Solution:** Deploy contracts first using Remix, then manually create:
```json
{
  "contracts": {
    "aicToken": "0xYOUR_TOKEN_ADDRESS",
    "vaultFactory": "0xYOUR_FACTORY_ADDRESS"
  }
}
```

### "Insufficient factory balance"
**Solution:** Run `fund-factory.ts` to add more AIC.

### "Vault already exists"
**Solution:** User already has a vault. Get existing vault address:
```bash
tsx create-vault.ts 0xUSER_ADDRESS
# Shows existing vault address
```

### "Insufficient AIC balance"
**Solution:** You need AIC tokens. As deployer, you got 1B AIC from AICToken deployment.

## 📝 Manual Deployment (Remix)

### Complete Step-by-Step

1. **Prepare Contracts**
   ```
   Copy contracts from contracts-avalanche/ to Remix
   ```

2. **Compile**
   ```
   Compiler: 0.8.20
   Optimization: 200 runs
   EVM: Paris
   ```

3. **Connect Wallet**
   ```
   Environment: Injected Provider - MetaMask
   Network: Avalanche C-Chain (43114)
   ```

4. **Deploy AICToken**
   ```
   Contract: AICToken
   Constructor: (none)
   Click: Deploy
   Copy address: 0x...
   ```

5. **Deploy Factory**
   ```
   Contract: AICVaultFactory
   Constructor: AICToken address
   Click: Deploy
   Copy address: 0x...
   ```

6. **Create deployment-avalanche.json**
   ```json
   {
     "contracts": {
       "aicToken": "0xTOKEN_ADDRESS",
       "vaultFactory": "0xFACTORY_ADDRESS"
     }
   }
   ```
   Save in `scripts-avalanche/`

7. **Fund Factory**
   ```bash
   tsx fund-factory.ts
   ```

8. **Create Vaults**
   ```bash
   tsx create-vault.ts 0xUSER_ADDRESS
   ```

## 🎯 Production Checklist

- [ ] Deploy on Avalanche mainnet (not testnet!)
- [ ] Verify contracts on Snowtrace
- [ ] Fund factory with sufficient AIC
- [ ] Test create 1 vault
- [ ] Test mine tokens
- [ ] Test redeem tokens
- [ ] Test swap on Trader Joe
- [ ] Document contract addresses
- [ ] Add to frontend config
- [ ] Set up monitoring

## 🔗 Useful Links

- **Avalanche RPC:** https://api.avax.network/ext/bc/C/rpc
- **Snowtrace:** https://snowtrace.io/
- **Remix IDE:** https://remix.ethereum.org/
- **Trader Joe:** https://traderjoexyz.com/
- **Avalanche Card:** https://www.avalanchecard.com/

## 🆘 Support

For issues:
1. Check `AVALANCHE_BUILD.md` for full guide
2. Verify all prerequisites met
3. Check Snowtrace for transaction details
4. Review error messages carefully

## 🎉 Next Steps

After deployment:
1. Integrate with frontend
2. Add swap interface (Trader Joe)
3. Add Avalanche Card info
4. Launch to users!
