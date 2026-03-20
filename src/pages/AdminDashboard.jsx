// src/pages/AdminDashboard.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Dynamic Date Greeting
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

  // Business Logic & Metrics Calculation
  const metrics = useMemo(() => {
    let revenue = 0;
    let active = 0;
    let overdue = 0;
    let available = 0;

    // Calculate Inventory Health
    CATALOG_ITEMS.forEach(item => {
      if (item.status === 'Available') available++;
    });

    // Calculate Transaction Metrics
    TRANSACTIONS.forEach(tx => {
      if (tx.status === 'active') active++;
      if (tx.status === 'overdue') overdue++;
      
      // Revenue Calculation (Only counting baseRate, as deposits are liabilities)
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      if (item && (tx.status === 'active' || tx.status === 'completed')) {
        revenue += item.baseRate;
      }
    });

    return { revenue, active, overdue, available, totalItems: CATALOG_ITEMS.length };
  }, []);

  // Get 4 most recent transactions
  const recentTx = TRANSACTIONS.slice(0, 4).map(tx => {
    const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
    return { ...tx, item };
  });

  // Action Handlers
  const sendPing = (name) => alert(`SMS Reminder successfully queued for ${name}.`);

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-4 md:px-10 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full custom-scrollbar">
        
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-black text-[#bf4a53] uppercase tracking-[0.2em] mb-2">{today}</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-[#111010] tracking-tight">Store Overview</h1>
            <button 
              onClick={() => navigate('/admin-add-item')}
              className="bg-[#111010] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#bf4a53] hover:shadow-lg hover:shadow-[#bf4a53]/20 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
            >
              <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New Item
            </button>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`₱${(metrics.revenue / 1000).toFixed(1)}k`} 
            subtitle="Base rental income"
            color="text-emerald-600"
            bg="bg-emerald-50"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} 
          />
          <StatCard 
            title="Active Rentals" 
            value={metrics.active} 
            subtitle="Currently with customers"
            color="text-blue-600"
            bg="bg-blue-50"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />} 
          />
          <StatCard 
            title="Overdue Returns" 
            value={metrics.overdue} 
            subtitle="Requires immediate action"
            color="text-[#bf4a53]"
            bg="bg-[#bf4a53]/10"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} 
          />
          <StatCard 
            title="Available Gowns" 
            value={metrics.available} 
            subtitle={`Out of ${metrics.totalItems} total items`}
            color="text-gray-900"
            bg="bg-gray-100"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />} 
          />
        </div>

        {/* Main Content Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* LEFT COLUMN: Recent Transactions (Takes up 2/3 width on desktop) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-black text-[#111010]">Recent Activity</h2>
              <button onClick={() => navigate('/admin-history')} className="text-xs font-black text-[#bf4a53] uppercase tracking-widest hover:text-[#9a3a42] transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentTx.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-bold">No recent transactions.</div>
              ) : (
                recentTx.map((task) => (
                  <div key={task.txId} className="group flex items-center gap-4 p-4 rounded-3xl border border-gray-50 hover:border-[#bf4a53]/20 hover:bg-[#bf4a53]/5 transition-all duration-300">
                    <div className="relative shrink-0">
                      <img src={task.item?.imageUrl} alt={task.item?.name} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover shadow-sm grayscale-[30%] group-hover:grayscale-0 transition-all" />
                      <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        task.status === 'active' ? 'bg-[#34c759]' : task.status === 'overdue' ? 'bg-[#ff9f0a]' : 'bg-gray-300'
                      }`} />
                    </div>
                    
                    <div className="grow min-w-0">
                      <div className="text-base md:text-lg font-black text-gray-900 truncate">{task.customerName}</div>
                      <div className="text-xs text-gray-400 font-bold truncate mt-0.5">
                        {task.item?.name} <span className="mx-1">•</span> Due {task.dueDate}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`hidden sm:inline-block text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                        task.status === 'active' ? 'bg-green-50 text-green-700' : 
                        task.status === 'overdue' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {task.status}
                      </span>
                      
                      {task.status !== 'completed' && (
                        <button 
                          onClick={() => sendPing(task.customerName)} 
                          title="Send SMS Reminder"
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#bf4a53] hover:text-white transition-all active:scale-95"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Quick Actions & Mini Reports (Takes up 1/3 width on desktop) */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-[#111010] mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <ActionBtn 
                  label="Catalog" 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />} 
                  onClick={() => navigate('/catalog')} 
                />
                <ActionBtn 
                  label="Reports" 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />} 
                  onClick={() => navigate('/admin-reports')} 
                />
              </div>
            </div>

            {/* Inventory Health Mini-Widget */}
            <div className="bg-[#111010] rounded-[32px] p-6 md:p-8 shadow-xl text-white">
              <h2 className="text-lg font-black text-white mb-2">Inventory Health</h2>
              <p className="text-xs font-medium text-gray-400 mb-6">Real-time asset utilization</p>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-300">Rented Out</span>
                    <span className="text-white">{Math.round((metrics.active / metrics.totalItems) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#bf4a53] h-2.5 rounded-full" style={{ width: `${(metrics.active / metrics.totalItems) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-300">Available in Store</span>
                    <span className="text-white">{Math.round((metrics.available / metrics.totalItems) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(metrics.available / metrics.totalItems) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

function StatCard({ title, value, subtitle, icon, color, bg }) {
  return (
    <div className="bg-white rounded-[28px] p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
      <div className={`p-3 rounded-2xl ${bg} w-fit mb-4 text-gray-900 transition-colors`}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-6 h-6 stroke-[2.5px] ${color}`}>
          {icon}
        </svg>
      </div>
      <div className="mt-auto">
        <div className="text-2xl md:text-3xl font-black text-gray-900 leading-none mb-1.5">{value}</div>
        <div className="text-xs md:text-sm font-bold text-gray-800">{title}</div>
        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{subtitle}</div>
      </div>
    </div>
  );
}

function ActionBtn({ label, icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white transition-all active:scale-95 group"
    >
      <div className="text-gray-400 group-hover:text-[#bf4a53] transition-colors">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.5px]">
          {icon}
        </svg>
      </div>
      <span className="text-xs font-black text-gray-700 uppercase tracking-wide">{label}</span>
    </button>
  );
}