import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createWalletClient, http, createPublicClient } from "npm:viem@2.21.54";
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
    const { forceRefill = false } = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    const autoRechargeAddress = Deno.env.get("AUTO_RECHARGE_CONTRACT") as `0x${string}` | undefined;
    const operatorPrivateKey = Deno.env.get("OPERATOR_PRIVATE_KEY");

    if (!autoRechargeAddress) {
      return new Response(
        JSON.stringify({
          error: "Auto-recharge contract not configured",
          message: "Please deploy TreasuryAutoRecharge contract and set AUTO_RECHARGE_CONTRACT env variable",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!operatorPrivateKey) {
      return new Response(
        JSON.stringify({
          error: "Operator wallet not configured",
          message: "Please set OPERATOR_PRIVATE_KEY env variable to trigger auto-recharge",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const rpcUrl = Deno.env.get("ARC_TESTNET_RPC_URL") || "https://rpc.testnet.arc.network";

    const formattedPrivateKey = operatorPrivateKey.startsWith("0x")
      ? operatorPrivateKey
      : `0x${operatorPrivateKey}`;

    const publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport: http(rpcUrl),
    });

    const [needsRecharge, treasuryBalance, contractBalance] = await publicClient.readContract({
      address: autoRechargeAddress,
      abi: AUTO_RECHARGE_ABI,
      functionName: "getTreasuryStatus",
    });

    const response: any = {
      timestamp: new Date().toISOString(),
      autoRechargeContract: autoRechargeAddress,
      treasuryBalance: Number(treasuryBalance) / 1e6,
      contractBalance: Number(contractBalance) / 1e6,
      needsRecharge,
    };

    if (!needsRecharge && !forceRefill) {
      response.status = "healthy";
      response.message = "Treasury balance is sufficient. No recharge needed.";

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (forceRefill) {
      console.log("Force refill requested, triggering recharge regardless of balance...");
    }

    const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);

    const walletClient = createWalletClient({
      account,
      chain: ARC_TESTNET,
      transport: http(rpcUrl),
    });

    const txHash = await walletClient.writeContract({
      address: autoRechargeAddress,
      abi: AUTO_RECHARGE_ABI,
      functionName: "checkAndRecharge",
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    response.status = "recharged";
    response.message = "Treasury successfully recharged!";
    response.txHash = txHash;
    response.blockNumber = receipt.blockNumber.toString();
    response.explorerUrl = `https://testnet.arcscan.app/tx/${txHash}`;

    const [updatedNeedsRecharge, updatedTreasuryBalance, updatedContractBalance] =
      await publicClient.readContract({
        address: autoRechargeAddress,
        abi: AUTO_RECHARGE_ABI,
        functionName: "getTreasuryStatus",
      });

    response.updatedStatus = {
      treasuryBalance: Number(updatedTreasuryBalance) / 1e6,
      contractBalance: Number(updatedContractBalance) / 1e6,
      needsRecharge: updatedNeedsRecharge,
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Auto-fund treasury error:", error);

    let errorMessage = error.message || "Failed to auto-fund treasury";
    let statusCode = 500;

    if (error.message?.includes("Insufficient contract funds")) {
      errorMessage = "Auto-recharge contract has insufficient funds. Please deposit USDC to the contract.";
      statusCode = 400;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error.toString(),
        timestamp: new Date().toISOString(),
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});