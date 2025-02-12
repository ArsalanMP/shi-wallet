import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface WalletSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { name: string; annualProfitRate: number }) => void;
  wallet: {
    name: string;
    annualProfitRate?: number;
  };
}

export const WalletSettingsModal: React.FC<WalletSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  wallet,
}) => {
  const [name, setName] = useState('');
  const [profitRate, setProfitRate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(wallet.name);
      setProfitRate(((wallet.annualProfitRate ?? 24) * 100).toString());
      setError(null);
    }
  }, [isOpen, wallet.name, wallet.annualProfitRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const rate = parseFloat(profitRate);
      if (isNaN(rate) || rate <= 0) {
        setError('Please enter a valid rate');
        return;
      }

      if (!name.trim()) {
        setError('Name cannot be empty');
        return;
      }

      onSave({ 
        name: name.trim(),
        annualProfitRate: rate / 100 
      });
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Wallet Settings</h3>
            <p className="text-sm text-gray-500">Edit wallet details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Wallet"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Profit Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={profitRate}
                  onChange={(e) => setProfitRate(e.target.value)}
                  placeholder="24"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 