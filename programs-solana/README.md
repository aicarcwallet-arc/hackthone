# Solana Programs for AIC + PYUSD System

This directory contains the Solana programs (smart contracts) for the AIC token ecosystem on Solana.

## Programs

### 1. AIC Token (SPL Token)
- Creates AIC as an SPL token on Solana
- Minting controlled by admin
- Users earn AIC tokens for completing tasks

### 2. PYUSD Swap Pool
- Liquidity pool for swapping AIC ↔ PYUSD
- Automated market maker (AMM) style
- Configurable swap rates

### 3. Payout Manager
- Manages PYUSD payouts to users' PayPal wallets
- Integrates with Circle API
- Tracks payout history

## Development

These programs use TypeScript with Solana web3.js (no Rust compilation needed for initial testing).

For production, consider rewriting in Anchor/Rust for gas optimization.

## Networks

- **Devnet**: For testing (free)
- **Mainnet**: For production
