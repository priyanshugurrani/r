import React from 'react';
import { ShareIcon, DownloadIcon } from './icons';

interface SummaryProps {
  subtotal: number;
  tip: string;
  onTipInputChange: (value: string) => void;
  total: number;
  onTipPercentageClick: (percentage: number) => void;
  selectedTipPercentage: number | null;
  onShare: () => void;
  onDownloadPdf: () => void;
}

const Summary: React.FC<SummaryProps> = ({ 
  subtotal, 
  tip, 
  onTipInputChange, 
  total, 
  onTipPercentageClick, 
  selectedTipPercentage,
  onShare,
  onDownloadPdf,
}) => {
  const popularTipPercentages = [15, 18, 20, 25];
  const canShare = typeof navigator !== 'undefined' && navigator.share;
    
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">
            {subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <label htmlFor="tip-amount" className="text-gray-600 flex items-center">
            <span>Tip</span>
            {selectedTipPercentage !== null && (
                <span className="ml-2 text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {selectedTipPercentage}%
                </span>
            )}
          </label>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">$</span>
            <input
              type="number"
              id="tip-amount"
              value={tip}
              onChange={(e) => onTipInputChange(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-24 px-2 py-1 text-right bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              aria-label="Tip amount"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
            {popularTipPercentages.map(percentage => {
                const isActive = selectedTipPercentage === percentage;
                const buttonClasses = `px-3 py-1 text-sm border rounded-full transition-colors ${
                    isActive 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'border-gray-300 text-gray-600 hover:bg-green-100 hover:border-green-400 hover:text-green-800'
                }`;

                return (
                 <button 
                    key={percentage}
                    onClick={() => onTipPercentageClick(percentage)}
                    className={buttonClasses}
                    aria-pressed={isActive}
                >
                    {percentage}%
                </button>
            )})}
        </div>

        <hr className="border-gray-200" />
        
        <div className="flex justify-between items-center text-2xl font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-green-600">
            {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        {canShare && (
            <button 
                onClick={onShare}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share Receipt
            </button>
        )}
        <button 
            onClick={onDownloadPdf}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download PDF
        </button>
      </div>
    </div>
  );
};

export default Summary;