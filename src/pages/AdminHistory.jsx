// src/pages/AdminHistory.jsx refactored
import { useState } from 'react';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';
import AdminBottomNav from '../components/AdminBottomNav';

export default function AdminHistory() {
  const [filter, setFilter] = useState('all');

  const filteredTx = (filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === filter))
    .map(tx => {
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      return { ...tx, item };
    });

  const sendPing = (name) => alert(`SMS draft created for ${name}`);

  return (
    <div className="flex flex-col h-full relative">
      <div className="grow overflow-y-auto px-4 md:px-8 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-7xl md:mx-auto md:w-full">
        
        <div className="mb-6 animate-slide-up">
          <h1 className="text-[32px] md:text-4xl font-extrabold text-text-main tracking-tight">Rental History</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Track past and current transactions</p>
        </div>

        {/* Responsive Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {['all', 'active', 'overdue', 'completed'].map(f => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100'}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Responsive Transaction Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTx.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-4xl border border-gray-50 text-gray-400 font-bold">
               No transactions found for this filter
            </div>
          ) : (
            filteredTx.map((tx, i) => (
              <div 
                key={tx.txId} 
                className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all border-l-4 border-l-transparent animate-slide-up"
                style={{ 
                  animationDelay: `${i * 0.05}s`, 
                  borderLeftColor: tx.status === 'active' ? '#34c759' : tx.status === 'overdue' ? '#ff9f0a' : 'transparent' 
                }}
              >
                <img src={tx.item?.imageUrl} className="w-16 h-16 rounded-2xl object-cover shrink-0" alt="" />
                
                <div className="grow">
                  <div className="text-base font-black text-gray-800">{tx.customerName}</div>
                  <div className="text-xs text-gray-400 font-bold">{tx.item?.name}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{tx.dueDate}</div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
                    tx.status === 'active' ? 'bg-green-50 text-green-600' : 
                    tx.status === 'overdue' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {tx.status}
                  </span>
                  
                  {tx.status !== 'completed' && (
                    <button 
                      onClick={() => sendPing(tx.customerName)} 
                      className="p-2 bg-primary/5 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 stroke-[2.5px]">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}