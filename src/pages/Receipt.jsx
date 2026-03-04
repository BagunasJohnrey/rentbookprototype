import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // FIX: Wrapped in useState with a lazy initializer so impure functions 
  // (Math.random, new Date) only run once when the component mounts.
  const [txData] = useState(() => location.state?.txData || {
    id: `TXN-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toLocaleDateString(),
    customer: 'Walk-in Customer',
    item: 'Sample Item',
    baseRate: 0,
    deposit: 0
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f4f5] relative">
      {/* Top Nav */}
      <div className="p-5 flex justify-between items-center z-10 bg-white no-print">
        <button onClick={() => navigate('/staff-dashboard')} className="text-primary font-bold active:opacity-70 transition-opacity">
          Done
        </button>
        <div className="text-[17px] font-bold text-text-main">Receipt</div>
        <button onClick={handlePrint} className="text-primary active:opacity-70 transition-opacity">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[2.5px]"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        </button>
      </div>

      {/* Receipt Paper */}
      <div className="grow overflow-y-auto p-6 flex flex-col items-center print:p-0 print:bg-white">
        
        {/* FIX: max-w-[340px] updated to Tailwind v4 canonical max-w-85 */}
        <div className="bg-white w-full max-w-85 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 relative overflow-hidden print:shadow-none print:max-w-full">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary text-white rounded-xl mx-auto flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 stroke-[2.5px]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <h2 className="text-xl font-black text-text-main tracking-tight">RentBook</h2>
            <p className="text-xs font-semibold text-text-muted mt-1">Gown & Suit Rentals</p>
          </div>

          <div className="border-t-2 border-dashed border-[#e5e5ea] py-4 my-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm"><span className="text-text-muted font-medium">Receipt No.</span><span className="font-bold text-text-main">{txData.id}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-muted font-medium">Date</span><span className="font-bold text-text-main">{txData.date}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-muted font-medium">Customer</span><span className="font-bold text-text-main">{txData.customer}</span></div>
          </div>

          <div className="border-t-2 border-dashed border-[#e5e5ea] py-4 my-4">
            <div className="text-sm font-bold text-text-main mb-2">Rental Items</div>
            <div className="flex justify-between text-sm mb-1"><span className="text-text-muted font-medium">{txData.item}</span><span className="font-bold text-text-main">₱{txData.baseRate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-muted font-medium">Security Deposit</span><span className="font-bold text-text-main">₱{txData.deposit}</span></div>
          </div>

          <div className="border-t-2 border-dashed border-[#e5e5ea] pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-text-main">Total Amount</span>
              <span className="text-2xl font-black text-primary">₱{txData.baseRate + txData.deposit}</span>
            </div>
          </div>

          <div className="mt-8 text-center text-xs font-medium text-text-muted">
            <p>Please return items on time to avoid penalties.</p>
            <p className="mt-1">Thank you for trusting RentBook!</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}