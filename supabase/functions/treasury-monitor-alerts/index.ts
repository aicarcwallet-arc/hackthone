import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TreasuryStatus {
  chain: string;
  balance: number;
  minBalance: number;
  needsRefill: boolean;
  alertLevel: 'critical' | 'warning' | 'normal';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // In production, fetch real balances from Arc and Linea treasury contracts
    // For now, returning example structure

    const arcTreasury: TreasuryStatus = {
      chain: 'Arc Mainnet',
      balance: 45, // ETH
      minBalance: 50,
      needsRefill: true,
      alertLevel: 'warning'
    };

    const lineaTreasury: TreasuryStatus = {
      chain: 'Linea Mainnet',
      balance: 25, // ETH
      minBalance: 30,
      needsRefill: true,
      alertLevel: 'critical'
    };

    // Determine overall status
    const criticalAlerts = [arcTreasury, lineaTreasury].filter(t => t.alertLevel === 'critical');
    const warningAlerts = [arcTreasury, lineaTreasury].filter(t => t.alertLevel === 'warning');

    // Send alerts if needed
    const alerts = [];

    if (criticalAlerts.length > 0) {
      alerts.push({
        severity: 'CRITICAL',
        message: `${criticalAlerts.length} treasury(ies) critically low`,
        treasuries: criticalAlerts.map(t => ({
          chain: t.chain,
          balance: t.balance,
          shortfall: t.minBalance - t.balance
        })),
        action: 'IMMEDIATE REFILL REQUIRED'
      });
    }

    if (warningAlerts.length > 0) {
      alerts.push({
        severity: 'WARNING',
        message: `${warningAlerts.length} treasury(ies) below minimum`,
        treasuries: warningAlerts.map(t => ({
          chain: t.chain,
          balance: t.balance,
          shortfall: t.minBalance - t.balance
        })),
        action: 'Refill recommended within 24 hours'
      });
    }

    // In production, send email/SMS/Discord notifications here
    if (alerts.length > 0) {
      console.log('TREASURY ALERTS:', JSON.stringify(alerts, null, 2));

      // Example: Send to Discord webhook
      // await fetch(DISCORD_WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: alerts.map(a => `**${a.severity}**: ${a.message}`).join('\n')
      //   })
      // });
    }

    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        arcTreasury,
        lineaTreasury,
        alerts,
        summary: {
          totalAlerts: alerts.length,
          criticalCount: criticalAlerts.length,
          warningCount: warningAlerts.length,
          status: criticalAlerts.length > 0 ? 'CRITICAL' : warningAlerts.length > 0 ? 'WARNING' : 'HEALTHY'
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Treasury monitor error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Treasury monitoring failed'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
