import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface AddWalletFormProps {
  onAdd: (name: string) => void;
}

export const AddWalletForm: React.FC<AddWalletFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New wallet name"
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-2 font-medium"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create</span>
        </button>
      </div>
    </form>
  );
}; 