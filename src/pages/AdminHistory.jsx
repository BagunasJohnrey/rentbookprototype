// src/pages/AdminHistory.jsx
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
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full">
        
        {/* Header Section */}
        <div className="mb-8 md:mb-12 animate-slide-up">
          <h1 className="text-[32px] md:text-5xl font-black text-[#111010] tracking-tight">Rental History</h1>
          <p className="text-sm md:text-base font-medium text-[#8e8e93] mt-2">Monitor and manage all customer transactions</p>
        </div>

        {/* Filter Tabs - Shared but styled for both */}
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
                      {tx.status !== 'completed' && (
                        <button 
                          onClick={() => sendPing(tx.customerName)} 
                          className="px-4 py-2 bg-[#bf4a53]/5 text-[#bf4a53] rounded-xl text-xs font-black hover:bg-[#bf4a53] hover:text-white transition-all"
                        >
                          Send Reminder
                        </button>
                      )}
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
                className="bg-white rounded-[28px] p-5 flex items-center gap-5 shadow-sm active:scale-95 transition-all animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative">
                  <img src={tx.item?.imageUrl} className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-inner" alt="" />
                  <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
                    tx.status === 'active' ? 'bg-[#34c759]' : tx.status === 'overdue' ? 'bg-[#ff9f0a]' : 'bg-gray-300'
                  }`} />
                </div>
                
                <div className="grow min-w-0">
                  <div className="text-lg font-black text-[#111010] truncate">{tx.customerName}</div>
                  <div className="text-xs text-[#8e8e93] font-bold truncate mb-1">{tx.item?.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-[#bf4a53] font-black uppercase tracking-wider">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tx.dueDate}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  {tx.status !== 'completed' && (
                    <button 
                      onClick={() => sendPing(tx.customerName)} 
                      className="w-10 h-10 flex items-center justify-center bg-[#bf4a53]/10 rounded-2xl text-[#bf4a53] active:bg-[#bf4a53] active:text-white transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </button>
                  )}
                  <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase ${
                    tx.status === 'active' ? 'bg-green-50 text-green-600' : 
                    tx.status === 'overdue' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {tx.status}
                  </span>
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