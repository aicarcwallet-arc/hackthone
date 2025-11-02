# 🚀 Arc Mainnet Migration Guide

## Overview

When Arc Mainnet launches, this guide will help you migrate from Arc Testnet to Arc Mainnet. The good news: **99% of your code stays the same!**

## What You Need to Do

### Step 1: Get Arc Mainnet Details

Wait for Arc to announce:
- ✅ Mainnet RPC URL (likely `https://rpc.arc.network`)
- ✅ Mainnet Chain ID (TBD)
- ✅ Mainnet USDC Contract Address
- ✅ Mainnet Block Explorer URL

### Step 2: Update Configuration Files

#### `src/config/chains.ts`
```typescript
// Add mainnet config
export const ARC_MAINNET = {
  id: 999999, // Replace with actual mainnet chain ID
  name: 'Arc Mainnet',
  network: 'arc-mainnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.arc.network'] },
    public: { http: ['https://rpc.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://arcscan.app' },
  },
};
```

#### `src/config/tokens.ts`
```typescript
// Update USDC address for mainnet
export const TOKENS = {
  USDC: {
    address: '0x...', // Replace with mainnet USDC address
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
};
```

#### `.env`
```bash
# Update all addresses for mainnet
VITE_ARC_CHAIN_ID=999999
VITE_ARC_RPC_URL=https://rpc.arc.network
VITE_USDC_ADDRESS=0x...
VITE_AIC_TOKEN_ADDRESS=0x...
VITE_AIC_SWAP_ADDRESS=0x...
```

### Step 3: Redeploy Smart Contracts

1. **Deploy to Arc Mainnet**:
```bash
# Update deploy script with mainnet RPC
npx hardhat run scripts/deploy-contracts.ts --network arc-mainnet
```

2. **Contracts to Deploy**:
   - ✅ AICToken.sol
   - ✅ AICSwap.sol
   - ✅ AICCollateralVault.sol
   - ✅ TreasuryFunder.sol
   - ✅ AICBurnPeg.sol

3. **Update Contract Addresses**:
   - Copy deployed addresses
   - Update `.env` file
   - Update `src/config/contracts.ts`

### Step 4: Update Edge Functions

#### `supabase/functions/mint-usdc-reward/index.ts`
```typescript
const ARC_MAINNET = {
  id: 999999, // Update with actual chain ID
  name: "Arc Mainnet",
  rpcUrls: {
    default: { http: ["https://rpc.arc.network"] },
  },
};

const usdcTokenAddress = "0x..."; // Update with mainnet USDC
```

Redeploy edge function:
```bash
# Edge function will auto-deploy on push
```

### Step 5: Update Database

No changes needed! Your Supabase database works the same:
- ✅ User profiles
- ✅ Game submissions
- ✅ Transaction history
- ✅ Token balances

### Step 6: Test Everything

1. **Connect to Mainnet**:
   - MetaMask → Add Network
   - Use mainnet chain ID and RPC
   - Get real USDC from Circle or exchange

2. **Test Core Features**:
   - ✅ Connect wallet
   - ✅ Play vocabulary game
   - ✅ Earn AIC tokens
   - ✅ Convert AIC to USDC
   - ✅ Bridge USDC to other chains
   - ✅ Fund treasury

3. **Verify Smart Contracts**:
   - Check on Arc Mainnet explorer
   - Verify source code
   - Test all functions

### Step 7: Update Frontend

#### App.tsx - Network Switch Logic
```typescript
const arcMainnetConfig = {
  chainId: '0xF4240', // Example - update with actual
  chainName: 'Arc Mainnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6
  },
  rpcUrls: ['https://rpc.arc.network'],
  blockExplorerUrls: ['https://arcscan.app']
};
```

### Step 8: Marketing Updates

Update all mentions of "testnet":
- ✅ Landing page copy
- ✅ FAQ section
- ✅ Documentation
- ✅ Social media
- ✅ README files

## Key Differences: Testnet vs Mainnet

