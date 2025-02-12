'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Wallet, Transaction, WalletState } from '@/types/wallet';
import { saveToLocalStorage, loadFromLocalStorage, generateId, calculateProfitAmount } from '@/utils/walletUtils';
import { getShamsiDaysInMonth } from '@/utils/dateUtils';
import jalaali from 'jalaali-js';

interface WalletContextType {
  wallets: Record<string, Wallet>;
  transactions: Transaction[];
  createWallet: (name: string) => void;
  deleteWallet: (id: string) => void;
  addAmount: (walletId: string, amount: number) => void;
  removeAmount: (walletId: string, amount: number) => void;
  calculateProfit: (fromDate?: Date) => void;
  importData: (data: WalletState) => void;
  exportData: () => WalletState;
  updateWalletSettings: (id: string, settings: { name?: string; annualProfitRate?: number }) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>({ wallets: {}, transactions: [] });

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setState(savedData);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  // Check for missed profit calculations
  useEffect(() => {
    const checkMissedProfits = () => {
      try {
        const now = new Date();
        
        Object.values(state.wallets).forEach(wallet => {
          if (!wallet.lastProfitCalculation && !wallet.createdAt) {
            // Skip wallets with invalid dates
            return;
          }

          const lastCalculation = wallet.lastProfitCalculation 
            ? new Date(wallet.lastProfitCalculation)
            : new Date(wallet.createdAt);

          if (isNaN(lastCalculation.getTime())) {
            // Skip if date is invalid
            return;
          }

          // Convert dates to Shamsi
          const lastCalc = jalaali.toJalaali(
            lastCalculation.getFullYear(),
            lastCalculation.getMonth() + 1,
            lastCalculation.getDate()
          );
          
          const current = jalaali.toJalaali(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
          );

          // If more than a month has passed since last calculation
          if (
            current.jy > lastCalc.jy || 
            (current.jy === lastCalc.jy && current.jm > lastCalc.jm)
          ) {
            calculateProfit(lastCalculation);
          }
        });
      } catch (error) {
        console.error('Error in profit calculation:', error);
      }
    };

    checkMissedProfits();
  }, [state.wallets]); // Run when wallets change

  const createWallet = (name: string) => {
    const id = generateId();
    setState(prev => ({
      ...prev,
      wallets: {
        ...prev.wallets,
        [id]: {
          id,
          name,
          balance: 0,
          createdAt: new Date().toISOString(),
          annualProfitRate: 0.24,
        }
      }
    }));
  };

  const deleteWallet = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: removed, ...remaining } = state.wallets;
    setState(prev => ({
      ...prev,
      wallets: remaining,
      transactions: prev.transactions.filter(t => t.walletId !== id)
    }));
  };

  const addAmount = (walletId: string, amount: number) => {
    // Add validation
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Invalid amount');
    }

    setState(prev => ({
      wallets: {
        ...prev.wallets,
        [walletId]: {
          ...prev.wallets[walletId],
          balance: Math.round((prev.wallets[walletId].balance + amount) * 100) / 100
        }
      },
      transactions: [
        ...prev.transactions,
        {
          id: generateId(),
          walletId,
          amount,
          type: 'deposit',
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  const removeAmount = (walletId: string, amount: number) => {
    const wallet = state.wallets[walletId];
    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    setState(prev => ({
      wallets: {
        ...prev.wallets,
        [walletId]: {
          ...prev.wallets[walletId],
          balance: prev.wallets[walletId].balance - amount
        }
      },
      transactions: [
        ...prev.transactions,
        {
          id: generateId(),
          walletId,
          amount: -amount,
          type: 'withdraw',
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  const calculateProfit = (fromDate?: Date) => {
    const now = new Date();
    const daysInMonth = getShamsiDaysInMonth(now);

    setState(prev => {
      const updatedWallets = { ...prev.wallets };
      const newTransactions = [...prev.transactions];

      Object.keys(updatedWallets).forEach(walletId => {
        const wallet = updatedWallets[walletId];
        const profit = calculateProfitAmount(prev.transactions, wallet, daysInMonth);

        updatedWallets[walletId] = {
          ...wallet,
          balance: Math.round((wallet.balance + profit) * 100) / 100,
          lastProfitCalculation: now.toISOString()
        };

        newTransactions.push({
          id: generateId(),
          walletId,
          amount: profit,
          type: 'profit',
          timestamp: now.toISOString(),
          description: fromDate 
            ? 'Missed profit calculation' 
            : 'Monthly profit'
        });
      });

      return {
        wallets: updatedWallets,
        transactions: newTransactions
      };
    });
  };

  const importData = (data: WalletState) => {
    setState(data);
  };

  const exportData = () => state;

  const updateWalletSettings = (id: string, settings: { name?: string; annualProfitRate?: number }) => {
    setState(prev => ({
      ...prev,
      wallets: {
        ...prev.wallets,
        [id]: {
          ...prev.wallets[id],
          ...settings,
        }
      }
    }));
  };

  return (
    <WalletContext.Provider value={{
      ...state,
      createWallet,
      deleteWallet,
      addAmount,
      removeAmount,
      calculateProfit,
      importData,
      exportData,
      updateWalletSettings,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 