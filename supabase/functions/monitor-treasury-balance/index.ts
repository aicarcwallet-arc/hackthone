import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createPublicClient, http } from "npm:viem@2.21.54";

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
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const AUTO_RECHARGE_ABI = [
  {
    inputs: [],
    name: "checkAndRecharge",
    outputs: [{ internalType: "bool", name: "recharged", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getTreasuryStatus",
    outputs: [
      { internalType: "bool", name: "needsRecharge", type: "bool" },
      { internalType: "uint256", name: "treasuryBalance", type: "uint256" },
      { internalType: "uint256", name: "contractBalance", type: "uint256" },
    ],
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
    const rpcUrl = Deno.env.get("ARC_TESTNET_RPC_URL") || "https://rpc.testnet.arc.network";
    const usdcTokenAddress = "0x3600000000000000000000000000000000000000" as `0x${string}`;
    const treasuryAddress = Deno.env.get("TREASURY_WALLET_ADDRESS") as `0x${string}` | undefined;
    const autoRechargeAddress = Deno.env.get("AUTO_RECHARGE_CONTRACT") as `0x${string}` | undefined;

    if (!treasuryAddress) {
      return new Response(
        JSON.stringify({ error: "Treasury wallet address not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport: http(rpcUrl),
    });

    const treasuryBalance = await publicClient.readContract({
      address: usdcTokenAddress,
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [treasuryAddress],
    });

    const balanceInUSDC = Number(treasuryBalance) / 1e6;

    const response: any = {
      treasuryAddress,
      balance: balanceInUSDC,
      balanceWei: treasuryBalance.toString(),
      timestamp: new Date().toISOString(),
      status: "healthy",
    };

    // Check if auto-recharge contract is configured
    if (autoRechargeAddress) {
      try {
        const [needsRecharge, treasuryBal, contractBal] = await publicClient.readContract({
          address: autoRechargeAddress,
          abi: AUTO_RECHARGE_ABI,
          functionName: "getTreasuryStatus",
        });

        response.autoRecharge = {
          contractAddress: autoRechargeAddress,
          needsRecharge,
          treasuryBalance: Number(treasuryBal) / 1e6,
          contractBalance: Number(contractBal) / 1e6,
          status: needsRecharge ? "NEEDS_RECHARGE" : "OK",
        };

        if (needsRecharge) {
          response.status = "low_balance";
          response.alert = "Treasury balance is low and needs recharging";
        }
      } catch (error) {
        console.error("Auto-recharge check failed:", error);
        response.autoRecharge = {
          error: "Failed to check auto-recharge status",
        };
      }
    }

    // Add Circle Programmable Wallet balance check if configured
    const circleApiKey = Deno.env.get("VITE_CIRCLE_API_KEY");
    const circleWalletId = Deno.env.get("CIRCLE_WALLET_ID");

    if (circleApiKey && circleWalletId && circleWalletId !== "not-configured") {
      try {
        const circleResponse = await fetch(
          `https://api.circle.com/v1/w3s/wallets/${circleWalletId}/balances`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${circleApiKey}`,
            },
          }
        );

        if (circleResponse.ok) {
          const circleData = await circleResponse.json();
          response.circleProgrammableWallet = {
            walletId: circleWalletId,
            balances: circleData.data?.tokenBalances || [],
            status: "connected",
          };
        }
      } catch (error) {
        console.error("Circle balance check failed:", error);
        response.circleProgrammableWallet = {
          error: "Failed to fetch Circle wallet balance",
        };
      }
    }

    // Determine overall health status
    if (balanceInUSDC < 100) {
      response.status = "critical";
      response.alert = "Treasury balance critically low! Immediate action required.";
    } else if (balanceInUSDC < 1000) {
      response.status = "warning";
      response.alert = "Treasury balance is running low. Consider refilling soon.";
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Treasury monitoring error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to monitor treasury",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
