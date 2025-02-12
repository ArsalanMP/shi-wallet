import React, { useState } from 'react';
import { Wallet, Transaction } from '@/types/wallet';
import { TrashIcon, PlusIcon, MinusIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { calculateProjectedProfitAmount } from '@/utils/walletUtils';
import { ConfirmDialog } from './ConfirmDialog';
import { WalletSettingsModal } from './WalletSettingsModal';

interface WalletCardProps {
  wallet: Wallet;
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onAddAmount: (id: string) => void;
  onRemoveAmount: (id: string) => void;
  onUpdateSettings: (id: string, settings: { name?: string; annualProfitRate?: number }) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  transactions,
  onDelete,
  onAddAmount,
  onRemoveAmount,
  onUpdateSettings,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const projectedProfit = calculateProjectedProfitAmount(transactions, wallet);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(wallet.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 hover:shadow-md transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{wallet.name}</h3>
          <div className="flex items-center gap-2">
            <Link
              href={`/wallet/${wallet.id}`}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
              aria-label="View transactions"
            >
              <ClockIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
              aria-label="Wallet settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
              aria-label="Delete wallet"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 font-mono mb-1">
            {new Intl.NumberFormat('en-US').format(wallet.balance)} T
          </div>
          <div className="text-sm text-gray-600">Balance in Toman</div>
        </div>

        <div className="mb-6 bg-purple-50 rounded-xl p-3">
          <div className="text-sm text-purple-700 mb-1">Projected Profit (15th)</div>
          <div className="text-lg font-medium text-purple-900">
            +{new Intl.NumberFormat('en-US').format(projectedProfit)} T
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onAddAmount(wallet.id)}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => onRemoveAmount(wallet.id)}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <MinusIcon className="h-5 w-5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Wallet"
        message={`Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`}
      />

      <WalletSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={(settings) => {
          onUpdateSettings(wallet.id, settings);
          setShowSettings(false);
        }}
        wallet={wallet}
      />
    </>
  );
}; 