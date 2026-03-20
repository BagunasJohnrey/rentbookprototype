// src/pages/InventoryCatalog.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

export default function InventoryCatalog({ globalRole }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);

  // AI Semantic Search Logic
  const filteredItems = useMemo(() => {
    let items = [...CATALOG_ITEMS];
    
    if (filter === 'available') {
      items = items.filter(i => i.status.toLowerCase() === 'available');
    } else if (filter !== 'all') {
      items = items.filter(i => i.category?.toLowerCase() === filter.toLowerCase());
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(item => {
        // Include AI tags in the search index
        const searchableString = (item.name + ' ' + (item.category || '') + ' ' + (item.tags ? item.tags.join(' ') : '')).toLowerCase();
        
        // Faked Semantic Rules for Demo purposes
        if (q === 'marriage' && searchableString.includes('wedding')) return true;
        if (q === 'prom' && searchableString.includes('evening')) return true;
        if (q === 'party' && searchableString.includes('debut')) return true;
        
        return searchableString.includes(q);
      });
    }
    return items;
  }, [filter, search]);

  const availableCount = CATALOG_ITEMS.filter(i => i.status === 'Available').length;

  const categories = [
    { id: 'all', label: 'All Collection' },
    { id: 'available', label: 'Available Now' },
    { id: 'gowns', label: 'Evening Gowns' },
    { id: 'suits', label: 'Suits & Tuxedos' },
    { id: 'barong', label: 'Filipiñana & Barong' }
  ];

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full scrollbar-hide">
        
        {/* SHARED HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 animate-slide-up">
          <div>
            <p className="text-xs font-black text-[#bf4a53] uppercase tracking-[0.2em] mb-2">The Collection</p>
            <h1 className="text-[32px] md:text-5xl font-black text-[#111010] tracking-tight leading-none">
              Lookbook
            </h1>
            <p className="text-sm md:text-base font-medium text-[#8e8e93] mt-3">
              Browse our exclusive wardrobe of premium attire.
            </p>
          </div>
          
          <div className="flex flex-col md:items-end gap-4 shrink-0">
            <div className="flex gap-3 w-full">
               <SummaryChip label="Total Assets" value={CATALOG_ITEMS.length} />
               <SummaryChip label="Ready to Wear" value={availableCount} color="text-[#34c759]" />
            </div>
            
            {globalRole === 'admin' && (
              <button 
                onClick={() => navigate('/admin-add-item')}
                className="bg-[#111010] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#bf4a53] hover:shadow-lg hover:shadow-[#bf4a53]/20 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Item
              </button>
            )}
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {/* ✨ AI Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <input 
              type="text" 
              placeholder="Semantic Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3.5 pr-4 pl-4 border border-purple-200 rounded-2xl bg-white shadow-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm text-gray-900"
            />
          </div>

          <div className="w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex gap-2 w-max pr-4 md:pr-0">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setFilter(cat.id)}
                  className={`shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                    filter === cat.id 
                      ? 'bg-[#111010] text-white shadow-lg shadow-black/10' 
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FASHION GRID */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm animate-slide-up">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <svg className="w-10 h-10 stroke-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-1">No items found</h3>
            <p className="text-gray-400 font-medium">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-10">
            {filteredItems.map((item, i) => (
              <div 
                key={item.id} 
                onClick={() => setDetailItem(item)}
                className="group cursor-pointer animate-slide-up flex flex-col"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative aspect-[3/4] rounded-[24px] md:rounded-[32px] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-white">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white/90 text-[#111010] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                      Quick View
                    </span>
                  </div>

                  <div className={`absolute top-3 right-3 md:top-4 md:right-4 px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 ${
                    item.status === 'Available' ? 'bg-[#34c759]/90 text-white' : 'bg-[#111010]/80 text-white'
                  }`}>
                    {item.status === 'Available' ? 'Ready' : 'Rented'}
                  </div>
                </div>
                
                <div className="px-2 grow flex flex-col">
                  <h3 className="font-black text-sm md:text-lg text-[#111010] leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{item.category}</p>
                  <p className="text-[#bf4a53] font-black text-sm md:text-base mt-auto">₱{item.baseRate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHARED DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 transition-all">
          <div className="absolute inset-0 bg-[#111010]/60 backdrop-blur-md transition-opacity" onClick={() => setDetailItem(null)} />
          
          <div className="relative bg-white w-full sm:max-w-5xl rounded-t-[32px] sm:rounded-[40px] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-slide-up sm:animate-scale-in z-10 pb-safe">
            
            <button 
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/80 backdrop-blur-md p-2.5 sm:p-3 rounded-full text-gray-900 hover:bg-[#111010] hover:text-white transition-all z-20 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[3px]">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex flex-col sm:flex-row h-full overflow-y-auto scrollbar-hide">
               <div className="w-full sm:w-1/2 h-[40vh] sm:h-auto sm:min-h-[500px] relative bg-gray-50 shrink-0">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/50 backdrop-blur-md rounded-full sm:hidden z-10"></div>
                  <img src={detailItem.imageUrl} className="w-full h-full object-cover" alt={detailItem.name} />
               </div>
               
               <div className="p-6 sm:p-10 lg:p-14 sm:w-1/2 flex flex-col bg-white">
                  <div className="mb-2">
                    <span className="text-[10px] font-black text-[#bf4a53] uppercase tracking-[0.2em]">{detailItem.category}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111010] leading-tight pr-8 mb-4">{detailItem.name}</h2>
                  
                  {/* ✨ AI Auto-Tagging Display */}
                  {detailItem.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg">
                        AI Tags:
                      </span>
                      {detailItem.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-500 text-xs sm:text-sm lg:text-base leading-relaxed mb-8 sm:mb-10">
                    {detailItem.description || "An exquisite piece from our premium collection, perfect for making a statement at your next special event. Carefully maintained and professionally cleaned after every use."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 mt-auto">
                    <div className="bg-[#faf6f6] p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-gray-100">
                       <p className="text-[9px] sm:text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Rental Rate</p>
                       <p className="text-xl sm:text-2xl font-black text-[#111010]">₱{detailItem.baseRate}</p>
                    </div>
                    <div className="bg-[#faf6f6] p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-gray-100">
                       <p className="text-[9px] sm:text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Security Deposit</p>
                       <p className="text-xl sm:text-2xl font-black text-[#111010]">₱{detailItem.deposit}</p>
                    </div>
                  </div>
                  
                  {globalRole === 'staff' ? (
                    <button 
                      disabled={detailItem.status !== 'Available'}
                      onClick={() => navigate(`/staff-new-rental?itemId=${detailItem.id}`)}
                      className={`w-full py-4 sm:py-5 rounded-[20px] sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                        detailItem.status === 'Available' 
                          ? 'bg-[#111010] text-white hover:bg-[#bf4a53] hover:shadow-xl hover:shadow-[#bf4a53]/20 active:scale-95' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {detailItem.status === 'Available' ? 'Proceed to Rental' : 'Currently Rented'}
                      {detailItem.status === 'Available' && (
                        <svg className="w-4 h-4 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      )}
                    </button>
                  ) : (
                    <div className={`w-full py-4 sm:py-5 rounded-[20px] sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest text-center border-2 ${
                      detailItem.status === 'Available'
                        ? 'border-[#34c759]/20 bg-[#34c759]/5 text-[#34c759]'
                        : 'border-gray-200 bg-gray-50 text-gray-400'
                    }`}>
                      {detailItem.status === 'Available' ? 'Available in Store' : 'Currently Rented'}
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

function SummaryChip({ label, value, color = "text-[#111010]" }) {
  return (
    <div className="flex-1 md:flex-none md:min-w-[120px] bg-white rounded-2xl p-3 md:p-4 text-center shadow-sm border border-gray-100">
      <div className={`text-xl md:text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}