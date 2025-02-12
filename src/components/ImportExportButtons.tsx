import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { WalletState } from '@/types/wallet';

interface ImportExportButtonsProps {
  onImport: (data: WalletState) => void;
  onExport: () => WalletState;
}

export const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  onImport,
  onExport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      
      // Type guard
      if (!isWalletState(data)) {
        throw new Error('Invalid file format');
      }
      
      onImport(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Invalid file format. Please check your file and try again.');
    }
  };

  // Type guard function
  const isWalletState = (data: unknown): data is WalletState => {
    if (!data || typeof data !== 'object') return false;
    const state = data as Partial<WalletState>;
    return (
      typeof state.wallets === 'object' && 
      state.wallets !== null &&
      Array.isArray(state.transactions)
    );
  };

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shiwallet-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3 mb-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept="application/json"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <ArrowUpTrayIcon className="h-5 w-5" />
        <span>Import</span>
      </button>
      <button
        onClick={handleExport}
        className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        <span>Export</span>
      </button>
    </div>
  );
}; 