import { Keypair, Connection, PublicKey, Transaction } from 'npm:@solana/web3.js@1.98.4';
import {
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from 'npm:@solana/spl-token@0.4.14';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userWallet } = await req.json();

    if (!userWallet) {
      return new Response(
        JSON.stringify({ error: 'User wallet address required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const connection = new Connection(
      'https://api.devnet.solana.com',
      'confirmed'
    );

    const deployerSecretKey = JSON.parse(Deno.env.get('SOLANA_DEPLOYER_SECRET_KEY') || '[]');
    if (!deployerSecretKey.length) {
      throw new Error('Deployer key not configured');
    }

    const deployerKeypair = Keypair.fromSecretKey(new Uint8Array(deployerSecretKey));
    const aicMintAddress = new PublicKey(Deno.env.get('SOLANA_AIC_MINT') || '');
    const userPublicKey = new PublicKey(userWallet);

    const userAICAccount = await getAssociatedTokenAddress(
      aicMintAddress,
      userPublicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    let needsAccountCreation = false;
    try {
      await connection.getAccountInfo(userAICAccount);
    } catch {
      needsAccountCreation = true;
    }

    const transaction = new Transaction();

    if (needsAccountCreation) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          deployerKeypair.publicKey,
          userAICAccount,
          userPublicKey,
          aicMintAddress,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    const amount = 1_000_000 * Math.pow(10, 6);

    transaction.add(
      createMintToInstruction(
        aicMintAddress,
        userAICAccount,
        deployerKeypair.publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = deployerKeypair.publicKey;

    transaction.sign(deployerKeypair);

    const signature = await connection.sendRawTransaction(transaction.serialize());

    await connection.confirmTransaction({
      signature,
      ...latestBlockhash,
    });

    return new Response(
      JSON.stringify({
        success: true,
        signature,
        amount: 1_000_000,
        userWallet,
        message: 'Successfully minted 1,000,000 AIC tokens!',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Mint error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});