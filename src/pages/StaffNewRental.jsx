// src/pages/StaffNewRental.jsx
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
  const [showToast, setShowToast] = useState(false);

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
      setShowToast(true);
      setTimeout(() => {
        navigate('/receipt', { 
          state: { 
            txData: {
              id: `TXN-${Date.now()}`,
              date: new Date().toLocaleDateString(),
              customer: customer.name,
              item: selectedItem.name,
              baseRate: selectedItem.baseRate,
              deposit: selectedItem.deposit,
              total: selectedItem.baseRate + selectedItem.deposit
            }
          } 
        });
      }, 1200);
      return;
    }
    setStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen w-full bg-app-bg font-sans flex flex-col items-center">
      
      {/* MAIN CONTAINER: Constrained width for desktop readability */}
      <div className="relative flex flex-col w-full max-w-5xl grow bg-app-bg">
        
        {/* Toast Notification */}
        <div className={`fixed left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-50 transition-all duration-500 ${showToast ? 'top-10' : '-top-20'}`}>
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="font-bold text-sm text-text-main">Processing Receipt...</span>
        </div>

        {/* Header */}
        <div className="pt-8 px-6 pb-4 flex justify-between items-center md:px-12 md:pt-12">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-text-main hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-lg md:text-2xl font-bold">New Rental</h1>
          <div className="w-6"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex px-6 py-6 items-center justify-center w-full md:px-12">
          <div className="flex w-full max-w-md">
            {[1, 2, 3].map((num) => (
              <div key={num} className="relative flex flex-col items-center flex-1">
                <div className={`z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[13px] md:text-base font-bold transition-all duration-300 border-2 
                  ${step > num ? 'bg-green-500 border-green-500 text-white' : 
                    step === num ? 'bg-primary border-primary text-white' : 
                    'bg-white border-gray-200 text-gray-400'}`}>
                  {step > num ? '✓' : num}
                </div>
                <span className={`mt-2 text-[10px] md:text-xs font-bold uppercase tracking-tighter md:tracking-wider ${step === num ? 'text-primary' : 'text-gray-400'}`}>
                  {num === 1 ? 'Item' : num === 2 ? 'Customer' : 'Confirm'}
                </span>
                {num < 3 && (
                  <div className={`absolute top-4 md:top-5 left-1/2 w-full h-0.5 z-0 ${step > num ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area: Added pb-48 for mobile scroll clearance */}
        <main className="grow px-6 pt-4 pb-48 md:pb-12 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* STEP 1: Select Item */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-main">Select Item</h2>
                <p className="text-sm md:text-base text-gray-500 font-medium mb-6">Choose from available catalog items</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {CATALOG_ITEMS.filter(i => i.status === 'Available').map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedItem(item)}
                      className={`bg-white rounded-3xl p-4 flex items-center gap-4 cursor-pointer transition-all border-2 
                        ${selectedItem?.id === item.id ? 'border-primary shadow-md scale-[1.01]' : 'border-transparent shadow-sm hover:border-gray-100'}`}
                    >
                      <img src={item.imageUrl} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover" alt="" />
                      <div className="grow">
                        <p className="font-bold text-base md:text-lg">{item.name}</p>
                        <p className="text-sm text-gray-400 font-medium">₱{item.baseRate} / rental</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
                        ${selectedItem?.id === item.id ? 'bg-primary border-primary' : 'border-gray-200'}`}>
                        {selectedItem?.id === item.id && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Customer Info */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-main">Customer Info</h2>
                <p className="text-sm md:text-base text-gray-500 font-medium mb-6">Enter details or scan government ID</p>
                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-main ml-1 uppercase">Full Name</label>
                    <input 
                        type="text" 
                        value={customer.name} 
                        onChange={e => setCustomer({...customer, name: e.target.value})} 
                        className="w-full p-4 md:p-5 rounded-2xl bg-white shadow-sm border border-transparent focus:border-primary/20 outline-none text-lg" 
                        placeholder="e.g. Liza Soberano" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-main ml-1 uppercase">Contact Number</label>
                    <input 
                        type="tel" 
                        value={customer.contact} 
                        onChange={e => setCustomer({...customer, contact: e.target.value})} 
                        className="w-full p-4 md:p-5 rounded-2xl bg-white shadow-sm border border-transparent focus:border-primary/20 outline-none text-lg" 
                        placeholder="e.g. 0917-123-4567" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-text-main ml-1 uppercase">Rental Date</label>
                      <input 
                        type="date" 
                        value={customer.rentalDate} 
                        onChange={e => setCustomer({...customer, rentalDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-white shadow-sm outline-none" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-text-main ml-1 uppercase">Return Date</label>
                      <input 
                        type="date" 
                        value={customer.returnDate} 
                        onChange={e => setCustomer({...customer, returnDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-white shadow-sm outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm Summary */}
            {step === 3 && selectedItem && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-extrabold text-text-main">Confirm Rental</h2>
                <div className="bg-white rounded-3xl md:rounded-4xl p-6 md:p-10 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-6 mb-8">
                    <img src={selectedItem.imageUrl} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl object-cover" alt="" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-black">{selectedItem.name}</h3>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Item Selected</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-gray-400 font-bold text-xs uppercase">Customer</span>
                      <span className="text-text-main font-bold md:text-lg">{customer.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 gap-2">
                      <span className="text-lg md:text-xl font-black text-gray-400">Total Due</span>
                      <span className="text-4xl md:text-5xl font-black text-primary">₱{selectedItem.baseRate + selectedItem.deposit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ACTION BAR: Fixed on mobile, relative on desktop */}
        <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 md:relative md:p-12 md:bg-transparent bg-white/80 backdrop-blur-lg rounded-t-[40px] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.04)] md:shadow-none z-40">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row-reverse gap-3">
            <button onClick={handleNext} className="w-full md:flex-2 bg-primary text-white py-5 md:py-6 rounded-2xl md:rounded-3xl font-bold text-base md:text-xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all">
              {step === 3 ? 'Confirm & Generate Receipt' : 'Continue to Next Step'}
            </button>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="w-full md:flex-1 py-4 text-gray-400 font-bold text-sm md:text-lg hover:text-text-main transition-colors">
                Go Back
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}