import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';
import BottomNav from '../components/BottomNav';

// Mock Semantic Search Dictionary
const themeDictionary = {
  "wedding": ["#White", "#Ivory", "#Lace", "#Wedding"],
  "prom": ["#Red", "#Formal", "#Evening"],
  "filipiniana": ["#Barong", "#Terno", "#Traditional"]
};

export default function InventoryCatalog() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null); // Controls the bottom sheet

  // Derived State: Filter and Search Logic
  const filteredItems = useMemo(() => {
    let items = [...CATALOG_ITEMS];

    // 1. Apply Category Filter
    if (filter === 'available') {
      items = items.filter(i => i.status === 'Available');
    } else if (filter !== 'all') {
      items = items.filter(i => i.category === filter);
    }

    // 2. Apply Search (with mock semantic tagging)
    if (search.trim()) {
      const q = search.toLowerCase();
      // Check if search matches a "theme" in our dictionary
      let searchTags = [q];
      for (const [theme, tags] of Object.entries(themeDictionary)) {
        if (q.includes(theme)) searchTags = searchTags.concat(tags.map(t => t.toLowerCase()));
      }

      items = items.filter(item => {
        const haystack = (item.name + ' ' + item.tags.join(' ') + ' ' + item.category).toLowerCase();
        return searchTags.some(term => haystack.includes(term));
      });
    }

    return items;
  }, [filter, search]);

  const availableCount = CATALOG_ITEMS.filter(i => i.status === 'Available').length;

  return (
    <div className="flex flex-col h-full bg-app-bg relative">
      <div className="grow overflow-y-auto px-6 pt-12 pb-28">
        
        {/* Header */}
        <div className="mb-5 animate-slide-up">
          <h1 className="text-[32px] font-extrabold text-text-main tracking-tight leading-tight">Catalog</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Browse & rent available items</p>
        </div>

        {/* Summary Chips */}
        <div className="flex gap-2.5 mb-5 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <div className="flex-1 bg-app-card rounded-2xl p-3.5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[22px] font-extrabold text-text-main leading-none">{CATALOG_ITEMS.length}</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4px] mt-1">Total</div>
          </div>
          <div className="flex-1 bg-app-card rounded-2xl p-3.5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[22px] font-extrabold text-primary leading-none">{availableCount}</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4px] mt-1">Available</div>
          </div>
          <div className="flex-1 bg-app-card rounded-2xl p-3.5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-[22px] font-extrabold text-text-main leading-none">{CATALOG_ITEMS.length - availableCount}</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.4px] mt-1">Rented Out</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted stroke-[2.5px] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search or try 'Wedding', 'Prom'..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 pr-4 pl-12 border-none rounded-[18px] text-[15px] font-medium bg-app-card shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none focus:shadow-[0_6px_16px_rgba(191,74,83,0.1)] text-text-main transition-shadow"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-3.5 mb-1.5 scrollbar-hide animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
          {['all', 'available', 'gowns', 'suits', 'barong'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border-1.5 ${filter === f ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(191,74,83,0.2)]' : 'bg-app-card text-primary-light border-[#f9d8da]'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-end gap-2 mb-3.5 animate-fade-in-down" style={{ animationDelay: '0.35s' }}>
          <span className="text-[13px] font-semibold text-text-muted mr-auto">{filteredItems.length} items</span>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-colors shadow-[0_2px_6px_rgba(0,0,0,0.04)] ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-app-card text-text-muted'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4.5 h-4.5 stroke-[2.5px]"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-colors shadow-[0_2px_6px_rgba(0,0,0,0.04)] ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-app-card text-text-muted'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4.5 h-4.5 stroke-[2.5px]"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
        </div>

        {/* Catalog Grid / List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center opacity-70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12 text-text-muted mb-3 stroke-[1.5px]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p className="text-[15px] font-semibold text-text-muted">No items match your search</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3.5' : 'flex flex-col gap-3'}>
            {filteredItems.map((item, i) => {
              const isRented = item.status === 'Rented';
              return viewMode === 'grid' ? (
                // GRID ITEM
                <div key={item.id} onClick={() => setDetailItem(item)} className="bg-app-card rounded-[22px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col cursor-pointer active:scale-95 transition-transform animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="relative h-[156px] bg-[#ddd] overflow-hidden group">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase bg-white/90 backdrop-blur-sm ${isRented ? 'text-[#e65100]' : 'text-[#2e7d32]'}`}>{item.status}</span>
                  </div>
                  <div className="p-3 pb-3.5">
                    <div className="text-sm font-bold text-text-main mb-1 line-clamp-1">{item.name}</div>
                    <div className="text-[13px] font-semibold text-text-muted mb-2">₱{item.baseRate}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {item.tags.slice(0, 2).map(t => <span key={t} className="bg-[#fcebeb] text-primary-light text-[10px] font-bold px-2 py-1 rounded-md">{t}</span>)}
                    </div>
                  </div>
                </div>
              ) : (
                // LIST ITEM
                <div key={item.id} onClick={() => setDetailItem(item)} className="bg-app-card rounded-[20px] p-3.5 flex items-center gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  <div className="grow">
                    <div className="text-[15px] font-bold text-text-main mb-1 line-clamp-1">{item.name}</div>
                    <div className="text-[13px] text-text-muted font-medium mb-1.5">{item.id}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {item.tags.slice(0, 3).map(t => <span key={t} className="bg-[#fcebeb] text-primary-light text-[10px] font-bold px-2 py-1 rounded-md">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-[15px] font-extrabold text-text-main">₱{item.baseRate}</div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(!isRented) navigate(`/staff-new-rental?itemId=${item.id}`); }} 
                      className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-colors whitespace-nowrap ${isRented ? 'bg-[#e5e5ea] text-[#aaa] cursor-not-allowed' : 'bg-primary text-white active:bg-[#a8424b]'}`}
                    >
                      {isRented ? 'Rented' : 'Rent Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Detail Sheet (Modal) */}
      <div className={`absolute inset-0 bg-app-bg z-50 flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${detailItem ? 'translate-y-0' : 'translate-y-full'}`}>
        {detailItem && (
          <>
            <img src={detailItem.imageUrl} alt="Item" className="w-full h-[280px] object-cover shrink-0" />
            <button onClick={() => setDetailItem(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/35 rounded-full flex justify-center items-center text-white backdrop-blur-sm active:scale-90 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4.5 h-4.5 stroke-[3px]"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="grow overflow-y-auto p-6 pb-32">
              <div className="flex justify-between items-start mb-3">
                <div className="text-2xl font-extrabold text-text-main tracking-tight max-w-[70%]">{detailItem.name}</div>
                <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl uppercase ${detailItem.status === 'Rented' ? 'bg-[#fff3e0] text-[#e65100]' : 'bg-[#e8f5e9] text-[#2e7d32]'}`}>{detailItem.status}</span>
              </div>
              <div className="text-[13px] font-semibold text-text-muted mb-1.5">{detailItem.id}</div>
              <div className="text-sm font-medium text-text-muted leading-relaxed mb-5">{detailItem.description || 'No description available for this item.'}</div>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-app-card rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-[0.4px] mb-1.5">Rental Rate</div>
                  <div className="text-[22px] font-extrabold text-text-main">₱{detailItem.baseRate}</div>
                </div>
                <div className="bg-app-card rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-[0.4px] mb-1.5">Deposit</div>
                  <div className="text-[22px] font-extrabold text-text-main">₱{detailItem.deposit}</div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap mb-5">
                {detailItem.tags.map(t => <span key={t} className="bg-[#fcebeb] text-primary text-xs font-bold px-3.5 py-2 rounded-xl">{t}</span>)}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-9 bg-app-card rounded-t-4xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex flex-col gap-2.5">
              <button 
                onClick={() => { if(detailItem.status !== 'Rented') navigate(`/staff-new-rental?itemId=${detailItem.id}`); }} 
                className={`w-full text-white rounded-[22px] p-5 text-[17px] font-extrabold flex items-center justify-center gap-2.5 transition-all ${detailItem.status === 'Rented' ? 'bg-[#e5e5ea] text-[#aaa] cursor-not-allowed' : 'bg-primary shadow-[0_6px_16px_rgba(191,74,83,0.3)] active:scale-95'}`}
              >
                {detailItem.status !== 'Rented' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>}
                {detailItem.status === 'Rented' ? 'Currently Rented Out' : 'Rent This Item'}
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}