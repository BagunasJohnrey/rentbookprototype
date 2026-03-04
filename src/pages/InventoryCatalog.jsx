// src/pages/InventoryCatalog.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function InventoryCatalog() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);

  const filteredItems = useMemo(() => {
    let items = [...CATALOG_ITEMS];
    if (filter === 'available') {
      items = items.filter(i => i.status === 'Available');
    } else if (filter !== 'all') {
      items = items.filter(i => i.category === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(item => 
        (item.name + ' ' + item.category).toLowerCase().includes(q)
      );
    }
    return items;
  }, [filter, search]);

  const availableCount = CATALOG_ITEMS.filter(i => i.status === 'Available').length;

  return (
    <div className="flex flex-col h-full relative">
      <div className="grow overflow-y-auto px-4 md:px-8 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-7xl md:mx-auto md:w-full">
        
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="animate-slide-up">
            <h1 className="text-[32px] md:text-4xl font-extrabold text-text-main tracking-tight leading-tight">Catalog</h1>
            <p className="text-sm font-medium text-text-muted mt-1">Browse and manage rental inventory</p>
          </div>
          
          <div className="flex gap-3 md:w-auto animate-fade-in-down">
             <SummaryChip label="Total" value={CATALOG_ITEMS.length} />
             <SummaryChip label="Available" value={availableCount} color="text-primary" />
             <SummaryChip label="Rented" value={CATALOG_ITEMS.length - availableCount} />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="relative w-full md:grow">
            <input 
              type="text" 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-4 pr-4 pl-12 border-none rounded-2xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['all', 'available', 'gowns', 'suits', 'barong'].map(f => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredItems.map((item, i) => (
            <div 
              key={item.id} 
              onClick={() => setDetailItem(item)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative aspect-3/4 bg-gray-100 overflow-hidden">
                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md ${item.status === 'Available' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                  {item.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate text-sm md:text-base">{item.name}</h3>
                <p className="text-primary font-black text-sm mt-1">₱{item.baseRate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailItem(null)} />
          <div className="relative bg-white w-full md:max-w-3xl md:rounded-4xl rounded-t-4xl overflow-hidden max-h-[95vh] md:max-h-[80vh] flex flex-col animate-slide-up">
            <div className="flex flex-col md:flex-row h-full">
               <div className="w-full md:w-1/2 h-72 md:h-auto relative">
                  <img src={detailItem.imageUrl} className="w-full h-full object-cover" alt={detailItem.name} />
               </div>
               <div className="p-6 md:p-10 grow flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{detailItem.name}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed grow mt-4">
                    {detailItem.description || "Premium selection for your special events."}
                  </p>
                  <div className="grid grid-cols-2 gap-4 my-8">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                       <p className="text-[10px] uppercase font-bold text-gray-400">Rate</p>
                       <p className="text-xl font-black text-gray-800">₱{detailItem.baseRate}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                       <p className="text-[10px] uppercase font-bold text-gray-400">Deposit</p>
                       <p className="text-xl font-black text-gray-800">₱{detailItem.deposit}</p>
                    </div>
                  </div>
                  <button 
                    disabled={detailItem.status !== 'Available'}
                    onClick={() => navigate(`/staff-new-rental?itemId=${detailItem.id}`)}
                    className={`w-full py-4 rounded-2xl font-bold transition-all ${detailItem.status === 'Available' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    {detailItem.status === 'Available' ? 'Proceed to Rental' : 'Unavailable'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}

function SummaryChip({ label, value, color = "text-text-main" }) {
  return (
    <div className="flex-1 min-w-20 md:min-w-25 bg-white rounded-2xl p-3 md:p-4 text-center shadow-sm border border-gray-50">
      <div className={`text-lg md:text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}