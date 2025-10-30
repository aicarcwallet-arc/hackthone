import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Starting app...');

try {
  const root = document.getElementById('root');
  console.log('Root element:', root);

  if (!root) {
    throw new Error('Root element not found');
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  console.log('App rendered');
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; border: 2px solid red; margin: 20px;">
      <h1>Error Loading App</h1>
      <pre>${error}</pre>
    </div>
  `;
}
