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

// Pure ID counter to avoid Date.now() / Math.random() hook purity errors
let globalCartCounter = 1; 

export default function StaffNewRental() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialItemId = query.get('itemId');
  
  const preFilledItem = CATALOG_ITEMS.find(i => i.id === initialItemId) || null;

  // Global Flow State
  const [step, setStep] = useState(preFilledItem ? 2 : 1);
  const [rentalType, setRentalType] = useState(preFilledItem ? 'single' : null); // 'single' | 'bulk'
  const [showToast, setShowToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  // Catalog State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart & Item State (Lazy initializer to ensure purity)
  const [selectedItems, setSelectedItems] = useState(() => 
    preFilledItem ? [{ ...preFilledItem, cartId: `cart-item-${globalCartCounter++}`, assignee: '', size: '', measurements: {}, measurementsExpanded: true }] : []
  );
  const [isCartMinimized, setIsCartMinimized] = useState(false);

  // Customer & Payment State
  const [customer, setCustomer] = useState(() => {
    const now = new Date();
    const returnDate = new Date(now.getTime() + 3 * 86400000);
    return {
      name: '', contact: '', address: '', 
      rentalDate: now.toISOString().split('T')[0], 
      returnDate: returnDate.toISOString().split('T')[0],
      notes: '',
      photoUrl: null
    };
  });
  
  // Downpayment State
  const [includeDownpayment, setIncludeDownpayment] = useState(false);
  const [downpaymentAmount, setDownpaymentAmount] = useState('');

  // Derived Totals
  const totals = useMemo(() => {
    let base = 0;
    selectedItems.forEach(i => {
      base += i.baseRate;
    });
    
    let dp = includeDownpayment ? (Number(downpaymentAmount) || 0) : 0;
    return { baseRate: base, downpayment: dp, balance: base - dp };
  }, [selectedItems, includeDownpayment, downpaymentAmount]);

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

  const handleTypeSelect = (type) => {
    if (type === 'wedding') {
      navigate('/staff-wedding-order');
    } else {
      setRentalType(type);
      setStep(2);
      setIsMobileMenuOpen(true);
    }
  };

  const toggleItemInCart = (item) => {
    const newCartId = `cart-item-${globalCartCounter++}`;
    if (rentalType === 'single') {
      setSelectedItems([{ ...item, cartId: newCartId, assignee: '', size: '', measurements: {}, measurementsExpanded: true }]);
    } else {
      setSelectedItems([...selectedItems, { ...item, cartId: newCartId, assignee: '', size: '', measurements: {}, measurementsExpanded: true }]);
      setIsCartMinimized(false); // Auto-expand cart when a new item is added
    }
  };

  const removeCartItem = (cartId) => {
    setSelectedItems(selectedItems.filter(i => i.cartId !== cartId));
  };

  const updateCartItem = (cartId, field, value) => {
    setSelectedItems(items => items.map(i => i.cartId === cartId ? { ...i, [field]: value } : i));
  };

  const updateCartMeasurement = (cartId, field, value) => {
    setSelectedItems(items => items.map(i => {
      if (i.cartId === cartId) {
        return { ...i, measurements: { ...i.measurements, [field]: value } };
      }
      return i;
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCustomer({ ...customer, photoUrl: URL.createObjectURL(file) });
  };

  const renderMeasurementFields = (cartItem) => {
    const isFemale = cartItem.category?.toLowerCase().includes('gown') || cartItem.category?.toLowerCase().includes('dress') || cartItem.category?.toLowerCase().includes('female');
    const fields = isFemale 
      ? ['bust', 'waist', 'hips', 'shoulderToFloor', 'shoulderWidth']
      : ['shoulder', 'chest', 'waist', 'sleeveLength', 'pantsLength', 'neck'];

    return (
      <div className="mt-3 pt-3 border-t border-border-soft transition-all col-span-1 md:col-span-2">
        <button 
          onClick={() => updateCartItem(cartItem.cartId, 'measurementsExpanded', !cartItem.measurementsExpanded)}
          className="w-full flex items-center justify-between focus:outline-none pb-1 group"
        >
          <p className="text-[10px] font-black text-text-main uppercase tracking-widest group-hover:text-primary transition-colors">Custom Measurements</p>
          <div className="w-6 h-6 flex items-center justify-center bg-app-bg rounded-full text-text-main group-hover:text-primary transition-colors">
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${cartItem.measurementsExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-300 ease-in-out overflow-hidden ${cartItem.measurementsExpanded ? 'max-h-125 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
          {fields.map((field) => (
            <div key={field}>
              <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input 
                type="number" placeholder="in" value={cartItem.measurements?.[field] || ''} 
                onChange={e => updateCartMeasurement(cartItem.cartId, field, e.target.value)}
                className="w-full p-3 bg-app-bg rounded-xl font-bold text-xs text-text-main border border-transparent focus:border-primary/30 outline-none transition-all" 
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleNext = () => {
    if (step === 1 && !rentalType) return alert('Please select a rental type.');
    if (step === 2 && selectedItems.length === 0) return alert('Please select at least one item.');
    if (step === 3) {
      if (!customer.name || !customer.contact || !customer.address) return alert('Main customer details are required.');
      const invalidItem = selectedItems.find(i => !i.size || (rentalType === 'bulk' && !i.assignee));
      if (invalidItem) return alert('Please ensure all items have an assigned size' + (rentalType === 'bulk' ? ' and assignee name.' : '.'));
    }
    
    if (step === 4) {
      setShowToast(true);
      setTimeout(() => {
        const payloadItems = selectedItems.map(i => ({
          itemId: i.id,
          name: rentalType === 'bulk' ? i.assignee : customer.name,
          role: rentalType === 'bulk' ? 'Participant' : 'Primary',
          size: i.size,
          measurements: i.size === 'Custom / Measurements' ? i.measurements : null,
          returned: false,
          isPaid: false
        }));

        navigate('/staff-history', { 
          state: { 
            newTransaction: {
              txId: `TXN-${new Date().getTime().toString().slice(-6)}`,
              type: rentalType,
              status: 'active',
              customerName: customer.name,
              dueDate: customer.returnDate,
              totalAmount: totals.baseRate,
              downpayment: totals.downpayment,
              balance: totals.balance,
              isPaid: totals.balance <= 0,
              notes: customer.notes,
              rentalPhotoUrl: customer.photoUrl,
              items: payloadItems,
              item: rentalType === 'single' ? selectedItems[0] : { name: `Bulk Rental (${selectedItems.length} items)`, imageUrl: selectedItems[0]?.imageUrl }
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
          <span className="font-black text-sm tracking-widest uppercase">Generating Order</span>
        </div>

        {/* Header */}
        <div className="pt-8 px-6 pb-4 flex justify-between items-center md:px-12 md:pt-12">
          <button onClick={handleBack} className="text-text-main hover:scale-110 hover:text-primary transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-xl md:text-2xl font-black tracking-[-0.03em] text-text-main">
            {step === 1 ? 'New Rental' : rentalType === 'single' ? 'Single Rental' : 'Bulk Rental'}
          </h1>
          <div className="w-6"></div>
        </div>

        {/* Progress Steps */}
        <div className="flex px-6 py-6 items-center justify-center w-full md:px-12 animate-slide-up">
          <div className="flex w-full max-w-lg">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative flex flex-col items-center flex-1">
                <div className={`z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[13px] md:text-base font-black transition-all duration-300 border-2 
                  ${step >= num ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-app-card border-border-soft text-text-muted'}`}>
                  {step > num ? '✓' : num}
                </div>
                <span className={`mt-2 text-[9px] md:text-xs font-black uppercase tracking-widest transition-colors ${step >= num ? 'text-primary' : 'text-text-muted'}`}>
                  {num === 1 ? 'Type' : num === 2 ? 'Items' : num === 3 ? 'Details' : 'Confirm'}
                </span>
                {num < 4 && (
                  <div className={`absolute top-4 md:top-5 left-1/2 w-full h-0.5 z-0 transition-colors ${step > num ? 'bg-primary' : 'bg-border-soft'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="grow px-6 pt-4 pb-64 md:pb-12 md:px-12">
          <div className="max-w-4xl mx-auto">
            
            {/* STEP 1: Select Rental Type */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Rental Type</h2>
                  <p className="text-[15px] font-semibold text-text-muted mt-1 tracking-tight">Select the appropriate booking flow.</p>
                </div>
                <div className="grid gap-5">
                  <button onClick={() => handleTypeSelect('single')} className="bg-app-card border-2 border-border-soft hover:border-primary p-6 md:p-8 rounded-4xl text-left transition-all hover:shadow-lg group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-text-main tracking-tight">Single Item Rental</h3>
                        <p className="text-sm font-semibold text-text-muted mt-1">Standard booking for an individual borrower.</p>
                      </div>
                    </div>
                  </button>

                  <button onClick={() => handleTypeSelect('bulk')} className="bg-app-card border-2 border-border-soft hover:border-primary p-6 md:p-8 rounded-4xl text-left transition-all hover:shadow-lg group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-text-main tracking-tight">Bulk / Group Rental</h3>
                        <p className="text-sm font-semibold text-text-muted mt-1">Rent multiple costumes/items under one booking.</p>
                      </div>
                    </div>
                  </button>

                  <button onClick={() => handleTypeSelect('wedding')} className="bg-primary border-2 border-primary hover:bg-primary-dark p-6 md:p-8 rounded-4xl text-left transition-all shadow-lg shadow-primary/20 group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-2xl leading-none">💍</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Wedding Package</h3>
                        <p className="text-sm font-semibold text-white/80 mt-1">Complete setup for Bride, Groom, and Entourage.</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Select Item(s) with Cart List */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-6 mb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Catalog</h2>
                      <p className="text-[15px] font-semibold text-text-muted mt-1 tracking-tight">
                        {rentalType === 'single' ? 'Select an item to rent.' : 'Add multiple items to your booking.'}
                      </p>
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
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-app-card border-border-soft text-text-muted hover:border-primary/30 hover:text-primary'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visible Animated Cart for Bulk / Specific Removal */}
                {selectedItems.length > 0 && (
                   <div className="mb-6 bg-app-card rounded-3xl border border-primary/20 shadow-sm animate-in fade-in overflow-hidden transition-all duration-300">
                     <div 
                        className="p-4 border-b border-border-soft flex justify-between items-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setIsCartMinimized(!isCartMinimized)}
                     >
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-black text-primary uppercase tracking-widest">Selected Items ({selectedItems.length})</p>
                           <svg className={`w-4 h-4 text-primary transition-transform duration-300 ${isCartMinimized ? '-rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                           </svg>
                        </div>
                        <button 
                           onClick={(e) => { e.stopPropagation(); setSelectedItems([]); setIsCartMinimized(false); }} 
                           className="text-[10px] font-black text-text-muted hover:text-primary transition-colors uppercase tracking-widest px-2 py-1 rounded hover:bg-white"
                        >
                           Clear All
                        </button>
                     </div>
                     
                     <div className={`transition-all duration-300 ease-in-out ${isCartMinimized ? 'max-h-0 opacity-0' : 'max-h-125 opacity-100'}`}>
                       <div className="max-h-48 overflow-y-auto p-2 scrollbar-hide">
                          {selectedItems.map((item) => (
                             <div key={item.cartId} className="flex items-center justify-between p-2 hover:bg-app-bg rounded-xl transition-colors border border-transparent hover:border-border-soft group">
                                <div className="flex items-center gap-3">
                                   <img src={item.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-app-bg border border-border-soft" alt="" />
                                   <div>
                                      <p className="text-xs font-black text-text-main line-clamp-1">{item.name}</p>
                                      <p className="text-[10px] font-bold text-text-muted">₱{item.baseRate.toLocaleString()}</p>
                                   </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); removeCartItem(item.cartId); }} className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white bg-app-bg hover:bg-primary rounded-full transition-all" title="Remove Item">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                             </div>
                          ))}
                       </div>
                     </div>
                   </div>
                )}

                {filteredItems.length === 0 ? (
                  <div className="text-center py-20 bg-app-card rounded-4xl border border-border-soft border-dashed">
                    <p className="text-text-muted font-black tracking-tight">No items found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map(item => {
                      const count = selectedItems.filter(i => i.id === item.id).length;
                      const isSelected = count > 0;

                      return (
                        <div 
                          key={item.id} 
                          onClick={() => toggleItemInCart(item)}
                          className={`bg-app-card rounded-4xl p-4 flex items-center gap-4 cursor-pointer transition-all border-2 relative overflow-hidden
                            ${rentalType === 'single' && isSelected ? 'border-primary shadow-md scale-[1.01]' : 'border-transparent shadow-sm hover:border-border-soft'}`}
                        >
                          {rentalType === 'bulk' && isSelected && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                               {count} IN CART
                            </div>
                          )}

                          <img src={item.imageUrl} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover bg-app-bg border border-border-soft" alt="" />
                          <div className="grow pr-2">
                            <p className="font-black text-base text-text-main tracking-tight line-clamp-1">{item.name}</p>
                            <p className="text-sm text-text-muted font-bold tracking-tight">₱{item.baseRate.toLocaleString()}</p>
                          </div>
                          
                          {rentalType === 'single' ? (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                              ${isSelected ? 'bg-primary border-primary' : 'border-border-soft'}`}>
                              {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-app-bg border border-border-soft flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors" title="Add to Cart">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Customer Info, Item Specs & Photos */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Booking Details</h2>
                  <p className="text-[15px] font-semibold text-text-muted mt-1 tracking-tight">Assign sizes and customer info.</p>
                </div>

                {/* GLOBAL CUSTOMER DETAILS */}
                <div className="space-y-5 bg-app-card p-6 md:p-8 rounded-4xl shadow-sm border border-border-soft">
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest border-b border-border-soft pb-2 mb-4">Main Booker Details</h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={customer.name} 
                      onChange={e => setCustomer({...customer, name: e.target.value})} 
                      className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/10 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
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
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/10 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                        placeholder="09xx-xxx-xxxx" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Address</label>
                      <input 
                        type="text" 
                        value={customer.address} 
                        onChange={e => setCustomer({...customer, address: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/10 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                        placeholder="e.g. 123 Rizal St" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Rental Date</label>
                      <input 
                        type="date" 
                        value={customer.rentalDate} 
                        onChange={e => setCustomer({...customer, rentalDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none font-bold tracking-tight text-sm focus:ring-2 focus:ring-primary/10 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Return Date</label>
                      <input 
                        type="date" 
                        value={customer.returnDate} 
                        onChange={e => setCustomer({...customer, returnDate: e.target.value})} 
                        className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none font-bold tracking-tight text-sm focus:ring-2 focus:ring-primary/10 transition-all" 
                      />
                    </div>
                  </div>
                  
                  {/* OPTIONAL DOWNPAYMENT */}
                  <div className="pt-4 border-t border-border-soft flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs font-black text-text-main tracking-tight">Downpayment</p>
                         <p className="text-[10px] text-text-muted font-bold mt-0.5 uppercase tracking-widest">Optional partial payment</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={includeDownpayment} onChange={(e) => setIncludeDownpayment(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-border-soft peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                       </label>
                     </div>
                     {includeDownpayment && (
                       <div className="relative animate-in fade-in slide-in-from-top-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-text-muted">₱</span>
                          <input
                            type="number"
                            value={downpaymentAmount}
                            onChange={(e) => setDownpaymentAmount(e.target.value)}
                            className="w-full p-4 pl-8 rounded-2xl bg-app-bg text-text-main border border-border-soft outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                            placeholder="Enter amount..."
                          />
                       </div>
                     )}
                  </div>
                </div>

                {/* ITEM SPECS (Dynamic mapping) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest pl-2">Item Configurations</h3>
                  
                  {selectedItems.map((cartItem, idx) => (
                    <div key={cartItem.cartId} className="bg-app-card p-5 md:p-6 rounded-4xl shadow-sm border border-border-soft relative group">
                      
                      <button onClick={() => removeCartItem(cartItem.cartId)} className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary/20 transition-colors z-10 flex items-center gap-1 bg-app-bg px-3 py-1.5 rounded-lg border border-border-soft">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                         Remove
                      </button>

                      <div className="flex items-center gap-4 mb-5 border-b border-border-soft pb-4 pt-1 pr-20">
                        <img src={cartItem.imageUrl} className="w-14 h-14 rounded-xl object-cover bg-app-bg border border-border-soft" alt="" />
                        <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Item {idx + 1}</p>
                          <p className="font-black text-text-main tracking-tight line-clamp-1">{cartItem.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rentalType === 'bulk' && (
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Assignee Name</label>
                            <input 
                              type="text" 
                              value={cartItem.assignee} 
                              onChange={e => updateCartItem(cartItem.cartId, 'assignee', e.target.value)} 
                              className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/10 text-sm font-bold tracking-tight transition-all placeholder:text-text-muted/50"
                              placeholder="Who is wearing this?" 
                            />
                          </div>
                        )}
                        <div className={`flex flex-col gap-2 ${rentalType === 'single' ? 'md:col-span-2' : ''}`}>
                          <label className="text-[10px] font-black text-text-main uppercase tracking-widest ml-1">Item Size</label>
                          <select 
                            value={cartItem.size} 
                            onChange={e => updateCartItem(cartItem.cartId, 'size', e.target.value)} 
                            className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/10 text-sm font-bold tracking-tight transition-all appearance-none"
                          >
                            <option value="" className="text-text-muted">-- Select Size --</option>
                            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        
                        {cartItem.size === 'Custom / Measurements' && renderMeasurementFields(cartItem)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* EXTRA DETAILS & PHOTOS */}
                <div className="space-y-5 bg-app-card p-6 md:p-8 rounded-4xl shadow-sm border border-border-soft">
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest border-b border-border-soft pb-2 mb-4">Documentation</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Remarks / Notes</label>
                    <textarea 
                      value={customer.notes} 
                      onChange={e => setCustomer({...customer, notes: e.target.value})} 
                      className="w-full p-4 rounded-2xl bg-app-bg text-text-main border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/10 text-sm font-medium min-h-24 resize-none transition-all placeholder:text-text-muted/50"
                      placeholder="Special instructions, overall condition notes..." 
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
                             <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                           </div>
                           <p className="text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-wider">Tap to Take Photo</p>
                         </>
                       )}
                     </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 4: Receipt Preview */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black text-text-main tracking-tight">Review Transaction</h2>
                  <p className="text-[15px] font-semibold text-text-muted mt-1 tracking-tight">Finalize the rental details below</p>
                </div>
                
                <div className="bg-app-card rounded-[40px] shadow-2xl shadow-primary/5 overflow-hidden border border-border-soft">
                  <div className="bg-primary p-8 text-white flex flex-col items-center relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3 z-10 border border-white/20">
                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-black tracking-tight z-10 text-center">
                       {rentalType === 'single' ? selectedItems[0]?.name : `Bulk Rental (${selectedItems.length} Items)`}
                    </h3>
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

                    {/* Breakdown of items */}
                    <div className="pt-4 border-t border-border-soft space-y-3">
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Item Breakdown</p>
                       {selectedItems.map((item) => (
                         <div key={item.cartId} className="flex justify-between items-start">
                            <div className="pr-2">
                               <p className="text-xs font-black text-text-main leading-tight">{item.name}</p>
                               <p className="text-[10px] font-bold text-text-muted mt-0.5">
                                 {rentalType === 'bulk' ? `${item.assignee} • Size: ${item.size}` : `Size: ${item.size}`}
                               </p>
                            </div>
                            <p className="text-xs font-black text-text-main shrink-0">₱{item.baseRate.toLocaleString()}</p>
                         </div>
                       ))}
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
                        <span className="text-text-muted">Total Rental Fee</span>
                        <span className="text-text-main">₱{totals.baseRate.toLocaleString()}</span>
                      </div>
                      {includeDownpayment && totals.downpayment > 0 && (
                        <div className="flex justify-between text-sm font-bold tracking-tight text-primary">
                          <span>Less: Downpayment</span>
                          <span>- ₱{totals.downpayment.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-end pt-4 mt-2 border-t border-border-soft">
                        <span className="text-lg font-black text-text-main tracking-tight">Balance Due</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">₱{totals.balance.toLocaleString()}</span>
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
              {step === 4 ? 'Confirm & Process' : 'Continue to Next Step'}
            </button>
          </div>

        </main>

        {/* COLLAPSIBLE MOBILE FLOATING ACTION BAR */}
        <div className="md:hidden fixed bottom-17.5 sm:bottom-0 left-0 right-0 z-40">
          <div className="bg-app-card/95 backdrop-blur-xl rounded-t-4xl shadow-[0_-15px_40px_rgba(0,0,0,0.08)] border-t border-border-soft px-5 transition-all duration-300 overflow-hidden">
            
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
            <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-50 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 pointer-events-none'}`}>
              {step > 1 && (
                <button 
                  onClick={handleBack} 
                  className="w-full py-3.5 font-black text-sm text-text-muted hover:text-primary bg-app-bg rounded-2xl transition-colors border border-border-soft uppercase tracking-widest"
                >
                  Go Back
                </button>
              )}
              <button 
                onClick={handleNext} 
                className="w-full py-4 rounded-[20px] font-black text-sm shadow-xl transition-all bg-primary text-white shadow-primary/20 active:scale-[0.98] uppercase tracking-widest hover:bg-primary-dark"
              >
                {step === 4 ? 'Confirm & Process' : 'Continue'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}