import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMint,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getConnection, AIC_TOKEN_DECIMALS } from '../config/solana';

export class AICSolanaToken {
  private connection: Connection;
  private mintKeypair: Keypair | null = null;
  private mintAuthority: Keypair | null = null;

  constructor() {
    this.connection = getConnection();
  }

  async createToken(payer: Keypair): Promise<{ mint: PublicKey; authority: PublicKey }> {
    const mintKeypair = Keypair.generate();
    const mintAuthority = payer;

    this.mintKeypair = mintKeypair;
    this.mintAuthority = mintAuthority;

    const lamports = await this.connection.getMinimumBalanceForRentExemption(82);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: 82,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        AIC_TOKEN_DECIMALS,
        mintAuthority.publicKey,
        null,
        TOKEN_PROGRAM_ID
      )
    );

    await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [payer, mintKeypair]
    );

    console.log('AIC Token created:', mintKeypair.publicKey.toBase58());

    return {
      mint: mintKeypair.publicKey,
      authority: mintAuthority.publicKey,
    };
  }

  async getOrCreateAssociatedTokenAccount(
    mint: PublicKey,
    owner: PublicKey,
    payer: Keypair
  ): Promise<PublicKey> {
    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      await getAccount(this.connection, associatedToken);
      return associatedToken;
    } catch (error) {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          payer.publicKey,
          associatedToken,
          owner,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );

      await sendAndConfirmTransaction(this.connection, transaction, [payer]);
      return associatedToken;
    }
  }

  async mintTokens(
    mint: PublicKey,
    destination: PublicKey,
    authority: Keypair,
    amount: number
  ): Promise<string> {
    const destinationAccount = await this.getOrCreateAssociatedTokenAccount(
      mint,
      destination,
      authority
    );

    const transaction = new Transaction().add(
      createMintToInstruction(
        mint,
        destinationAccount,
        authority.publicKey,
        amount * Math.pow(10, AIC_TOKEN_DECIMALS),
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [authority]
    );

    console.log(`Minted ${amount} AIC tokens to ${destination.toBase58()}`);
    console.log('Transaction:', signature);

    return signature;
  }

  async getBalance(mint: PublicKey, owner: PublicKey): Promise<number> {
    try {
      const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const account = await getAccount(this.connection, associatedToken);
      return Number(account.amount) / Math.pow(10, AIC_TOKEN_DECIMALS);
    } catch (error) {
      return 0;
    }
  }

  async getTokenInfo(mint: PublicKey) {
    const mintInfo = await getMint(this.connection, mint);
    return {
      address: mint.toBase58(),
      decimals: mintInfo.decimals,
      supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
      mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
    };
  }
}
