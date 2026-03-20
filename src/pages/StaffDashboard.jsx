// src/pages/StaffDashboard.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function StaffDashboard() {
  const navigate = useNavigate();

  // Dynamic Date Greeting
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

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
  const handleReturn = (id, customer) => {
    const confirm = window.confirm(`Process return for ${customer}'s rental?`);
    if (confirm) alert(`Return processed successfully for ${customer}.`);
  };

  const sendPing = (customer) => {
    alert(`SMS Reminder successfully queued for ${customer}.`);
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-5 md:px-10 pt-10 md:pt-12 pb-32 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full custom-scrollbar">
        
        {/* Header */}
        <div className="mb-8 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] md:text-xs font-black text-[#bf4a53] uppercase tracking-[0.2em] mb-2">{today}</p>
          <h1 className="text-3xl md:text-5xl font-black text-[#111010] tracking-tight">Front Desk</h1>
        </div>

        {/* Hero Action Banner - Adjusted mobile padding and font sizes */}
        <div 
          onClick={() => navigate('/staff-new-rental')}
          className="group relative bg-[#111010] rounded-[28px] md:rounded-[32px] overflow-hidden p-6 md:p-10 text-white flex flex-row items-center justify-between mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-800"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#bf4a53] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight">New Rental</h2>
            <p className="text-[10px] md:text-sm text-gray-400 font-bold tracking-wide uppercase md:normal-case">Start the 3-step checkout wizard</p>
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

        {/* Task Grid - Improved mobile layout for cards */}
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
                  className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 flex flex-row items-center gap-4 md:gap-5 shadow-sm border border-gray-100 hover:border-[#bf4a53]/20 transition-all animate-slide-up"
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
                  
                  {/* Action Buttons - Stacked on very small mobile if needed, but side-by-side for now */}
                  <div className="flex flex-col md:flex-row gap-2 shrink-0">
                    <button 
                      onClick={() => sendPing(task.customerName)}
                      className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#ff9f0a] hover:text-white transition-all active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleReturn(task.txId, task.customerName)}
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
    </div>
  );
}