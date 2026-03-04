import { useState } from 'react';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';
import AdminBottomNav from '../components/AdminBottomNav';

export default function AdminHistory() {
  // FIX: Removed unused 'navigate' hook
  const [filter, setFilter] = useState('all');

  // Filter and map transactions to include item details
  const filteredTx = (filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === filter))
    .map(tx => {
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      return { ...tx, item };
    });

  const sendPing = (name) => {
    alert(`SMS drafted for ${name}`);
  };

  return (
    <div className="flex flex-col h-full bg-app-bg relative">
      <div className="grow overflow-y-auto px-6 pt-12 pb-28">
        
        <div className="mb-5 animate-slide-up">
          <h1 className="text-[32px] font-extrabold text-text-main tracking-tight">History</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3.5 mb-4 scrollbar-hide animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          {['all', 'active', 'overdue', 'completed'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4.5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border-1.5 ${filter === f ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(191,74,83,0.2)]' : 'bg-app-card text-text-muted border-[#e5e5ea]'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="flex flex-col gap-3 animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
          {filteredTx.length === 0 ? (
            <div className="text-center py-10 text-text-muted font-semibold">No transactions found</div>
          ) : (
            filteredTx.map((tx, i) => {
              // FIX: Removed unused 'statusClass'
              
              const badgeClass = 
                tx.status === 'active' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 
                tx.status === 'overdue' ? 'bg-[#fff3e0] text-[#e65100]' : 'bg-[#f2f2f7] text-[#8e8e93]';

              return (
                <div 
                  key={tx.txId} 
                  className={`bg-app-card rounded-[20px] p-3.5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer active:scale-95 transition-transform border-l-4 animate-slide-up`}
                  style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: tx.status === 'active' ? '#34c759' : tx.status === 'overdue' ? '#ff9f0a' : 'transparent' }}
                >
                  <img src={tx.item?.imageUrl} alt={tx.item?.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  
                  <div className="grow">
                    <div className="text-[15px] font-bold text-text-main mb-1">{tx.customerName}</div>
                    <div className="text-[13px] text-text-muted font-medium">{tx.item?.name} • {tx.dueDate}</div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase whitespace-nowrap ${badgeClass}`}>
                      {tx.status}
                    </span>
                    <span className="text-sm font-extrabold text-text-main">₱{tx.item?.baseRate ? tx.item.baseRate + tx.item.deposit : 0}</span>
                  </div>

                  {tx.status !== 'completed' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); sendPing(tx.customerName); }} 
                      className="p-1.5 rounded-xl transition-colors active:bg-[#fdf0f1] ml-1 shrink-0"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" className="w-4.5 h-4.5 stroke-[2.5px]">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
      <AdminBottomNav />
    </div>
  );
}