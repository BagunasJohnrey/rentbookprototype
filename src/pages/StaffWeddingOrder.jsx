// src/pages/StaffWeddingOrder.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

const MOTIFS = ['Traditional', 'Fantasy', 'Modern', 'Rustic', 'Bohemian', 'Filipiniana', 'Other'];
const ROLES = ['Maid of Honor', 'Best Man', 'Bridesmaid', 'Groomsman', 'Flower Girl', 'Bearer', 'Parent of Bride', 'Parent of Groom'];
const CATALOG_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'gowns', label: 'Gowns & Dresses (Female)' },
  { id: 'suits', label: 'Suits & Tuxedos (Male)' },
  { id: 'barong', label: 'Barong Tagalog (Male)' }
];

export default function StaffWeddingOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCatalog, setShowCatalog] = useState(false);
  const [activeSelection, setActiveSelection] = useState(null); 
  
  // Mobile Action Bar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  // Catalog Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [weddingData, setWeddingData] = useState({
    brideName: '', 
    brideContact: '',
    brideAddress: '',
    groomName: '', 
    groomContact: '',
    groomAddress: '',
    motif: '',
    motifColor: '',
    motifNotes: '', 
    brideOutfitId: '', 
    groomOutfitId: '',
    participants: [] 
  });

  const getItem = (id) => CATALOG_ITEMS.find(item => item.id === id) || { name: 'Not Selected', baseRate: 0, deposit: 0 };
  
  const filteredCatalogItems = useMemo(() => {
    return CATALOG_ITEMS.filter(item => {
      if (item.status !== 'Available') return false;
      const matchesCategory = activeCategory === 'all' || item.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totals = useMemo(() => {
    const brideItem = getItem(weddingData.brideOutfitId);
    const groomItem = getItem(weddingData.groomOutfitId);
    const participantsTotal = weddingData.participants.reduce((sum, p) => sum + getItem(p.itemId).baseRate, 0);
    const depositsTotal = brideItem.deposit + groomItem.deposit + 
                          weddingData.participants.reduce((sum, p) => sum + getItem(p.itemId).deposit, 0);
    
    return {
      subtotal: brideItem.baseRate + groomItem.baseRate + participantsTotal,
      securityDeposit: depositsTotal,
      grandTotal: brideItem.baseRate + groomItem.baseRate + participantsTotal + depositsTotal
    };
  }, [weddingData]);

  const openCatalog = (type, index = null) => {
    setActiveSelection({ type, index });
    setSearchQuery('');
    setActiveCategory('all');
    setShowCatalog(true);
  };

  const selectFromCatalog = (itemId) => {
    if (activeSelection.type === 'bride') setWeddingData({ ...weddingData, brideOutfitId: itemId });
    else if (activeSelection.type === 'groom') setWeddingData({ ...weddingData, groomOutfitId: itemId });
    else {
      const newParts = [...weddingData.participants];
      newParts[activeSelection.index].itemId = itemId;
      setWeddingData({ ...weddingData, participants: newParts });
    }
    setShowCatalog(false);
  };

  const removeParticipant = (index) => {
    setWeddingData({
      ...weddingData,
      participants: weddingData.participants.filter((_, i) => i !== index)
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!weddingData.brideName.trim() || !weddingData.groomName.trim()) {
        return alert("Please enter both the Bride and Groom's names.");
      }
      if (!weddingData.motif) {
        return alert("Please select a wedding theme.");
      }
      setStep(2);
      setIsMobileMenuOpen(true); 
    } 
    else if (step === 2) {
      if (!weddingData.brideOutfitId || !weddingData.groomOutfitId) {
        return alert("Please assign outfits for both the Bride and Groom.");
      }
      setStep(3);
      setIsMobileMenuOpen(true);
    } 
    else if (step === 3) {
      const hasIncomplete = weddingData.participants.some(p => !p.name.trim() || !p.role || !p.itemId);
      if (hasIncomplete) {
        return alert("Please ensure all entourage members have a name, role, and outfit.");
      }
      setStep(4);
      setIsMobileMenuOpen(true);
    } 
    else if (step === 4) {
      const newBulkTx = {
        txId: `TXN-W-${Date.now().toString().slice(-4)}`,
        type: "wedding",
        customerName: `${weddingData.brideName} & ${weddingData.groomName}`,
        motif: weddingData.motif,
        motifColor: weddingData.motifColor,
        motifNotes: weddingData.motifNotes, 
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], 
        status: "active",
        totalAmount: totals.grandTotal,
        clientDetails: {
          bride: { name: weddingData.brideName, contact: weddingData.brideContact, address: weddingData.brideAddress },
          groom: { name: weddingData.groomName, contact: weddingData.groomContact, address: weddingData.groomAddress }
        },
        items: [
          { role: "Bride", name: weddingData.brideName, itemId: weddingData.brideOutfitId, returned: false },
          { role: "Groom", name: weddingData.groomName, itemId: weddingData.groomOutfitId, returned: false },
          ...weddingData.participants.map(p => ({ 
            role: p.role, 
            name: p.name, 
            itemId: p.itemId, 
            contact: p.contact, 
            address: p.address, 
            returned: false 
          }))
        ]
      };
      navigate('/staff-history', { state: { newTransaction: newBulkTx } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-[#faf6f6]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      {/* Main Content Area */}
      <div className="grow overflow-y-auto px-5 md:px-12 pt-8 md:pt-12 pb-48 md:pb-12 md:max-w-6xl md:mx-auto w-full scrollbar-hide">
        
        {/* Progress Tracker */}
        <div className="mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} 
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-gray-100 rounded-full text-[#111010] hover:scale-105 transition-transform shadow-sm shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-black text-[#111010] tracking-tight">Wedding Package</h1>
            </div>
            <div className="w-10 md:w-12 h-10 md:h-12"></div>
          </div>
          
          <div className="relative flex items-center justify-between max-w-sm mx-auto px-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full -z-0 transition-all duration-500 ease-out" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`relative z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full font-black text-xs md:text-sm transition-all duration-300 shadow-sm border-2
                  ${step >= num ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {step > num ? '✓' : num}
              </div>
            ))}
          </div>
        </div>

        <main className="w-full pb-8 max-w-6xl mx-auto">
          
          {/* STEP 1: CLIENT & MOTIF */}
          {step === 1 && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Client Information</h2>
                <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Provide the details for the couple and the event theme.</p>
              </div>
              
              <div className="bg-white p-6 md:p-10 rounded-4xl shadow-sm border border-gray-100 space-y-8">
                {/* Bride Details */}
                <div className="space-y-5">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-gray-50 pb-2">Bride's Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" placeholder="Maria Clara" value={weddingData.brideName} onChange={e => setWeddingData({...weddingData, brideName: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Contact Number</label>
                      <input type="text" placeholder="09XX XXX XXXX" value={weddingData.brideContact} onChange={e => setWeddingData({...weddingData, brideContact: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Current Address</label>
                    <input type="text" placeholder="House No, Barangay, City" value={weddingData.brideAddress} onChange={e => setWeddingData({...weddingData, brideAddress: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>

                {/* Groom Details */}
                <div className="space-y-5 pt-4">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-gray-50 pb-2">Groom's Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" placeholder="Juan Luna" value={weddingData.groomName} onChange={e => setWeddingData({...weddingData, groomName: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Contact Number</label>
                      <input type="text" placeholder="09XX XXX XXXX" value={weddingData.groomContact} onChange={e => setWeddingData({...weddingData, groomContact: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Current Address</label>
                    <input type="text" placeholder="House No, Barangay, City" value={weddingData.groomAddress} onChange={e => setWeddingData({...weddingData, groomAddress: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>

                {/* Motif Section */}
                <div className="pt-6 border-t border-gray-50">
                  <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest block mb-4 ml-1">Choose Wedding Theme</label>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {MOTIFS.map(m => (
                      <button key={m} onClick={() => setWeddingData({...weddingData, motif: m})} className={`px-4 py-3 rounded-2xl text-xs md:text-sm font-black transition-all border-2 ${weddingData.motif === m ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 border-transparent text-[#8e8e93] hover:bg-gray-100 hover:text-[#111010]'}`}>
                        {m}
                      </button>
                    ))}
                  </div>

                  {weddingData.motif && (
                    <div className="space-y-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Specific Color Scheme</label>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder="e.g. Sage Green, Champagne, etc." 
                          value={weddingData.motifColor} 
                          onChange={e => setWeddingData({...weddingData, motifColor: e.target.value})} 
                          className="grow p-4 rounded-2xl bg-gray-50 border-none font-bold text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                        />
                        <div className="relative w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                          <input 
                            type="color" 
                            value={weddingData.motifColor.startsWith('#') ? weddingData.motifColor : '#6366f1'} 
                            onChange={e => setWeddingData({...weddingData, motifColor: e.target.value})}
                            className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest ml-1">Notes / Special Instructions</label>
                    <textarea 
                      placeholder="Specify additional motif details or requirements..." 
                      value={weddingData.motifNotes} 
                      onChange={e => setWeddingData({...weddingData, motifNotes: e.target.value})} 
                      className="w-full p-4 rounded-2xl bg-gray-50 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COUPLE OUTFITS */}
          {step === 2 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 md:space-y-10">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Main Attire</h2>
                <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Assign the outfits for the Bride and Groom.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto">
                {['bride', 'groom'].map(role => (
                  <div key={role} className="bg-white p-5 md:p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center group transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="w-full aspect-[3/4] rounded-3xl bg-gray-50 overflow-hidden mb-5 md:mb-8 border border-gray-100 relative transition-all">
                      {weddingData[`${role}OutfitId`] ? (
                        <img src={getItem(weddingData[`${role}OutfitId`]).imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-200">
                             <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#8e8e93]">Assign Outfit</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => openCatalog(role)} className={`w-full py-4 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest transition-colors ${weddingData[`${role}OutfitId`] ? 'bg-gray-50 text-[#111010] hover:bg-gray-100' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                      {weddingData[`${role}OutfitId`] ? 'Change Outfit' : 'Browse Catalog'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ENTOURAGE */}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-4 mb-2">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Entourage</h2>
                  <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Add members and assign their roles, contact info, and attire.</p>
                </div>
                <button onClick={() => setWeddingData({...weddingData, participants: [...weddingData.participants, {name: '', role: '', itemId: '', contact: '', address: ''}]})} className="w-full md:w-auto bg-[#111010] text-white px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl transition-all hover:bg-black">
                  + Add Member
                </button>
              </div>
              
              {weddingData.participants.length === 0 ? (
                <div className="text-center py-12 md:py-24 bg-white rounded-4xl border-2 border-dashed border-gray-100">
                  <p className="text-[#8e8e93] font-bold text-sm md:text-base">No entourage members added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {weddingData.participants.map((p, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100 flex flex-col gap-4 relative transition-all hover:border-gray-200 hover:shadow-md group">
                      <button onClick={() => removeParticipant(idx)} className="absolute right-4 top-4 p-2 w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-all z-10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>

                      <div className="flex gap-4">
                        <button onClick={() => openCatalog('participant', idx)} className="w-24 h-32 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center hover:border-primary/30 transition-colors relative">
                          {p.itemId ? (
                            <img src={getItem(p.itemId).imageUrl} className="w-full h-full object-cover transition-opacity" alt="" />
                          ) : (
                            <div className="flex flex-col items-center text-gray-300">
                              <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                              <span className="text-[8px] font-black uppercase">Assign</span>
                            </div>
                          )}
                        </button>
                        <div className="grow space-y-2">
                          <input placeholder="Member Full Name" value={p.name} onChange={e => {
                            const n = [...weddingData.participants]; n[idx].name = e.target.value; setWeddingData({...weddingData, participants: n});
                          }} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none border border-transparent focus:border-primary/10" />
                          <select value={p.role} onChange={e => {
                            const n = [...weddingData.participants]; n[idx].role = e.target.value; setWeddingData({...weddingData, participants: n});
                          }} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none border border-transparent focus:border-primary/10 appearance-none">
                            <option value="">Select Role</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <input placeholder="Contact Number" value={p.contact} onChange={e => {
                            const n = [...weddingData.participants]; n[idx].contact = e.target.value; setWeddingData({...weddingData, participants: n});
                         }} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-primary/10" />
                         <input placeholder="Current Address" value={p.address} onChange={e => {
                            const n = [...weddingData.participants]; n[idx].address = e.target.value; setWeddingData({...weddingData, participants: n});
                         }} className="w-full p-3 bg-gray-50 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-primary/10" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUMMARY & CONFIRMATION */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto animate-slide-up">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Order Summary</h2>
                <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Final review before processing the rental package.</p>
              </div>

              <div className="bg-white rounded-4xl md:rounded-[40px] shadow-2xl shadow-primary/5 overflow-hidden border border-gray-100">
                <div className="bg-[#111010] p-6 md:p-10 text-white relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary rounded-full blur-[60px] opacity-30"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8e8e93] mb-1.5">Wedding Of</p>
                      <h3 className="text-xl md:text-3xl font-black leading-tight">{weddingData.brideName} & {weddingData.groomName}</h3>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8e8e93] mb-1.5">Motif & Color</p>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5">
                          {weddingData.motif || 'Not Set'}
                        </span>
                        {weddingData.motifColor && (
                          <div className="flex items-center gap-2 px-2">
                             <span className="text-[10px] font-bold text-white/70 italic">{weddingData.motifColor}</span>
                             {weddingData.motifColor.startsWith('#') && (
                               <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: weddingData.motifColor }}></div>
                             )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-10 space-y-8">
                  {/* Client Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div>
                       <h4 className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest mb-2">Bride Info</h4>
                       <p className="text-sm font-bold text-[#111010]">{weddingData.brideContact || 'No contact provided'}</p>
                       <p className="text-[11px] text-[#8e8e93] mt-1">{weddingData.brideAddress || 'No address'}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest mb-2">Groom Info</h4>
                       <p className="text-sm font-bold text-[#111010]">{weddingData.groomContact || 'No contact provided'}</p>
                       <p className="text-[11px] text-[#8e8e93] mt-1">{weddingData.groomAddress || 'No address'}</p>
                    </div>
                  </div>

                  {weddingData.motifNotes && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <h4 className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest mb-1.5">Motif Notes</h4>
                      <p className="text-xs text-[#111010] font-medium italic">"{weddingData.motifNotes}"</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-gray-100 pb-3">Primary Attire</h4>
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <p className="font-black text-sm text-[#111010]">Bride: {getItem(weddingData.brideOutfitId).name}</p>
                        <p className="text-[10px] text-[#8e8e93] font-bold mt-1">Rent + Deposit</p>
                      </div>
                      <p className="font-black text-sm text-[#111010]">₱{(getItem(weddingData.brideOutfitId).baseRate + getItem(weddingData.brideOutfitId).deposit).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <p className="font-black text-sm text-[#111010]">Groom: {getItem(weddingData.groomOutfitId).name}</p>
                        <p className="text-[10px] text-[#8e8e93] font-bold mt-1">Rent + Deposit</p>
                      </div>
                      <p className="font-black text-sm text-[#111010]">₱{(getItem(weddingData.groomOutfitId).baseRate + getItem(weddingData.groomOutfitId).deposit).toLocaleString()}</p>
                    </div>
                  </div>

                  {weddingData.participants.length > 0 && (
                    <div className="space-y-4 pt-6">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-gray-100 pb-3">Entourage ({weddingData.participants.length})</h4>
                      <div className="space-y-4">
                        {weddingData.participants.map((p, i) => (
                          <div key={i} className="flex justify-between items-start text-xs md:text-sm">
                            <div className="grow pr-4">
                              <p className="font-black text-[#111010]">{p.role}: {p.name}</p>
                              <p className="text-[10px] text-[#8e8e93] font-bold mt-0.5">{p.contact || 'No Contact'} • {p.address || 'No Address'}</p>
                            </div>
                            <p className="font-black text-[#111010] shrink-0">₱{getItem(p.itemId).baseRate.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 mt-8 border-t-2 border-dashed border-gray-200 space-y-4">
                    <div className="flex justify-between text-sm font-bold text-[#8e8e93]">
                      <span>Rental Subtotal</span>
                      <span>₱{totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#8e8e93]">
                      <span>Total Security Deposits</span>
                      <span>₱{totals.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end pt-6 mt-4 border-t border-gray-100">
                      <span className="text-xl md:text-2xl font-black text-[#111010] tracking-tight">Grand Total</span>
                      <span className="text-2xl md:text-4xl font-black text-primary tracking-tighter">₱{totals.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#faf6f6] p-5 md:p-6 text-center border-t border-gray-100">
                  <p className="text-[9px] font-black text-[#8e8e93] uppercase tracking-widest leading-relaxed">
                    Note: Security deposits are refundable upon return of items in good condition.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP ACTION BAR */}
          {!showCatalog && (
            <div className="hidden md:flex max-w-2xl mx-auto mt-12 gap-4 pb-12">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all bg-white border border-gray-200 text-[#8e8e93] hover:text-[#111010] hover:border-gray-300">
                  Go Back
                </button>
              )}
              <button onClick={handleNext} className="flex-2 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl transition-all bg-primary text-white shadow-primary/20 hover:brightness-110 active:scale-[0.98]">
                {step === 4 ? 'Confirm & Process' : 'Continue to Next Step'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FLOATING ACTION BAR */}
      {!showCatalog && (
        <div className="md:hidden fixed bottom-[70px] sm:bottom-0 left-0 right-0 z-40">
          <div className="bg-white/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 px-5 transition-all duration-300 overflow-hidden">
            <div className="w-full flex flex-col items-center justify-center py-4 cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mb-2"></div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isMobileMenuOpen ? 'text-gray-400' : 'text-primary'}`}>
                  {isMobileMenuOpen ? 'Minimize' : 'Show Actions'}
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180 text-gray-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 pointer-events-none'}`}>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="w-full py-3.5 font-black text-sm text-[#8e8e93] bg-gray-50 rounded-[16px] border border-gray-100">
                  Go Back
                </button>
              )}
              <button onClick={handleNext} className="w-full py-4 rounded-[20px] font-black text-base shadow-xl bg-primary text-white shadow-primary/20 uppercase tracking-widest">
                {step === 4 ? 'Confirm & Process' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATALOG OVERLAY */}
      {showCatalog && (
        <div className="fixed inset-0 z-[100] bg-[#faf6f6] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#faf6f6]/90 backdrop-blur-xl border-b border-gray-200/50 px-5 pt-4 pb-3 md:px-12 md:pt-8 md:pb-6 z-10 shrink-0">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex justify-between items-center mb-5 md:mb-8">
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Catalog</h3>
                  <p className="text-[10px] md:text-sm font-bold text-[#8e8e93] mt-0.5">Assigning for <span className="text-primary uppercase tracking-widest">{activeSelection?.type}</span></p>
                </div>
                <button onClick={() => setShowCatalog(false)} className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full font-black text-lg md:text-xl shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all">✕</button>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="relative w-full max-w-2xl mb-4">
                  <input type="text" placeholder="Search outfits..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-3.5 pr-4 pl-11 border border-gray-200 rounded-2xl bg-white shadow-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm" />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div className="flex overflow-x-auto w-full max-w-full justify-start md:justify-center gap-2 pb-2 scrollbar-hide">
                  {CATALOG_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-200 text-[#8e8e93] hover:text-[#111010]'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 md:p-12 pb-32">
            <div className="max-w-6xl mx-auto w-full">
              {filteredCatalogItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-gray-200">
                  <p className="text-[#8e8e93] font-bold text-sm">No items found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredCatalogItems.map(item => (
                    <div key={item.id} onClick={() => selectFromCatalog(item.id)} className="bg-white p-3 md:p-4 rounded-[24px] shadow-sm border-2 border-transparent hover:border-primary/50 cursor-pointer transition-all group hover:shadow-md flex flex-col h-full">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-3 md:mb-4 bg-gray-50 relative shrink-0">
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      </div>
                      <div className="flex flex-col grow justify-between">
                        <p className="font-black text-[11px] md:text-sm text-[#111010] line-clamp-2">{item.name}</p>
                        <p className="text-primary font-black text-[10px] md:text-xs mt-1.5">₱{item.baseRate.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}