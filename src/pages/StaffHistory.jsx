// src/pages/StaffHistory.jsx
import { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { TRANSACTIONS, CATALOG_ITEMS } from '../data/mockData';

export default function StaffHistory() {
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  
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
  const [returningTx, setReturningTx] = useState(null);
  const [returnNotes, setReturnNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (location.state?.newTransaction) {
      window.history.replaceState({}, document.title); 
    }
  }, [location.state]);

  const filteredTx = (filter === 'all' ? transactions : transactions.filter(t => t.status === filter))
    .map(tx => {
      if (tx.type === 'wedding') {
        return { 
          ...tx, 
          item: { 
            name: 'Wedding Package', 
            imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80' 
          } 
        };
      }
      const item = CATALOG_ITEMS.find(i => i.id === tx.itemId);
      return { ...tx, item };
    });

  const getItemName = (id) => CATALOG_ITEMS.find(i => i.id === id)?.name || id;
  const getItemImage = (id) => CATALOG_ITEMS.find(i => i.id === id)?.imageUrl || 'https://via.placeholder.com/150?text=No+Image';

  const sendPing = (name) => alert(`SMS reminder drafted for ${name}.`);
  
  // --- INLINE PAYMENT HANDLER ---
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

  // --- RETURNS HANDLER ---
  const openReturnModal = (tx) => {
    setReturningTx(tx);
    setReturnNotes('');
    setImagePreview(null);
  };

  const openSubItemReturnModal = (tx, subItemIndex, subItem) => {
    setReturningTx({ 
      ...tx, 
      subItemIndex, 
      item: { name: `${subItem.role} (${getItemName(subItem.itemId)})` } 
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

  // --- DETAILS/EDIT HANDLER ---
  const openDetailsModal = (tx) => {
    setDetailsTx(JSON.parse(JSON.stringify(tx)));
  };

  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...detailsTx.items];
    updatedItems[index][field] = value;
    setDetailsTx({ ...detailsTx, items: updatedItems });
  };

  const addParticipant = () => {
    setDetailsTx({
      ...detailsTx,
      items: [...(detailsTx.items || []), { role: '', name: '', itemId: '', returned: false, isPaid: false }]
    });
  };

  const removeParticipant = (index) => {
    const updatedItems = detailsTx.items.filter((_, i) => i !== index);
    setDetailsTx({ ...detailsTx, items: updatedItems });
  };

  const saveDetails = () => {
    setTransactions(prev => prev.map(tx => 
      tx.txId === detailsTx.txId ? detailsTx : tx
    ));
    setDetailsTx(null);
  };

  // --- THEME UTILS ---
  const getStatusBadge = (status) => {
    if (status === 'active') return 'bg-gray-100 text-[#111010]';
    if (status === 'overdue') return 'bg-[#bf4a53]/10 text-[#bf4a53]';
    return 'bg-gray-50 text-gray-400';
  };

  const getStatusDot = (status) => {
    if (status === 'active') return 'bg-[#111010]';
    if (status === 'overdue') return 'bg-[#bf4a53]';
    return 'bg-gray-300';
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6]">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-16 pb-28 md:pb-12 md:max-w-350 md:mx-auto md:w-full scrollbar-hide">
        
        <div className="mb-8 md:mb-12 animate-slide-up">
          <h1 className="text-[32px] md:text-5xl font-black text-[#111010] tracking-tight">Rental History</h1>
          <p className="text-sm md:text-base font-medium text-[#8e8e93] mt-2">Monitor and manage standard and bulk wedding transactions</p>
        </div>

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

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase text-gray-400 tracking-widest">Item / Package</th>
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
                  <Fragment key={tx.txId}>
                    <tr className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={tx.item?.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                            {tx.type === 'wedding' && (
                              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm text-sm">💍</div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 block">{tx.item?.name}</span>
                            {tx.type === 'wedding' ? (
                              <span className="text-[10px] font-black text-[#bf4a53] uppercase tracking-widest">Bulk Order</span>
                            ) : (
                              <span className={`text-[10px] font-black uppercase tracking-widest ${tx.isPaid ? 'text-[#111010]' : 'text-gray-400'}`}>
                                {tx.isPaid ? 'Fully Paid' : 'Unpaid'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-gray-700">{tx.customerName}</td>
                      <td className="px-8 py-5 font-medium text-gray-500">{tx.dueDate}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {tx.type === 'wedding' && (
                            <button onClick={() => setExpandedTx(expandedTx === tx.txId ? null : tx.txId)} className="p-2 text-gray-400 hover:text-[#111010] transition-colors rounded-xl hover:bg-gray-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest mr-2">
                              {expandedTx === tx.txId ? 'Hide' : 'View'} Items
                              <svg className={`w-4 h-4 transition-transform ${expandedTx === tx.txId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                          )}
                          
                          <button onClick={() => openDetailsModal(tx)} className="p-2 text-gray-400 hover:text-[#111010] hover:bg-gray-100 transition-colors rounded-xl" title="Transaction Details / Edit">
                            <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          
                          {tx.status !== 'completed' && (
                            <>
                              <button onClick={() => sendPing(tx.customerName)} className="p-2 text-gray-400 hover:text-[#111010] hover:bg-gray-100 rounded-xl transition-colors" title="Send SMS Reminder">
                                <svg className="w-5 h-5 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                              </button>

                              {!tx.isPaid && tx.type !== 'wedding' && (
                                <button onClick={() => handleMarkPaid(tx)} className="p-2 text-gray-400 hover:text-[#111010] hover:bg-gray-100 rounded-xl transition-colors font-black flex items-center justify-center" title="Mark Paid">
                                  ₱
                                </button>
                              )}

                              <button onClick={() => openReturnModal(tx)} className="p-2 text-gray-400 hover:text-[#111010] hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1" title="Mark as Returned">
                                <svg className="w-5 h-5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {tx.type === 'wedding' && <span className="text-[10px] font-black uppercase tracking-tighter px-1">All</span>}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {tx.type === 'wedding' && expandedTx === tx.txId && (
                      <tr className="bg-gray-50/50">
                        <td colSpan="5" className="px-8 py-6">
                          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entourage Checklist</p>
                              {tx.status !== 'completed' && (
                                <button 
                                  onClick={() => openDetailsModal(tx)}
                                  className="text-[10px] font-black bg-white border border-gray-200 text-[#111010] hover:border-[#111010] px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  Edit List
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {tx.items?.map((subItem, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                  <div>
                                    <p className="font-bold text-sm text-[#111010]">{subItem.role} {subItem.name ? `(${subItem.name})` : ''}</p>
                                    <p className="text-[10px] font-bold text-gray-500">{getItemName(subItem.itemId) || 'No Item Assigned'}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    {subItem.isPaid ? (
                                      <span className="text-[10px] font-black bg-gray-100 text-[#111010] px-3 py-1.5 rounded-lg uppercase tracking-widest">Paid</span>
                                    ) : (
                                      <button onClick={() => handleMarkPaid(tx, idx)} className="text-[10px] font-black bg-white border border-gray-200 text-[#111010] hover:border-[#111010] px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm">
                                        Mark Paid
                                      </button>
                                    )}

                                    {subItem.returned ? (
                                      <span className="text-[10px] font-black bg-gray-100 text-[#8e8e93] px-3 py-1.5 rounded-lg uppercase tracking-widest">Returned</span>
                                    ) : (
                                      <button onClick={() => openSubItemReturnModal(tx, idx, subItem)} className="text-[10px] font-black bg-white border border-gray-200 text-[#111010] hover:border-[#111010] px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm">
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
            <div className="text-center py-20 bg-white rounded-4xl border border-gray-50 text-gray-400 font-bold">
               No transactions found
            </div>
          ) : (
            filteredTx.map((tx, i) => (
              <div 
                key={tx.txId} 
                className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={tx.item?.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt="" />
                    <div className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusDot(tx.status)}`} />
                    {tx.type === 'wedding' && (
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm text-[10px] leading-none flex items-center justify-center">💍</div>
                    )}
                  </div>
                  
                  <div className="grow min-w-0">
                    <div className="flex justify-between items-start">
                       <div className="text-base font-black text-[#111010] truncate pr-2">{tx.customerName}</div>
                       {tx.type !== 'wedding' && (
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${tx.isPaid ? 'bg-gray-100 text-[#111010]' : 'bg-gray-50 text-gray-400'}`}>
                           {tx.isPaid ? 'Paid' : 'Unpaid'}
                         </span>
                       )}
                    </div>
                    
                    <div className="text-[11px] text-[#8e8e93] font-bold truncate mb-1 mt-0.5">
                      {tx.item?.name} {tx.type === 'wedding' ? `(${tx.items?.length} items)` : ''}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wide ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <button onClick={() => openDetailsModal(tx)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 active:text-[#111010] transition-colors">
                          <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>

                        {/* Add SMS Reminder Icon to Mobile */}
                        {tx.status !== 'completed' && (
                          <button onClick={() => sendPing(tx.customerName)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 active:text-[#111010] transition-colors" title="Send SMS Reminder">
                            <svg className="w-4 h-4 stroke-[2.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          </button>
                        )}

                        {!tx.isPaid && tx.status !== 'completed' && tx.type !== 'wedding' && (
                          <button onClick={() => handleMarkPaid(tx)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 active:text-[#111010] transition-colors font-black text-sm" title="Mark Paid">
                             ₱
                          </button>
                        )}
                        
                        {tx.type === 'wedding' && (
                          <button onClick={() => setExpandedTx(expandedTx === tx.txId ? null : tx.txId)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 active:text-[#111010] transition-colors">
                            <svg className={`w-4 h-4 transition-transform ${expandedTx === tx.txId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        )}

                        {tx.status !== 'completed' && (
                          <button onClick={() => openReturnModal(tx)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-200 active:text-[#111010] transition-colors">
                            <svg className="w-4 h-4 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Accordion */}
                {tx.type === 'wedding' && expandedTx === tx.txId && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/30">
                     <div className="flex justify-between items-center mb-3">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entourage Items</p>
                       {tx.status !== 'completed' && (
                          <button 
                            onClick={() => openDetailsModal(tx)}
                            className="text-[9px] font-black bg-white border border-gray-200 text-[#111010] px-2 py-1 rounded-md uppercase flex items-center gap-1 shadow-sm"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                          </button>
                       )}
                     </div>
                     <div className="space-y-2">
                       {tx.items?.map((subItem, idx) => (
                         <div key={idx} className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm gap-2">
                            <div className="truncate">
                              <p className="font-bold text-xs text-[#111010] truncate">{subItem.role} {subItem.name ? `(${subItem.name})` : ''}</p>
                              <p className="text-[9px] font-bold text-gray-500 truncate">{getItemName(subItem.itemId) || 'No item'}</p>
                            </div>
                            
                            <div className="flex gap-2 justify-end mt-1">
                               {subItem.isPaid ? (
                                 <span className="text-[9px] font-black bg-gray-100 text-[#111010] px-2 py-1 rounded-md uppercase">Paid</span>
                               ) : (
                                 <button onClick={() => handleMarkPaid(tx, idx)} className="text-[9px] font-black border border-gray-200 text-[#111010] hover:border-[#111010] px-2 py-1 rounded-md uppercase">
                                   Mark Paid
                                 </button>
                               )}

                               {subItem.returned ? (
                                 <span className="text-[9px] font-black bg-gray-100 text-[#8e8e93] px-2 py-1 rounded-md uppercase shrink-0">Returned</span>
                               ) : (
                                 <button onClick={() => openSubItemReturnModal(tx, idx, subItem)} className="text-[9px] font-black border border-gray-200 text-[#111010] hover:border-[#111010] px-2 py-1 rounded-md uppercase shrink-0">
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

      {/* COMPREHENSIVE TRANSACTION DETAILS & EDIT MODAL */}
      {detailsTx && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-md transition-all"
          onClick={() => setDetailsTx(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-t-4xl sm:rounded-[40px] shadow-2xl animate-slide-up sm:animate-scale-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (No X button) */}
            <div className="p-6 border-b border-gray-100 shrink-0">
               <h2 className="text-xl font-black text-[#111010]">Transaction Details</h2>
               <div className="flex gap-2 items-center mt-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${getStatusBadge(detailsTx.status)}`}>
                    {detailsTx.status}
                  </span>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    ID: {detailsTx.txId}
                  </p>
               </div>
            </div>

            {/* Form Body - Scrollable */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-5 bg-gray-50/50 grow scrollbar-hide">
              
              {/* Core Information Block */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Customer Name</label>
                     <input 
                       type="text" 
                       value={detailsTx.customerName} 
                       onChange={(e) => setDetailsTx({...detailsTx, customerName: e.target.value})}
                       className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none"
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Due Date</label>
                     <input 
                       type="date" 
                       value={detailsTx.dueDate} 
                       onChange={(e) => setDetailsTx({...detailsTx, dueDate: e.target.value})}
                       className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Status</label>
                     <select 
                       value={detailsTx.status} 
                       onChange={(e) => setDetailsTx({...detailsTx, status: e.target.value})}
                       className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none appearance-none"
                     >
                       <option value="active">Active</option>
                       <option value="overdue">Overdue</option>
                       <option value="completed">Completed</option>
                     </select>
                   </div>
                   
                   {/* Overall Payment Status for standard */}
                   {detailsTx.type !== 'wedding' && (
                     <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Payment Status</label>
                       <select 
                         value={detailsTx.isPaid ? 'paid' : 'unpaid'} 
                         onChange={(e) => setDetailsTx({...detailsTx, isPaid: e.target.value === 'paid'})}
                         className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none appearance-none"
                       >
                         <option value="unpaid">Unpaid</option>
                         <option value="paid">Fully Paid</option>
                       </select>
                     </div>
                   )}
                 </div>

                 {/* General Remarks / Notes */}
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Remarks / Notes
                    </label>
                    <textarea 
                      value={detailsTx.notes}
                      onChange={(e) => setDetailsTx({...detailsTx, notes: e.target.value})}
                      placeholder="Add transaction notes here..."
                      className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#111010] outline-none min-h-20"
                    />
                 </div>
              </div>

              {/* Item Assignment Block */}
              {detailsTx.type === 'wedding' ? (
                // WEDDING ENTOURAGE LIST
                <>
                  <div className="flex justify-between items-end mb-2 mt-4 px-1">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Entourage List</h3>
                  </div>
                  
                  {detailsTx.items?.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm relative">
                      
                      {/* Sub-Item Form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Role</label>
                            <input 
                              type="text" 
                              value={item.role} 
                              onChange={(e) => handleEditItemChange(idx, 'role', e.target.value)}
                              placeholder="e.g. Groomsman"
                              disabled={item.returned}
                              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Name</label>
                            <input 
                              type="text" 
                              value={item.name} 
                              onChange={(e) => handleEditItemChange(idx, 'name', e.target.value)}
                              placeholder="e.g. John Doe"
                              disabled={item.returned}
                              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Assigned Item</label>
                          <div className="flex gap-3 items-center">
                            <img src={getItemImage(item.itemId)} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-gray-100 shrink-0" alt="Catalog preview"/>
                            <select 
                              value={item.itemId || ''} 
                              onChange={(e) => handleEditItemChange(idx, 'itemId', e.target.value)}
                              disabled={item.returned}
                              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none appearance-none disabled:opacity-50"
                            >
                              <option value="">-- Select Catalog Item --</option>
                              {CATALOG_ITEMS.map(ci => (
                                <option key={ci.id} value={ci.id}>{ci.name} ({ci.id})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {/* Sub Item Payment and Removal */}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                           <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={item.isPaid || false} 
                                onChange={(e) => handleEditItemChange(idx, 'isPaid', e.target.checked)}
                                className="w-4 h-4 rounded text-[#111010] bg-gray-100 border-gray-300 focus:ring-[#111010]"
                              />
                              <span className="text-xs font-bold text-gray-700">Participant Paid</span>
                           </label>
                           
                           {!item.returned && (
                             <button 
                               onClick={() => removeParticipant(idx)} 
                               className="text-[10px] font-black text-gray-400 hover:text-[#bf4a53] uppercase tracking-widest transition-colors"
                             >
                               Remove
                             </button>
                           )}
                        </div>

                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addParticipant}
                    className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-black text-xs uppercase tracking-widest rounded-3xl hover:border-[#111010] hover:text-[#111010] transition-all flex justify-center items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add Participant
                  </button>
                </>
              ) : (
                // STANDARD SINGLE ITEM ASSIGNMENT
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Assigned Item (Catalog)</label>
                   <div className="flex gap-4 items-center">
                      <img src={getItemImage(detailsTx.itemId)} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-100 shrink-0" alt="Catalog preview"/>
                      <div className="relative grow">
                        <select 
                          value={detailsTx.itemId || ''} 
                          onChange={(e) => setDetailsTx({...detailsTx, itemId: e.target.value})}
                          className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#111010] outline-none appearance-none"
                        >
                          <option value="">-- Select Catalog Item --</option>
                          {CATALOG_ITEMS.map(ci => (
                            <option key={ci.id} value={ci.id}>{ci.name} - ₱{ci.baseRate}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* View Proof of Return if completed */}
              {detailsTx.status === 'completed' && detailsTx.returnPhotoUrl && (
                  <div className="pt-4 animate-slide-up">
                    <div className="flex items-center gap-2 mb-3 text-[#111010]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h4 className="font-black text-[10px] sm:text-xs uppercase tracking-widest">Return Proof</h4>
                    </div>
                    <div className="rounded-[24px] overflow-hidden shadow-sm">
                      <img 
                        src={detailsTx.returnPhotoUrl} 
                        className="w-full h-32 object-cover grayscale-20" 
                        alt="Proof of return" 
                      />
                    </div>
                  </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button onClick={() => setDetailsTx(null)} className="flex-1 py-3.5 sm:py-4 text-sm text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors">Discard</button>
              <button onClick={saveDetails} className="flex-2 py-3.5 sm:py-4 text-sm bg-[#111010] text-white rounded-2xl font-black shadow-lg shadow-black/10 active:scale-95 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN CAPTURE MODAL */}
      {returningTx && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-md transition-all"
          onClick={() => setReturningTx(null)}
        >
          <form 
            onSubmit={submitReturn} 
            className="bg-white w-full max-w-md rounded-t-4xl sm:rounded-[40px] overflow-hidden shadow-2xl animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-hide pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-[#111010] mb-1">
                {returningTx.type === 'wedding' && returningTx.subItemIndex === undefined ? 'Return All Items' : 'Return Item'}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">
                Capture proof for <span className="text-black font-bold">{returningTx.item?.name}</span>
              </p>
              
              <div className="space-y-4">
                <div className="relative h-40 sm:h-48 bg-gray-50 rounded-3xl sm:rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Proof" />
                      <button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-2 bg-[#bf4a53] text-white rounded-full shadow-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 text-gray-400 group-hover:text-[#111010] transition-colors">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">Tap to Take Photo</p>
                    </>
                  )}
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition Notes</label>
                  <textarea 
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. Returned in perfect condition..."
                    className="w-full mt-1 p-3.5 sm:p-4 bg-gray-50 border-none rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#111010] outline-none min-h-20 sm:min-h-25"
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button type="button" onClick={() => setReturningTx(null)} className="flex-1 py-3.5 sm:py-4 text-xs sm:text-sm text-gray-500 font-bold hover:bg-gray-50 rounded-[20px] sm:rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="flex-2 py-3.5 sm:py-4 text-xs sm:text-sm bg-[#111010] text-white rounded-[20px] sm:rounded-2xl font-black shadow-lg shadow-black/10 active:scale-95 transition-all">Confirm Return</button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}