| Feature | Testnet | Mainnet |
|---------|---------|---------|
| USDC Value | Fake ($0) | Real ($1) |
| Gas Costs | Free (faucet) | ~$0.007 per tx |
| Chain ID | 5042002 | TBD |
| RPC URL | rpc.testnet.arc.network | rpc.arc.network |
| Explorer | testnet.arcscan.app | arcscan.app |
| Risk | Zero | Real money |

## Advantages of Arc Mainnet

### 1. **Real Economic Value**
- Players earn real USDC
- Contributors fund real rewards
- Treasury has real value

### 2. **Better Liquidity**
- Bridge to any major chain
- Trade on DEXs
- Use in DeFi protocols

### 3. **Professional Credibility**
- Real blockchain, not testnet
- Audited smart contracts
- Production-grade infrastructure

### 4. **Circle Integration**
- Official USDC (not mock)
- Circle CCTP for bridging
- Circle Banking APIs
- Programmable Wallets

### 5. **Enterprise Ready**
- KYC/AML compliance possible
- Regulatory clarity
- Institutional adoption

## Migration Timeline

### Phase 1: Preparation (Before Mainnet Launch)
- ✅ Audit smart contracts
- ✅ Test all features thoroughly
- ✅ Prepare deployment scripts
- ✅ Update documentation

### Phase 2: Deployment (Mainnet Launch Day)
- ✅ Deploy contracts to mainnet
- ✅ Update configuration
- ✅ Redeploy edge functions
- ✅ Test critical paths

### Phase 3: Migration (First Week)
- ✅ Announce mainnet launch
- ✅ Guide users to mainnet
- ✅ Keep testnet running for testing
- ✅ Monitor for issues

### Phase 4: Production (Ongoing)
- ✅ Deprecate testnet gradually
- ✅ Scale mainnet infrastructure
- ✅ Add new features
- ✅ Grow user base

## Environment Variables Comparison

### Testnet (Current)
```bash
VITE_ARC_CHAIN_ID=5042002
VITE_ARC_RPC_URL=https://rpc.testnet.arc.network
VITE_USDC_ADDRESS=0x3600000000000000000000000000000000000000
```

### Mainnet (Future)
```bash
VITE_ARC_CHAIN_ID=999999
VITE_ARC_RPC_URL=https://rpc.arc.network
VITE_USDC_ADDRESS=0x... # Real USDC from Circle
```

## Risks and Mitigation

### Risk 1: Smart Contract Bugs
**Mitigation**: Audit before mainnet, start with small treasury

### Risk 2: User Error (Wrong Network)
**Mitigation**: Clear UI warnings, network detection

### Risk 3: Insufficient Treasury Funding
**Mitigation**: Public fund treasury page, transparency

### Risk 4: Gas Price Spikes
**Mitigation**: Arc's stable USDC gas makes this unlikely

## Post-Migration Checklist

- [ ] All contracts deployed and verified
- [ ] All configuration updated
- [ ] Edge functions redeployed
- [ ] Frontend tested on mainnet
- [ ] Users notified of migration
- [ ] Documentation updated
- [ ] Monitoring set up
- [ ] Support channels ready
- [ ] Marketing materials updated
- [ ] Treasury adequately funded

## Support During Migration

- **Technical Issues**: Check Arc Discord
- **Smart Contract**: Review on ArcScan
- **Edge Functions**: Check Supabase logs
- **Frontend**: Check browser console

## Future Enhancements (Mainnet Only)

1. **Circle Banking Integration**
   - Direct deposit from payroll
   - ACH withdrawals to bank
   - Wire transfers

2. **Institutional Features**
   - KYC/AML compliance
   - Large transaction support
   - Enterprise API

3. **DeFi Integration**
   - Yield farming with treasury USDC
   - Liquidity pools
   - Lending protocols

4. **NFT Rewards**
   - Achievement NFTs
   - Contributor badges
   - Premium features

## Summary

✅ **95% of code stays the same**
✅ **Same gasless experience**
✅ **Better with real USDC**
✅ **Easy migration path**

The beauty of building on Arc: **testnet and mainnet work identically**. When mainnet launches, you just update a few addresses and you're live!

---

**Ready for Arc Mainnet? Your app is! 🚀**
