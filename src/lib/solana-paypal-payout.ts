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
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getConnection, PYUSD_MINT_ADDRESS, PYUSD_DECIMALS } from '../config/solana';
import { supabase } from './supabase';

export interface PayoutRequest {
  userId: string;
  amount: number;
  destinationWalletId: string;
  email?: string;
}

export interface PayoutResult {
  success: boolean;
  transactionId: string;
  amount: number;
  recipient: string;
  timestamp: Date;
  error?: string;
}

export class SolanaPayPalPayoutManager {
  private connection: Connection;
  private treasuryAuthority: Keypair | null = null;

  constructor() {
    this.connection = getConnection();
  }

  setTreasuryAuthority(authority: Keypair) {
    this.treasuryAuthority = authority;
  }

  async sendPYUSDToCircleWallet(
    destinationWalletId: string,
    amount: number,
    memo: string = ''
  ): Promise<string> {
    if (!this.treasuryAuthority) {
      throw new Error('Treasury authority not set');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/circle-instant-payout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          walletId: destinationWalletId,
          amount: amount.toString(),
          memo: memo,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Circle payout failed: ${error.message}`);
    }

    const result = await response.json();
    return result.transferId;
  }

  async processPayoutRequest(request: PayoutRequest): Promise<PayoutResult> {
    try {
      if (request.amount <= 0) {
        throw new Error('Invalid payout amount');
      }

      console.log(`Processing payout: ${request.amount} PYUSD to ${request.destinationWalletId}`);

      const transferId = await this.sendPYUSDToCircleWallet(
        request.destinationWalletId,
        request.amount,
        `Payout for user ${request.userId}`
      );

      const payoutResult: PayoutResult = {
        success: true,
        transactionId: transferId,
        amount: request.amount,
        recipient: request.destinationWalletId,
        timestamp: new Date(),
      };

      await this.recordPayoutInDatabase(request.userId, payoutResult);

      console.log(`Payout successful: ${transferId}`);
      return payoutResult;

    } catch (error) {
      console.error('Payout failed:', error);

      const failedResult: PayoutResult = {
        success: false,
        transactionId: '',
        amount: request.amount,
        recipient: request.destinationWalletId,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await this.recordPayoutInDatabase(request.userId, failedResult);

      return failedResult;
    }
  }

  async batchPayouts(requests: PayoutRequest[]): Promise<PayoutResult[]> {
    const results: PayoutResult[] = [];

    for (const request of requests) {
      const result = await this.processPayoutRequest(request);
      results.push(result);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  private async recordPayoutInDatabase(userId: string, result: PayoutResult) {
    try {
      const { error } = await supabase
        .from('payouts')
        .insert({
          user_id: userId,
          amount: result.amount,
          transaction_id: result.transactionId,
          recipient: result.recipient,
          status: result.success ? 'completed' : 'failed',
          error_message: result.error || null,
          created_at: result.timestamp.toISOString(),
        });

      if (error) {
        console.error('Failed to record payout in database:', error);
      }
    } catch (error) {
      console.error('Database error:', error);
    }
  }

  async getPayoutHistory(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch payout history:', error);
      return [];
    }
  }

  async getTotalPayouts(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (error) throw error;

      return data?.reduce((sum, payout) => sum + payout.amount, 0) || 0;
    } catch (error) {
      console.error('Failed to calculate total payouts:', error);
      return 0;
    }
  }

  async validatePayoutEligibility(
    userId: string,
    requestedAmount: number
  ): Promise<{ eligible: boolean; reason?: string }> {
    try {
      const { data: user, error } = await supabase
        .from('user_wallets')
        .select('aic_balance, circle_wallet_id')
        .eq('wallet_address', userId)
        .single();

      if (error || !user) {
        return { eligible: false, reason: 'User not found' };
      }

      if (!user.circle_wallet_id) {
        return { eligible: false, reason: 'No Circle wallet configured' };
      }

      if (user.aic_balance < requestedAmount) {
        return { eligible: false, reason: 'Insufficient AIC balance' };
      }

      return { eligible: true };
    } catch (error) {
      return { eligible: false, reason: 'Validation error' };
    }
  }

  async estimatePayoutAmount(aicAmount: number, swapRate: number): Promise<number> {
    const pyusdAmount = aicAmount * swapRate;
    const fee = pyusdAmount * 0.003;
    return pyusdAmount - fee;
  }
}
