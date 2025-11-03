import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createWalletClient, http, parseUnits, createPublicClient, encodeFunctionData } from "npm:viem@2.21.54";
import { privateKeyToAccount } from "npm:viem@2.21.54/accounts";
import { mainnet, base } from "npm:viem@2.21.54/chains";

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

// CCTP V2 Domain IDs
const DOMAIN_IDS = {
  ethereum: 0,
  base: 6,
  arcTestnet: 999, // Placeholder - check actual Arc domain ID
};

// CCTP V2 TokenMessengerV2 Contract ABI (depositForBurn)
const TOKEN_MESSENGER_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint32", name: "destinationDomain", type: "uint32" },
      { internalType: "bytes32", name: "mintRecipient", type: "bytes32" },
      { internalType: "address", name: "burnToken", type: "address" },
      { internalType: "uint32", name: "minFinalityThreshold", type: "uint32" },
      { internalType: "uint256", name: "maxFee", type: "uint256" },
      { internalType: "bytes", name: "hookData", type: "bytes" },
    ],
    name: "depositForBurn",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// USDC Token ABI
const USDC_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// CCTP V2 Contract Addresses (Base Sepolia for testing)
const CCTP_CONTRACTS = {
  baseSepolia: {
    tokenMessenger: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5" as `0x${string}`,
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
  },
  ethereum: {
    tokenMessenger: "0xBd3fa81B58Ba92a82136038B25aDec7066af3155" as `0x${string}`,
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
  },
};

/**
 * Convert Ethereum address to bytes32 format for CCTP
 */
function addressToBytes32(address: string): `0x${string}` {
  // Remove 0x prefix if present
  const cleanAddress = address.replace("0x", "");
  // Pad with zeros on the left to make it 64 characters (32 bytes)
  const paddedAddress = cleanAddress.padStart(64, "0");
  return `0x${paddedAddress}`;
}

/**
 * CCTP V2 Fast Transfer: Burn USDC on source chain
 * Returns transaction hash and nonce for tracking
 */
async function burnUSDCViaCCTP(
  sourceChain: "ethereum" | "baseSepolia",
  treasuryPrivateKey: string,
  recipientAddress: string,
  amount: number,
  userId: string
) {
  const chain = sourceChain === "ethereum" ? mainnet : base;
  const contracts = CCTP_CONTRACTS[sourceChain === "ethereum" ? "ethereum" : "baseSepolia"];

  const account = privateKeyToAccount(treasuryPrivateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
  });

  // 1. Check USDC balance
  const usdcBalance = await publicClient.readContract({
    address: contracts.usdc,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [account.address],
  });

  const amountInUnits = parseUnits(amount.toString(), 6);

  if (usdcBalance < amountInUnits) {
    throw new Error(
      `Insufficient USDC balance. Required: ${amount}, Available: ${Number(usdcBalance) / 1e6}`
    );
  }

  // 2. Approve TokenMessenger to spend USDC
  const approveTx = await walletClient.writeContract({
    address: contracts.usdc,
    abi: USDC_ABI,
    functionName: "approve",
    args: [contracts.tokenMessenger, amountInUnits],
  });

  console.log("Approval tx:", approveTx);

  // Wait for approval confirmation
  await publicClient.waitForTransactionReceipt({ hash: approveTx });

  // 3. Prepare hook data (encode user info)
  const hookData = new TextEncoder().encode(
    JSON.stringify({
      userId,
      gameReward: true,
      timestamp: Date.now(),
    })
  );

  // 4. Calculate maxFee (Fast Transfer fee: ~10 bps = 0.1%)
  const maxFee = (amountInUnits * BigInt(10)) / BigInt(10000); // 0.1% fee

  // 5. Execute depositForBurn (Fast Transfer: minFinalityThreshold = 1000)
  const burnTx = await walletClient.writeContract({
    address: contracts.tokenMessenger,
    abi: TOKEN_MESSENGER_ABI,
    functionName: "depositForBurn",
    args: [
      amountInUnits,
      DOMAIN_IDS.arcTestnet,
      addressToBytes32(recipientAddress),
      contracts.usdc,
      1000, // Fast Transfer threshold
      maxFee,
      `0x${Buffer.from(hookData).toString("hex")}`,
    ],
  });

  console.log("Burn tx:", burnTx);

  return {
    txHash: burnTx,
    sourceChain,
    destinationChain: "Arc Testnet",
    amount,
    fee: Number(maxFee) / 1e6,
  };
}

