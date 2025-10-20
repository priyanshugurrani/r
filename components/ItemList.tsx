import React from 'react';
import type { Item } from '../types';
import { TrashIcon } from './icons';

interface ItemListProps {
  items: Item[];
  onRemoveItem: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onRemoveItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Your receipt is empty.</p>
        <p className="text-sm text-gray-400">Add some items using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ul role="list" className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} &times; {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-800">
                {(item.quantity * item.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1 transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
