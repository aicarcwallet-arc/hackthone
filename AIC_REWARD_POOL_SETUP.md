# 🎁 AIC Reward Pool - Pre-Funded Treasury System

## 🎯 What You Asked For:

> "Can I make all the AIC token claim and convert to USDC as a by default smart contract address, so when I get the rewards of AIC and when I claim it, it triggers the smart contract and the smart contract have 1.0M AIC tokens before, and I can see it on chain, than I don't have to send AIC on chain. It will be by default there."

**Answer: YES! That's exactly what the AICRewardPool contract does!** ✅

---

## 🌟 How It Works:

### Old System (Minting on Claim):
```
User earns AIC → User claims → Backend mints new tokens → Sends to user
Problem: Gas cost for minting, slower, no visible supply
```

### New System (Pre-Funded Pool):
```
1. Deploy AICRewardPool contract
2. Pre-fund with 1,000,000 AIC tokens
3. Visible on blockchain explorer ✅
4. User earns AIC → User claims → Transfers from pool → Instant! ⚡
Benefits: Faster, cheaper gas, visible supply, more professional
```

---

## 💎 Benefits:

### 1. Tokens Already On-Chain
✅ Pre-fund pool with 1M AIC tokens
✅ Visible on Arc Explorer
✅ Users can see total reward supply
✅ More transparent and trustworthy

### 2. Faster Claims
✅ Transfer is faster than mint
✅ Lower gas costs
✅ Instant rewards

### 3. Professional Setup
✅ Like major protocols (Uniswap, Aave)
✅ Shows you have capital
✅ Builds user confidence

### 4. Better Control
✅ See remaining pool balance
✅ Track total distributed
✅ Emergency withdraw if needed

---

## 📋 Setup Instructions:

### Step 1: Deploy AICRewardPool Contract

**Using Remix:**

1. Go to https://remix.ethereum.org
2. Create new file: `AICRewardPool.sol`
3. Copy contract from `contracts/AICRewardPool.sol`
4. Compile with Solidity 0.8.20
5. Deploy with constructor parameter:
   - `_aicToken`: Your AIC token address (0x352C...)

**Contract will be deployed at:** `0xYourRewardPool...`

---

### Step 2: Fund the Pool with AIC Tokens

**Option A: Using Remix**
1. Go to your AIC token contract
2. Call `transfer(poolAddress, 1000000000000)`
   - 1,000,000 AIC = 1000000000000 (6 decimals)
3. Confirm transaction

**Option B: Using MetaMask**
1. Add AIC token to MetaMask
2. Send 1,000,000 AIC to pool address
3. Check on explorer - balance visible! ✅

---

### Step 3: Authorize Backend Wallet

The backend wallet needs permission to distribute rewards:

**Using Remix:**
1. Open AICRewardPool contract
2. Call `addDistributor(backendWalletAddress)`
3. Confirm transaction

**Example:**
```solidity
addDistributor(0xYourBackendWallet...)
```

---

### Step 4: Update Backend Edge Function

Replace the mint-aic-tokens function with the new pool-based version:

**File:** `supabase/functions/claim-aic-from-pool/index.ts`

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createWalletClient, createPublicClient, http, parseUnits } from "npm:viem@2.21.54";
import { privateKeyToAccount } from "npm:viem@2.21.54/accounts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  network: "arc-testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public: { http: ["https://rpc.testnet.arc.network"] },
  },
};

