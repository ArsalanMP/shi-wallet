export interface Wallet {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  lastProfitCalculation?: string;
  annualProfitRate?: number; // Default will be 24% if not set
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'profit';
  timestamp: string;
  description?: string;
}

export interface WalletState {
  wallets: Record<string, Wallet>;
  transactions: Transaction[];
} 