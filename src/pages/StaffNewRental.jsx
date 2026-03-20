// src/pages/StaffNewRental.jsx
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

const CATEGORIES = [
  { id: 'all', label: 'All Collection' },
  { id: 'available', label: 'Discounted' },
  { id: 'gowns', label: 'Evening Gowns' },
  { id: 'suits', label: 'Suits & Tuxedos' },
  { id: 'barong', label: 'Filipiñana & Barong' }
];

export default function StaffNewRental() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialItemId = query.get('itemId');
  
  const preFilledItem = CATALOG_ITEMS.find(i => i.id === initialItemId) || null;

  // State
  const [step, setStep] = useState(preFilledItem ? 2 : 1);
  const [selectedItem, setSelectedItem] = useState(preFilledItem);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredItems = useMemo(() => {
    return CATALOG_ITEMS.filter(item => {
      if (item.status !== 'Available') return false;
      const matchesCategory = 
        activeCategory === 'all' || 
        (activeCategory === 'available' && item.isDiscounted) || 
        item.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleNext = () => {
    if (step === 1 && !selectedItem) return alert('Please select an item');
    // Updated validation to require address
    if (step === 2 && (!customer.name || !customer.contact || !customer.address)) return alert('Details required');
    if (step === 3) {
      setShowToast(true);
      setTimeout(() => {
        navigate('/receipt', { 
          state: { 
            txData: {
              id: `TXN-${Date.now()}`,
              date: new Date().toLocaleDateString(),
              returnDate: customer.returnDate,
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
    <div className="min-h-screen w-full bg-app-bg flex flex-col items-center antialiased"
         style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      <div className="relative flex flex-col w-full max-w-5xl grow bg-app-bg">
        
        {/* Toast Notification */}
        <div className={`fixed left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-50 transition-all duration-500 ${showToast ? 'top-10' : '-top-20'}`}>
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="font-black text-sm text-text-main tracking-tight">Finalizing</span>
        </div>

        {/* Header */}
        <div className="pt-8 px-6 pb-4 flex justify-between items-center md:px-12 md:pt-12">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-text-main hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-xl md:text-2xl font-black tracking-[-0.03em] text-[#111010]">New Rental</h1>
          <div className="w-6"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex px-6 py-6 items-center justify-center w-full md:px-12">
          <div className="flex w-full max-w-md">
            {[1, 2, 3].map((num) => (
              <div key={num} className="relative flex flex-col items-center flex-1">
                <div className={`z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[13px] md:text-base font-black transition-all duration-300 border-2 
                  ${step > num ? 'bg-green-500 border-green-500 text-white' : 
                    step === num ? 'bg-primary border-primary text-white' : 
                    'bg-white border-gray-200 text-gray-400'}`}>
                  {step > num ? '✓' : num}
                </div>
                <span className={`mt-2 text-[10px] md:text-xs font-black uppercase tracking-widest ${step === num ? 'text-primary' : 'text-gray-400'}`}>
                  {num === 1 ? 'Item' : num === 2 ? 'Customer' : 'Confirm'}
                </span>
                {num < 3 && (
                  <div className={`absolute top-4 md:top-5 left-1/2 w-full h-0.5 z-0 ${step > num ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="grow px-6 pt-4 pb-64 md:pb-12 md:px-12">
          <div className="max-w-4xl mx-auto">
            
            {/* STEP 1: Select Item */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-[#111010] tracking-[-0.04em]">Select Item</h2>
                      <p className="text-[15px] font-semibold text-[#8e8e93] mt-1 tracking-tight">Choose from our exclusive collection</p>
                    </div>
                    <div className="relative w-full md:w-72">
                      <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 pr-4 pl-11 border border-gray-200 rounded-2xl bg-white shadow-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm tracking-tight"
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                  </div>

                  {/* CATEGORIES SCROLL */}
                  <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all border
                          ${activeCategory === cat.id 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/10' 
                            : 'bg-white border-gray-100 text-[#8e8e93] hover:border-gray-300'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 border-dashed">
                    <p className="text-[#8e8e93] font-black tracking-tight">No items found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className={`bg-white rounded-[28px] p-4 flex items-center gap-4 cursor-pointer transition-all border-2 
                          ${selectedItem?.id === item.id ? 'border-primary shadow-md scale-[1.01]' : 'border-transparent shadow-sm hover:border-gray-100'}`}
                      >
                        <img src={item.imageUrl} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover" alt="" />
                        <div className="grow">
                          <p className="font-black text-base text-[#111010] tracking-tight">{item.name}</p>
                          <p className="text-sm text-[#8e8e93] font-bold tracking-tight">₱{item.baseRate.toLocaleString()}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                          ${selectedItem?.id === item.id ? 'bg-primary border-primary' : 'border-gray-200'}`}>
                          {selectedItem?.id === item.id && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Customer Info */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
                <h2 className="text-3xl md:text-4xl font-black text-[#111010] tracking-[-0.04em]">Customer Details</h2>
                <p className="text-[15px] font-semibold text-[#8e8e93] mt-1 mb-6 tracking-tight">Enter borrower information below</p>
                
                <div className="mb-8 flex items-center gap-4 bg-primary/5 p-4 rounded-[24px] border border-primary/10">
                  <img src={selectedItem?.imageUrl} className="w-14 h-14 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Selected for Rental</p>
                    <p className="font-black text-[#111010] tracking-tight">{selectedItem?.name}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-xs font-black text-primary underline px-2 tracking-tight">Change</button>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={customer.name} 
                      onChange={e => setCustomer({...customer, name: e.target.value})} 
                      className="w-full p-4 md:p-5 rounded-2xl bg-white border-none shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold tracking-tight"
                      placeholder="e.g. Maria Clara" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Contact Number</label>
                    <input 
                      type="tel" 
                      value={customer.contact} 
                      onChange={e => setCustomer({...customer, contact: e.target.value})} 
                      className="w-full p-4 md:p-5 rounded-2xl bg-white border-none shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold tracking-tight"
                      placeholder="09xx-xxx-xxxx" 
                    />
                  </div>
                  
                  {/* Added Address Field Here */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Address</label>
                    <input 
                      type="text" 
                      value={customer.address} 
                      onChange={e => setCustomer({...customer, address: e.target.value})} 
                      className="w-full p-4 md:p-5 rounded-2xl bg-white border-none shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold tracking-tight"
                      placeholder="e.g. 123 Rizal St, Brgy. San Jose" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Rental Date</label>
                      <input 
                        type="date" 
                        value={customer.rentalDate} 
                        onChange={e => setCustomer({...customer, rentalDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-white shadow-sm outline-none border-none font-bold tracking-tight" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Return Date</label>
                      <input 
                        type="date" 
                        value={customer.returnDate} 
                        onChange={e => setCustomer({...customer, returnDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-white shadow-sm outline-none border-none font-bold tracking-tight" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Receipt Preview */}
            {step === 3 && selectedItem && (
              <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-[#111010] tracking-[-0.04em]">Review Transaction</h2>
                  <p className="text-[15px] font-semibold text-[#8e8e93] mt-1 tracking-tight">Review the summary below</p>
                </div>
                
                <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 overflow-hidden border border-gray-100">
                  <div className="bg-primary p-8 text-white flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4">
                      <img src={selectedItem.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">{selectedItem.name}</h3>
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em] mt-1">Receipt Preview</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest mb-1">Customer</p>
                        <p className="text-sm font-black text-[#111010] truncate tracking-tight">{customer.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest mb-1">Due Date</p>
                        <p className="text-sm font-black text-[#111010] tracking-tight">{new Date(customer.returnDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                      <div className="flex justify-between text-sm font-bold tracking-tight">
                        <span className="text-[#8e8e93]">Base Rental Fee</span>
                        <span className="text-[#111010]">₱{selectedItem.baseRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold tracking-tight">
                        <span className="text-[#8e8e93]">Security Deposit</span>
                        <span className="text-[#111010]">₱{selectedItem.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gray-50">
                        <span className="text-lg font-black text-[#111010] tracking-tight">Total Amount</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">₱{(selectedItem.baseRate + selectedItem.deposit).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-4 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-app-bg -ml-4 border border-gray-100 shadow-inner"></div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-2"></div>
                    <div className="w-8 h-8 rounded-full bg-app-bg -mr-4 border border-gray-100 shadow-inner"></div>
                  </div>

                  <div className="p-8 pt-4">
                    <p className="text-[10px] text-center text-[#8e8e93] font-black leading-relaxed italic px-4 uppercase tracking-tighter">
                      Draft summary only. Final receipt generated on confirm.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ACTION BAR */}
        <div className="fixed bottom-20 left-0 right-0 p-4 pb-6 md:bottom-auto md:relative md:p-12 md:bg-transparent bg-white/95 backdrop-blur-xl rounded-t-[32px] md:rounded-none shadow-[0_-15px_40px_rgba(0,0,0,0.08)] md:shadow-none z-40">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row-reverse gap-3">
            <button 
              onClick={handleNext} 
              className="w-full md:flex-2 py-4 md:py-6 rounded-2xl md:rounded-[24px] font-black text-base md:text-xl shadow-xl transition-all bg-primary text-white shadow-primary/20 hover:brightness-110 active:scale-[0.98] tracking-tight"
            >
              {step === 3 ? 'Confirm & Process' : 'Continue to Details'}
            </button>
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)} 
                className="w-full md:flex-1 py-3 font-black text-sm md:text-lg text-[#8e8e93] hover:text-[#111010] transition-colors tracking-tight"
              >
                Go Back
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}