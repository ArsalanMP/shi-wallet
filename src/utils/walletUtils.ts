import { Wallet, Transaction, WalletState } from '@/types/wallet';
import jalaali from 'jalaali-js';

const ANNUAL_INTEREST_RATE = 0.24; // 24%
const DEFAULT_ANNUAL_RATE = 0.24; // 24%

export const calculateDailyProfit = (balance: number, daysInMonth: number): number => {
  return (balance * ANNUAL_INTEREST_RATE) / 365 * daysInMonth;
};

export const getDaysInMonth = (date: Date): number => {
  const month = date.getMonth();
  // Simplified implementation - can be enhanced with Shamsi calendar
  return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29][month];
};

export const saveToLocalStorage = (state: WalletState) => {
  try {
    localStorage.setItem('walletData', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): WalletState | null => {
  try {
    const data = localStorage.getItem('walletData');
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Validate data structure
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.wallets || !parsed.transactions) return null;
    
    return parsed;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateProfitAmount = (transactions: Transaction[], wallet: Wallet, daysInMonth: number): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Get all balance-changing transactions this month, sorted by date
  const monthTransactions = transactions
    .filter(t => t.walletId === wallet.id && new Date(t.timestamp) >= startOfMonth)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  let totalWeightedBalance = 0;
  let previousBalance = wallet.balance;
  let previousDate = startOfMonth;

  // Calculate weighted balance for each period
  monthTransactions.forEach(transaction => {
    const transactionDate = new Date(transaction.timestamp);
    const daysBetween = (transactionDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
    
    totalWeightedBalance += previousBalance * daysBetween;
    
    // Update balance for next period
    previousBalance = previousBalance + transaction.amount;
    previousDate = transactionDate;
  });

  // Add remaining days until today
  const remainingDays = (now.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
  totalWeightedBalance += previousBalance * remainingDays;

  // Calculate average daily balance
  const averageDailyBalance = totalWeightedBalance / daysInMonth;

  // Calculate profit based on average daily balance
  const dailyRate = ANNUAL_INTEREST_RATE / 365;
  return Math.round(averageDailyBalance * dailyRate * daysInMonth);
};

export const calculateProjectedProfitAmount = (transactions: Transaction[], wallet: Wallet): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Convert current date to Shamsi to find 15th of next month
  const currentShamsi = jalaali.toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  
  const targetShamsi = {
    jy: currentShamsi.jm === 12 ? currentShamsi.jy + 1 : currentShamsi.jy,
    jm: currentShamsi.jm === 12 ? 1 : currentShamsi.jm + 1,
    jd: 15
  };
  
  const targetDate = jalaali.toGregorian(targetShamsi.jy, targetShamsi.jm, targetShamsi.jd);
  const endDate = new Date(targetDate.gy, targetDate.gm - 1, targetDate.gd);
  endDate.setHours(0, 0, 0, 0);
  
  let totalProfit = 0;
  const currentBalance = wallet.balance;
  const currentDate = new Date(now);
  
  const annualRate = wallet.annualProfitRate ?? DEFAULT_ANNUAL_RATE;
  const dailyRate = annualRate / 365;
  
  while (currentDate < endDate) {
    totalProfit += Math.round(currentBalance * dailyRate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalProfit;
};