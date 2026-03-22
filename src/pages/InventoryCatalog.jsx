// src/pages/InventoryCatalog.jsx
import { useState, useMemo, useRef } from 'react';
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
  
  // New State: Confirmation prompt for cancelling selection
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  // State for Maintenance Input Modal (Repair issue / Laundry status)
  const [maintenanceForm, setMaintenanceForm] = useState(null);

  // Long press refs
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  // AI Semantic Search Logic
  const filteredItems = useMemo(() => {
    let items = [...CATALOG_ITEMS];
    
    if (filter === 'available') {
      items = items.filter(i => i.status?.toLowerCase() === 'available');
    } else if (filter !== 'all' && filter !== 'maintenance') {
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

  const triggerMaintenanceForm = (type, items) => {
    setMaintenanceForm({ type, items });
    setDetailItem(null); 
  };

  const handleMaintenanceConfirm = (data) => {
    alert(`Success: ${maintenanceForm.items.length} item(s) moved to ${maintenanceForm.type}.\nDetails: ${data.value} | Priority: ${data.priority}`);
    
    setMaintenanceForm(null);
    setSelectedItems([]);
    setSelectionMode(false);
    setFilter('maintenance');
  };

  const isItemAvailable = detailItem?.status?.toLowerCase() === 'available';

  // --- Background Click Handler ---
  const handleBgClick = () => {
    if (selectionMode) {
      if (selectedItems.length > 0) {
        setShowCancelPrompt(true); // Trigger Pop-up if items are selected
      } else {
        setSelectionMode(false); // Cancel silently if nothing is selected
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      {/* The main scrollable wrapper detects background clicks.
        Internal elements use e.stopPropagation() so they don't trigger the cancel prompt.
      */}
      <div 
        className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full scrollbar-hide"
        onClick={handleBgClick}
      >
        
        {/* SHARED HEADER */}
        <div 
          className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-10 animate-slide-up"
          onClick={(e) => e.stopPropagation()} // Prevent BG click
        >
          {/* TOP ROW: Subtitle & Maintenance Toggle (Upper Right) */}
          <div className="flex justify-between items-start w-full">
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-2">
              {filter === 'maintenance' ? 'Service Tracking' : 'The Collection'}
            </p>
            {globalRole === 'admin' && (
              <button 
                onClick={() => {
                  setFilter(filter === 'maintenance' ? 'all' : 'maintenance');
                  setSelectionMode(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-app-card text-text-main border border-border-soft hover:border-primary/50 hover:text-primary shadow-sm shrink-0"
              >
                {filter === 'maintenance' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Catalog
                  </>
                ) : (
                  <>
                    Maintenance
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </>
                )}
              </button>
            )}
          </div>

          {/* MAIN TITLE & ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[32px] md:text-5xl font-black text-text-main tracking-tight leading-none">
                {filter === 'maintenance' ? 'Maintenance' : 'Lookbook'}
              </h1>
              <p className="text-sm md:text-base font-medium text-text-muted mt-3">
                {filter === 'maintenance' ? 'Restoration and cleaning cycle management.' : 'Browse our exclusive wardrobe of premium attire.'}
              </p>
            </div>
            
            <div className="flex flex-col md:items-end gap-4 shrink-0">
              <div className="flex gap-3 w-full">
                 <SummaryChip label="Total Assets" value={CATALOG_ITEMS.length} />
                 <SummaryChip label="Ready to Wear" value={availableCount} color="text-success" />
              </div>
              
              {globalRole === 'admin' && filter !== 'maintenance' && (
                <div className="flex gap-2 w-full md:w-auto">
                  {selectionMode ? (
                    <button 
                      onClick={() => {
                        if (selectedItems.length > 0) {
                          setShowCancelPrompt(true);
                        } else {
                          setSelectionMode(false);
                        }
                      }}
                      className="w-full md:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-red-50 text-red-500 border-2 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm"
                    >
                      Cancel Selection
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate('/admin-add-item')}
                      className="group w-full md:w-auto flex items-center justify-center gap-2 bg-text-main text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Item
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BULK ACTION BAR */}
        {selectionMode && selectedItems.length > 0 && (
          <div 
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] bg-app-card border-2 border-primary rounded-3xl p-4 shadow-2xl flex items-center justify-center gap-3 animate-slide-up w-auto px-8"
            onClick={(e) => e.stopPropagation()} // Prevent BG click
          >
            <button 
              onClick={() => triggerMaintenanceForm('laundry', selectedItems)}
              className="bg-primary text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Laundry
            </button>
            <button 
              onClick={() => triggerMaintenanceForm('repair', selectedItems)}
              className="bg-primary/80 text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-primary/10"
            >
              Repair
            </button>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div 
          className="flex flex-col md:flex-row gap-4 mb-10 animate-slide-up" 
          style={{ animationDelay: '0.05s' }}
          onClick={(e) => e.stopPropagation()} // Prevent BG click
        >
          <div className="relative w-full md:w-80 shrink-0">
            <input 
              type="text" 
              placeholder={filter === 'maintenance' ? "Search maintenance records..." : "Search catalog..."} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3.5 pr-4 pl-4 border border-border-soft rounded-2xl bg-app-bg shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-text-main placeholder:text-text-muted/50"
            />
          </div>

          {/* Hide categories when in maintenance mode */}
          {filter !== 'maintenance' && (
            <div className="w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex gap-2 w-max pr-4 md:pr-0">
                {categories.map(cat => {
                  const isActive = Array.isArray(cat.id) 
                    ? Array.isArray(filter) && cat.id.join(',') === filter.join(',')
                    : filter === cat.id;

                  return (
                    <button 
                      key={Array.isArray(cat.id) ? cat.id.join('-') : cat.id} 
                      onClick={() => {setFilter(cat.id); setSelectionMode(false);}}
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
          )}
        </div>

        {/* FASHION GRID OR MAINTENANCE CENTER */}
        {filter === 'maintenance' && globalRole === 'admin' ? (
          <div 
            className="flex flex-col gap-6 md:gap-10 pb-20 animate-slide-up"
            onClick={(e) => e.stopPropagation()} // Prevent BG click
          >
            <MaintenanceTable 
              title="Laundry" 
              count="3" 
              headers={['Outfit Asset', 'Status / Update', 'Priority', 'Action']}
              data={[
                { id: 'ITEM-1011', name: 'Ivory Lace Bridal Gown', status: 'In Wash', sub: '2 hours ago', priority: 'High' },
                { id: 'ITEM-1004', name: 'Midnight Blue Peak Tuxedo', status: 'Drying', sub: '5 hours ago', priority: 'Normal' },
                { id: 'ITEM-1021', name: 'Satin Bridesmaid Midi', status: 'Pressing', sub: '1 hour ago', priority: 'Urgent' },
              ]}
            />
            <MaintenanceTable 
              title="Repair" 
              count="2" 
              headers={['Outfit Asset', 'Status / Issue', 'Priority', 'Action']}
              data={[
                { id: 'ITEM-1007', name: 'Emerald Evening Gown', status: 'Loose Hemline', sub: 'Assigned: Nene', priority: 'Urgent' },
                { id: 'ITEM-1014', name: 'Modern Piña Barong', status: 'Fabric Snag', sub: 'Assigned: Internal', priority: 'High' },
              ]}
            />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-32 bg-app-card rounded-[40px] border border-border-soft shadow-sm animate-slide-up">
            <div className="w-20 h-20 bg-app-bg border border-border-soft rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted/50">
              <svg className="w-10 h-10 stroke-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-text-main mb-1">No items found</h3>
            <p className="text-text-muted font-medium">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-10 min-h-[50vh]">
            {filteredItems.map((item, i) => (
              <div 
                key={item.id} 
                onPointerDown={(e) => {
                  if (globalRole !== 'admin' || filter === 'maintenance') return;
                  // Handle left clicks or touch
                  if (e.pointerType === 'mouse' && e.button !== 0) return;
                  
                  isLongPressRef.current = false;
                  timerRef.current = setTimeout(() => {
                    isLongPressRef.current = true;
                    if (!selectionMode) {
                      setSelectionMode(true);
                      setSelectedItems([item.id]);
                      // Add tactile feedback for mobile devices
                      if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(50);
                      }
                    }
                  }, 600); // 600ms long press threshold
                }}
                onPointerUp={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
                onPointerLeave={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
                onPointerCancel={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
                onContextMenu={(e) => {
                  // Prevent the default mobile context menu from appearing during a long press
                  if (globalRole === 'admin') e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (timerRef.current) clearTimeout(timerRef.current);
                  
                  // Ignore click if it was just a long press
                  if (isLongPressRef.current) {
                    isLongPressRef.current = false;
                    return;
                  }
                  
                  selectionMode ? toggleSelection(item.id) : setDetailItem(item);
                }}
                className={`group cursor-pointer animate-slide-up flex flex-col relative ${selectionMode && selectedItems.includes(item.id) ? 'scale-95' : ''} transition-transform`}
                style={{ 
                  animationDelay: `${i * 0.05}s`, 
                  WebkitUserSelect: 'none', 
                  userSelect: 'none',
                  WebkitTouchCallout: 'none' // Prevent iOS popup
                }}
              >
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

      {/* --- CANCEL SELECTION POP-UP MODAL --- */}
      {showCancelPrompt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelPrompt(false)}></div>
          <div className="relative bg-app-card rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in border border-border-soft">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
              <svg className="w-8 h-8 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-text-main mb-2 tracking-tight">Cancel Selection?</h3>
            <p className="text-text-muted text-sm font-medium mb-8">
              You currently have <span className="font-bold text-text-main">{selectedItems.length} item(s)</span> selected. Are you sure you want to discard this selection?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelPrompt(false)} 
                className="flex-1 py-3.5 font-bold text-text-main bg-app-bg hover:bg-border-soft border border-border-soft rounded-2xl transition-colors text-sm"
              >
                Keep Selecting
              </button>
              <button 
                onClick={() => {
                  setShowCancelPrompt(false);
                  setSelectionMode(false);
                  setSelectedItems([]);
                }} 
                className="flex-1 py-3.5 font-black text-white bg-primary rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE ACTION MODAL */}
      {maintenanceForm && (
        <MaintenanceActionModal 
          form={maintenanceForm} 
          onClose={() => setMaintenanceForm(null)} 
          onConfirm={handleMaintenanceConfirm} 
        />
      )}

      {/* SHARED DETAIL MODAL */}
      {detailItem && (
        <DetailModal 
          detailItem={detailItem} 
          setDetailItem={setDetailItem} 
          globalRole={globalRole} 
          isItemAvailable={isItemAvailable} 
          navigate={navigate} 
          onMaintenanceTrigger={triggerMaintenanceForm}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MaintenanceActionModal({ form, onClose, onConfirm }) {
  const [value, setValue] = useState(form.type === 'laundry' ? 'In Wash' : '');
  const [priority, setPriority] = useState('Normal');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-app-card w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-scale-in">
        <h2 className="text-2xl font-black text-text-main mb-2 uppercase tracking-tight">
          Move to {form.type}
        </h2>
        <p className="text-sm text-text-muted font-medium mb-6">
          Updating cycle for {form.items.length} item(s).
        </p>

        <div className="flex flex-col gap-5 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
              {form.type === 'laundry' ? 'Laundry Status' : 'Issue Description'}
            </label>
            {form.type === 'laundry' ? (
              <select 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-4 rounded-2xl bg-app-bg border border-border-soft font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option>In Wash</option>
                <option>Drying</option>
                <option>Pressing</option>
                <option>Ready for Pickup</option>
              </select>
            ) : (
              <input 
                type="text" 
                autoFocus
                placeholder="e.g. Broken zipper, stain on hem..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-4 rounded-2xl bg-app-bg border border-border-soft font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Priority Level</label>
            <div className="flex gap-2">
              {['Normal', 'High', 'Urgent'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    priority === p ? 'bg-primary border-primary text-white' : 'bg-transparent border-border-soft text-text-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-text-muted">Cancel</button>
          <button 
            disabled={form.type === 'repair' && !value.trim()}
            onClick={() => onConfirm({ value, priority })}
            className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function MaintenanceTable({ title, count, headers, data }) {
  return (
    <div className="bg-app-card rounded-[24px] md:rounded-[32px] border border-border-soft shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 border-b border-border-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            {title === 'Repair' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M20.37 8.91l-8.17-8.17a2.12 2.12 0 1 0-3 3l8.17 8.17a2.12 2.12 0 1 0 3-3zM4 18h16M4 14h16"/></svg>
            )}
          </div>
          <h3 className="text-lg font-black text-text-main">{title} <span className="text-text-muted ml-1">({count})</span></h3>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 bg-app-bg/50 px-6 py-4 border-b border-border-soft">
        {headers.map(h => (
          <div key={h} className="text-[10px] font-black uppercase text-text-muted tracking-widest">{h}</div>
        ))}
      </div>

      <div className="flex flex-col">
        {data.map((row, i) => (
          <div key={i} className="flex flex-col md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 md:gap-4 md:items-center border-b last:border-0 border-border-soft hover:bg-app-bg/30 transition-colors p-5 md:px-6 md:py-5">
            
            <div className="flex justify-between items-start md:items-center">
              <div>
                <p className="font-black text-sm text-text-main">{row.name}</p>
                <p className="text-[10px] font-bold text-text-muted mt-0.5">{row.id}</p>
              </div>
              <div className="md:hidden">
                <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                  row.priority === 'Urgent' ? 'bg-primary text-white' : 
                  row.priority === 'High' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-app-bg text-text-muted border border-border-soft'
                }`}>
                  {row.priority}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center md:block bg-app-bg md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-border-soft md:border-0">
              <span className="text-[10px] font-black uppercase text-text-muted md:hidden">Status</span>
              <div className="text-right md:text-left">
                <p className="text-sm font-bold text-text-main">{row.status}</p>
                <p className="text-[10px] font-medium text-text-muted mt-0.5">{row.sub}</p>
              </div>
            </div>

            <div className="hidden md:block">
              <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                row.priority === 'Urgent' ? 'bg-primary text-white' : 
                row.priority === 'High' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-app-bg text-text-muted border border-border-soft'
              }`}>
                {row.priority}
              </span>
            </div>

            <div className="mt-1 md:mt-0">
              <button 
                onClick={() => alert(`${row.id} set to Available`)} 
                className="w-full md:w-auto bg-success text-white px-4 py-3 md:py-2.5 rounded-xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-success-dark transition-all shadow-sm shadow-success/20"
              >
                Set Available
              </button>
            </div>
          </div>
        ))}
      </div>
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

function DetailModal({ detailItem, setDetailItem, globalRole, isItemAvailable, navigate, onMaintenanceTrigger }) {
  return (
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
              
              <div className="flex flex-col gap-2 mt-auto">
                {globalRole === 'staff' ? (
                  <button 
                    disabled={!isItemAvailable}
                    onClick={() => navigate(`/staff-new-rental?itemId=${detailItem.id}`)}
                    className={`w-full py-4 sm:py-5 rounded-[20px] sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                      isItemAvailable ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/20' : 'bg-app-bg text-text-muted opacity-70 border cursor-not-allowed'
                    }`}
                  >
                    {isItemAvailable ? 'Proceed to Rental' : 'Currently Rented'}
                  </button>
                ) : (
                  <>
                    {!isItemAvailable && (
                      <button onClick={() => { alert('Status updated to Available'); setDetailItem(null); }} className="w-full bg-success text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-success/20 mb-1">
                        Mark as Available
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => onMaintenanceTrigger('laundry', [detailItem.id])} className="flex-1 bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark active:scale-95 transition-all shadow-md">
                        Laundry
                      </button>
                      <button onClick={() => onMaintenanceTrigger('repair', [detailItem.id])} className="flex-1 bg-primary/80 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary active:scale-95 transition-all shadow-md">
                        Repair
                      </button>
                    </div>
                  </>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}