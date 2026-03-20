// src/pages/StaffDashboard.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function StaffDashboard() {
  const navigate = useNavigate();

  // Dynamic Date Greeting
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

  // Modal States
  const [viewingTx, setViewingTx] = useState(null); // Stores tx object for View Modal
  const [returningTx, setReturningTx] = useState(null); // Stores tx object for Return Modal
  
  // Proof Form State
  const [returnNotes, setReturnNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Calculate quick metrics for the front desk
  const metrics = useMemo(() => {
    let active = 0;
    let overdue = 0;
    let available = 0;

    CATALOG_ITEMS.forEach(item => {
      if (item.status === 'Available') available++;
    });

    TRANSACTIONS.forEach(tx => {
      if (tx.status === 'active') active++;
      if (tx.status === 'overdue') overdue++;
    });

    return { active, overdue, available };
  }, []);

  // Filter and sort tasks (Overdue items float to the top)
  const priorityTasks = useMemo(() => {
    return TRANSACTIONS
      .filter(tx => tx.status !== 'completed')
      .map(tx => {
        const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
        return { ...tx, item };
      })
      .sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (a.status !== 'overdue' && b.status === 'overdue') return 1;
        return 0;
      });
  }, []);

  // Action Handlers
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const sendPing = (customer) => {
    alert(`SMS Reminder successfully queued for ${customer}.`);
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-5 md:px-10 pt-10 md:pt-12 pb-32 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full scrollbar-hide">
        
        {/* Header */}
        <div className="mb-8 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] md:text-xs font-black text-[#bf4a53] uppercase tracking-[0.2em] mb-2">{today}</p>
          <h1 className="text-3xl md:text-5xl font-black text-[#111010] tracking-tight">Front Desk</h1>
        </div>

        {/* Hero Action Banner */}
        <div 
          onClick={() => navigate('/staff-new-rental')}
          className="group relative bg-[#111010] rounded-[28px] md:rounded-[32px] overflow-hidden p-6 md:p-10 text-white flex flex-row items-center justify-between mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-800"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#bf4a53] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight">New Rental</h2>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold tracking-wide uppercase md:normal-case">Start the checkout wizard</p>
          </div>
          <div className="relative z-10 w-12 h-12 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-[#bf4a53] transition-all duration-500 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 md:w-10 md:h-10 stroke-[2.5px]"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <span className="text-xl md:text-4xl font-black text-[#34c759]">{metrics.available}</span>
            <span className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Ready</span>
          </div>
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <span className="text-xl md:text-4xl font-black text-blue-500">{metrics.active}</span>
            <span className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Out</span>
          </div>
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <span className="text-xl md:text-4xl font-black text-[#ff9f0a]">{metrics.overdue}</span>
            <span className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Overdue</span>
          </div>
        </div>

        {/* Priority Task Section Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-lg md:text-2xl font-black text-[#111010]">Action Required</h2>
            <p className="text-[10px] md:text-sm text-[#8e8e93] font-medium">Active and overdue rentals</p>
          </div>
          <button onClick={() => navigate('/staff-history')} className="text-[10px] font-black text-[#bf4a53] uppercase tracking-widest hover:text-[#9a3a42] transition-colors pb-1">
            View All
          </button>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-10">
          {priorityTasks.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-[28px] md:rounded-[32px] border border-gray-100 text-gray-400 font-bold">
              All clear! No active rentals.
            </div>
          ) : (
            priorityTasks.map((task, index) => {
              const isOverdue = task.status === 'overdue';
              return (
                <div 
                  key={task.txId} 
                  onClick={() => setViewingTx(task)} // Opens View Modal
                  className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 flex flex-row items-center gap-4 md:gap-5 shadow-sm border border-gray-100 hover:border-[#bf4a53]/20 transition-all animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="relative shrink-0">
                    <img src={task.item?.imageUrl} alt={task.item?.name} className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover shadow-sm" />
                    {isOverdue && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9f0a] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ff9f0a] border-2 border-white"></span>
                      </span>
                    )}
                  </div>
                  
                  <div className="grow min-w-0">
                    <div className="text-[15px] md:text-xl font-black text-[#111010] truncate">{task.customerName}</div>
                    <div className="text-[10px] md:text-sm text-[#8e8e93] font-bold truncate mb-1.5 md:mb-2">{task.item?.name}</div>
                    <span className={`inline-block px-2 md:px-3 py-1 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'bg-orange-50 text-[#ff9f0a]' : 'bg-green-50 text-[#34c759]'}`}>
                      {isOverdue ? 'Overdue' : 'Due ' + task.dueDate}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-2 shrink-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents card click from triggering
                        sendPing(task.customerName);
                      }}
                      className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#ff9f0a] hover:text-white transition-all active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents card click from triggering
                        openReturnModal(task);
                      }}
                      className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-gray-50 text-[#34c759] hover:bg-[#34c759] hover:text-white transition-all active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
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