'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { WalletCard } from '@/components/WalletCard';
import { AddWalletForm } from '@/components/AddWalletForm';
import { AmountModal } from '@/components/AmountModal';
import { ImportExportButtons } from '@/components/ImportExportButtons';

export default function Home() {
  const {
    wallets,
    transactions,
    createWallet,
    deleteWallet,
    addAmount,
    removeAmount,
    importData,
    exportData,
    updateWalletSettings,
  } = useWallet();

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit');

  const handleAddAmount = (walletId: string) => {
    setSelectedWallet(walletId);
    setModalType('deposit');
  };

  const handleRemoveAmount = (walletId: string) => {
    setSelectedWallet(walletId);
    setModalType('withdraw');
  };

  const handleAmountSubmit = (amount: number) => {
    if (selectedWallet) {
      if (modalType === 'deposit') {
        addAmount(selectedWallet, amount);
      } else {
        removeAmount(selectedWallet, amount);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-xl">
              <span className="font-bold">Shi</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ShiWallet
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Smart wallet manager with automatic profit calculation
          </p>
        </div>

        <ImportExportButtons onImport={importData} onExport={exportData} />
        <AddWalletForm onAdd={createWallet} />

        <div className="space-y-4">
          {Object.values(wallets).map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              transactions={transactions}
              onDelete={deleteWallet}
              onAddAmount={handleAddAmount}
              onRemoveAmount={handleRemoveAmount}
              onUpdateSettings={updateWalletSettings}
            />
          ))}
        </div>

        <AmountModal
          isOpen={!!selectedWallet}
          onClose={() => setSelectedWallet(null)}
          onSubmit={handleAmountSubmit}
          type={modalType}
        />
      </div>
    </main>
  );
}
