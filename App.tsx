import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Item } from './types';
import AddItemForm from './components/AddItemForm';
import ItemList from './components/ItemList';
import Summary from './components/Summary';
import Receipt from './components/Receipt';

// Declare jspdf and html2canvas from window object for TypeScript
declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [tip, setTip] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (newItem: Omit<Item, 'id'>) => {
    setItems(prevItems => [...prevItems, { ...newItem, id: crypto.randomUUID() }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  useEffect(() => {
    if (tipPercentage !== null) {
      const newTipAmount = subtotal * (tipPercentage / 100);
      setTip(newTipAmount.toFixed(2));
    }
  }, [subtotal, tipPercentage]);

  const handleTipInputChange = (value: string) => {
    setTip(value);
    setTipPercentage(null);
  };

  const handleTipPercentageChange = (percentage: number) => {
    setTipPercentage(percentage);
  };

  const tipAmount = useMemo(() => {
    const parsedTip = parseFloat(tip);
    return isNaN(parsedTip) ? 0 : parsedTip;
  }, [tip]);

  const total = useMemo(() => {
    return subtotal + tipAmount;
  }, [subtotal, tipAmount]);

  const formatCurrency = (amount: number) => 
    amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Sharing is not supported on this browser.");
      return;
    }

    const itemsText = items.map(item => 
      `- ${item.name} (${item.quantity} x ${formatCurrency(item.price)}): ${formatCurrency(item.price * item.quantity)}`
    ).join('\n');

    const shareText = `
Receipt Summary:
${itemsText}

--------------------
Subtotal: ${formatCurrency(subtotal)}
Tip${tipPercentage ? ` (${tipPercentage}%)` : ''}: ${formatCurrency(tipAmount)}
--------------------
Total: ${formatCurrency(total)}
    `;

    try {
      await navigator.share({
        title: 'Receipt',
        text: shareText.trim(),
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleDownloadPdf = async () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) return;

    try {
      const canvas = await html2canvas(receiptElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const { jsPDF } = jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('receipt.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Sorry, there was an error creating the PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Receipt Calculator</h1>
          <p className="mt-2 text-lg text-gray-500">Add items, set a tip, and see your total.</p>
        </header>
        
        <main className="space-y-6">
          <AddItemForm onAddItem={handleAddItem} />
          <ItemList items={items} onRemoveItem={handleRemoveItem} />
          <Summary 
            subtotal={subtotal} 
            tip={tip} 
            onTipInputChange={handleTipInputChange} 
            total={total} 
            onTipPercentageClick={handleTipPercentageChange}
            selectedTipPercentage={tipPercentage}
            onShare={handleShare}
            onDownloadPdf={handleDownloadPdf}
          />
        </main>
        
        <footer className="text-center mt-12 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Receipt & Tip Calculator. A modern, simple tool.</p>
        </footer>
      </div>
      
      {/* Hidden component for PDF generation */}
      <div className="absolute -z-10 -left-[9999px] top-0">
          <div ref={receiptRef}>
            <Receipt 
                items={items}
                subtotal={subtotal}
                tipAmount={tipAmount}
                total={total}
                selectedTipPercentage={tipPercentage}
            />
          </div>
      </div>
    </div>
  );
};

export default App;