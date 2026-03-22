// src/pages/InventoryCatalog.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

export default function InventoryCatalog({ globalRole }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  
  // State for bulk selection
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // AI Semantic Search Logic
  const filteredItems = useMemo(() => {
    let items = [...CATALOG_ITEMS];
    
    if (filter === 'available') {
      items = items.filter(i => i.status?.toLowerCase() === 'available');
    } else if (filter !== 'all') {
      if (Array.isArray(filter)) {
        items = items.filter(i => filter.includes(i.category?.toLowerCase()));
      } else {
        items = items.filter(i => i.category?.toLowerCase() === filter.toLowerCase());
      }
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(item => {
        const searchableString = (
          (item.name || '') + ' ' + 
          (item.category || '') + ' ' + 
          (item.tags ? item.tags.join(' ') : '')
        ).toLowerCase();
        
        if (q === 'marriage' && searchableString.includes('wedding')) return true;
        if (q === 'prom' && searchableString.includes('evening')) return true;
        if (q === 'party' && searchableString.includes('debut')) return true;
        
        return searchableString.includes(q);
      });
    }
    return items;
  }, [filter, search]);

  const availableCount = CATALOG_ITEMS.filter(i => i.status?.toLowerCase() === 'available').length;

  const categories = [
    { id: 'all', label: 'All Collection' },
    { id: 'available', label: 'Available Now' },
    { id: 'gowns', label: 'Evening Gowns' },
    { id: 'suits', label: 'Suits & Tuxedos' },
    { id: ['barong', 'filipiniana'], label: 'Barong & Filipiniana' },
    { id: 'costumes', label: 'Costumes' },
  ];

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (status) => {
    alert(`Moving ${selectedItems.length} items to ${status}`);
    setSelectedItems([]);
    setSelectionMode(false);
  };

  const isItemAvailable = detailItem?.status?.toLowerCase() === 'available';

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full scrollbar-hide">
        
        {/* SHARED HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 animate-slide-up">
          <div>
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">The Collection</p>
            <h1 className="text-[32px] md:text-5xl font-black text-text-main tracking-tight leading-none">
              Lookbook
            </h1>
            <p className="text-sm md:text-base font-medium text-text-muted mt-3">
              Browse our exclusive wardrobe of premium attire.
            </p>
          </div>
          
          <div className="flex flex-col md:items-end gap-4 shrink-0">
            <div className="flex gap-3 w-full">
               <SummaryChip label="Total Assets" value={CATALOG_ITEMS.length} />
               <SummaryChip label="Ready to Wear" value={availableCount} color="text-success" />
            </div>
            
            {globalRole === 'admin' && (
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => {
                    setSelectionMode(!selectionMode);
                    setSelectedItems([]);
                  }}
                  className={`flex-1 md:w-auto px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                    selectionMode ? 'bg-primary text-white border-primary' : 'bg-white text-text-main border-border-soft hover:border-primary/50'
                  }`}
                >
                  {selectionMode ? 'Cancel Selection' : 'Select for Service'}
                </button>
                {!selectionMode && (
                  <button 
                    onClick={() => navigate('/admin-add-item')}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Add New
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BULK ACTION BAR - Simplified to Buttons Only */}
        {selectionMode && selectedItems.length > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] bg-app-card border-2 border-primary rounded-3xl p-4 shadow-2xl flex items-center justify-center gap-3 animate-slide-up w-auto px-8">
            <button 
              onClick={() => handleBulkAction('Laundry')}
              className="bg-primary text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Laundry
            </button>
            <button 
              onClick={() => handleBulkAction('Repair')}
              className="bg-primary/80 text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-primary/10"
            >
              Repair
            </button>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="relative w-full md:w-80 shrink-0">
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3.5 pr-4 pl-4 border border-border-soft rounded-2xl bg-app-bg shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-text-main placeholder:text-text-muted/50"
            />
          </div>

          <div className="w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex gap-2 w-max pr-4 md:pr-0">
              {categories.map(cat => {
                const isActive = Array.isArray(cat.id) 
                  ? Array.isArray(filter) && cat.id.join(',') === filter.join(',')
                  : filter === cat.id;

                return (
                  <button 
                    key={Array.isArray(cat.id) ? cat.id.join('-') : cat.id} 
                    onClick={() => setFilter(cat.id)}
                    className={`shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary' 
                        : 'bg-app-card text-text-muted border border-border-soft hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FASHION GRID */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-32 bg-app-card rounded-[40px] border border-border-soft shadow-sm animate-slide-up">
            <div className="w-20 h-20 bg-app-bg border border-border-soft rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted/50">
              <svg className="w-10 h-10 stroke-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-text-main mb-1">No items found</h3>
            <p className="text-text-muted font-medium">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-10">
            {filteredItems.map((item, i) => (
              <div 
                key={item.id} 
                onClick={() => selectionMode ? toggleSelection(item.id) : setDetailItem(item)}
                className={`group cursor-pointer animate-slide-up flex flex-col relative ${selectionMode && selectedItems.includes(item.id) ? 'scale-95' : ''} transition-transform`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Selection Marker */}
                {selectionMode && (
                  <div className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedItems.includes(item.id) ? 'bg-primary border-primary' : 'bg-white/80 border-text-muted'
                  }`}>
                    {selectedItems.includes(item.id) && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                )}

                <div className={`relative aspect-[3/4] rounded-[24px] md:rounded-[32px] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-app-card border-2 ${
                  selectionMode && selectedItems.includes(item.id) ? 'border-primary' : 'border-border-soft'
                }`}>
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-app-bg" alt={item.name} />
                  
                  {!selectionMode && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-app-card/90 text-text-main px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                        Quick View
                      </span>
                    </div>
                  )}

                  <div className={`absolute top-3 right-3 md:top-4 md:right-4 px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 ${
                    item.status?.toLowerCase() === 'available' ? 'bg-success/90 text-white' : 'bg-app-card/90 text-text-muted border-border-soft'
                  }`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="px-2 grow flex flex-col">
                  <h3 className="font-black text-sm md:text-base text-text-main leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">{item.category}</p>
                  <p className="text-primary font-black text-sm md:text-base mt-auto">₱{item.baseRate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHARED DETAIL MODAL (Pop-up) */}
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 transition-all">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setDetailItem(null)} />
          
          <div className="relative bg-app-card w-full sm:max-w-5xl rounded-t-[32px] sm:rounded-[40px] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-slide-up sm:animate-scale-in z-10 pb-safe">
            
            <button 
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-app-bg/80 backdrop-blur-md p-2.5 sm:p-3 rounded-full text-text-muted hover:bg-primary hover:text-white border border-border-soft transition-all z-20 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[3px]">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex flex-col sm:flex-row h-full overflow-y-auto scrollbar-hide">
               <div className="w-full sm:w-1/2 h-[40vh] sm:h-auto sm:min-h-[500px] relative bg-app-bg shrink-0">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/50 backdrop-blur-md rounded-full sm:hidden z-10"></div>
                  <img src={detailItem.imageUrl} className="w-full h-full object-cover" alt={detailItem.name} />
               </div>
               
               <div className="p-6 sm:p-10 lg:p-14 sm:w-1/2 flex flex-col bg-app-card">
                  <div className="mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{detailItem.category}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-main leading-tight pr-8 mb-4">{detailItem.name}</h2>
                  
                  {detailItem.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                        AI Tags:
                      </span>
                      {detailItem.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-app-bg text-text-muted border border-border-soft rounded-lg text-[10px] font-bold tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-text-muted text-xs sm:text-sm lg:text-base leading-relaxed mb-8 sm:mb-10 font-medium">
                    {detailItem.description || "An exquisite piece from our premium collection, perfect for making a statement at your next special event."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 mt-auto">
                    <div className="bg-[#faf6f6] p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-border-soft">
                       <p className="text-[9px] sm:text-[10px] uppercase font-black text-text-muted tracking-widest mb-1">Rental Rate</p>
                       <p className="text-xl sm:text-2xl font-black text-text-main">₱{detailItem.baseRate}</p>
                    </div>
                    <div className="bg-[#faf6f6] p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-border-soft">
                       <p className="text-[9px] sm:text-[10px] uppercase font-black text-text-muted tracking-widest mb-1">Downpayment</p>
                       <p className="text-xl sm:text-2xl font-black text-text-main">₱{detailItem.deposit}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons styled with Theme Colors */}
                  {globalRole === 'staff' ? (
                    <button 
                      disabled={!isItemAvailable}
                      onClick={() => navigate(`/staff-new-rental?itemId=${detailItem.id}`)}
                      className={`w-full py-4 sm:py-5 rounded-[20px] sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                        isItemAvailable 
                          ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20 active:scale-95' 
                          : 'bg-app-bg text-text-muted opacity-70 border border-border-soft cursor-not-allowed'
                      }`}
                    >
                      {isItemAvailable ? 'Proceed to Rental' : 'Currently Rented'}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {/* Option to restore availability if currently unavailable */}
                      {!isItemAvailable && (
                        <button 
                          onClick={() => { alert('Status updated to Available'); setDetailItem(null); }}
                          className="w-full bg-success text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-success/90 active:scale-95 transition-all shadow-lg shadow-success/20 mb-1"
                        >
                          Mark as Available
                        </button>
                      )}
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { alert('Marked for Laundry'); setDetailItem(null); }}
                          className="flex-1 bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark active:scale-95 transition-all shadow-md"
                        >
                          Laundry
                        </button>
                        <button 
                          onClick={() => { alert('Marked for Repair'); setDetailItem(null); }}
                          className="flex-1 bg-primary/80 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary active:scale-95 transition-all shadow-md"
                        >
                          Repair
                        </button>
                      </div>

                      <div className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center border-2 mt-2 ${
                        isItemAvailable 
                          ? 'border-success/20 bg-success/10 text-success' 
                          : 'border-border-soft bg-[#faf6f6] text-text-muted'
                      }`}>
                        Current Status: {detailItem.status}
                      </div>
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

function SummaryChip({ label, value, color = "text-text-main" }) {
  return (
    <div className="flex-1 md:flex-none md:min-w-[120px] bg-app-card rounded-2xl p-3 md:p-4 text-center shadow-sm border border-border-soft">
      <div className={`text-xl md:text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}