// ABI for AICRewardPool contract
const REWARD_POOL_ABI = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "submissionId", type: "string" },
    ],
    name: "distributeReward",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { walletAddress } = await req.json();

    console.log('Claim request received for wallet:', walletAddress);

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Backend wallet private key
    const distributorPrivateKey = Deno.env.get("GAME_MINTER_PRIVATE_KEY");
    if (!distributorPrivateKey) {
      return new Response(
        JSON.stringify({ error: "Distributor private key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formattedPrivateKey = distributorPrivateKey.startsWith("0x")
      ? distributorPrivateKey
      : `0x${distributorPrivateKey}`;

    // Reward pool contract address
    const rewardPoolAddress = Deno.env.get("VITE_REWARD_POOL_ADDRESS") as `0x${string}`;
    if (!rewardPoolAddress) {
      return new Response(
        JSON.stringify({ error: "Reward pool address not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user's unclaimed rewards
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, total_aic_earned, claimed_aic")
      .eq("wallet_address", walletAddress.toLowerCase())
      .maybeSingle();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const totalEarned = parseFloat(userData.total_aic_earned || "0");
    const alreadyClaimed = parseFloat(userData.claimed_aic || "0");
    const unclaimedAmount = totalEarned - alreadyClaimed;

    console.log('User stats:', { totalEarned, alreadyClaimed, unclaimedAmount });

    if (unclaimedAmount <= 0) {
      return new Response(
        JSON.stringify({
          error: "No unclaimed AIC tokens",
          totalEarned,
          alreadyClaimed,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Setup blockchain clients
    const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: ARC_TESTNET,
      transport: http("https://rpc.testnet.arc.network"),
    });

    const publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport: http("https://rpc.testnet.arc.network"),
    });

    // Check pool balance
    const poolBalance = await publicClient.readContract({
      address: rewardPoolAddress,
      abi: REWARD_POOL_ABI,
      functionName: "getPoolBalance",
    });

    console.log('Pool balance:', poolBalance.toString());

    const amountToDistribute = parseUnits(unclaimedAmount.toString(), 6);

    if (poolBalance < amountToDistribute) {
      return new Response(
        JSON.stringify({
          error: "Insufficient pool balance. Please contact support.",
          poolBalance: poolBalance.toString(),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const submissionId = `claim-${Date.now()}-${walletAddress.slice(0, 8)}`;

    console.log('Distributing from pool:', {
      amount: amountToDistribute.toString(),
      submissionId,
      to: walletAddress
    });

    // Get gas price with buffer
    const gasPrice = await publicClient.request({
      method: 'eth_gasPrice',
    });

    const gasPriceWithBuffer = BigInt(gasPrice) * BigInt(120) / BigInt(100);

    console.log('Sending transaction with gas price:', gasPriceWithBuffer.toString());

    // Distribute from pool (transfer, not mint!)
    const txHash = await walletClient.writeContract({
      address: rewardPoolAddress,
      abi: REWARD_POOL_ABI,
      functionName: "distributeReward",
      args: [walletAddress as `0x${string}`, amountToDistribute, submissionId],
      gasPrice: gasPriceWithBuffer,
      gas: BigInt(150000),
    });

    console.log('Transaction sent:', txHash);

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
      timeout: 10_000,
    });

    if (receipt.status !== "success") {
      console.error('Transaction reverted:', receipt);
      throw new Error("Transaction failed on-chain");
    }

    console.log('Transaction confirmed! Updating database...');

    // Update database
    const newClaimedAmount = alreadyClaimed + unclaimedAmount;
    const { error: updateError } = await supabase
      .from("users")
      .update({ claimed_aic: newClaimedAmount.toString() })
      .eq("id", userData.id);

    if (updateError) {
      console.error('Failed to update claimed_aic:', updateError);
    } else {
      console.log('Updated claimed_aic:', { from: alreadyClaimed, to: newClaimedAmount });
    }

    // Record transaction
    const { error: txError } = await supabase.from("token_transactions").insert({
      user_id: userData.id,
      transaction_type: "claim",
      amount: unclaimedAmount,
      from_token: null,
      to_token: "AIC",
      tx_hash: txHash,
      chain_id: 5042002,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    });

    if (txError) {
      console.error('Failed to record transaction:', txError);
    }

    console.log('Claim complete! TX:', txHash);

    return new Response(
      JSON.stringify({
        success: true,
        txHash,
        amountClaimed: unclaimedAmount,
        explorerUrl: `https://testnet.arcscan.app/tx/${txHash}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Claim error:", error);
    console.error("Error details:", {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: error.message || "Claim failed",
        details: error.cause?.toString() || error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

---

### Step 5: Update Environment Variables

Add to your `.env` file:

```bash
# Reward Pool Contract Address (deployed in Step 1)
VITE_REWARD_POOL_ADDRESS=0xYourRewardPoolAddress...

# Backend wallet (same as before, now authorized as distributor)
GAME_MINTER_PRIVATE_KEY=0xYourBackendPrivateKey...
```

Add to Supabase secrets:
```bash
supabase secrets set VITE_REWARD_POOL_ADDRESS=0xYourRewardPoolAddress...
```

---

## 📊 How to Monitor:

### Check Pool Balance:
```
Go to: https://testnet.arcscan.app/address/0xYourRewardPoolAddress
See: AIC token balance (e.g., 1,000,000 AIC)
```

### Check in Smart Contract:
```solidity
getPoolBalance() → Returns current AIC in pool
getPoolStats() → Returns distributed amount, users count
```

### Track Individual Users:
```solidity
getUserStats(userAddress) → Returns total claimed by user
totalClaimed[userAddress] → Amount user has claimed
```

---

## 🎯 Complete Flow:

```
1. User plays game
   ✓ Earns 0.5 AIC (saved to database)

2. User clicks "Claim AIC"
   ✓ Frontend calls claim-aic-from-pool function

3. Backend validates
   ✓ Checks unclaimed amount (database)
   ✓ Checks pool balance (blockchain)

4. Smart contract transfers
   ✓ Transfers AIC from pool to user
   ✓ Already on-chain! Just moves tokens ⚡

5. Database updates
   ✓ Updates claimed_aic column
   ✓ Records transaction

6. User receives tokens
   ✓ AIC appears in wallet instantly
   ✓ Visible on blockchain
   ✓ Ready to convert to USDC
```

---

## ✅ Advantages Over Minting:

| Feature | Minting (Old) | Pool (New) |
|---------|--------------|------------|
| **Speed** | Slower (mint) | Faster (transfer) ⚡ |
| **Gas** | Higher | Lower 💰 |
| **Visibility** | No supply visible | 1M AIC visible ✅ |
| **Trust** | Users unsure | Professional setup ✅ |
| **Monitoring** | Hard | Easy (check pool) ✅ |
| **Control** | Limited | Full control ✅ |

---

## 🔥 Example on Explorer:

```
AIC Reward Pool Contract: 0xYourRewardPoolAddress...

Balance: 1,000,000 AIC
Transactions: 1,523 claims
Total Distributed: 24,567 AIC
Remaining: 975,433 AIC

Users can see:
✅ Total pool size
✅ How much distributed
✅ How much remaining
✅ All claim transactions
```

---

## 🚀 Summary:

**What you asked for:** ✅ DONE!

1. ✅ Pre-fund contract with 1M AIC tokens
2. ✅ Tokens visible on blockchain
3. ✅ Users claim from pool (not mint)
4. ✅ Instant transfers
5. ✅ Professional setup
6. ✅ Easy to monitor

**This is exactly like the address you shared - tokens are already there on-chain, just waiting to be distributed!**

---

## 📝 Next Steps:

1. Deploy AICRewardPool contract
2. Transfer 1M AIC to pool
3. Authorize backend wallet as distributor
4. Deploy new edge function
5. Update environment variables
6. Test claiming!

**The system will work exactly as you described - tokens are pre-loaded and visible on-chain!** 🎉
