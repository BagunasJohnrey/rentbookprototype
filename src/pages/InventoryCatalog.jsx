// src/pages/InventoryCatalog.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

export default function InventoryCatalog({ globalRole }) {
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
    <div className="flex flex-col h-full relative bg-gray-50">
      
      {/* ==========================================
          DESKTOP DESIGN (Visible on md and up)
      ========================================== */}
      <div className="hidden md:flex flex-col grow p-10 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-gray-500 font-medium mt-2">Manage and monitor your rental assets</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-w-[160px]">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Items</p>
              <p className="text-3xl font-black text-gray-900">{CATALOG_ITEMS.length}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-w-[160px]">
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Available</p>
              <p className="text-3xl font-black text-primary">{availableCount}</p>
            </div>
          </div>
        </header>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col gap-8">
          {/* Desktop Controls */}
          <div className="flex gap-6 items-center">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full bg-gray-50 border-none py-5 pl-14 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div className="flex bg-gray-50 p-1.5 rounded-2xl">
              {['all', 'available', 'gowns', 'suits', 'barong'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table-style Grid */}
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setDetailItem(item)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase backdrop-blur-md shadow-sm ${item.status === 'Available' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {item.status}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 px-2">{item.name}</h3>
                <p className="text-primary font-black px-2">₱{item.baseRate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ==========================================
          MOBILE DESIGN (Visible on screen < md)
      ========================================== */}
      <div className="md:hidden flex flex-col h-full">
        <div className="grow overflow-y-auto px-4 pt-8 pb-28">
          
          <div className="flex flex-col mb-8 gap-6">
            <div className="animate-slide-up">
              <h1 className="text-[32px] font-extrabold text-text-main tracking-tight leading-tight">Catalog</h1>
              <p className="text-sm font-medium text-text-muted mt-1">Browse and manage rental inventory</p>
            </div>
            
            <div className="flex gap-3 animate-fade-in-down">
               <SummaryChip label="Total" value={CATALOG_ITEMS.length} />
               <SummaryChip label="Available" value={availableCount} color="text-primary" />
               <SummaryChip label="Rented" value={CATALOG_ITEMS.length - availableCount} />
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search items..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-4 pr-4 pl-12 border-none rounded-2xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
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

          <div className="grid grid-cols-2 gap-4">
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
                  <h3 className="font-bold text-gray-800 truncate text-sm">{item.name}</h3>
                  <p className="text-primary font-black text-sm mt-1">₱{item.baseRate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shared Detail Modal (Works for both desktop and mobile) */}
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailItem(null)} />
          
          <div className="relative bg-white w-full md:max-w-4xl md:rounded-[48px] rounded-t-[40px] overflow-hidden max-h-[95vh] md:max-h-[85vh] flex flex-col animate-slide-up">
            
            {/* CLOSE BUTTON MOVED HERE */}
            <button 
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/50 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-white hover:shadow-md transition-all z-10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[3px]">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex flex-col md:flex-row h-full">
               <div className="w-full md:w-1/2 h-80 md:h-auto relative">
                  <img src={detailItem.imageUrl} className="w-full h-full object-cover" alt={detailItem.name} />
               </div>
               <div className="p-8 md:p-12 grow flex flex-col">
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight pr-8">{detailItem.name}</h2>
                  <p className="text-gray-500 text-base leading-relaxed grow mt-6">
                    {detailItem.description || "Premium selection for your special events."}
                  </p>
                  <div className="grid grid-cols-2 gap-6 my-10">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                       <p className="text-xs uppercase font-bold text-gray-400 tracking-widest">Rate</p>
                       <p className="text-2xl font-black text-gray-900">₱{detailItem.baseRate}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                       <p className="text-xs uppercase font-bold text-gray-400 tracking-widest">Deposit</p>
                       <p className="text-2xl font-black text-gray-900">₱{detailItem.deposit}</p>
                    </div>
                  </div>
                  
                  {/* ROLE-BASED CONDITIONAL RENDERING */}
                  {globalRole === 'staff' ? (
                    <button 
                      disabled={detailItem.status !== 'Available'}
                      onClick={() => navigate(`/staff-new-rental?itemId=${detailItem.id}`)}
                      className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${
                        detailItem.status === 'Available' 
                          ? 'bg-[#bf4a53] text-white shadow-xl shadow-[#bf4a53]/20 hover:brightness-110' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {detailItem.status === 'Available' ? 'Proceed to Rental' : 'Unavailable'}
                    </button>
                  ) : (
                    <div className={`w-full py-5 rounded-2xl font-black text-lg text-center ${
                      detailItem.status === 'Available'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {detailItem.status === 'Available' ? 'Item is Available' : 'Currently Unavailable'}
                    </div>
                  )}

               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Retained Helper Component
function SummaryChip({ label, value, color = "text-text-main" }) {
  return (
    <div className="flex-1 min-w-20 bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-50">
      <div className={`text-lg font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}