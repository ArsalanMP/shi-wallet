import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface AmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  type: 'deposit' | 'withdraw';
}

export const AmountModal: React.FC<AmountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formattedAmount, setFormattedAmount] = useState('');

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setFormattedAmount('');
      setError(null);
    }
  }, [isOpen]);

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits
    setAmount(value);
    
    // Format with commas
    if (value) {
      setFormattedAmount(new Intl.NumberFormat('en-US').format(parseInt(value)));
    } else {
      setFormattedAmount('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const numAmount = parseInt(amount);
      if (isNaN(numAmount)) {
        setError('Please enter a valid number');
        return;
      }
      if (numAmount <= 0) {
        setError('Amount must be positive');
        return;
      }
      if (!Number.isFinite(numAmount)) {
        setError('Invalid amount');
        return;
      }
      
      onSubmit(numAmount);
      setAmount('');
      setFormattedAmount('');
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
          <h3 className="text-xl font-semibold text-gray-900">
            {type === 'deposit' ? 'Add Money' : 'Withdraw Money'}
          </h3>
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
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formattedAmount}
                onChange={handleAmountChange}
                placeholder="Amount in Toman"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg text-right pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">T</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium"
            >
              Confirm
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