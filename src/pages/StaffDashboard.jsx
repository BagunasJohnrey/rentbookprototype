// src/pages/StaffDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function StaffDashboard() {
  const navigate = useNavigate();

const priorityTasks = TRANSACTIONS
  .filter(tx => tx.status !== 'completed')
  .map(tx => {
    const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
    return { ...tx, item };
  });

  return (
    <div className="flex flex-col h-full relative bg-slate-50">
      <div className="grow overflow-y-auto px-4 md:px-8 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-7xl md:mx-auto md:w-full">
        
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-sm font-semibold text-gray-400 mb-1">Front Desk Operations</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Staff Dashboard</h1>
        </div>

        {/* Quick Action Banner */}
        <div 
          onClick={() => navigate('/staff-new-rental')}
          className="bg-linear-to-br from-primary-light to-primary rounded-4xl p-8 text-white flex items-center justify-between mb-10 shadow-xl shadow-red-200/50 cursor-pointer hover:scale-[1.01] active:scale-95 transition-all duration-300"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-1">New Rental</h2>
            <p className="text-sm opacity-90 font-bold uppercase tracking-wider">Start 3-Step Wizard</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 stroke-[3px]"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </div>

        {/* Tasks Section Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900">Today's Priority</h2>
            <p className="text-sm text-gray-400 font-bold">Immediate actions required</p>
          </div>
          <button className="text-sm font-black text-primary hover:text-primary-light transition-colors pb-1 border-b-2 border-primary/20">View All</button>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {priorityTasks.map((task, index) => {
            const isOverdue = task.status === 'overdue';
            return (
              <div 
                key={task.txId} 
                className="group bg-white rounded-3xl p-5 flex items-center gap-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="relative">
                  <img src={task.item?.imageUrl} alt={task.item?.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-50" />
                  {isOverdue && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                    </span>
                  )}
                </div>
                
                <div className="grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-black text-gray-900 truncate">{task.customerName}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-tight truncate">
                    {task.item?.name}
                  </div>
                  <div className={`mt-2 inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                    {isOverdue ? 'Overdue' : 'Due ' + task.dueDate}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[3px] text-gray-300 group-hover:text-primary">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}