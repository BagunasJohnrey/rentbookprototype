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

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom / Measurements'];

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
  
  // Mobile Action Bar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  const [customer, setCustomer] = useState(() => {
    const now = new Date();
    const returnDate = new Date(now.getTime() + 3 * 86400000);
    return {
      name: '', contact: '', address: '', 
      size: '', measurements: {}, measurementsExpanded: true,
      rentalDate: now.toISOString().split('T')[0], 
      returnDate: returnDate.toISOString().split('T')[0],
      notes: '',
      photoUrl: null
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomer({ ...customer, photoUrl: URL.createObjectURL(file) });
    }
  };

  const renderMeasurementFields = () => {
    const isFemale = selectedItem?.category?.toLowerCase().includes('gown') || selectedItem?.category?.toLowerCase().includes('dress') || selectedItem?.category?.toLowerCase().includes('female');
    const fields = isFemale 
      ? ['bust', 'waist', 'hips', 'shoulderToFloor', 'shoulderWidth']
      : ['shoulder', 'chest', 'waist', 'sleeveLength', 'pantsLength', 'neck'];

    return (
      <div className="mt-3 pt-3 border-t border-border-soft transition-all col-span-1 md:col-span-2">
        <button 
          onClick={() => setCustomer({...customer, measurementsExpanded: !customer.measurementsExpanded})}
          className="w-full flex items-center justify-between focus:outline-none pb-1 group"
        >
          <p className="text-[10px] font-black text-text-main uppercase tracking-widest group-hover:text-primary transition-colors">Custom Measurements</p>
          <div className="w-6 h-6 flex items-center justify-center bg-app-bg rounded-full text-text-main group-hover:text-primary transition-colors">
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${customer.measurementsExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-300 ease-in-out overflow-hidden ${customer.measurementsExpanded ? 'max-h-125 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
          {fields.map((field) => (
            <div key={field}>
              <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input 
                type="text" placeholder="in" value={customer.measurements?.[field] || ''} 
                onChange={e => setCustomer({...customer, measurements: {...customer.measurements, [field]: e.target.value}})}
                className="w-full p-3 bg-app-bg rounded-xl font-bold text-xs text-text-main border border-transparent focus:border-primary/30 outline-none transition-all" 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleNext = () => {
    if (step === 1 && !selectedItem) return alert('Please select an item');
    if (step === 2) {
      if (!customer.name || !customer.contact || !customer.address) return alert('Customer contact details are required');
      if (!customer.size) return alert('Please select a size');
    }
    
    if (step === 3) {
      setShowToast(true);
      setTimeout(() => {
        navigate('/receipt', { 
          state: { 
            txData: {
              id: `TXN-${Date.now().toString().slice(-6)}`,
              date: customer.rentalDate,
              returnDate: customer.returnDate,
              customer: customer.name,
              item: selectedItem.name,
              size: customer.size,
              measurements: customer.size === 'Custom / Measurements' ? customer.measurements : null,
              baseRate: selectedItem.baseRate,
              deposit: selectedItem.deposit,
              total: selectedItem.baseRate + selectedItem.deposit,
              notes: customer.notes,
              rentalPhotoUrl: customer.photoUrl
            }
          } 
        });
      }, 1200);
      return;
    }
    setStep(prev => prev + 1);
    setIsMobileMenuOpen(true);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setIsMobileMenuOpen(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-app-bg flex flex-col items-center antialiased"
         style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      <div className="relative flex flex-col w-full max-w-5xl grow bg-app-bg">
        
        {/* Toast Notification */}
        <div className={`fixed left-1/2 -translate-x-1/2 bg-success text-white backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-50 transition-all duration-500 ${showToast ? 'top-10' : '-top-20'}`}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="font-black text-sm tracking-widest uppercase">Processing</span>
        </div>

        {/* Header */}
        <div className="pt-8 px-6 pb-4 flex justify-between items-center md:px-12 md:pt-12">
          <button onClick={handleBack} className="text-text-main hover:scale-110 hover:text-primary transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-xl md:text-2xl font-black tracking-[-0.03em] text-text-main">New Rental</h1>
          <div className="w-6"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex px-6 py-6 items-center justify-center w-full md:px-12 animate-slide-up">
          <div className="flex w-full max-w-md">
            {[1, 2, 3].map((num) => (
              <div key={num} className="relative flex flex-col items-center flex-1">
                <div className={`z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[13px] md:text-base font-black transition-all duration-300 border-2 
                  ${step >= num ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-app-card border-border-soft text-text-muted'}`}>
                  {step > num ? '✓' : num}
                </div>
                <span className={`mt-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${step >= num ? 'text-primary' : 'text-text-muted'}`}>
                  {num === 1 ? 'Item' : num === 2 ? 'Customer' : 'Confirm'}
                </span>
                {num < 3 && (
                  <div className={`absolute top-4 md:top-5 left-1/2 w-full h-0.5 z-0 transition-colors ${step > num ? 'bg-primary' : 'bg-border-soft'}`}></div>
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
                      <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Select Item</h2>
                      <p className="text-[15px] font-semibold text-text-muted mt-1 tracking-tight">Choose from our available collection.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                      <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 pr-4 pl-11 border border-border-soft rounded-2xl bg-app-card text-text-main shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm tracking-tight placeholder:text-text-muted"
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                  </div>

                  {/* CATEGORIES SCROLL */}
                  <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all border
                          ${activeCategory === cat.id 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/10' 
                            : 'bg-app-card border-border-soft text-text-muted hover:border-primary/30 hover:text-primary'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="text-center py-20 bg-app-card rounded-[32px] border border-border-soft border-dashed">
                    <p className="text-text-muted font-black tracking-tight">No items found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className={`bg-app-card rounded-[28px] p-4 flex items-center gap-4 cursor-pointer transition-all border-2 
                          ${selectedItem?.id === item.id ? 'border-primary shadow-md scale-[1.01]' : 'border-transparent shadow-sm hover:border-border-soft'}`}
                      >
                        <img src={item.imageUrl} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover bg-app-bg" alt="" />
                        <div className="grow">
                          <p className="font-black text-base text-text-main tracking-tight line-clamp-1">{item.name}</p>
                          <p className="text-sm text-text-muted font-bold tracking-tight">₱{item.baseRate.toLocaleString()}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                          ${selectedItem?.id === item.id ? 'bg-primary border-primary' : 'border-border-soft'}`}>
                          {selectedItem?.id === item.id && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Customer Info & Photos */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
                <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Rental Details</h2>
                <p className="text-[15px] font-semibold text-text-muted mt-1 mb-6 tracking-tight">Borrower info, sizes, and condition capture.</p>
                
                <div className="mb-8 flex items-center gap-4 bg-app-card p-4 rounded-[24px] border border-border-soft shadow-sm">
                  <img src={selectedItem?.imageUrl} className="w-14 h-14 rounded-xl object-cover bg-app-bg" alt="" />
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Selected Item</p>
                    <p className="font-black text-text-main tracking-tight">{selectedItem?.name}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-[10px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-primary/10 transition-colors">Change</button>
                </div>

                <div className="space-y-5 bg-app-card p-6 rounded-[32px] shadow-sm border border-border-soft">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={customer.name} 
                      onChange={e => setCustomer({...customer, name: e.target.value})} 
                      className="w-full p-4 rounded-2xl bg-app-bg text-text-main border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                      placeholder="e.g. Maria Clara" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Contact Number</label>
                      <input 
                        type="tel" 
                        value={customer.contact} 
                        onChange={e => setCustomer({...customer, contact: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                        placeholder="09xx-xxx-xxxx" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Address</label>
                      <input 
                        type="text" 
                        value={customer.address} 
                        onChange={e => setCustomer({...customer, address: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                        placeholder="e.g. 123 Rizal St" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-soft pt-5">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-text-main uppercase tracking-widest ml-1">Item Size</label>
                      <select 
                        value={customer.size} 
                        onChange={e => setCustomer({...customer, size: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold tracking-tight transition-all appearance-none"
                      >
                        <option value="" className="text-text-muted">-- Select Size --</option>
                        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {customer.size === 'Custom / Measurements' && renderMeasurementFields()}

                    <div className="flex flex-col gap-2 mt-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Rental Date</label>
                      <input 
                        type="date" 
                        value={customer.rentalDate} 
                        onChange={e => setCustomer({...customer, rentalDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main outline-none border-none font-bold tracking-tight text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Return Date</label>
                      <input 
                        type="date" 
                        value={customer.returnDate} 
                        onChange={e => setCustomer({...customer, returnDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main outline-none border-none font-bold tracking-tight text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-border-soft mt-5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Remarks / Notes</label>
                    <textarea 
                      value={customer.notes} 
                      onChange={e => setCustomer({...customer, notes: e.target.value})} 
                      className="w-full p-4 rounded-2xl bg-app-bg text-text-main border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-h-24 resize-none transition-all placeholder:text-text-muted/50"
                      placeholder="Special instructions, initial condition notes..." 
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Release Photo (Optional)</label>
                     <div className="relative h-40 sm:h-48 bg-app-bg rounded-2xl sm:rounded-3xl border-2 border-dashed border-border-soft flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-primary/30">
                       {customer.photoUrl ? (
                         <>
                           <img src={customer.photoUrl} className="w-full h-full object-cover" alt="Condition" />
                           <button type="button" onClick={() => setCustomer({...customer, photoUrl: null})} className="absolute top-3 right-3 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         </>
                       ) : (
                         <>
                           <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-app-card rounded-2xl shadow-sm flex items-center justify-center mb-2 text-text-muted group-hover:text-primary transition-colors border border-border-soft">
                             <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                           </div>
                           <p className="text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-wider">Tap to Take Photo</p>
                         </>
                       )}
                     </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: Receipt Preview */}
            {step === 3 && selectedItem && (
              <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-text-main tracking-tight">Review Transaction</h2>
                  <p className="text-[15px] font-semibold text-text-muted mt-1 tracking-tight">Finalize the rental details below</p>
                </div>
                
                <div className="bg-app-card rounded-[40px] shadow-2xl shadow-primary/5 overflow-hidden border border-border-soft">
                  <div className="bg-primary p-8 text-white flex flex-col items-center relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-[40px]"></div>
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 z-10 p-1">
                      <img src={selectedItem.imageUrl} className="w-full h-full rounded-2xl object-cover shadow-lg bg-primary-dark" alt="" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight z-10 text-center">{selectedItem.name}</h3>
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 z-10">Receipt Preview</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Customer</p>
                        <p className="text-sm font-black text-text-main truncate tracking-tight">{customer.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Due Date</p>
                        <p className="text-sm font-black text-text-main tracking-tight">{new Date(customer.returnDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border-soft">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Size & Specs</p>
                      <p className="text-sm font-black text-text-main">{customer.size}</p>
                      {customer.size === 'Custom / Measurements' && (
                         <div className="mt-2 text-text-main bg-app-bg p-2.5 rounded-xl text-xs font-bold inline-block border border-border-soft">
                           {Object.entries(customer.measurements).filter(([, v]) => v).map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}"`).join(', ') || 'No measurements entered'}
                         </div>
                      )}
                    </div>

                    {(customer.notes || customer.photoUrl) && (
                      <div className="pt-4 border-t border-border-soft">
                         {customer.notes && (
                           <div className="mb-3">
                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Remarks / Notes</p>
                             <p className="text-xs font-medium text-text-main italic bg-app-bg p-3 rounded-xl border border-border-soft">"{customer.notes}"</p>
                           </div>
                         )}
                         {customer.photoUrl && (
                           <div>
                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Release Photo Attached</p>
                             <div className="w-full h-24 rounded-xl overflow-hidden border border-border-soft">
                               <img src={customer.photoUrl} className="w-full h-full object-cover" alt="Condition preview"/>
                             </div>
                           </div>
                         )}
                      </div>
                    )}

                    <div className="space-y-3 pt-6 border-t-2 border-dashed border-border-soft">
                      <div className="flex justify-between text-sm font-bold tracking-tight">
                        <span className="text-text-muted">Base Rental Fee</span>
                        <span className="text-text-main">₱{selectedItem.baseRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold tracking-tight">
                        <span className="text-text-muted">Security Deposit</span>
                        <span className="text-text-main">₱{selectedItem.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 mt-2 border-t border-border-soft">
                        <span className="text-lg font-black text-text-main tracking-tight">Total Amount</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">₱{(selectedItem.baseRate + selectedItem.deposit).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-4 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-app-bg -ml-4 border border-border-soft shadow-inner"></div>
                    <div className="flex-1 border-t-2 border-dashed border-border-soft mx-2"></div>
                    <div className="w-8 h-8 rounded-full bg-app-bg -mr-4 border border-border-soft shadow-inner"></div>
                  </div>

                  <div className="p-8 pt-4">
                    <p className="text-[10px] text-center text-text-muted font-black leading-relaxed px-4 uppercase tracking-widest">
                      Draft summary only. Process to finalize.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* DESKTOP ACTION BAR */}
          <div className="hidden md:flex max-w-2xl mx-auto mt-12 gap-4 pb-12">
            {step > 1 && (
              <button 
                onClick={handleBack} 
                className="flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all bg-app-card border border-border-soft text-text-muted hover:text-primary hover:border-primary/30"
              >
                Go Back
              </button>
            )}
            <button 
              onClick={handleNext} 
              className="flex-2 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl transition-all bg-primary text-white shadow-primary/20 hover:bg-primary-dark active:scale-[0.98]"
            >
              {step === 3 ? 'Confirm & Process' : 'Continue to Next Step'}
            </button>
          </div>

        </main>

        {/* COLLAPSIBLE MOBILE FLOATING ACTION BAR */}
        <div className="md:hidden fixed bottom-[70px] sm:bottom-0 left-0 right-0 z-40">
          <div className="bg-app-card/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] border-t border-border-soft px-5 transition-all duration-300 overflow-hidden">
            
            {/* Drawer Drag Handle */}
            <div 
              className="w-full flex flex-col items-center justify-center py-4 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-10 h-1.5 bg-border-soft rounded-full mb-2"></div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isMobileMenuOpen ? 'text-text-muted' : 'text-primary'}`}>
                  {isMobileMenuOpen ? 'Minimize' : 'Show Actions'}
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180 text-text-muted' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Action Buttons (Collapses when minimized) */}
            <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 pointer-events-none'}`}>
              {step > 1 && (
                <button 
                  onClick={handleBack} 
                  className="w-full py-3.5 font-black text-sm text-text-muted hover:text-primary bg-app-bg rounded-[16px] transition-colors border border-border-soft uppercase tracking-widest"
                >
                  Go Back
                </button>
              )}
              <button 
                onClick={handleNext} 
                className="w-full py-4 rounded-[20px] font-black text-sm shadow-xl transition-all bg-primary text-white shadow-primary/20 active:scale-[0.98] uppercase tracking-widest hover:bg-primary-dark"
              >
                {step === 3 ? 'Confirm & Process' : 'Continue'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}