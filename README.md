# 🎮 AIC Token Vocabulary Game - Arc Testnet Hackathon

## 🏆 AI Agents on Arc with USDC Hackathon Submission

**Play. Learn. Earn. Swap. Bridge.**

An AI-powered vocabulary game where players earn **AIC (AI Cognitive) tokens** with a programmatic 1:1 peg to USDC on Circle's Arc blockchain. Earnings can be swapped to USDC and bridged to any chain.

---

## 🚀 What is AIC Token?

**AIC (AI Cognitive Token)** is a blockchain-native reward token that:
- **Earned through gameplay**: Type blockchain vocabulary words correctly
- **AI-validated**: OpenAI validates accuracy, speed, and cognitive skill
- **Programmatically pegged to USDC**: Built-in AMM provides liquidity
- **Unlimited earning potential**: Vocabulary is unlimited, creating deep liquidity
- **Real market value**: Swap AIC → USDC → Any chain via Bridge Kit

---

## 🎯 Hackathon Innovation Tracks

### ✅ On-chain Actions (DeFi)
- Automated AIC minting upon game completion
- AMM-based swap mechanism (AIC/USDC)
- Real-time liquidity pool management

### ✅ Content Payments
- Pay-per-performance model for educational content
- AI validates learning outcomes
- Instant micropayments in AIC tokens

### ✅ Real-World Assets (RWA)
- AIC represents cognitive skill (real-world asset)
- Tokenized learning achievements
- Programmatic value transfer based on performance

---

## 🔥 Key Features

### 1. **AI-Powered Validation**
- OpenAI GPT-4 validates word submissions
- Analyzes accuracy, speed, and cognitive patterns
- Detects cheating and intentional errors
- Calculates fair rewards (100-500 AIC per word)

### 2. **Programmatic USDC Peg**
- Constant Product AMM (x * y = k)
- 0.3% swap fee
- 5% slippage protection
- Real-time price discovery

### 3. **Unlimited Liquidity**
- Vocabulary words are unlimited
- Continuous player engagement = constant AIC minting
- Deep liquidity pool forms naturally
- Market value established through gameplay volume

### 4. **Cross-Chain Integration**
- Swap AIC → USDC on Arc
- Bridge USDC to Ethereum, Base, Arbitrum, etc.
- Circle Bridge Kit integration
- CCTP for secure transfers

### 5. **Arc-Native Architecture**
- USDC as gas token (6 decimals)
- Sub-second finality
- Predictable, low fees
- Production-ready for mainnet

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER PLAYS GAME                         │
│                  Types Vocabulary Words                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI VALIDATION (OpenAI)                     │
│   • Accuracy Analysis   • Speed Check   • Cheat Detection  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              AIC TOKEN MINTING (On-Chain)                   │
│         ERC20 Contract → mintGameReward()                   │
│            Reward: 100-500 AIC tokens                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 AIC BALANCE IN WALLET                       │
│              View in MetaMask / Dashboard                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│             SWAP AIC → USDC (On-Chain AMM)                  │
│     AICSwap Contract → swapAICForUSDC()                     │
│          Programmatic 1:1 Peg Mechanism                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              USDC IN WALLET (Real Value!)                   │
│                  Ready for bridging                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│        BRIDGE TO OTHER CHAINS (Circle Bridge Kit)          │
│    Arc → Ethereum, Base, Arbitrum, Polygon, etc.           │
│              Use anywhere in DeFi!                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Smart Contracts

### AIC Token (ERC20)
**Location:** `contracts/AICToken.sol`

- **Standard:** ERC20 with minting capability
- **Decimals:** 6 (matches USDC on Arc)
- **Minting:** Authorized minters only (game validators)
- **Supply:** Initial 1M + unlimited game rewards
- **Burn:** Users can burn tokens

**Key Functions:**
```solidity
mintGameReward(address player, uint256 amount, string submissionId)
burn(uint256 amount)
addMinter(address minter)
```

### AIC Swap (AMM)
**Location:** `contracts/AICSwap.sol`

- **Model:** Constant Product (x * y = k)
- **Fee:** 0.3% per swap
- **Slippage:** Configurable (default 5%)
- **Liquidity:** Add/remove permissionlessly

**Key Functions:**
```solidity
swapAICForUSDC(uint256 aicIn, uint256 minUsdcOut)
swapUSDCForAIC(uint256 usdcIn, uint256 minAicOut)
addLiquidity(uint256 aicAmount, uint256 usdcAmount)
getAICPrice() // Current market price
```

---

## 🛠️ Tech Stack

### Blockchain
- **Arc Testnet** (Chain ID: 5042002)
- **Circle USDC** (Native gas + swap pair)
- **Viem** (Ethereum interactions)
- **OpenZeppelin** (Smart contract standards)

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** (Modern UI)
- **Lucide React** (Icons)

### Backend
- **Supabase** (Database + Auth)
- **Edge Functions** (Serverless validation)
- **OpenAI GPT-4** (AI validation)

### Integration
- **Circle Bridge Kit** (Cross-chain transfers)
- **MetaMask** (Wallet connection)
- **Arc Explorer** (Transaction verification)

---

## 📦 Setup Instructions

### 1. Clone & Install
```bash
git clone <your-repo>
cd <project>
npm install
```

### 2. Deploy Smart Contracts
See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions.

