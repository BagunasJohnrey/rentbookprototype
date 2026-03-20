// src/pages/StaffWeddingOrder.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

const MOTIFS = ['Rustic', 'Modern Minimalist', 'Royal Blue', 'Pastel Pink', 'Bohemian', 'Classic Filipiniana'];
const ROLES = ['Maid of Honor', 'Best Man', 'Bridesmaid', 'Groomsman', 'Flower Girl', 'Bearer', 'Parent of Bride', 'Parent of Groom'];

export default function StaffWeddingOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCatalog, setShowCatalog] = useState(false);
  const [activeSelection, setActiveSelection] = useState(null); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  const [weddingData, setWeddingData] = useState({
    brideName: '', 
    groomName: '', 
    motif: '',
    motifNotes: '', 
    brideOutfitId: '', 
    groomOutfitId: '',
    participants: [] 
  });

  const getItem = (id) => CATALOG_ITEMS.find(item => item.id === id) || { name: 'Not Selected', baseRate: 0, deposit: 0 };
  const availableItems = useMemo(() => CATALOG_ITEMS.filter(i => i.status === 'Available'), []);

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
        return alert("Please select a wedding motif.");
      }
      setStep(2);
      setIsMobileMenuOpen(true); 
    } 
    else if (step === 2) {
      if (!weddingData.brideOutfitId || !weddingData.groomOutfitId) {
        return alert("Please assign outfits for both the Bride and Groom from the catalog.");
      }
      setStep(3);
      setIsMobileMenuOpen(true);
    } 
    else if (step === 3) {
      const hasIncomplete = weddingData.participants.some(p => !p.name.trim() || !p.role || !p.itemId);
      if (hasIncomplete) {
        return alert("Please ensure all entourage members have a name, role, and outfit assigned. Remove any empty rows.");
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
        motifNotes: weddingData.motifNotes, 
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], 
        status: "active",
        totalAmount: totals.grandTotal,
        items: [
          { role: "Bride", name: weddingData.brideName, itemId: weddingData.brideOutfitId, returned: false },
          { role: "Groom", name: weddingData.groomName, itemId: weddingData.groomOutfitId, returned: false },
          ...weddingData.participants.map(p => ({ role: p.role, name: p.name, itemId: p.itemId, returned: false }))
        ]
      };
      navigate('/staff-history', { state: { newTransaction: newBulkTx } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-[#faf6f6]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      {/* Main Scrollable Content */}
      <div className="grow overflow-y-auto px-5 md:px-12 pt-8 md:pt-12 pb-48 md:pb-12 md:max-w-6xl md:mx-auto w-full scrollbar-hide">
        
        {/* PROGRESS HEADER (Matching StaffNewRental) */}
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
            <div className="w-10 md:w-12 h-10 md:h-12"></div> {/* Spacer for perfect centering */}
          </div>
          
          {/* Circular Step Indicator */}
          <div className="relative flex items-center justify-between max-w-sm mx-auto px-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-[#bf4a53] -translate-y-1/2 rounded-full -z-0 transition-all duration-500 ease-out" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`relative z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full font-black text-xs md:text-sm transition-all duration-300 shadow-sm border-2
                  ${step >= num ? 'bg-[#bf4a53] border-[#bf4a53] text-white' : 'bg-white border-gray-200 text-gray-400'}`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        <main className="w-full pb-8">
          
          {/* STEP 1: EVENT INFO */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">The Happy Couple</h2>
                <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Let's start with the basic wedding details.</p>
              </div>
              
              <div className="bg-white p-6 md:p-10 rounded-4xl shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-[#8e8e93] uppercase tracking-widest ml-1">Bride's Name</label>
                    <input type="text" placeholder="Maria Clara" value={weddingData.brideName} onChange={e => setWeddingData({...weddingData, brideName: e.target.value})} className="w-full p-4 md:p-5 rounded-2xl bg-gray-50 border-none font-bold text-base md:text-lg outline-none focus:ring-2 focus:ring-[#bf4a53]/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-[#8e8e93] uppercase tracking-widest ml-1">Groom's Name</label>
                    <input type="text" placeholder="Juan Luna" value={weddingData.groomName} onChange={e => setWeddingData({...weddingData, groomName: e.target.value})} className="w-full p-4 md:p-5 rounded-2xl bg-gray-50 border-none font-bold text-base md:text-lg outline-none focus:ring-2 focus:ring-[#bf4a53]/20 transition-all" />
                  </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-gray-50">
                  <label className="text-[10px] md:text-xs font-black text-[#8e8e93] uppercase tracking-widest block mb-3 md:mb-4 ml-1">Choose Motif</label>
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                    {MOTIFS.map(m => (
                      <button key={m} onClick={() => setWeddingData({...weddingData, motif: m})} className={`px-4 md:px-6 py-3 md:py-3.5 rounded-2xl text-xs md:text-sm font-black transition-all border-2 ${weddingData.motif === m ? 'bg-[#bf4a53] border-[#bf4a53] text-white shadow-lg shadow-[#bf4a53]/20' : 'bg-gray-50 border-transparent text-[#8e8e93] hover:bg-gray-100 hover:text-[#111010]'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] md:text-xs font-black text-[#8e8e93] uppercase tracking-widest ml-1">Motif Notes / Instructions (Optional)</label>
                    <textarea 
                      placeholder="e.g. Strictly pastel shades, no neon colors..." 
                      value={weddingData.motifNotes} 
                      onChange={e => setWeddingData({...weddingData, motifNotes: e.target.value})} 
                      className="w-full p-4 md:p-5 rounded-2xl bg-gray-50 border-none font-bold text-sm md:text-base outline-none focus:ring-2 focus:ring-[#bf4a53]/20 transition-all min-h-[100px] resize-none tracking-tight" 
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
                <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Select the primary outfits for the couple.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto">
                {['bride', 'groom'].map(role => (
                  <div key={role} className="bg-white p-5 md:p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center group transition-all hover:border-[#bf4a53]/20 hover:shadow-md">
                    <div className="w-full aspect-3/4 rounded-3xl bg-gray-50 overflow-hidden mb-5 md:mb-8 border border-gray-100 relative transition-all">
                      {weddingData[`${role}OutfitId`] ? (
                        <img src={getItem(weddingData[`${role}OutfitId`]).imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2 md:gap-3">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-200">
                             <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#8e8e93]">Assign Outfit</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => openCatalog(role)} className={`w-full py-3.5 md:py-5 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest transition-colors ${weddingData[`${role}OutfitId`] ? 'bg-gray-50 text-[#111010] hover:bg-gray-100' : 'bg-[#bf4a53]/10 text-[#bf4a53] hover:bg-[#bf4a53]/20'}`}>
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-4 mb-2 md:mb-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Entourage</h2>
                  <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Add participants and assign their attire.</p>
                </div>
                <button onClick={() => setWeddingData({...weddingData, participants: [...weddingData.participants, {name: '', role: '', itemId: ''}]})} className="w-full md:w-auto bg-[#111010] text-white px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all hover:bg-black">
                  + Add Member
                </button>
              </div>
              
              {weddingData.participants.length === 0 ? (
                <div className="text-center py-12 md:py-24 bg-white rounded-4xl border-2 border-dashed border-gray-100">
                  <p className="text-[#8e8e93] font-bold text-sm md:text-base">No entourage members added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {weddingData.participants.map((p, idx) => (
                    <div key={idx} className="bg-white p-3.5 md:p-5 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100 flex gap-3 md:gap-4 items-center relative pr-4 md:pr-12 transition-all hover:border-gray-200 hover:shadow-md group">
                      
                      <button onClick={() => removeParticipant(idx)} className="absolute right-2 top-2 md:right-4 md:top-1/2 md:-translate-y-1/2 p-1.5 md:p-2 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 md:bg-gray-50 rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10">
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>

                      <button onClick={() => openCatalog('participant', idx)} className="w-20 h-28 md:w-24 md:h-32 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center hover:border-[#bf4a53]/30 transition-colors relative">
                        {p.itemId ? (
                          <img src={getItem(p.itemId).imageUrl} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
                        ) : (
                          <div className="flex flex-col items-center text-gray-300 group-hover:text-[#bf4a53] transition-colors">
                            <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Assign</span>
                          </div>
                        )}
                      </button>
                      <div className="grow space-y-2 md:space-y-3 min-w-0 pr-8 md:pr-0">
                        <input placeholder="Participant Name" value={p.name} onChange={e => {
                          const n = [...weddingData.participants]; n[idx].name = e.target.value; setWeddingData({...weddingData, participants: n});
                        }} className="w-full p-2.5 md:p-3.5 bg-gray-50 rounded-xl font-bold text-xs md:text-sm outline-none focus:ring-2 focus:ring-[#bf4a53]/20 transition-all border border-transparent focus:border-[#bf4a53]/10 truncate" />
                        <select value={p.role} onChange={e => {
                          const n = [...weddingData.participants]; n[idx].role = e.target.value; setWeddingData({...weddingData, participants: n});
                        }} className="w-full p-2.5 md:p-3.5 bg-gray-50 rounded-xl font-bold text-xs md:text-sm outline-none focus:ring-2 focus:ring-[#bf4a53]/20 transition-all border border-transparent focus:border-[#bf4a53]/10 appearance-none truncate">
                          <option value="">Select Role</option>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUMMARY RECEIPT */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto animate-slide-up">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Order Summary</h2>
                <p className="text-sm md:text-base font-semibold text-[#8e8e93] mt-1 md:mt-2">Review bulk order details before confirming.</p>
              </div>

              <div className="bg-white rounded-4xl md:rounded-[40px] shadow-2xl shadow-[#bf4a53]/5 overflow-hidden border border-gray-100">
                <div className="bg-[#111010] p-6 md:p-10 text-white relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#bf4a53] rounded-full blur-[60px] opacity-30"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start gap-3 md:gap-4">
                    <div>
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#8e8e93] mb-1.5">Wedding Of</p>
                      <h3 className="text-xl md:text-3xl font-black leading-tight">{weddingData.brideName || 'Bride'} & {weddingData.groomName || 'Groom'}</h3>
                    </div>
                    <div className="md:text-right mt-1 md:mt-0">
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#8e8e93] mb-1.5">Motif</p>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-white/10 text-[10px] md:text-xs font-black uppercase tracking-widest backdrop-blur-sm border border-white/5">
                        {weddingData.motif || 'Not Set'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-10 space-y-6 md:space-y-8">
                  {weddingData.motifNotes && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <h4 className="text-[10px] md:text-xs font-black text-[#8e8e93] uppercase tracking-widest mb-1.5">Motif Notes</h4>
                      <p className="text-xs md:text-sm text-[#111010] font-medium leading-relaxed italic">"{weddingData.motifNotes}"</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-[10px] md:text-xs font-black text-[#bf4a53] uppercase tracking-widest border-b border-gray-100 pb-3">Primary Attire</h4>
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <p className="font-black text-sm md:text-base text-[#111010]">Bride: {getItem(weddingData.brideOutfitId).name}</p>
                        <p className="text-[10px] md:text-xs text-[#8e8e93] font-bold mt-1">Base Rate + Security Deposit</p>
                      </div>
                      <p className="font-black text-sm md:text-base text-[#111010]">₱{(getItem(weddingData.brideOutfitId).baseRate + getItem(weddingData.brideOutfitId).deposit).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <p className="font-black text-sm md:text-base text-[#111010]">Groom: {getItem(weddingData.groomOutfitId).name}</p>
                        <p className="text-[10px] md:text-xs text-[#8e8e93] font-bold mt-1">Base Rate + Security Deposit</p>
                      </div>
                      <p className="font-black text-sm md:text-base text-[#111010]">₱{(getItem(weddingData.groomOutfitId).baseRate + getItem(weddingData.groomOutfitId).deposit).toLocaleString()}</p>
                    </div>
                  </div>

                  {weddingData.participants.length > 0 && (
                    <div className="space-y-4 pt-4 md:pt-6">
                      <h4 className="text-[10px] md:text-xs font-black text-[#bf4a53] uppercase tracking-widest border-b border-gray-100 pb-3">Entourage ({weddingData.participants.length})</h4>
                      <div className="space-y-3 md:space-y-4">
                        {weddingData.participants.map((p, i) => (
                          <div key={i} className="flex justify-between items-center text-xs md:text-base">
                            <p className="font-bold text-[#8e8e93]">{p.role || 'Member'}: <span className="text-[#111010] font-black ml-1">{p.name || 'Unnamed'}</span></p>
                            <p className="font-black text-[#111010]">₱{getItem(p.itemId).baseRate.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-5 md:pt-8 mt-5 md:mt-8 border-t-2 border-dashed border-gray-200 space-y-3 md:space-y-4">
                    <div className="flex justify-between text-sm md:text-base font-bold text-[#8e8e93]">
                      <span>Rental Subtotal</span>
                      <span>₱{totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base font-bold text-[#8e8e93]">
                      <span>Total Security Deposits</span>
                      <span>₱{totals.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 md:pt-6 mt-3 md:mt-4 border-t border-gray-100">
                      <span className="text-lg md:text-2xl font-black text-[#111010] tracking-tight">Grand Total</span>
                      <span className="text-2xl md:text-4xl font-black text-[#bf4a53] tracking-tighter">₱{totals.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#faf6f6] p-5 md:p-6 text-center border-t border-gray-100">
                  <p className="text-[9px] md:text-[10px] font-black text-[#8e8e93] uppercase tracking-widest leading-relaxed">
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
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all bg-white border border-gray-200 text-[#8e8e93] hover:text-[#111010] hover:border-gray-300 hover:shadow-sm"
                >
                  Go Back
                </button>
              )}
              <button 
                onClick={handleNext} 
                className="flex-2 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl transition-all bg-[#bf4a53] text-white shadow-[#bf4a53]/20 hover:brightness-110 active:scale-[0.98]"
              >
                {step === 4 ? 'Confirm & Process' : 'Continue to Next Step'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* COLLAPSIBLE MOBILE FLOATING ACTION BAR */}
      {!showCatalog && (
        <div className="md:hidden fixed bottom-[70px] sm:bottom-0 left-0 right-0 z-40">
          <div className="bg-white/95 backdrop-blur-xl rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 px-5 transition-all duration-300 overflow-hidden">
            
            {/* Drawer Drag Handle */}
            <div 
              className="w-full flex flex-col items-center justify-center py-4 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mb-2"></div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isMobileMenuOpen ? 'text-gray-400' : 'text-[#bf4a53]'}`}>
                  {isMobileMenuOpen ? 'Minimize' : 'Show Actions'}
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180 text-gray-400' : 'text-[#bf4a53]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Action Buttons (Collapses when minimized) */}
            <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 pointer-events-none'}`}>
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="w-full py-3.5 font-black text-sm text-[#8e8e93] hover:text-[#111010] bg-gray-50 rounded-[16px] transition-colors tracking-tight border border-gray-100"
                >
                  Go Back
                </button>
              )}
              <button 
                onClick={handleNext} 
                className="w-full py-4 rounded-[20px] font-black text-base shadow-xl transition-all bg-[#bf4a53] text-white shadow-[#bf4a53]/20 active:scale-[0.98] tracking-tight uppercase tracking-widest"
              >
                {step === 4 ? 'Confirm & Process' : 'Continue'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CATALOG OVERLAY */}
      {showCatalog && (
        <div className="fixed inset-0 z-100 bg-[#faf6f6] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          <div className="bg-[#faf6f6]/90 backdrop-blur-xl border-b border-gray-200/50 px-5 py-4 md:px-10 md:py-6 flex justify-between items-center z-10 shrink-0">
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-[#111010] tracking-tight">Catalog</h3>
              <p className="text-[10px] md:text-sm font-bold text-[#8e8e93] mt-0.5">Assigning outfit for <span className="text-[#bf4a53] uppercase tracking-widest">{activeSelection?.type}</span></p>
            </div>
            <button 
              onClick={() => setShowCatalog(false)} 
              className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full font-black text-lg md:text-xl shadow-sm border border-gray-200 flex items-center justify-center text-[#111010] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {availableItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => selectFromCatalog(item.id)} 
                  className="bg-white p-3 md:p-4 rounded-[24px] md:rounded-3xl shadow-sm border-2 border-transparent hover:border-[#bf4a53]/50 cursor-pointer transition-all group hover:shadow-md flex flex-col h-full"
                >
                  <div className="aspect-3/4 rounded-2xl overflow-hidden mb-3 bg-gray-50 relative shrink-0">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-[#bf4a53]/0 group-hover:bg-[#bf4a53]/10 transition-colors duration-300"></div>
                  </div>
                  <div className="flex flex-col grow justify-between">
                    <p className="font-black text-[11px] md:text-sm text-[#111010] tracking-tight leading-snug px-1 line-clamp-2">{item.name}</p>
                    <p className="text-[#bf4a53] font-black text-[10px] md:text-xs mt-1.5 px-1">₱{item.baseRate.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
      
    </div>
  );
}