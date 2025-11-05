import React from 'react';
import { SolanaWalletProvider } from './components/SolanaWalletProvider';
import { SolanaPYUSDDashboard } from './components/SolanaPYUSDDashboard';

export const SolanaApp: React.FC = () => {
  return (
    <SolanaWalletProvider>
      <SolanaPYUSDDashboard />
    </SolanaWalletProvider>
  );
};
