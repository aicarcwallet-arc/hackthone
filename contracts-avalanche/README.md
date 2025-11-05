# 🏔️ Avalanche Mining Contracts

Personal mining vault smart contracts for the AIC vocabulary mining platform.

## 📜 Contracts

### AICToken.sol
Standard ERC20 token with 6 decimals, 1 billion supply, and owner minting capability.

### AICPersonalVault.sol
Personal mining contract that:
- Holds user's 100K AIC allocation
- Tracks mined vs locked tokens
- Allows user-controlled redemptions
- Emits transparent events

### AICVaultFactory.sol
Factory that creates and manages personal vaults:
- Creates new vaults with 100K AIC each
- Maintains AIC reserve
- Tracks all vaults
- Provides statistics

## 🔧 Compilation

### Using Remix (Recommended)

1. Go to https://remix.ethereum.org
2. Create new files for each contract
3. Install OpenZeppelin (GitHub import):
   ```solidity
   import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
   ```
4. Compile with:
   - Compiler: 0.8.20+
   - Optimization: 200 runs
   - EVM: Paris

### Using Hardhat

```bash
npm install
npx hardhat compile
```

## 🚀 Deployment Order

1. **AICToken** - No constructor args
2. **AICVaultFactory** - Constructor: `(aicTokenAddress)`

## 💰 Gas Estimates

- AICToken deployment: ~1.2M gas (~$10)
- VaultFactory deployment: ~2.5M gas (~$10)
- Create vault: ~250K gas (~$1)
- Fund factory: ~80K gas (~$0.50)
- Mine tokens: ~50K gas (~$0.25)
- Redeem tokens: ~60K gas (~$0.30)

## 🔍 Verification

Verify on Snowtrace using flattened source:

```bash
npx hardhat flatten contracts-avalanche/AICToken.sol > AICToken_flat.sol
# Upload to Snowtrace with compiler settings
```

## 🧪 Testing

### Test Vault Creation
```solidity
// After deployment
factory.fundFactory(10000000 * 10**6); // 10M AIC
factory.createVault(userAddress);
address vault = factory.getVault(userAddress);
```

### Test Mining
```solidity
AICPersonalVault vault = AICPersonalVault(vaultAddress);
vault.mineTokens(500000); // 0.5 AIC (6 decimals)
```

### Test Redemption
```solidity
// As user
vault.redeemTokens(1000000); // Redeem 1 AIC
```

## 📊 Events

### VaultCreated
```solidity
event VaultCreated(address indexed user, address vaultAddress, uint256 allocation);
```

### TokensMined
```solidity
event TokensMined(address indexed user, uint256 amount, uint256 totalMined);
```

### TokensRedeemed
```solidity
event TokensRedeemed(address indexed user, uint256 amount);
```

## 🔒 Security

- Owner-only functions protected by OpenZeppelin Ownable
- SafeERC20 for all token transfers
- Checks for sufficient balances
- Prevents double initialization
- No reentrancy risks

## 📝 ABIs

After compilation, ABIs available in:
- `artifacts/contracts-avalanche/` (Hardhat)
- Copy from Remix compiler panel

Export for frontend use.

## 🌐 Mainnet Addresses

After deployment, add to your frontend config:

```typescript
export const AVALANCHE_CONTRACTS = {
  aicToken: '0x...',
  vaultFactory: '0x...',
  chainId: 43114,
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  explorer: 'https://snowtrace.io'
};
```

## 🛠️ Integration

See `AVALANCHE_BUILD.md` for complete deployment and integration guide.
