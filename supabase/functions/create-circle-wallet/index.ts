import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { apiKey, entitySecret } = await req.json();

    if (!apiKey || !entitySecret) {
      throw new Error("Missing apiKey or entitySecret");
    }

    const walletSetId = 'wallet-set-' + Date.now();
    const idempotencyKey = 'idem-' + Date.now();

    const walletResponse = await fetch('https://api.circle.com/v1/w3s/developer/wallets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-User-Token': entitySecret
      },
      body: JSON.stringify({
        idempotencyKey,
        accountType: 'SCA',
        blockchains: ['ETH-SEPOLIA'],
        count: 1,
        walletSetId
      })
    });

    const walletData = await walletResponse.json();

    if (!walletResponse.ok) {
      throw new Error('Wallet creation failed: ' + JSON.stringify(walletData));
    }

    const walletId = walletData.data?.wallets?.[0]?.id;
    const address = walletData.data?.wallets?.[0]?.address;

    if (!walletId) {
      throw new Error('No wallet ID in response');
    }

    return new Response(
      JSON.stringify({
        success: true,
        walletId,
        address
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});