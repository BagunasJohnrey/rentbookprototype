// src/pages/StaffHistory.jsx
import { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function StaffHistory() {
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  
  const [transactions, setTransactions] = useState(() => {
    if (location.state?.newTransaction) {
      const newTx = location.state.newTransaction;
      const exists = TRANSACTIONS.some(t => t.txId === newTx.txId);
      if (!exists) {
        TRANSACTIONS.unshift(newTx);
      }
    }
    return TRANSACTIONS.map(tx => ({
      ...tx,
      isPaid: tx.isPaid || false,
      notes: tx.notes || '',
    }));
  });

  const [expandedTx, setExpandedTx] = useState(null); 
  const [detailsTx, setDetailsTx] = useState(null); 
  const [isEditingMode, setIsEditingMode] = useState(false); 
  const [returningTx, setReturningTx] = useState(null);
  const [returnNotes, setReturnNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // --- CALENDAR & DAY SELECTION STATES ---
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayBookings, setSelectedDayBookings] = useState(null);

  useEffect(() => {
    if (location.state?.newTransaction) {
      window.history.replaceState({}, document.title); 
    }
  }, [location.state]);

  // Updated filtering logic to include both status and customer search
  const filteredTx = transactions
    .filter(t => (filter === 'all' ? true : t.status === filter))
    .filter(t => t.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(tx => {
      if (tx.type === 'wedding') {
        return { 
          ...tx, 
          item: { name: 'Wedding Package', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80' } 
        };
      }
      if (tx.type === 'bulk') {
        return {
          ...tx,
          item: { name: `Bulk Rental (${tx.items?.length || 0} items)`, imageUrl: tx.items?.[0]?.imageUrl || 'https://via.placeholder.com/150?text=Bulk' }
        }
      }
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      return { ...tx, item };
    });

  const getItemName = (id) => CATALOG_ITEMS.find(i => i.id === id)?.name || id;
  const getItemImage = (id) => CATALOG_ITEMS.find(i => i.id === id)?.imageUrl || 'https://via.placeholder.com/150?text=No+Image';

  const sendPing = (name) => alert(`SMS reminder drafted for ${name}.`);

  // --- CONFLICT CHECKER LOGIC ---
  const checkRentalConflict = (itemId, requestedDate, currentTxId) => {
    return transactions.find(tx => 
      tx.itemId === itemId && 
      tx.txId !== currentTxId &&
      tx.status !== 'completed' && 
      tx.dueDate === requestedDate
    );
  };
  
  const handleMarkPaid = (tx, subItemIndex = undefined) => {
    setTransactions(prev => prev.map(t => {
      if (t.txId === tx.txId) {
        if (subItemIndex !== undefined) {
          const newItems = [...t.items];
          newItems[subItemIndex] = { ...newItems[subItemIndex], isPaid: true };
          return { ...t, items: newItems };
        } else {
          return { ...t, isPaid: true };
        }
      }
      return t;
    }));
  };

  const openReturnModal = (tx) => {
    setReturningTx(tx);
    setReturnNotes('');
    setImagePreview(null);
  };

  const openSubItemReturnModal = (tx, subItemIndex, subItem) => {
    setReturningTx({ 
      ...tx, 
      subItemIndex, 
      item: { name: `${subItem.role || subItem.name} (${getItemName(subItem.itemId)})` } 
    });
    setReturnNotes('');
    setImagePreview(null);
  };

  const submitReturn = (e) => {
    e.preventDefault();
    setTransactions(prev => prev.map(tx => {
      if (tx.txId === returningTx.txId) {
         if (returningTx.subItemIndex !== undefined) {
            const newItems = [...tx.items];
            newItems[returningTx.subItemIndex].returned = true;
            const allReturned = newItems.every(i => i.returned);
            return { ...tx, items: newItems, status: allReturned ? 'completed' : tx.status };
         } else {
            const updatedItems = tx.items ? tx.items.map(item => ({ ...item, returned: true })) : null;
            return { ...tx, status: 'completed', items: updatedItems, returnNotes, returnPhotoUrl: imagePreview };
         }
      }
      return tx;
    }));
    setReturningTx(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const openDetailsModal = (tx, startInEditMode = false) => {
    setDetailsTx(JSON.parse(JSON.stringify(tx)));
    setIsEditingMode(startInEditMode);
  };

  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...detailsTx.items];
    updatedItems[index][field] = value;
    setDetailsTx({ ...detailsTx, items: updatedItems });
  };

  const addParticipant = () => {
    setDetailsTx({
      ...detailsTx,
      items: [...(detailsTx.items || []), { role: 'Participant', name: '', itemId: '', size: '', returned: false, isPaid: false }]
    });
  };

  const removeParticipant = (index) => {
    const updatedItems = detailsTx.items.filter((_, i) => i !== index);
    setDetailsTx({ ...detailsTx, items: updatedItems });
  };

  const saveDetails = () => {
    if (detailsTx.itemId && detailsTx.dueDate) {
      const conflict = checkRentalConflict(detailsTx.itemId, detailsTx.dueDate, detailsTx.txId);
      if (conflict) {
        alert(`CONFLICT: Item ${detailsTx.itemId} is already booked for ${detailsTx.dueDate} by ${conflict.customerName}.`);
        return;
      }
    }
    setTransactions(prev => prev.map(tx => 
      tx.txId === detailsTx.txId ? detailsTx : tx
    ));
    setDetailsTx(null);
    setIsEditingMode(false);
  };

  // --- CALENDAR UTILS ---
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const getStatusBadge = (status) => {
    if (status === 'active') return 'bg-app-bg text-text-main border border-border-soft';
    if (status === 'overdue') return 'bg-primary/10 text-primary border border-primary/20';
    return 'bg-app-bg text-text-muted border border-border-soft opacity-70';
  };

  const getStatusDot = (status) => {
    if (status === 'active') return 'bg-text-main';
    if (status === 'overdue') return 'bg-primary';
    return 'bg-border-soft';
  };

  const isMultiItem = (tx) => tx.type === 'wedding' || tx.type === 'bulk';

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-7xl md:mx-auto md:w-full scrollbar-hide">
        
        <div className="flex justify-between items-start mb-8 md:mb-12 animate-slide-up">
          <div>
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Staff Terminal</p>
            <h1 className="text-[32px] md:text-5xl font-black text-text-main tracking-tight">Rental History</h1>
            <p className="text-sm md:text-base font-medium text-text-muted mt-2">Monitor and manage all customer transactions</p>
          </div>

          <button 
            onClick={() => setShowCalendar(true)}
            className="p-4 bg-app-card border border-border-soft rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* SEARCH BAR SECTION */}
        <div className="relative mb-6 group animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
            <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text"
            placeholder="Search customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-app-card border border-border-soft rounded-[24px] text-sm font-bold text-text-main placeholder:text-text-muted/50 focus:ring-4 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {['all', 'active', 'overdue', 'completed'].map(f => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all uppercase tracking-widest ${
                filter === f 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary' 
                  : 'bg-app-card text-text-muted border border-border-soft hover:border-primary/30 hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-app-card rounded-[32px] shadow-sm border border-border-soft overflow-x-auto animate-slide-up scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-app-bg border-b border-border-soft">
                <th className="px-8 py-6 text-[11px] font-black uppercase text-text-muted tracking-widest whitespace-nowrap">Item / Package</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-text-muted tracking-widest whitespace-nowrap">Customer</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-text-muted tracking-widest whitespace-nowrap">Due Date</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-text-muted tracking-widest whitespace-nowrap">Status</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-text-muted tracking-widest text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-text-muted font-bold">No transactions found.</td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <Fragment key={tx.txId}>
                    <tr className="hover:bg-app-bg transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={tx.item?.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-app-bg border border-border-soft" alt="" />
                            {tx.type === 'wedding' && (
                              <div className="absolute -bottom-2 -right-2 bg-app-card rounded-full p-1 shadow-sm text-sm border border-border-soft leading-none flex items-center justify-center">💍</div>
                            )}
                            {tx.type === 'bulk' && (
                              <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm text-[10px] font-black border border-app-card leading-none">{tx.items?.length}</div>
                            )}
                          </div>
                          <div>
                            <span className="font-black text-text-main block tracking-tight line-clamp-1">{tx.item?.name}</span>
                            {isMultiItem(tx) ? (
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{tx.type === 'wedding' ? 'Wedding' : 'Bulk'} Order</span>
                            ) : (
                              <span className={`text-[10px] font-black uppercase tracking-widest ${tx.isPaid ? 'text-text-main' : 'text-text-muted'}`}>
                                {tx.isPaid ? 'Fully Paid' : 'Unpaid'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-text-main tracking-tight">{tx.customerName}</td>
                      <td className="px-8 py-5 text-xs font-bold text-text-muted whitespace-nowrap">{tx.dueDate}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${tx.status === 'overdue' ? 'text-[9px]' : 'text-[10px]'} ${getStatusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {isMultiItem(tx) && (
                            <button onClick={() => setExpandedTx(expandedTx === tx.txId ? null : tx.txId)} className="p-2 text-text-muted hover:text-primary transition-colors rounded-xl hover:bg-primary/10 flex items-center gap-2 text-xs font-black uppercase tracking-widest mr-2">
                              {expandedTx === tx.txId ? 'Hide' : 'View'} Items
                              <svg className={`w-4 h-4 transition-transform ${expandedTx === tx.txId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                          )}
                          
                          <button onClick={() => openDetailsModal(tx, false)} className="p-2 text-text-muted hover:text-primary transition-colors rounded-xl hover:bg-primary/10" title="View Details">
                            <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          {tx.status !== 'completed' && (
                            <>
                              <button onClick={() => sendPing(tx.customerName)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-colors" title="Send SMS Reminder">
                                <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                              </button>

                              {!tx.isPaid && !isMultiItem(tx) && (
                                <button onClick={() => handleMarkPaid(tx)} className="p-2 text-text-muted hover:text-success hover:bg-success/10 rounded-xl transition-colors font-black flex items-center justify-center" title="Mark Paid">
                                  ₱
                                </button>
                              )}

                              <button onClick={() => openReturnModal(tx)} className="p-2 text-text-muted hover:text-success hover:bg-success/10 rounded-xl transition-colors flex items-center gap-1" title="Mark as Returned">
                                <svg className="w-5 h-5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {isMultiItem(tx) && <span className="text-[10px] font-black uppercase tracking-tighter px-1">All</span>}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {isMultiItem(tx) && expandedTx === tx.txId && (
                      <tr className="bg-app-bg border-t border-border-soft">
                        <td colSpan="5" className="px-8 py-6">
                          <div className="bg-app-card rounded-[24px] p-6 border border-border-soft shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Item Checklist</p>
                              {tx.status !== 'completed' && (
                                <button 
                                  onClick={() => openDetailsModal(tx, true)}
                                  className="text-[10px] font-black bg-app-bg border border-border-soft text-text-main hover:border-primary hover:text-primary px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  Edit List
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {tx.items?.map((subItem, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-border-soft bg-app-bg hover:border-primary/30 transition-colors group">
                                  <div>
                                    <p className="font-black text-sm text-text-main tracking-tight">{subItem.role || subItem.name} {subItem.name && subItem.role ? `(${subItem.name})` : ''}</p>
                                    <p className="text-[10px] font-bold text-text-muted mt-0.5">{getItemName(subItem.itemId) || 'No Item Assigned'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    {subItem.isPaid ? (
                                      <span className="text-[10px] font-black bg-app-card border border-border-soft text-text-main px-3 py-1.5 rounded-lg uppercase tracking-widest">Paid</span>
                                    ) : (
                                      <button onClick={() => handleMarkPaid(tx, idx)} className="text-[10px] font-black bg-app-card border border-border-soft text-text-main hover:border-success hover:text-success px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm">
                                        Mark Paid
                                      </button>
                                    )}

                                    {subItem.returned ? (
                                      <span className="text-[10px] font-black bg-app-card border border-border-soft text-text-muted px-3 py-1.5 rounded-lg uppercase tracking-widest opacity-70">Returned</span>
                                    ) : (
                                      <button onClick={() => openSubItemReturnModal(tx, idx, subItem)} className="text-[10px] font-black bg-app-card border border-border-soft text-text-main hover:border-success hover:text-success px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm">
                                        Receive
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {filteredTx.length === 0 ? (
            <div className="text-center py-20 bg-app-card rounded-[32px] border border-border-soft text-text-muted font-bold">
                No transactions found
            </div>
          ) : (
            filteredTx.map((tx, i) => (
              <div 
                key={tx.txId} 
                className="bg-app-card rounded-[28px] shadow-sm border border-border-soft overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={tx.item?.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-border-soft bg-app-bg" alt="" />
                    <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-app-card ${getStatusDot(tx.status)}`} />
                    {tx.type === 'wedding' && (
                      <div className="absolute -bottom-2 -right-2 bg-app-card border border-border-soft rounded-full p-1 shadow-sm text-[10px] leading-none flex items-center justify-center">💍</div>
                    )}
                    {tx.type === 'bulk' && (
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm text-[10px] font-black border border-app-card leading-none">{tx.items?.length}</div>
                    )}
                  </div>
                  
                  <div className="grow min-w-0">
                    <div className="flex justify-between items-start">
                       <div className="text-base font-black text-text-main tracking-tight truncate pr-2">{tx.customerName}</div>
                       {!isMultiItem(tx) && (
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${tx.isPaid ? 'bg-app-bg border-border-soft text-text-main' : 'bg-transparent border-transparent text-text-muted'}`}>
                           {tx.isPaid ? 'Paid' : 'Unpaid'}
                         </span>
                       )}
                    </div>
                    
                    <div className="text-[11px] text-text-muted font-bold truncate mb-1 mt-0.5">
                      Due: {tx.dueDate}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`font-black px-2 py-1 rounded-lg uppercase tracking-wide ${tx.status === 'overdue' ? 'text-[8px]' : 'text-[9px]'} ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <button onClick={() => openDetailsModal(tx, false)} className="w-8 h-8 flex items-center justify-center bg-app-bg rounded-xl text-text-muted hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                          <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {tx.status !== 'completed' && (
                          <button onClick={() => sendPing(tx.customerName)} className="w-8 h-8 flex items-center justify-center bg-app-bg rounded-xl text-text-muted hover:text-primary transition-colors border border-transparent hover:border-primary/20" title="Send SMS Reminder">
                            <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          </button>
                        )}

                        {!tx.isPaid && tx.status !== 'completed' && !isMultiItem(tx) && (
                          <button onClick={() => handleMarkPaid(tx)} className="w-8 h-8 flex items-center justify-center bg-app-bg rounded-xl text-text-muted hover:text-success transition-colors font-black text-sm border border-transparent hover:border-success/20">
                                ₱
                          </button>
                        )}
                        
                        {isMultiItem(tx) && (
                          <button onClick={() => setExpandedTx(expandedTx === tx.txId ? null : tx.txId)} className="w-8 h-8 flex items-center justify-center bg-app-bg rounded-xl text-text-muted hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                            <svg className={`w-4 h-4 transition-transform ${expandedTx === tx.txId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        )}

                        {tx.status !== 'completed' && (
                          <button onClick={() => openReturnModal(tx)} className="w-8 h-8 flex items-center justify-center bg-app-bg rounded-xl text-text-muted hover:text-success transition-colors border border-transparent hover:border-success/20">
                            <svg className="w-4 h-4 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isMultiItem(tx) && expandedTx === tx.txId && (
                  <div className="px-5 pb-5 pt-2 border-t border-border-soft bg-app-bg/50">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Item Checklist</p>
                        {tx.status !== 'completed' && (
                           <button 
                             onClick={() => openDetailsModal(tx, true)}
                             className="text-[9px] font-black bg-app-card border border-border-soft text-text-main px-2 py-1 rounded-md uppercase flex items-center gap-1 shadow-sm hover:border-primary hover:text-primary transition-colors"
                           >
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                             Edit
                           </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {tx.items?.map((subItem, idx) => (
                          <div key={idx} className="flex flex-col bg-app-card p-3 rounded-xl border border-border-soft shadow-sm gap-2">
                            <div className="truncate">
                              <p className="font-black text-xs text-text-main tracking-tight truncate">{subItem.role || subItem.name} {subItem.name && subItem.role ? `(${subItem.name})` : ''}</p>
                              <p className="text-[9px] font-bold text-text-muted mt-0.5 truncate">{getItemName(subItem.itemId) || 'No item'}</p>
                            </div>
                            
                            <div className="flex gap-2 justify-end mt-1">
                               {subItem.isPaid ? (
                                 <span className="text-[9px] font-black bg-app-bg border border-border-soft text-text-main px-2 py-1 rounded-md uppercase">Paid</span>
                               ) : (
                                 <button onClick={() => handleMarkPaid(tx, idx)} className="text-[9px] font-black border border-border-soft text-text-main hover:border-success hover:text-success px-2 py-1 rounded-md uppercase bg-app-card transition-colors">
                                   Mark Paid
                                 </button>
                               )}

                               {subItem.returned ? (
                                 <span className="text-[9px] font-black bg-app-bg border border-border-soft text-text-muted px-2 py-1 rounded-md uppercase shrink-0 opacity-70">Returned</span>
                               ) : (
                                 <button onClick={() => openSubItemReturnModal(tx, idx, subItem)} className="text-[9px] font-black border border-border-soft text-text-main hover:border-success hover:text-success px-2 py-1 rounded-md uppercase shrink-0 bg-app-card transition-colors">
                                   Receive
                                 </button>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CALENDAR MODAL */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setShowCalendar(false)}>
          <div className="bg-app-card w-full max-w-lg rounded-[40px] shadow-2xl animate-scale-in flex flex-col border border-border-soft overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-soft flex justify-between items-center bg-white">
              <button onClick={prevMonth} className="p-2 hover:bg-app-bg rounded-xl transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg></button>
              <h2 className="text-xl font-black text-text-main tracking-tight uppercase">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-app-bg rounded-xl transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg></button>
            </div>

            <div className="p-4 bg-app-bg">
              <div className="grid grid-cols-7 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-text-muted uppercase py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()))].map((_, i) => (
                  <div key={`empty-${i}`} className="h-12" />
                ))}
                {[...Array(daysInMonth(currentDate.getFullYear(), currentDate.getMonth()))].map((_, i) => {
                  const day = i + 1;
                  const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const bookingsOnDay = transactions.filter(t => t.dueDate === dateString);

                  return (
                    <div 
                      key={day} 
                      onClick={() => bookingsOnDay.length > 0 && setSelectedDayBookings({ date: dateString, items: bookingsOnDay })}
                      className={`h-14 rounded-xl border border-border-soft flex flex-col items-center justify-center transition-all relative group
                        ${bookingsOnDay.length > 0 ? 'bg-white shadow-sm cursor-pointer hover:border-primary active:scale-95' : 'bg-transparent opacity-40 cursor-default'}
                      `}
                    >
                      <span className={`text-[11px] font-black ${bookingsOnDay.length > 0 ? 'text-primary' : 'text-text-muted'}`}>{day}</span>
                      {bookingsOnDay.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {bookingsOnDay.slice(0, 3).map((_, idx) => (
                            <div key={idx} className="w-1 h-1 rounded-full bg-primary" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-border-soft flex gap-2">
              <button onClick={() => setShowCalendar(false)} className="w-full py-4 text-sm font-black text-text-muted hover:bg-app-bg rounded-2xl transition-all">Close Calendar</button>
            </div>
          </div>
        </div>
      )}

      {/* DAY BOOKINGS QUICK-VIEW MODAL */}
      {selectedDayBookings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDayBookings(null)}>
          <div className="bg-app-card w-full max-w-sm rounded-[32px] shadow-2xl animate-scale-in border border-border-soft overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-soft flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-text-main tracking-tight">Rents for this Day</h3>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{selectedDayBookings.date}</p>
              </div>
              <button onClick={() => setSelectedDayBookings(null)} className="p-2 text-text-muted hover:text-primary transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 bg-app-bg">
              {selectedDayBookings.items.map((tx) => {
                const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
                return (
                  <div key={tx.txId} className="flex items-center gap-3 p-3 bg-app-card border border-border-soft rounded-2xl shadow-sm">
                    <img src={item?.imageUrl || 'https://via.placeholder.com/150'} className="w-10 h-10 rounded-lg object-cover border border-border-soft" alt="" />
                    <div className="grow min-w-0">
                      <p className="text-xs font-black text-text-main truncate">{tx.customerName}</p>
                      <p className="text-[9px] font-bold text-text-muted truncate">{item?.name || 'Bulk/Wedding Package'}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedDayBookings(null);
                        openDetailsModal(tx);
                      }}
                      className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE TRANSACTION DETAILS & EDIT MODAL */}
      {detailsTx && (
        <div 
          className="fixed inset-0 z-500 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-md transition-all"
          onClick={() => { setDetailsTx(null); setIsEditingMode(false); }}
        >
          <div 
            className="bg-app-card w-full max-w-2xl rounded-t-[32px] sm:rounded-[40px] shadow-2xl animate-slide-up sm:animate-scale-in flex flex-col max-h-[90vh] border border-border-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border-soft shrink-0 flex justify-between items-center w-full">
                <div>
                  <h2 className="text-xl font-black text-text-main tracking-tight">Transaction Details</h2>
                  <div className="flex gap-2 items-center mt-1">
                     <span className={`px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${detailsTx.status === 'overdue' ? 'text-[8px]' : 'text-[10px]'} ${getStatusBadge(detailsTx.status)}`}>
                       {detailsTx.status}
                     </span>
                     <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                       ID: {detailsTx.txId}
                     </p>
                  </div>
                </div>
                {!isEditingMode && detailsTx.status !== 'completed' && (
                  <button 
                    onClick={() => setIsEditingMode(true)} 
                    className="flex items-center gap-1.5 px-4 py-2 bg-app-bg hover:bg-primary/10 text-text-muted hover:text-primary rounded-xl transition-colors font-bold text-xs border border-border-soft shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Edit
                  </button>
                )}
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-5 bg-app-bg grow scrollbar-hide">
              <div className="bg-app-card p-5 rounded-3xl border border-border-soft shadow-sm space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Customer Name</label>
                      <input type="text" value={detailsTx.customerName} onChange={(e) => setDetailsTx({...detailsTx, customerName: e.target.value})} disabled={!isEditingMode} className="w-full p-3.5 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-text-main transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Due Date</label>
                      <input type="date" value={detailsTx.dueDate} onChange={(e) => setDetailsTx({...detailsTx, dueDate: e.target.value})} disabled={!isEditingMode} className="w-full p-3.5 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-text-main transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Status</label>
                      <select value={detailsTx.status} onChange={(e) => setDetailsTx({...detailsTx, status: e.target.value})} disabled={!isEditingMode} className="w-full p-3.5 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-text-main appearance-none transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        <option value="active">Active</option><option value="overdue">Overdue</option><option value="completed">Completed</option>
                      </select>
                    </div>
                    {!isMultiItem(detailsTx) && (
                      <div>
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Payment Status</label>
                        <select value={detailsTx.isPaid ? 'paid' : 'unpaid'} onChange={(e) => setDetailsTx({...detailsTx, isPaid: e.target.value === 'paid'})} disabled={!isEditingMode} className="w-full p-3.5 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-text-main appearance-none transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                          <option value="unpaid">Unpaid</option><option value="paid">Fully Paid</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Remarks / Notes</label>
                     <textarea value={detailsTx.notes} onChange={(e) => setDetailsTx({...detailsTx, notes: e.target.value})} disabled={!isEditingMode} placeholder={isEditingMode ? "Add transaction notes here..." : "No notes attached."} className="w-full p-3.5 bg-app-bg border border-border-soft rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none min-h-20 text-text-main transition-all placeholder:text-text-muted/50 disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                  {detailsTx.rentalPhotoUrl && (
                    <div className="mt-4 pt-4 border-t border-border-soft">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Release Condition Photo</label>
                      <div className="w-full h-40 sm:h-48 rounded-2xl overflow-hidden border border-border-soft shadow-sm bg-app-bg"><img src={detailsTx.rentalPhotoUrl} className="w-full h-full object-cover" alt="Release Condition" /></div>
                    </div>
                  )}
              </div>

              {isMultiItem(detailsTx) ? (
                <>
                  <div className="flex justify-between items-end mb-2 mt-4 px-1"><h3 className="text-xs font-black text-text-muted uppercase tracking-widest">Item Roster</h3></div>
                  {detailsTx.items?.map((item, idx) => (
                    <div key={idx} className="bg-app-card p-4 sm:p-5 rounded-3xl border border-border-soft shadow-sm relative">
                      {isEditingMode && !item.returned && (
                        <button onClick={() => removeParticipant(idx)} className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors p-1 bg-app-bg rounded-lg border border-border-soft" title="Remove Item"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      )}
                      <div className="pr-10 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div><label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Role / Title</label><input type="text" value={item.role || ''} onChange={(e) => handleEditItemChange(idx, 'role', e.target.value)} placeholder="e.g. Groomsman" disabled={!isEditingMode || item.returned} className="w-full p-3 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-60 disabled:cursor-not-allowed text-text-main transition-all placeholder:text-text-muted/50" /></div>
                          <div><label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Assignee Name</label><input type="text" value={item.name} onChange={(e) => handleEditItemChange(idx, 'name', e.target.value)} placeholder="e.g. John Doe" disabled={!isEditingMode || item.returned} className="w-full p-3 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-60 disabled:cursor-not-allowed text-text-main transition-all placeholder:text-text-muted/50" /></div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1 block">Assigned Item</label>
                          <div className="flex gap-3 items-center"><img src={getItemImage(item.itemId)} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-app-bg border border-border-soft shrink-0" alt="Catalog preview"/><select value={item.itemId || ''} onChange={(e) => handleEditItemChange(idx, 'itemId', e.target.value)} disabled={!isEditingMode || item.returned} className="w-full p-3 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none disabled:opacity-60 disabled:cursor-not-allowed text-text-main transition-all"><option value="">-- Select Catalog Item --</option>{CATALOG_ITEMS.map(ci => (<option key={ci.id} value={ci.id}>{ci.name} ({ci.id})</option>))}</select></div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border-soft"><label className={`flex items-center gap-2 ${isEditingMode ? 'cursor-pointer' : 'cursor-not-allowed'}`}><input type="checkbox" checked={item.isPaid || false} onChange={(e) => handleEditItemChange(idx, 'isPaid', e.target.checked)} disabled={!isEditingMode} className="w-4 h-4 rounded text-primary bg-app-bg border-border-soft focus:ring-primary disabled:opacity-60"/><span className="text-xs font-bold text-text-main">Participant Paid</span></label>{item.returned && (<span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1 bg-app-bg px-2 py-1 rounded-md border border-border-soft"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Returned</span>)}</div>
                      </div>
                    </div>
                  ))}
                  {isEditingMode && (<button onClick={addParticipant} className="w-full py-4 border-2 border-dashed border-border-soft text-text-muted font-black text-xs uppercase tracking-widest rounded-3xl hover:border-primary hover:text-primary transition-all flex justify-center items-center gap-2 bg-app-card"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Add Participant / Item</button>)}
                </>
              ) : (
                <div className="bg-app-card p-5 rounded-3xl border border-border-soft shadow-sm">
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2 block">Assigned Item (Catalog)</label>
                   <div className="flex gap-4 items-center"><img src={getItemImage(detailsTx.itemId)} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-app-bg border border-border-soft shrink-0" alt="Catalog preview"/><div className="relative grow"><select value={detailsTx.itemId || ''} onChange={(e) => setDetailsTx({...detailsTx, itemId: e.target.value})} disabled={!isEditingMode} className="w-full p-3.5 bg-app-bg border border-border-soft rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none text-text-main transition-all disabled:opacity-60 disabled:cursor-not-allowed"><option value="">-- Select Catalog Item --</option>{CATALOG_ITEMS.map(ci => (<option key={ci.id} value={ci.id}>{ci.name} - ₱{ci.baseRate}</option>))}</select><div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg></div></div></div>
                </div>
              )}

              {detailsTx.status === 'completed' && detailsTx.returnPhotoUrl && (
                  <div className="pt-4 animate-slide-up"><div className="flex items-center gap-2 mb-3 text-text-main"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><h4 className="font-black text-[10px] sm:text-xs uppercase tracking-widest">Return Proof</h4></div><div className="rounded-[24px] overflow-hidden shadow-sm border border-border-soft"><img src={detailsTx.returnPhotoUrl} className="w-full h-32 object-cover grayscale-20" alt="Proof of return" /></div></div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-border-soft flex gap-3 shrink-0 bg-app-card rounded-b-[32px] sm:rounded-b-[40px]">
              <button onClick={() => { setDetailsTx(null); setIsEditingMode(false); }} className="flex-1 py-3.5 sm:py-4 text-sm text-text-muted font-bold hover:bg-app-bg border border-transparent hover:border-border-soft rounded-2xl transition-colors">{isEditingMode ? 'Cancel' : 'Close'}</button>
              {isEditingMode && (<button onClick={saveDetails} className="flex-[2] py-3.5 sm:py-4 text-sm bg-primary hover:bg-primary-dark text-white rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all animate-in fade-in">Save Changes</button>)}
            </div>
          </div>
        </div>
      )}

      {/* RETURN CAPTURE MODAL */}
      {returningTx && (
        <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-md transition-all" onClick={() => setReturningTx(null)}>
          <form onSubmit={submitReturn} className="bg-app-card w-full max-w-md rounded-t-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-hide pb-safe border border-border-soft" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8"><h2 className="text-xl sm:text-2xl font-black text-text-main mb-1 tracking-tight">{isMultiItem(returningTx) && returningTx.subItemIndex === undefined ? 'Return All Items' : 'Return Item'}</h2><p className="text-sm sm:text-base text-text-muted font-medium mb-6 tracking-tight">Capture proof for <span className="text-text-main font-bold">{returningTx.item?.name}</span></p><div className="space-y-4"><div className="relative h-40 sm:h-48 bg-app-bg rounded-[24px] sm:rounded-3xl border-2 border-dashed border-border-soft flex flex-col items-center justify-center overflow-hidden group hover:border-primary/30 transition-colors">{imagePreview ? (<><img src={imagePreview} className="w-full h-full object-cover" alt="Proof" /><button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button></>) : (<><input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 mb-3 stroke-[2px] text-text-muted group-hover:text-primary transition-colors"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><p className="text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-wider">Tap to Take Photo</p></>)}</div><div><label className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Condition Notes</label><textarea value={returnNotes} onChange={(e) => setReturnNotes(e.target.value)} placeholder="e.g. Returned in perfect condition..." className="w-full mt-1 p-3.5 sm:p-4 bg-app-bg border border-border-soft rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px] sm:min-h-[100px] text-text-main transition-all placeholder:text-text-muted/50" /></div></div><div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8"><button type="button" onClick={() => setReturningTx(null)} className="flex-1 py-3.5 sm:py-4 text-xs sm:text-sm text-text-muted font-bold hover:bg-app-bg border border-transparent hover:border-border-soft rounded-[20px] sm:rounded-2xl transition-colors">Cancel</button><button type="submit" className="flex-[2] py-3.5 sm:py-4 text-xs sm:text-sm bg-primary hover:bg-primary-dark text-white rounded-[20px] sm:rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">Confirm Return</button></div></div>
          </form>
        </div>
      )}

    </div>
  );
}