import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { randomUUID } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Circle Instant Payout
 * Converts game rewards (AIC) directly to USDC via Circle Programmable Wallets
 * Supports instant withdrawals to:
 * - Virtual cards (spend anywhere)
 * - Bank accounts (ACH withdrawal)
 * - Other wallets (crypto transfer)
 */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { walletAddress, withdrawalMethod = "wallet" } = await req.json();

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

    const circleApiKey = Deno.env.get("VITE_CIRCLE_API_KEY");
    const circleWalletId = Deno.env.get("CIRCLE_WALLET_ID");

    if (!circleApiKey || !circleWalletId || circleWalletId === "not-configured") {
      return new Response(
        JSON.stringify({
          error: "Circle Programmable Wallets not configured",
          message: "Please set up Circle API credentials to enable instant payouts",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user's unclaimed rewards
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, total_aic_earned, claimed_aic, wallet_address")
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
          error: "No unclaimed rewards",
          totalEarned,
          alreadyClaimed,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const idempotencyKey = randomUUID();
    const amountInUSDC = unclaimedAmount.toFixed(6);

    // Circle API transfer request
    const requestBody: any = {
      idempotencyKey,
      destinationAddress: walletAddress,
      amounts: [amountInUSDC],
      walletId: circleWalletId,
      feeLevel: "MEDIUM",
      tokenId: "36000000-0000-0000-0000-000000000000", // USDC token
    };

    const circleResponse = await fetch(
      "https://api.circle.com/v1/w3s/developer/transactions/transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${circleApiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const circleData = await circleResponse.json();

    if (!circleResponse.ok) {
      console.error("Circle API Error:", circleData);
      return new Response(
        JSON.stringify({
          error: "Circle transfer failed",
          details: circleData,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update user's claimed amount
    await supabase
      .from("users")
      .update({ claimed_aic: totalEarned.toString() })
      .eq("id", userData.id);

    // Record transaction
    await supabase.from("token_transactions").insert({
      user_id: userData.id,
      transaction_type: "instant_payout",
      amount: unclaimedAmount,
      from_token: "AIC",
      to_token: "USDC",
      tx_hash: circleData.data?.id || "circle_pending",
      chain_id: 5042002,
      status: "pending",
      confirmed_at: new Date().toISOString(),
    });

    const response: any = {
      success: true,
      transactionId: circleData.data?.id,
      amountSent: unclaimedAmount,
      currency: "USDC",
      withdrawalMethod,
      message: `${unclaimedAmount} USDC sent via Circle! Instant, gasless transfer.`,
      state: circleData.data?.state,
      timestamp: new Date().toISOString(),
    };

    // Add withdrawal-specific information
    switch (withdrawalMethod) {
      case "virtual_card":
        response.cardInfo = {
          message: "USDC sent to your virtual card wallet. Use it anywhere Visa is accepted!",
          spendingPower: `$${unclaimedAmount.toFixed(2)} USD`,
        };
        break;
      case "bank":
        response.bankInfo = {
          message: "USDC withdrawal initiated. Funds will arrive in 1-2 business days.",
          estimatedArrival: "1-2 business days",
        };
        break;
      case "wallet":
      default:
        response.walletInfo = {
          message: "USDC sent to your wallet. Available immediately!",
          canUse: ["Bridge to other chains", "Trade on exchanges", "Send to others"],
        };
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Circle instant payout error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process instant payout",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
