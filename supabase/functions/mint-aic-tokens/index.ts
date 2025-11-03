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

const AIC_TOKEN_ABI = [
  {
    inputs: [
      { internalType: "address", name: "player", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "submissionId", type: "string" },
    ],
    name: "mintGameReward",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
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

    console.log('Mint request received for wallet:', walletAddress);

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

    const minterPrivateKey = Deno.env.get("GAME_MINTER_PRIVATE_KEY");
    if (!minterPrivateKey) {
      return new Response(
        JSON.stringify({ error: "Minter private key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formattedPrivateKey = minterPrivateKey.startsWith("0x")
      ? minterPrivateKey
      : `0x${minterPrivateKey}`;

    const aicTokenAddress = Deno.env.get("VITE_AIC_TOKEN_ADDRESS") as `0x${string}`;
    if (!aicTokenAddress) {
      return new Response(
        JSON.stringify({ error: "AIC token address not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

    const amountToMint = parseUnits(unclaimedAmount.toString(), 6);
    const submissionId = `claim-${Date.now()}-${walletAddress.slice(0, 8)}`;

    console.log('Preparing to mint:', { amountToMint: amountToMint.toString(), submissionId, to: walletAddress });

    const gasPrice = await publicClient.request({
      method: 'eth_gasPrice',
    });

    const gasPriceWithBuffer = BigInt(gasPrice) * BigInt(120) / BigInt(100);

    console.log('Sending transaction with gas price:', gasPriceWithBuffer.toString());

    const txHash = await walletClient.writeContract({
      address: aicTokenAddress,
      abi: AIC_TOKEN_ABI,
      functionName: "mintGameReward",
      args: [walletAddress as `0x${string}`, amountToMint, submissionId],
      gasPrice: gasPriceWithBuffer,
      gas: BigInt(100000),
    });

    console.log('Transaction sent:', txHash);

    // Arc Network: Malachite BFT consensus provides deterministic finality
    // Transactions are final as soon as included in a block (sub-second)
    // Wait for 1 confirmation for absolute certainty
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1, // Arc blocks finalize in <1 second
      timeout: 10_000, // 10s timeout (generous for sub-second blocks)
    });

    if (receipt.status !== "success") {
      throw new Error("Transaction failed on-chain");
    }

    await supabase
      .from("users")
      .update({ claimed_aic: totalEarned.toString() })
      .eq("id", userData.id);

    await supabase.from("token_transactions").insert({
      user_id: userData.id,
      transaction_type: "mint",
      amount: unclaimedAmount,
      from_token: null,
      to_token: "AIC",
      tx_hash: txHash,
      chain_id: 5042002,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        txHash,
        amountMinted: unclaimedAmount,
        explorerUrl: `https://testnet.arcscan.com/tx/${txHash}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Mint error:", error);
    console.error("Error details:", {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: error.message || "Mint failed",
        details: error.cause?.toString() || error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});