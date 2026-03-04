// src/pages/AdminDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';
import AdminBottomNav from '../components/AdminBottomNav';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const activeCount = TRANSACTIONS.filter(t => t.status === 'active').length;
  const overdueCount = TRANSACTIONS.filter(t => t.status === 'overdue').length;
  const catalogCount = CATALOG_ITEMS.length;
  
  // Calculate revenue dynamically from transactions
  const totalRevenue = TRANSACTIONS.reduce((acc, curr) => acc + (curr.total || 0), 0);
  
  const recentTx = TRANSACTIONS.slice(0, 4).map(tx => {
    const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
    return { ...tx, item };
  });

  const sendPing = (name) => {
    alert(`Reminder ping sent to ${name} via SMS.`);
  };

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="grow overflow-y-auto px-4 md:px-8 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-7xl md:mx-auto md:w-full">
        
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Management Terminal</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Store Today</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <StatCard icon={<circle cx="12" cy="12" r="10"></circle>} value={activeCount} label="Active" color="text-blue-500" />
          <StatCard icon={<path d="M12 2v20m10-10H2"></path>} value={`₱${(totalRevenue/1000).toFixed(1)}k`} label="Revenue" color="text-emerald-500" />
          <StatCard icon={<path d="M20 7h-9"></path>} value={catalogCount} label="Catalog" color="text-primary" />
          <StatCard icon={<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>} value={overdueCount} label="Overdue" color="text-orange-500" />
        </div>

        {/* Recent Transactions Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-black text-gray-900">Recent Transactions</h2>
          <button 
            onClick={() => navigate('/admin-history')} 
            className="px-5 py-2 rounded-full bg-gray-50 text-xs font-black text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm uppercase tracking-wider"
          >
            See All Records
          </button>
        </div>

        {/* Transaction List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentTx.map((task) => {
            const isOverdue = task.status === 'overdue';
            return (
              <div 
                key={task.txId} 
                className="group bg-white rounded-3xl p-4 flex items-center gap-4 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500"
              >
                <img src={task.item?.imageUrl} alt={task.item?.name} className="w-16 h-16 rounded-2xl object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" />
                <div className="grow min-w-0">
                  <div className="text-[15px] font-black text-gray-900 truncate mb-0.5">{task.customerName}</div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-tight truncate">
                    {task.item?.name} • Due {task.dueDate}
                  </div>
                </div>
                
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase whitespace-nowrap ${isOverdue ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                  {task.status}
                </span>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); sendPing(task.customerName); }} 
                  className="p-3 rounded-2xl bg-gray-50 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-lg transition-all duration-500 group">
      <div className={`p-3 rounded-2xl bg-gray-50 w-fit group-hover:bg-white transition-colors ${color}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[3px]">
          {icon}
        </svg>
      </div>
      <div>
        <div className="text-3xl font-black text-gray-900 leading-none mb-2">{value}</div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}