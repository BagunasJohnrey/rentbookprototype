import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';
import AdminBottomNav from '../components/AdminBottomNav';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Dynamic Metric Calculations
  const activeCount = TRANSACTIONS.filter(t => t.status === 'active').length;
  const overdueCount = TRANSACTIONS.filter(t => t.status === 'overdue').length;
  const catalogCount = CATALOG_ITEMS.length;
  
  // Get recent 4 transactions
  const recentTx = TRANSACTIONS.slice(0, 4).map(tx => {
    const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
    return { ...tx, item };
  });

  const sendPing = (name) => {
    alert(`Reminder ping sent to ${name} via SMS.`);
  };

  return (
    <div className="flex flex-col h-full bg-app-bg relative">
      <div className="grow overflow-y-auto px-6 pt-12 pb-28">
        
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <p className="text-sm font-semibold text-text-muted mb-1">Welcome back, Admin</p>
          <h1 className="text-[32px] font-extrabold text-text-main tracking-tight">Store Today</h1>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-7">
          <StatCard icon={<><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>} value={activeCount} label="Active" delay="0.1s" />
          <StatCard icon={<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></>} value="₱38.5k" label="Revenue" delay="0.2s" />
          <StatCard icon={<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>} value={catalogCount} label="Catalog" delay="0.3s" />
          <StatCard icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></>} value={overdueCount} label="Overdue" delay="0.4s" />
        </div>

        {/* Recent Transactions Section */}
        <div className="flex justify-between items-center mb-3.5 animate-fade-in-down" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-bold text-text-main">Recent Transactions</h2>
          <span onClick={() => navigate('/admin-history')} className="text-sm font-bold text-primary-light cursor-pointer">See All</span>
        </div>

        <div className="flex flex-col gap-3 animate-fade-in-down" style={{ animationDelay: '0.6s' }}>
          {recentTx.map((task) => {
            const isOverdue = task.status === 'overdue';
            return (
              <div 
                key={task.txId} 
                onClick={() => navigate('/admin-history')}
                className="bg-app-card rounded-[20px] p-3 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform cursor-pointer"
              >
                <img src={task.item?.imageUrl} alt={task.item?.name} className="w-14.5 h-14.5 rounded-xl object-cover shrink-0" />
                <div className="grow">
                  <div className="text-[15px] font-bold text-text-main mb-1">{task.customerName}</div>
                  <div className="text-[12px] text-text-muted font-medium">{task.item?.name} • Due {task.dueDate}</div>
                </div>
                
                <span className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase whitespace-nowrap ${isOverdue ? 'bg-[#fff3e0] text-[#e65100]' : 'bg-[#e8f5e9] text-[#2e7d32]'}`}>
                  {isOverdue ? 'Overdue' : 'Active'}
                </span>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); sendPing(task.customerName); }} 
                  className="p-2 rounded-xl transition-colors active:bg-[#fdf0f1] shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" className="w-4.5 h-4.5 stroke-[2.5px]">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
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

// Reusable Sub-component for the 2x2 Grid
function StatCard({ icon, value, label, delay }) {
  return (
    <div className="bg-app-card rounded-[22px] p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-2.5 animate-slide-up" style={{ animationDelay: delay }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7.5 h-7.5 text-primary-light stroke-[2.5px]">
        {icon}
      </svg>
      <div>
        <div className="text-[26px] font-extrabold text-text-main leading-none mb-1">{value}</div>
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-[0.5px]">{label}</div>
      </div>
    </div>
  );
}