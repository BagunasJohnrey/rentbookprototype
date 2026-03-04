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
    <div className="min-h-screen w-full bg-[#faf6f6] font-sans flex overflow-hidden">
      
      {/* DESKTOP SIDEBAR (Visible only on md screens and up) 
      */}
      <div className="hidden md:flex md:w-[35%] bg-gradient-to-br from-[#ff6b76] to-[#bf4a53] p-16 flex-col justify-between text-white">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">RentBook</h1>
          <p className="text-xl opacity-90 max-w-xs">Streamlined Rental Management for Professionals.</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
            <h3 className="font-bold text-lg mb-2">Step {step} of 3</h3>
            <p className="text-sm opacity-80">
              {step === 1 && "Choose the perfect item from your active inventory to begin the rental process."}
              {step === 2 && "Register the customer's details and set the rental duration."}
              {step === 3 && "Review the transaction summary and finalize the rental contract."}
            </p>
          </div>
          <div className="text-sm opacity-60">© 2026 RentBook Prototype System</div>
        </div>
      </div>

      {/* MAIN CONTENT AREA 
          - Mobile: Full viewport, bottom-sheet style
          - Desktop: Right side of the screen
      */}
      <div className="relative flex flex-col flex-grow h-screen bg-[#faf6f6]">
        
        {/* Toast Notification */}
        <div className={`absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-[1000] transition-all duration-500 ${showToast ? 'top-10' : '-top-20'}`}>
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="font-bold text-sm text-[#111010]">Processing Receipt...</span>
        </div>

        {/* Header / Nav */}
        <div className="pt-8 px-6 pb-4 flex justify-between items-center md:px-12 md:pt-12">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-[#111010] hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-[17px] md:text-2xl font-bold">New Rental</h1>
          <div className="w-6"></div>
        </div>

        {/* Progress Steps (Mobile & Desktop layout) */}
        <div className="flex px-6 py-4 items-center md:px-12 md:max-w-2xl">
          {[1, 2, 3].map((num) => (
            <div key={num} className="relative flex flex-col items-center flex-1">
              <div className={`z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[13px] md:text-base font-bold transition-all duration-300 border-2 
                ${step > num ? 'bg-green-500 border-green-500 text-white' : 
                  step === num ? 'bg-[#bf4a53] border-[#bf4a53] text-white' : 
                  'bg-white border-gray-200 text-gray-400'}`}>
                {step > num ? '✓' : num}
              </div>
              <span className={`mt-1 text-[10px] md:text-xs font-bold uppercase tracking-wider ${step === num ? 'text-[#bf4a53]' : 'text-gray-400'}`}>
                {num === 1 ? 'Item' : num === 2 ? 'Customer' : 'Confirm'}
              </span>
              {num < 3 && (
                <div className={`absolute top-4 md:top-5 left-1/2 w-full h-[2px] z-0 ${step > num ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto px-6 pt-4 pb-48 md:px-12 scrollbar-hide">
          <div className="max-w-2xl">
            {/* STEP 1: Select Item */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-[22px] md:text-3xl font-extrabold text-[#111010]">Select Item</h2>
                <p className="text-[14px] md:text-base text-gray-500 font-medium mb-6">Choose from available catalog items</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {CATALOG_ITEMS.filter(i => i.status === 'Available').map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedItem(item)}
                      className={`bg-white rounded-[20px] md:rounded-[24px] p-4 flex items-center gap-4 cursor-pointer transition-all border-2 
                        ${selectedItem?.id === item.id ? 'border-[#bf4a53] shadow-md scale-[1.02]' : 'border-transparent shadow-sm hover:border-gray-100'}`}
                    >
                      <img src={item.imageUrl} className="w-[62px] h-[62px] md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover" alt="" />
                      <div className="flex-grow">
                        <p className="font-bold text-[15px] md:text-lg">{item.name}</p>
                        <p className="text-[13px] md:text-sm text-gray-400 font-medium">₱{item.baseRate} / rental</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
                        ${selectedItem?.id === item.id ? 'bg-[#bf4a53] border-[#bf4a53]' : 'border-gray-200'}`}>
                        {selectedItem?.id === item.id && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Customer Info */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-[22px] md:text-3xl font-extrabold text-[#111010]">Customer Info</h2>
                <p className="text-[14px] md:text-base text-gray-500 font-medium mb-6">Enter details or scan government ID</p>
                
                <button className="w-full md:max-w-md bg-gradient-to-r from-[#bf4a53] to-[#ff6b76] text-white py-4 rounded-[18px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#bf4a53]/20 mb-8 active:scale-95 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  Scan Government ID (AI OCR)
                </button>

                <div className="space-y-5 md:max-w-xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#111010] ml-1 uppercase tracking-wider">Full Name</label>
                    <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full p-4 md:p-5 rounded-[18px] bg-white shadow-sm outline-none focus:ring-2 focus:ring-[#bf4a53]/10 text-lg" placeholder="e.g. Liza Soberano" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#111010] ml-1 uppercase tracking-wider">Contact Number</label>
                    <input type="tel" value={customer.contact} onChange={e => setCustomer({...customer, contact: e.target.value})} className="w-full p-4 md:p-5 rounded-[18px] bg-white shadow-sm outline-none focus:ring-2 focus:ring-[#bf4a53]/10 text-lg" placeholder="e.g. 0917-123-4567" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-[#111010] ml-1 uppercase tracking-wider">Rental Date</label>
                      <input type="date" value={customer.rentalDate} onChange={e => setCustomer({...customer, rentalDate: e.target.value})} className="w-full p-4 md:p-5 rounded-[18px] bg-white shadow-sm outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-[#111010] ml-1 uppercase tracking-wider">Return Date</label>
                      <input type="date" value={customer.returnDate} onChange={e => setCustomer({...customer, returnDate: e.target.value})} className="w-full p-4 md:p-5 rounded-[18px] bg-white shadow-sm outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm Summary */}
            {step === 3 && selectedItem && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-[22px] md:text-3xl font-extrabold text-[#111010]">Confirm Rental</h2>
                <p className="text-[14px] md:text-base text-gray-500 font-medium mb-6">Review details before processing</p>
                
                <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-50 md:max-w-xl">
                  <div className="flex items-center gap-6 mb-8">
                    <img src={selectedItem.imageUrl} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl object-cover" alt="" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-black">{selectedItem.name}</h3>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Item Selected</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-gray-400 font-bold text-sm uppercase">Customer</span>
                      <span className="text-[#111010] font-bold md:text-lg">{customer.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-gray-400 font-bold text-sm uppercase">Return Date</span>
                      <span className="text-[#111010] font-bold md:text-lg">{customer.returnDate}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-[18px] md:text-xl font-black text-gray-400">Total Due</span>
                      <span className="text-3xl md:text-5xl font-black text-[#bf4a53]">₱{selectedItem.baseRate + selectedItem.deposit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FIXED ACTION BAR
            - Desktop: Wider, stays at bottom
            - Mobile: Full width bottom sheet
        */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 md:p-12 md:bg-transparent bg-white rounded-t-[32px] md:rounded-none shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:shadow-none z-20">
          <div className="max-w-2xl flex flex-col md:flex-row gap-3">
            <button onClick={handleNext} className="flex-[2] bg-[#bf4a53] text-white py-5 md:py-6 rounded-[22px] md:rounded-3xl font-bold text-[17px] md:text-xl shadow-xl shadow-[#bf4a53]/20 hover:brightness-110 active:scale-[0.98] transition-all order-1 md:order-2">
              {step === 3 ? '✓ Confirm & Generate Receipt' : 'Continue to Next Step'}
            </button>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 py-5 md:py-6 text-gray-400 font-bold text-sm md:text-lg hover:text-[#111010] transition-colors order-2 md:order-1">
                Go Back
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}