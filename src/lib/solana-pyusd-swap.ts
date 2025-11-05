import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getConnection, PYUSD_MINT_ADDRESS, AIC_TOKEN_DECIMALS, PYUSD_DECIMALS } from '../config/solana';

export interface SwapPoolConfig {
  aicMint: PublicKey;
  pyusdMint: PublicKey;
  aicReserve: number;
  pyusdReserve: number;
  swapFeePercent: number;
}

export class PYUSDSwapPool {
  private connection: Connection;
  private poolAuthority: Keypair | null = null;
  private config: SwapPoolConfig | null = null;

  constructor() {
    this.connection = getConnection();
  }

  async initializePool(
    authority: Keypair,
    aicMint: PublicKey,
    initialAICAmount: number,
    initialPYUSDAmount: number,
    swapFeePercent: number = 0.3
  ): Promise<SwapPoolConfig> {
    this.poolAuthority = authority;

    const pyusdMint = new PublicKey(PYUSD_MINT_ADDRESS);

    const aicPoolAccount = await getAssociatedTokenAddress(
      aicMint,
      authority.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const pyusdPoolAccount = await getAssociatedTokenAddress(
      pyusdMint,
      authority.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    this.config = {
      aicMint,
      pyusdMint,
      aicReserve: initialAICAmount,
      pyusdReserve: initialPYUSDAmount,
      swapFeePercent,
    };

    console.log('Swap Pool Initialized:');
    console.log('AIC Reserve:', initialAICAmount);
    console.log('PYUSD Reserve:', initialPYUSDAmount);
    console.log('Pool Authority:', authority.publicKey.toBase58());

    return this.config;
  }

  calculateSwapOutput(
    inputAmount: number,
    inputReserve: number,
    outputReserve: number
  ): number {
    if (!this.config) throw new Error('Pool not initialized');

    const feeMultiplier = (100 - this.config.swapFeePercent) / 100;
    const inputWithFee = inputAmount * feeMultiplier;

    const numerator = inputWithFee * outputReserve;
    const denominator = inputReserve + inputWithFee;

    return numerator / denominator;
  }

  calculateAICToPYUSD(aicAmount: number): number {
    if (!this.config) throw new Error('Pool not initialized');

    return this.calculateSwapOutput(
      aicAmount,
      this.config.aicReserve,
      this.config.pyusdReserve
    );
  }

  calculatePYUSDToAIC(pyusdAmount: number): number {
    if (!this.config) throw new Error('Pool not initialized');

    return this.calculateSwapOutput(
      pyusdAmount,
      this.config.pyusdReserve,
      this.config.aicReserve
    );
  }

  async swapAICForPYUSD(
    user: Keypair,
    aicAmount: number
  ): Promise<{ pyusdReceived: number; signature: string }> {
    if (!this.config || !this.poolAuthority) {
      throw new Error('Pool not initialized');
    }

    const pyusdOutput = this.calculateAICToPYUSD(aicAmount);

    if (pyusdOutput > this.config.pyusdReserve) {
      throw new Error('Insufficient PYUSD liquidity in pool');
    }

    const userAICAccount = await getAssociatedTokenAddress(
      this.config.aicMint,
      user.publicKey
    );

    const poolAICAccount = await getAssociatedTokenAddress(
      this.config.aicMint,
      this.poolAuthority.publicKey
    );

    const userPYUSDAccount = await getAssociatedTokenAddress(
      this.config.pyusdMint,
      user.publicKey
    );

    const poolPYUSDAccount = await getAssociatedTokenAddress(
      this.config.pyusdMint,
      this.poolAuthority.publicKey
    );

    const transaction = new Transaction()
      .add(
        createTransferInstruction(
          userAICAccount,
          poolAICAccount,
          user.publicKey,
          aicAmount * Math.pow(10, AIC_TOKEN_DECIMALS),
          [],
          TOKEN_PROGRAM_ID
        )
      )
      .add(
        createTransferInstruction(
          poolPYUSDAccount,
          userPYUSDAccount,
          this.poolAuthority.publicKey,
          Math.floor(pyusdOutput * Math.pow(10, PYUSD_DECIMALS)),
          [],
          TOKEN_PROGRAM_ID
        )
      );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [user, this.poolAuthority]
    );

    this.config.aicReserve += aicAmount;
    this.config.pyusdReserve -= pyusdOutput;

    console.log(`Swapped ${aicAmount} AIC for ${pyusdOutput.toFixed(6)} PYUSD`);
    console.log('Transaction:', signature);

    return {
      pyusdReceived: pyusdOutput,
      signature,
    };
  }

  async swapPYUSDForAIC(
    user: Keypair,
    pyusdAmount: number
  ): Promise<{ aicReceived: number; signature: string }> {
    if (!this.config || !this.poolAuthority) {
      throw new Error('Pool not initialized');
    }

    const aicOutput = this.calculatePYUSDToAIC(pyusdAmount);

    if (aicOutput > this.config.aicReserve) {
      throw new Error('Insufficient AIC liquidity in pool');
    }

    const userPYUSDAccount = await getAssociatedTokenAddress(
      this.config.pyusdMint,
      user.publicKey
    );

    const poolPYUSDAccount = await getAssociatedTokenAddress(
      this.config.pyusdMint,
      this.poolAuthority.publicKey
    );

    const userAICAccount = await getAssociatedTokenAddress(
      this.config.aicMint,
      user.publicKey
    );

    const poolAICAccount = await getAssociatedTokenAddress(
      this.config.aicMint,
      this.poolAuthority.publicKey
    );

    const transaction = new Transaction()
      .add(
        createTransferInstruction(
          userPYUSDAccount,
          poolPYUSDAccount,
          user.publicKey,
          Math.floor(pyusdAmount * Math.pow(10, PYUSD_DECIMALS)),
          [],
          TOKEN_PROGRAM_ID
        )
      )
      .add(
        createTransferInstruction(
          poolAICAccount,
          userAICAccount,
          this.poolAuthority.publicKey,
          Math.floor(aicOutput * Math.pow(10, AIC_TOKEN_DECIMALS)),
          [],
          TOKEN_PROGRAM_ID
        )
      );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [user, this.poolAuthority]
    );

    this.config.pyusdReserve += pyusdAmount;
    this.config.aicReserve -= aicOutput;

    console.log(`Swapped ${pyusdAmount} PYUSD for ${aicOutput.toFixed(6)} AIC`);
    console.log('Transaction:', signature);

    return {
      aicReceived: aicOutput,
      signature,
    };
  }

  getPoolInfo() {
    if (!this.config) throw new Error('Pool not initialized');

    return {
      aicReserve: this.config.aicReserve,
      pyusdReserve: this.config.pyusdReserve,
      aicPrice: this.config.pyusdReserve / this.config.aicReserve,
      pyusdPrice: this.config.aicReserve / this.config.pyusdReserve,
      swapFeePercent: this.config.swapFeePercent,
    };
  }
}