**Quick Deploy:**
1. Open [Remix IDE](https://remix.ethereum.org)
2. Deploy `AICToken.sol` to Arc Testnet
3. Deploy `AICSwap.sol` with token addresses
4. Add minter permission for backend
5. Add initial liquidity (AIC/USDC)

### 3. Update .env
```bash
# Add deployed contract addresses
VITE_AIC_TOKEN_ADDRESS=0x_YOUR_AIC_TOKEN_ADDRESS
VITE_AIC_SWAP_ADDRESS=0x_YOUR_SWAP_ADDRESS
VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

# Backend minter wallet
GAME_MINTER_PRIVATE_KEY=0x_YOUR_BACKEND_PRIVATE_KEY
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🎮 How to Play

### For Players:

1. **Connect Wallet**
   - Install MetaMask
   - Add Arc Testnet (Chain ID: 5042002)
   - Get testnet USDC: https://faucet.circle.com

2. **Play Game**
   - Read vocabulary word
   - Type it accurately
   - Get AI validation score
   - Earn AIC tokens (100-500 per word)

3. **Check Earnings**
   - View AIC balance in wallet
   - See total earned in dashboard
   - Track transaction history

4. **Swap to USDC**
   - Go to Swap tab
   - Enter AIC amount
   - Get quote with 0.3% fee
   - Confirm swap
   - Receive USDC instantly

5. **Bridge to Other Chains**
   - Go to Bridge tab
   - Select destination chain
   - Transfer USDC via CCTP
   - Use anywhere!

---

## 🧪 Testing on Arc Testnet

### Verify All Transactions:
**Arc Explorer:** https://testnet.arcscan.app

### Test Flow:
1. **Mint AIC Tokens** (play game)
   - Transaction: `mintGameReward()`
   - Verify on explorer
   - Check wallet balance

2. **Approve AIC for Swap**
   - Transaction: `approve(swapAddress, amount)`
   - Required before swap

3. **Swap AIC → USDC**
   - Transaction: `swapAICForUSDC()`
   - Check USDC received
   - Verify price accuracy

4. **Bridge USDC Cross-Chain**
   - Use Bridge Kit
   - CCTP transfer
   - Receive on destination chain

---

## 💡 Tokenomics: Why AIC Has Value

### The Liquidity Model

1. **Unlimited Supply from Gameplay**
   - Vocabulary words are infinite
   - Players continuously earn AIC
   - Constant minting = growing liquidity

2. **Programmatic Peg to USDC**
   - AMM maintains 1:1 price target
   - Arbitrage opportunities keep balance
   - Deep liquidity from high gameplay volume

3. **Market Value Discovery**
   - Price determined by supply/demand
   - Swap fees generate LP rewards
   - Self-sustaining ecosystem

4. **Real Utility**
   - Educational performance = real value
   - Cognitive skills tokenized
   - Transferable, tradeable, valuable

### Mainnet Economics (Future)
When Arc launches mainnet (2026):
- Deploy production AIC token
- Migrate liquidity pool
- Real USDC pairing
- **Players swap massive AIC earnings → Real USDC**
- Bridge to any chain
- Trade anywhere in DeFi

---

## 🔐 Security Features

- ✅ OpenZeppelin audited contracts
- ✅ ReentrancyGuard on all swaps
- ✅ Slippage protection
- ✅ Authorized minters only
- ✅ AI cheat detection
- ✅ RLS policies on database
- ✅ Edge function validation

---

## 📊 Database Schema

### Tables:
- **users**: Wallet addresses, total earnings
- **word_submissions**: Game results, AI scores
- **token_transactions**: All AIC mints/swaps
- **vocabulary_words**: Word bank with difficulty

---

## 🌐 Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel/Netlify/Cloudflare Pages

### Smart Contracts
- Use Remix IDE
- Deploy to Arc Testnet
- Verify on Arc Explorer

### Backend
- Supabase Edge Functions
- Auto-deployed on git push

---

## 🏆 Hackathon Demo Video

[Link to demo video showing full flow]

### What to Show Judges:
1. ✅ Play game, earn AIC tokens
2. ✅ AI validation in action
3. ✅ Check balance in MetaMask
4. ✅ Swap AIC → USDC
5. ✅ Verify ALL transactions on Arc Explorer
6. ✅ Bridge USDC to another chain
7. ✅ Show liquidity pool statistics

---

## 🔮 Future Roadmap

### Phase 1: Testnet (NOW)
- ✅ AIC token deployment
- ✅ Swap mechanism
- ✅ Game integration
- ✅ Bridge integration

### Phase 2: Mainnet (2026)
- Deploy to Arc Mainnet
- Real USDC liquidity
- Production economics
- Marketing push

### Phase 3: Expansion
- Multi-language support
- Mobile apps
- Educational partnerships
- DeFi integrations

### Phase 4: Ecosystem
- AIC lending/borrowing
- NFT achievements
- Leaderboards with stakes
- Tournament mode

---

## 🤝 Team

Built for Circle's AI Agents on Arc with USDC Hackathon

---

## 📜 License

MIT License - Built with Circle's Arc blockchain

---

## 🔗 Links

- **Arc Docs:** https://docs.arc.network
- **Arc Explorer:** https://testnet.arcscan.app
- **Circle Bridge Kit:** https://developers.circle.com/bridge-kit
- **USDC Faucet:** https://faucet.circle.com
- **Remix IDE:** https://remix.ethereum.org

---

## 📧 Support

Questions? Issues? Reach out:
- GitHub Issues
- Arc Discord
- Circle Developer Forum

---

## 🎉 Ready to WIN the Hackathon!

This project demonstrates:
✅ Real working prototype on Arc Testnet
✅ AI-powered payment system
✅ Programmatic USDC pegging
✅ Cross-chain functionality
✅ Production-ready architecture
✅ All transactions verifiable on-chain

**Let's build the future of AI + blockchain payments!** 🚀
