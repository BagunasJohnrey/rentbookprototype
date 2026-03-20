// src/pages/StaffHistory.jsx
import { useState } from 'react';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function StaffHistory() {
  const [filter, setFilter] = useState('all');

  const filteredTx = (filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === filter))
    .map(tx => {
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      return { ...tx, item };
    });

  // Mock Action Handlers
  const sendPing = (name) => alert(`SMS reminder drafted for ${name}.`);
  const handleView = (id) => alert(`Opening full transaction details for ${id}...`);
  const handleReturn = (id) => {
    const confirm = window.confirm(`Mark transaction ${id} as returned?`);
    if (confirm) alert(`Transaction ${id} successfully closed!`);
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full custom-scrollbar">
        
        {/* Header Section */}
        <div className="mb-8 md:mb-12 animate-slide-up">
          <h1 className="text-[32px] md:text-5xl font-black text-[#111010] tracking-tight">Rental History</h1>
          <p className="text-sm md:text-base font-medium text-[#8e8e93] mt-2">Monitor and manage all customer transactions</p>
        </div>

        {/* Filter Tabs */}
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
                      <div className="flex justify-end gap-2">
                        {/* View Details Action */}
                        <button onClick={() => handleView(tx.txId)} className="p-2 text-gray-400 hover:text-primary transition-colors rounded-xl hover:bg-gray-100" title="View Details">
                          <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        
                        {/* Conditional Actions for Active/Overdue */}
                        {tx.status !== 'completed' && (
                          <>
                            <button onClick={() => sendPing(tx.customerName)} className="p-2 text-[#ff9f0a] hover:text-white transition-colors rounded-xl hover:bg-[#ff9f0a]" title="Send SMS Reminder">
                              <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </button>
                            <button onClick={() => handleReturn(tx.txId)} className="p-2 text-[#34c759] hover:text-white transition-colors rounded-xl hover:bg-[#34c759]" title="Mark as Returned">
                              <svg className="w-5 h-5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </button>
                          </>
                        )}
                      </div>
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
                className="bg-white rounded-[28px] p-5 flex items-center gap-4 shadow-sm transition-all animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative shrink-0">
                  <img src={tx.item?.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt="" />
                  <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    tx.status === 'active' ? 'bg-[#34c759]' : tx.status === 'overdue' ? 'bg-[#ff9f0a]' : 'bg-gray-300'
                  }`} />
                </div>
                
                <div className="grow min-w-0">
                  <div className="text-base font-black text-[#111010] truncate">{tx.customerName}</div>
                  <div className="text-[11px] text-[#8e8e93] font-bold truncate mb-1">{tx.item?.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wide ${
                      tx.status === 'active' ? 'bg-green-50 text-green-600' : 
                      tx.status === 'overdue' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {tx.status}
                    </span>
                    
                    {/* Mobile Action Buttons row */}
                    <div className="flex gap-1.5">
                      <button onClick={() => handleView(tx.txId)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      
                      {tx.status !== 'completed' && (
                        <>
                          <button onClick={() => sendPing(tx.customerName)} className="w-8 h-8 flex items-center justify-center bg-[#ff9f0a]/10 rounded-xl text-[#ff9f0a] active:bg-[#ff9f0a] active:text-white transition-colors">
                            <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          </button>
                          <button onClick={() => handleReturn(tx.txId)} className="w-8 h-8 flex items-center justify-center bg-[#34c759]/10 rounded-xl text-[#34c759] active:bg-[#34c759] active:text-white transition-colors">
                            <svg className="w-4 h-4 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}