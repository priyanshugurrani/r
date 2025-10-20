import React from 'react';
import type { Item } from '../types';

interface ReceiptProps {
  items: Item[];
  subtotal: number;
  tipAmount: number;
  total: number;
  selectedTipPercentage: number | null;
}

const Receipt: React.FC<ReceiptProps> = ({ 
    items, 
    subtotal, 
    tipAmount, 
    total, 
    selectedTipPercentage 
}) => {
  
  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="bg-white p-8" style={{ width: '400px' }}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Receipt Summary</h2>
        <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
      </div>

      <div className="space-y-2 mb-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-start text-sm">
            <div className="flex-1 pr-2">
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-500">{item.quantity} &times; {formatCurrency(item.price)}</p>
            </div>
            <p className="text-gray-800 font-medium">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <hr className="my-4 border-dashed" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            Tip {selectedTipPercentage && `(${selectedTipPercentage}%)`}
          </span>
          <span className="font-medium text-gray-800">{formatCurrency(tipAmount)}</span>
        </div>
      </div>

      <hr className="my-4 border-dashed" />

      <div className="flex justify-between items-center font-bold text-lg">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">{formatCurrency(total)}</span>
      </div>
      
      <div className="text-center mt-8 text-xs text-gray-400">
          <p>Thank you!</p>
      </div>
    </div>
  );
};

export default Receipt;