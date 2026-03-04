// src/pages/StaffHistory.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data based on your RentBook project structure
const MOCK_HISTORY = [
  { id: 'TXN-9921', customer: 'John Doe', item: 'Classic White Gown', date: '2026-03-01', total: 2500, status: 'Active' },
  { id: 'TXN-9918', customer: 'Liza Soberano', item: 'Evening Silk Dress', date: '2026-02-28', total: 4500, status: 'Returned' },
  { id: 'TXN-9915', customer: 'Jane Smith', item: 'Modern Filipiñana', date: '2026-02-25', total: 3200, status: 'Overdue' },
];

export default function StaffHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredHistory = filter === 'All' 
    ? MOCK_HISTORY 
    : MOCK_HISTORY.filter(tx => tx.status === filter);

  return (
    <div className="min-h-screen bg-app-bg font-sans">
      
      {/* ==========================================
          MOBILE DESIGN (Retained)
          Visible only on screens < md
      ========================================== */}
      <div className="flex md:hidden flex-col h-screen">
        <header className="pt-12 px-6 pb-4 bg-white shrink-0 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-main">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h1 className="text-[17px] font-bold">History</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Mobile Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Active', 'Returned', 'Overdue'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <main className="grow overflow-y-auto px-6 py-4 pb-24">
          <div className="space-y-4">
            {filteredHistory.map(tx => (
              <div key={tx.id} className="bg-white p-5 rounded-3xl shadow-sm flex justify-between items-center active:scale-95 transition-all">
                <div className="flex gap-4 items-center">
                  <div className={`w-2 h-10 rounded-full ${tx.status === 'Active' ? 'bg-blue-400' : tx.status === 'Overdue' ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <div>
                    <p className="font-black text-text-main">{tx.customer}</p>
                    <p className="text-xs text-gray-400 font-bold">{tx.item} • {tx.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">₱{tx.total}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-300">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>


      {/* ==========================================
          DESKTOP DESIGN
          Visible only on screens >= md
      ========================================== */}
      <div className="hidden md:flex flex-col h-screen p-12 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-text-main mb-2">Transaction History</h1>
              <p className="text-gray-400 font-medium text-lg">Manage and track all customer rental records.</p>
            </div>
            
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              {['All', 'Active', 'Returned', 'Overdue'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${filter === f ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          <div className="bg-app-bg rounded-[40px] p-10 overflow-hidden shadow-inner min-h-[600px]">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-gray-400 text-sm font-black uppercase tracking-widest px-6">
                  <th className="pb-4 pl-8">Transaction ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Rented Item</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">Total Paid</th>
                  <th className="pb-4 text-center pr-8">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold text-xl">
                      No records found for "{filter}"
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(tx => (
                    <tr key={tx.id} className="bg-white group hover:shadow-lg transition-all">
                      <td className="py-6 pl-8 rounded-l-[28px] font-bold text-gray-400 group-hover:text-primary transition-colors">{tx.id}</td>
                      <td className="py-6 font-black text-text-main">{tx.customer}</td>
                      <td className="py-6 font-bold text-gray-500">{tx.item}</td>
                      <td className="py-6 font-medium text-gray-400">{tx.date}</td>
                      <td className="py-6 text-right font-black text-lg">₱{tx.total}</td>
                      <td className="py-6 pr-8 rounded-r-[28px] text-center">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider
                          ${tx.status === 'Active' ? 'bg-blue-50 text-blue-600' : 
                            tx.status === 'Overdue' ? 'bg-red-50 text-red-600' : 
                            'bg-green-50 text-green-600'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}