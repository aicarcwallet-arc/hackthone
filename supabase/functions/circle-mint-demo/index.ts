import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createWalletClient, http, parseUnits, createPublicClient } from "npm:viem@2.21.54";
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

const USDC_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { walletAddress } = await req.json();

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

    const treasuryPrivateKey = Deno.env.get("GAME_MINTER_PRIVATE_KEY");
    if (!treasuryPrivateKey) {
      return new Response(
        JSON.stringify({ error: "Treasury wallet not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formattedPrivateKey = treasuryPrivateKey.startsWith("0x")
      ? treasuryPrivateKey
      : `0x${treasuryPrivateKey}`;

    const rpcUrl = "https://rpc.testnet.arc.network";
    const usdcTokenAddress = "0x3600000000000000000000000000000000000000" as `0x${string}`;

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

    const publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport: http(rpcUrl),
    });

    const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);

    const treasuryBalance = await publicClient.readContract({
      address: usdcTokenAddress,
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [account.address],
    });

    const amountToSend = parseUnits(unclaimedAmount.toString(), 6);

    if (treasuryBalance < amountToSend) {
      return new Response(
        JSON.stringify({
          error: "Treasury needs funding",
          required: unclaimedAmount,
          available: Number(treasuryBalance) / 1e6,
          treasuryAddress: account.address,
          demoNote: "DEMO MODE: In production, Circle Programmable Wallets would mint unlimited USDC automatically. No pre-funding needed!",
          circleAdvantage: {
            currentSystem: "Limited by treasury balance",
            withCircle: "Unlimited USDC minting on-demand",
            benefit: "Never runs out, gasless for users"
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const walletClient = createWalletClient({
      account,
      chain: ARC_TESTNET,
      transport: http(rpcUrl),
    });

    const txHash = await walletClient.writeContract({
      address: usdcTokenAddress,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [walletAddress as `0x${string}`, amountToSend],
      gasPrice: parseUnits("7", 6),
    });

    await supabase
      .from("users")
      .update({ claimed_aic: totalEarned.toString() })
      .eq("id", userData.id);

    await supabase.from("token_transactions").insert({
      user_id: userData.id,
      transaction_type: "reward",
      amount: unclaimedAmount,
      from_token: null,
      to_token: "USDC",
      tx_hash: txHash,
      chain_id: 5042002,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        txHash,
        amountSent: unclaimedAmount,
        currency: "USDC",
        explorerUrl: `https://testnet.arcscan.app/tx/${txHash}`,
        message: "✅ DEMO SUCCESS! USDC sent on Arc Testnet!",
        demoMode: true,
        currentlyUsing: "Manual Treasury (Limited Balance)",
        withCircleAccess: {
          method: "Circle Programmable Wallets",
          capacity: "Unlimited USDC minting",
          gasless: true,
          preFunding: "None required",
          scalability: "Infinite users",
          advantage: "Circle mints fresh USDC on-demand for each reward"
        },
        treasuryInfo: {
          address: account.address,
          balanceAfter: Number(treasuryBalance - amountToSend) / 1e6,
          note: "With Circle API, this balance would be unlimited"
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Circle Demo Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Demo transaction failed",
        details: error.toString(),
        note: "This demo shows our working system. With Circle Programmable Wallets API access, we can provide unlimited USDC minting capacity.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});