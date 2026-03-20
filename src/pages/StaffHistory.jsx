// src/pages/StaffHistory.jsx
import { useState } from 'react';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function StaffHistory() {
  const [filter, setFilter] = useState('all');
  
  // Modal States
  const [viewingTx, setViewingTx] = useState(null); // Stores tx object for View Modal
  const [returningTx, setReturningTx] = useState(null); // Stores tx object for Return Modal
  
  // Proof Form State
  const [returnNotes, setReturnNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Map transactions to include item details based on current filter
  const filteredTx = (filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === filter))
    .map(tx => {
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      return { ...tx, item };
    });

  // Action Handlers
  const sendPing = (name) => alert(`SMS reminder drafted for ${name}.`);
  
  const handleView = (tx) => setViewingTx(tx);
  
  const openReturnModal = (tx) => {
    setReturningTx(tx);
    setReturnNotes('');
    setImagePreview(null);
  };

  const submitReturn = (e) => {
    e.preventDefault();
    alert(`Transaction ${returningTx.txId} closed!\nNotes: ${returnNotes}\nImage: ${imagePreview ? 'Attached' : 'None'}`);
    setReturningTx(null);
  };

  // Mock image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full scrollbar-hide">
        
        {/* Header Section */}
        <div className="mb-8 md:mb-12 animate-slide-up">
          <h1 className="text-[32px] md:text-5xl font-black text-[#111010] tracking-tight">Rental History</h1>
          <p className="text-sm md:text-base font-medium text-[#8e8e93] mt-2">Monitor and manage all customer transactions</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {['all', 'active', 'overdue', 'completed'].map(f => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-[#bf4a53] text-white shadow-lg shadow-[#bf4a53]/20' 
                  : 'bg-white text-[#8e8e93] border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ==========================================
            DESKTOP DESIGN: Professional Table
            (Hidden on mobile, visible md+)
        ========================================== */}
        <div className="hidden md:block bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase text-gray-400 tracking-widest">Item</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-gray-400 tracking-widest">Due Date</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold">No transactions found.</td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.txId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={tx.item?.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                        <span className="font-bold text-gray-800">{tx.item?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-gray-700">{tx.customerName}</td>
                    <td className="px-8 py-5 font-medium text-gray-500">{tx.dueDate}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        tx.status === 'active' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'overdue' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleView(tx)} className="p-2 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-gray-100" title="View Details">
                          <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        
                        {tx.status !== 'completed' && (
                          <>
                            <button onClick={() => sendPing(tx.customerName)} className="p-2 text-[#ff9f0a] hover:bg-[#ff9f0a] hover:text-white rounded-xl transition-all" title="Send SMS Reminder">
                              <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </button>
                            <button onClick={() => openReturnModal(tx)} className="p-2 text-[#34c759] hover:bg-[#34c759] hover:text-white rounded-xl transition-all" title="Mark as Returned">
                              <svg className="w-5 h-5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ==========================================
            MOBILE DESIGN: High-Fidelity Cards
            (Visible on mobile, hidden md+)
        ========================================== */}
        <div className="md:hidden space-y-4">
          {filteredTx.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-4xl border border-gray-50 text-gray-400 font-bold">
               No transactions found
            </div>
          ) : (
            filteredTx.map((tx, i) => (
              <div 
                key={tx.txId} 
                className="bg-white rounded-[28px] p-5 flex items-center gap-4 shadow-sm transition-all animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative shrink-0">
                  <img src={tx.item?.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt="" />
                  <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    tx.status === 'active' ? 'bg-[#34c759]' : tx.status === 'overdue' ? 'bg-[#ff9f0a]' : 'bg-gray-300'
                  }`} />
                </div>
                
                <div className="grow min-w-0">
                  <div className="text-base font-black text-[#111010] truncate">{tx.customerName}</div>
                  <div className="text-[11px] text-[#8e8e93] font-bold truncate mb-1">{tx.item?.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wide ${
                      tx.status === 'active' ? 'bg-green-50 text-green-600' : 
                      tx.status === 'overdue' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {tx.status}
                    </span>
                    
                    {/* Mobile Action Buttons row */}
                    <div className="flex gap-1.5">
                      <button onClick={() => handleView(tx)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      
                      {tx.status !== 'completed' && (
                        <>
                          <button onClick={() => sendPing(tx.customerName)} className="w-8 h-8 flex items-center justify-center bg-[#ff9f0a]/10 rounded-xl text-[#ff9f0a] active:bg-[#ff9f0a] active:text-white transition-colors">
                            <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          </button>
                          <button onClick={() => openReturnModal(tx)} className="w-8 h-8 flex items-center justify-center bg-[#34c759]/10 rounded-xl text-[#34c759] active:bg-[#34c759] active:text-white transition-colors">
                            <svg className="w-4 h-4 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==========================================
          MODAL: VIEW TRANSACTION DETAILS (Responsive)
      ========================================== */}
      {viewingTx && (
        <div 
          className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm transition-all"
          onClick={() => setViewingTx(null)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[40px] shadow-2xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-hide pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111010]">Transaction Details</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      viewingTx.status === 'completed' ? 'bg-gray-100 text-gray-500' : 
                      viewingTx.status === 'overdue' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {viewingTx.status}
                    </span>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">ID: {viewingTx.txId}</p>
                  </div>
                </div>
                <button onClick={() => setViewingTx(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Item Info Card */}
                <div className="flex gap-4 p-4 sm:p-5 bg-gray-50 rounded-[24px] sm:rounded-3xl border border-gray-100">
                  <img src={viewingTx.item?.imageUrl} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm" alt="" />
                  <div className="flex flex-col justify-center">
                    <h3 className="font-black text-base sm:text-lg text-[#111010] leading-tight">{viewingTx.item?.name}</h3>
                    <p className="text-[#bf4a53] font-bold text-xs sm:text-sm mt-1">Item ID: {viewingTx.itemId}</p>
                  </div>
                </div>

                {/* Transaction Metadata */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Customer</p>
                    <p className="font-bold text-sm sm:text-base text-[#111010]">{viewingTx.customerName}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Due Date</p>
                    <p className="font-bold text-sm sm:text-base text-[#111010]">{viewingTx.dueDate}</p>
                  </div>
                </div>

                {/* RETURN PROOF SECTION */}
                {viewingTx.status === 'completed' && (
                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-dashed border-gray-200 animate-slide-up">
                    <div className="flex items-center gap-2 mb-4 text-[#34c759]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest">Return Proof Archive</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[24px] sm:rounded-[28px] overflow-hidden border-4 border-white shadow-md">
                        <img 
                          src={viewingTx.returnPhotoUrl || "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800"} 
                          className="w-full h-36 sm:h-48 object-cover grayscale-[20%]" 
                          alt="Proof of return" 
                        />
                      </div>

                      <div className="p-4 sm:p-5 bg-green-50/50 rounded-2xl border border-green-100">
                        <p className="text-[9px] sm:text-[10px] font-black text-green-700 uppercase mb-1">Staff Notes</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 italic">
                          "{viewingTx.returnNotes || "Item returned in original condition. Verified by staff."}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setViewingTx(null)} 
                className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 bg-[#111010] hover:bg-black text-white rounded-[20px] sm:rounded-2xl font-bold transition-all active:scale-95"
              >
                Dismiss Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: RETURN CAPTURE (Responsive)
      ========================================== */}
      {returningTx && (
        <div 
          className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-md transition-all"
          onClick={() => setReturningTx(null)}
        >
          <form 
            onSubmit={submitReturn} 
            className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-hide pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#111010] mb-1">Return Item</h2>
              <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">Capture proof of condition for <span className="text-black font-bold">{returningTx.item?.name}</span></p>
              
              <div className="space-y-4">
                {/* Photo Upload Area */}
                <div className="relative h-40 sm:h-48 bg-gray-50 rounded-[24px] sm:rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Proof" />
                      <button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 text-gray-400 group-hover:text-[#bf4a53] transition-colors">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">Tap to Take Photo</p>
                    </>
                  )}
                </div>

                {/* Notes Input */}
                <div>
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition Notes</label>
                  <textarea 
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. Returned in perfect condition..."
                    className="w-full mt-1 p-3.5 sm:p-4 bg-gray-50 border-none rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#bf4a53] outline-none min-h-[80px] sm:min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button type="button" onClick={() => setReturningTx(null)} className="flex-1 py-3.5 sm:py-4 text-xs sm:text-sm text-gray-500 font-bold hover:bg-gray-50 rounded-[20px] sm:rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-3.5 sm:py-4 text-xs sm:text-sm bg-[#34c759] text-white rounded-[20px] sm:rounded-2xl font-black shadow-lg shadow-green-200 active:scale-95 transition-all">Confirm Return</button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}