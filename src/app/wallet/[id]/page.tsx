'use client';

import { useWallet } from '@/contexts/WalletContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatShamsiDate } from '@/utils/dateUtils';

export default function WalletTransactions() {
  const { wallets, transactions } = useWallet();
  const params = useParams();
  const walletId = params.id as string;
  const wallet = wallets[walletId];

  if (!wallet) {
    return null;
  }

  const walletTransactions = transactions.filter(t => t.walletId === walletId);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↑';
      case 'withdraw':
        return '↓';
      case 'profit':
        return '★';
      default:
        return '•';
    }
  };

  const formatDate = (dateString: string) => {
    return formatShamsiDate(dateString);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="bg-white border border-gray-200 p-2 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
            aria-label="Back to wallets"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <div className="text-sm text-gray-500 mb-1">ShiWallet</div>
            <h1 className="text-2xl font-bold text-gray-900">
              {wallet.name} Transactions
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">Current Balance</div>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-US').format(wallet.balance)} T
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {walletTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No transactions yet
              </div>
            ) : (
              walletTransactions
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-6 text-center">
                          {getTransactionIcon(transaction.type)}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-medium ${
                        transaction.type === 'withdraw' ? 'text-red-600' : 
                        transaction.type === 'deposit' ? 'text-green-600' : 
                        'text-purple-600'
                      }`}>
                        {transaction.type === 'withdraw' ? '-' : '+'}
                        {new Intl.NumberFormat('en-US').format(Math.abs(transaction.amount))} T
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 