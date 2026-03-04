// src/pages/StaffDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function StaffDashboard() {
  const navigate = useNavigate();

  // Combine transaction data with item data for the UI
  const priorityTasks = TRANSACTIONS.map(tx => {
    const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
    return { ...tx, item };
  });

  return (
    <div className="flex flex-col h-full relative">
      {/* RESPONSIVE FIX: 
        - Added md:max-w-7xl md:mx-auto md:w-full to center content on desktop.
        - Changed pb-28 to md:pb-12 so desktop doesn't have huge empty space at the bottom.
      */}
      <div className="grow overflow-y-auto px-4 md:px-8 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-7xl md:mx-auto md:w-full">
        
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-slide-up">
          <p className="text-sm font-semibold text-text-muted mb-1">Front Desk Operations</p>
          <h1 className="text-[32px] md:text-4xl font-extrabold text-text-main tracking-tight">Staff Dashboard</h1>
        </div>

        {/* Quick Action Banner */}
        <div 
          onClick={() => navigate('/staff-new-rental')}
          className="bg-linear-to-br from-primary to-primary-light rounded-[28px] p-6 text-white flex items-center justify-between mb-8 shadow-[0_12px_24px_rgba(191,74,83,0.3)] cursor-pointer active:scale-95 hover:scale-[1.02] transition-transform animate-fade-in-down"
        >
          <div>
            <h2 className="text-[22px] md:text-2xl font-extrabold mb-1">New Rental</h2>
            <p className="text-sm opacity-90 font-medium">3-Step Wizard Interface</p>
          </div>
          <div className="bg-white/20 p-3.5 rounded-full flex">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 stroke-[3px]"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="flex justify-between items-center mb-4 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg md:text-xl font-bold text-text-main">Today's Priority</h2>
          <span className="text-sm font-bold text-primary hover:text-primary-light transition-colors cursor-pointer">View All</span>
        </div>

        {/* RESPONSIVE FIX: 
          Turned flex column into a grid that expands to 2 columns on tablet and 3 on desktop 
        */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-6">
          {priorityTasks.map((task, index) => {
            const isOverdue = task.status === 'overdue';
            return (
              <div 
                key={task.txId} 
                className={`bg-white rounded-[20px] p-4 flex items-center gap-4 shadow-sm hover:shadow-md border-l-[5px] active:scale-95 transition-all cursor-pointer animate-fade-in-down`}
                style={{ animationDelay: `${0.2 + (index * 0.1)}s`, borderLeftColor: isOverdue ? '#ff9f0a' : 'var(--color-primary-light)' }}
              >
                <img src={task.item?.imageUrl} alt={task.item?.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="grow">
                  <div className="text-[15px] font-bold text-text-main mb-1">
                    {isOverdue && '⚠️ '} {task.customerName}
                  </div>
                  <div className="text-[13px] text-text-muted font-medium">
                    {task.item?.name} • Due {task.dueDate}
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke={isOverdue ? '#ff9f0a' : 'var(--color-primary-light)'} className="w-5 h-5 stroke-[3px]">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            );
          })}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}