/**
 * Poll CCTP API for attestation
 */
async function getAttestation(txHash: string, maxRetries = 60) {
  const apiUrl = "https://iris-api-sandbox.circle.com"; // Use sandbox for testing

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${apiUrl}/v2/messages?txHash=${txHash}`);
      const data = await response.json();

      if (data.messages && data.messages.length > 0) {
        const message = data.messages[0];
        if (message.attestation) {
          return {
            attestation: message.attestation,
            messageBytes: message.message,
            nonce: message.nonce,
          };
        }
      }

      // Wait 2 seconds before retry (Fast Transfer should be ready in 8-20 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Attestation check ${i + 1} failed:`, error);
    }
  }

  throw new Error("Attestation timeout - CCTP message not attested after 2 minutes");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { walletAddress, sourceChain = "baseSepolia" } = await req.json();

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

    // Get treasury private key (should be for Ethereum/Base wallet with USDC)
    const treasuryPrivateKey = Deno.env.get("CCTP_TREASURY_PRIVATE_KEY") ||
                               Deno.env.get("GAME_MINTER_PRIVATE_KEY");

    if (!treasuryPrivateKey) {
      return new Response(
        JSON.stringify({ error: "CCTP treasury wallet not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formattedPrivateKey = treasuryPrivateKey.startsWith("0x")
      ? treasuryPrivateKey
      : `0x${treasuryPrivateKey}`;

    // Get user data
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

    if (unclaimedAmount <= 0) {
      return new Response(
        JSON.stringify({
          error: "No unclaimed USDC",
          totalEarned,
          alreadyClaimed,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: Burn USDC on source chain via CCTP V2
    console.log(`Burning ${unclaimedAmount} USDC on ${sourceChain}...`);
    const burnResult = await burnUSDCViaCCTP(
      sourceChain,
      formattedPrivateKey,
      walletAddress,
      unclaimedAmount,
      userData.id
    );

    console.log("Burn successful:", burnResult);

    // Step 2: Get attestation from Circle
    console.log("Waiting for CCTP attestation (8-20 seconds)...");
    const attestationData = await getAttestation(burnResult.txHash);

    console.log("Attestation received!");

    // Step 3: Record transaction (minting happens automatically via CCTP)
    await supabase
      .from("users")
      .update({ claimed_aic: totalEarned.toString() })
      .eq("id", userData.id);

    await supabase.from("token_transactions").insert({
      user_id: userData.id,
      transaction_type: "cctp_reward",
      amount: unclaimedAmount,
      from_token: "USDC",
      to_token: "USDC",
      tx_hash: burnResult.txHash,
      chain_id: sourceChain === "ethereum" ? 1 : 8453, // Ethereum or Base
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        method: "CCTP V2 Fast Transfer",
        burnTxHash: burnResult.txHash,
        sourceChain: burnResult.sourceChain,
        destinationChain: burnResult.destinationChain,
        amountSent: unclaimedAmount,
        fee: burnResult.fee,
        currency: "USDC",
        attestation: {
          nonce: attestationData.nonce,
          status: "attested",
          estimatedArrival: "8-20 seconds",
        },
        message: `USDC burned on ${sourceChain} and will arrive on Arc Testnet in 8-20 seconds via CCTP V2!`,
        explorerUrl: `https://testnet.arcscan.app/address/${walletAddress}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("CCTP reward error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process CCTP reward",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
