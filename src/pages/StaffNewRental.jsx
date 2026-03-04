import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

export default function StaffNewRental() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialItemId = query.get('itemId');

  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState(
    CATALOG_ITEMS.find(i => i.id === initialItemId) || null
  );
  
  // FIX: Wrapped in lazy initializer to ensure purity
  const [customer, setCustomer] = useState(() => {
    const now = new Date();
    const returnDate = new Date(now.getTime() + 3 * 86400000);
    return {
      name: '', contact: '', address: '', 
      rentalDate: now.toISOString().split('T')[0], 
      returnDate: returnDate.toISOString().split('T')[0]
    };
  });

  const handleNext = () => {
    if (step === 1 && !selectedItem) return alert('Please select an item');
    if (step === 2 && (!customer.name || !customer.contact)) return alert('Details required');
    if (step === 3) {
      navigate('/receipt', { 
        state: { 
          txData: {
            id: `TXN-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString(),
            customer: customer.name,
            item: selectedItem.name,
            baseRate: selectedItem.baseRate,
            deposit: selectedItem.deposit
          }
        } 
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 md:py-10">
      {/* FIX: Use md:min-h-187.5 (canonical) */}
      <div className="w-full md:max-w-2xl md:mx-auto bg-white md:shadow-2xl md:rounded-4xl flex flex-col h-full md:h-auto md:min-h-187.5 overflow-hidden relative">
        
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[2.5px]"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="text-xl font-black text-gray-800">New Rental</div>
          <div className="w-10"></div>
        </div>

        {/* Step Indicator */}
        <div className="px-10 py-8">
           <div className="flex items-center justify-between relative">
              {/* FIX: Use z-0 (canonical) */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
              {[1, 2, 3].map(num => (
                <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black transition-all duration-500 ${step >= num ? 'bg-primary border-primary/20 text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                    {step > num ? '✓' : num}
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="grow overflow-y-auto px-6 md:px-12 pb-32">
           {step === 1 && (
             <div className="animate-fade-in">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Select Item</h2>
                <div className="grid gap-4">
                   {CATALOG_ITEMS.filter(i => i.status === 'Available').map(item => (
                     <div 
                        key={item.id} onClick={() => setSelectedItem(item)}
                        className={`p-4 rounded-3xl border-2 flex items-center gap-4 ${selectedItem?.id === item.id ? 'border-primary bg-primary/5' : 'border-gray-50'}`}
                     >
                        <img src={item.imageUrl} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                        <div className="grow">
                           <p className="font-bold text-gray-800">{item.name}</p>
                           <p className="text-xs font-bold text-gray-400 tracking-tighter">₱{item.baseRate}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <h2 className="text-2xl font-black text-gray-900 mb-6">Customer Details</h2>
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">Full Name</label>
                   <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full p-4 mt-2 rounded-2xl bg-gray-50 border-none" placeholder="Enter name" />
                </div>
                <div>
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">Contact</label>
                   <input type="tel" value={customer.contact} onChange={e => setCustomer({...customer, contact: e.target.value})} className="w-full p-4 mt-2 rounded-2xl bg-gray-50 border-none" placeholder="09XX..." />
                </div>
                <div>
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">Return Date</label>
                   <input type="date" value={customer.returnDate} onChange={e => setCustomer({...customer, returnDate: e.target.value})} className="w-full p-4 mt-2 rounded-2xl bg-gray-50 border-none" />
                </div>
             </div>
           )}

           {step === 3 && selectedItem && (
             <div className="animate-fade-in">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Summary</h2>
                {/* FIX: Use rounded-4xl (canonical) */}
                <div className="bg-gray-50 rounded-4xl p-8">
                   <div className="space-y-4">
                      <div className="flex justify-between font-black text-gray-900">
                         <p>Total Payment</p>
                         <p className="text-3xl text-primary">₱{selectedItem.baseRate + selectedItem.deposit}</p>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="absolute md:relative bottom-0 left-0 right-0 p-6 md:p-10 bg-white border-t border-gray-100">
           <button onClick={handleNext} className="w-full bg-primary text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">
             {step === 3 ? 'Confirm & Finalize' : 'Continue'}
           </button>
        </div>
      </div>
    </div>
  );
}