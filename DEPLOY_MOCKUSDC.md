# Deploy MockUSDC for Testing

Since Arc Testnet's native USDC requires external funding, we'll deploy a MockUSDC contract for unlimited testing.

## Quick Deploy Steps

### Option 1: Remix IDE (Easiest - 5 minutes)

1. **Open Remix**
   - Go to https://remix.ethereum.org

2. **Create File**
   - Create new file: `MockUSDC.sol`
   - Copy content from `contracts/MockUSDC.sol`

3. **Compile**
   - Click "Solidity Compiler" tab
   - Select version: 0.8.20+
   - Click "Compile MockUSDC.sol"

4. **Configure Network**
   - Open MetaMask
   - Add Arc Testnet:
     - Network Name: Arc Testnet
     - RPC: https://rpc.testnet.arc.network
     - Chain ID: 5042002
     - Currency: USDC (6 decimals)
     - Explorer: https://testnet.arcscan.app

5. **Deploy**
   - Click "Deploy & Run" tab
   - Environment: "Injected Provider - MetaMask"
   - Ensure Arc Testnet is selected in MetaMask
   - Click "Deploy"
   - Confirm transaction in MetaMask

6. **Mint to Treasury**
   - After deployment, find deployed contract
   - Call `mint` function:
     - `to`: `0x43909cce967BE2a4448336a0ad95A99b7040BF05`
     - `amount`: `5000000000` (5000 USDC)
   - Confirm transaction

7. **Update .env**
   ```bash
   VITE_USDC_ADDRESS=<your_mockusdc_address>
   ```

8. **Restart App**
   ```bash
   npm run dev
   ```

### Option 2: Foundry (For Developers)

```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy MockUSDC
forge create contracts/MockUSDC.sol:MockUSDC \
  --rpc-url https://rpc.testnet.arc.network \
  --private-key $GAME_MINTER_PRIVATE_KEY

# Mint to treasury
cast send <MOCKUSDC_ADDRESS> \
  "mint(address,uint256)" \
  0x43909cce967BE2a4448336a0ad95A99b7040BF05 \
  5000000000 \
  --rpc-url https://rpc.testnet.arc.network \
  --private-key $GAME_MINTER_PRIVATE_KEY
```

## Contract Addresses

**Treasury Wallet:** `0x43909cce967BE2a4448336a0ad95A99b7040BF05`

**After Deployment:**
- MockUSDC: `<paste_your_address_here>`
- Balance: 5000 USDC

## Verification

```bash
# Check treasury balance
cast call <MOCKUSDC_ADDRESS> \
  "balanceOf(address)(uint256)" \
  0x43909cce967BE2a4448336a0ad95A99b7040BF05 \
  --rpc-url https://rpc.testnet.arc.network

# Expected output: 5000000000 (5000 USDC)
```

## Why MockUSDC?

1. **Unlimited Testing**: Mint as much as needed
2. **No Faucet Limits**: Not dependent on Circle faucet
3. **Full Control**: Same interface as real USDC
4. **Easy Reset**: Deploy new contract anytime

## Update AIC Swap Contract

After deploying MockUSDC, update your AIC Swap contract:

```solidity
// When deploying AICSwap, use MockUSDC address
constructor(
    address _aicToken,
    address _mockUsdc  // Your new MockUSDC address
)
```

## Mobile Testing

1. Deploy MockUSDC
2. Fund treasury with 5000 USDC
3. Test on mobile:
   - Connect wallet
   - Play game
   - Earn AiC tokens
   - Claim tokens
   - Swap to USDC
   - Check balance

All should work instantly with your new MockUSDC!
