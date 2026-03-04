import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ITEMS } from '../data/mockData';

export default function StaffNewRental() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // FIX: Using a lazy initializer function () => ({}) to satisfy React purity rules
  const [customer, setCustomer] = useState(() => ({
    name: '', contact: '', address: '', 
    rentalDate: new Date().toISOString().split('T')[0], 
    returnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  }));

const handleNext = () => {
    if (step === 1 && !selectedItem) return alert('Please select an item first');
    if (step === 2 && (!customer.name || !customer.contact)) return alert('Name and contact are required');
    if (step === 3) {
      // FIX: Navigate to receipt and pass the data!
      navigate('/receipt', { 
        state: { 
          txData: {
            id: `TXN-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString(),
            customer: customer.name,
            item: selectedItem.name,
            baseRate: selectedItem.baseRate,
            deposit: selectedItem.deposit
          }
        } 
      }); 
      return;
    }
    setStep(prev => prev + 1);
  };

  const simulateIDScan = () => {
    alert('Scanning ID via AI OCR...');
    setTimeout(() => {
      setCustomer({ ...customer, name: 'Liza Soberano', contact: '0917-123-4567', address: '123 Balete Drive, QC' });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-app-bg relative">
      {/* Top Nav */}
      <div className="p-5 flex justify-between items-center z-10">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-text-main active:-translate-x-1 transition-transform">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[3px]"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="text-[17px] font-bold text-text-main">New Rental</div>
        <div className="w-6"></div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center px-6 pb-5">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 flex flex-col items-center gap-1.5 relative">
            {/* FIX: h-[2px] -> h-0.5 */}
            {num < 3 && <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${step > num ? 'bg-success' : step === num ? 'bg-linear-to-r from-primary to-[#e5e5ea]' : 'bg-[#e5e5ea]'}`}></div>}
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[13px] font-bold transition-all z-10 ${step > num ? 'bg-success border-success text-white' : step === num ? 'bg-primary border-primary text-white' : 'bg-app-card border-[#e5e5ea] text-text-muted'}`}>
              {step > num ? '✓' : num}
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-[0.3px] ${step > num ? 'text-success' : step === num ? 'text-primary' : 'text-text-muted'}`}>
              {num === 1 ? 'Item' : num === 2 ? 'Customer' : 'Confirm'}
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      {/* FIX: flex-grow -> grow */}
      <div className="grow overflow-y-auto px-6 pb-32 animate-slide-up">
        
        {/* STEP 1: Select Item */}
        {step === 1 && (
          <div>
            <h2 className="text-[22px] font-extrabold text-text-main mb-1">Select Item</h2>
            <p className="text-sm text-text-muted font-medium mb-6">Choose from available catalog items</p>
            {CATALOG_ITEMS.map(item => (
              <div 
                key={item.id} onClick={() => setSelectedItem(item)}
                className={`bg-app-card rounded-[20px] p-4 flex items-center gap-3.5 mb-3 cursor-pointer transition-all border-2 ${selectedItem?.id === item.id ? 'border-primary shadow-[0_4px_16px_rgba(191,74,83,0.15)]' : 'border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
              >
                {/* FIX: w-[62px] h-[62px] -> w-15.5 h-15.5 */}
                <img src={item.imageUrl} alt={item.name} className="w-15.5 h-15.5 rounded-xl object-cover" />
                
                {/* FIX: flex-grow -> grow */}
                <div className="grow">
                  <div className="text-[15px] font-bold text-text-main mb-1">{item.name}</div>
                  <div className="text-[13px] font-medium text-text-muted">₱{item.baseRate} • Dep: ₱{item.deposit}</div>
                </div>
                
                {/* FIX: w-[26px] h-[26px] flex-shrink-0 -> w-6.5 h-6.5 shrink-0 */}
                <div className={`w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${selectedItem?.id === item.id ? 'bg-primary border-primary' : 'border-[#e5e5ea]'}`}>
                  {selectedItem?.id === item.id && <svg viewBox="0 0 24 24" fill="none" stroke="white" className="w-3.5 h-3.5 stroke-[3px]"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: Customer Info */}
        {step === 2 && (
          <div className="animate-fade-in-down">
            <h2 className="text-[22px] font-extrabold text-text-main mb-1">Customer Info</h2>
            <p className="text-sm text-text-muted font-medium mb-6">Enter details or scan government ID</p>
            
            {/* FIX: p-[18px] -> p-4.5 */}
            <button onClick={simulateIDScan} className="w-full bg-linear-to-br from-primary to-primary-light text-white rounded-[18px] p-4.5 text-[15px] font-bold flex items-center justify-center gap-2.5 mb-5 shadow-[0_6px_16px_rgba(191,74,83,0.25)] active:scale-95 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              Scan Government ID (AI OCR)
            </button>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Full Name</label>
                <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none focus:shadow-[0_4px_12px_rgba(191,74,83,0.1)]" placeholder="e.g. Liza Soberano" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Contact Number</label>
                <input type="tel" value={customer.contact} onChange={e => setCustomer({...customer, contact: e.target.value})} className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none focus:shadow-[0_4px_12px_rgba(191,74,83,0.1)]" placeholder="e.g. 0917-123-4567" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Rental Date</label>
                  <input type="date" value={customer.rentalDate} onChange={e => setCustomer({...customer, rentalDate: e.target.value})} className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none" />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Return Date</label>
                  <input type="date" value={customer.returnDate} onChange={e => setCustomer({...customer, returnDate: e.target.value})} className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm Summary */}
        {step === 3 && selectedItem && (
          <div className="animate-fade-in-down">
            <h2 className="text-[22px] font-extrabold text-text-main mb-1">Confirm Rental</h2>
            <p className="text-sm text-text-muted font-medium mb-6">Review details before processing</p>
            
            {/* FIX: rounded-[24px] -> rounded-3xl */}
            <div className="bg-app-card rounded-3xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
              <img src={selectedItem.imageUrl} alt="Item" className="w-20 h-20 rounded-2xl object-cover mb-4" />
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0]"><span className="text-sm font-semibold text-text-muted">Item</span><span className="text-sm font-bold text-text-main text-right">{selectedItem.name}</span></div>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0]"><span className="text-sm font-semibold text-text-muted">Customer</span><span className="text-sm font-bold text-text-main text-right">{customer.name}</span></div>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0]"><span className="text-sm font-semibold text-text-muted">Duration</span><span className="text-sm font-bold text-text-main text-right">3 Days</span></div>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0]"><span className="text-sm font-semibold text-text-muted">Base Rate</span><span className="text-sm font-bold text-text-main text-right">₱{selectedItem.baseRate}</span></div>
              <div className="flex justify-between py-2.5 border-b border-[#f0f0f0]"><span className="text-sm font-semibold text-text-muted">Deposit</span><span className="text-sm font-bold text-text-main text-right">₱{selectedItem.deposit}</span></div>
              
              <div className="flex justify-between items-center pt-4 mt-2">
                <span className="text-lg font-bold text-text-main">Total Due</span>
                <span className="text-[28px] font-black text-primary">₱{selectedItem.baseRate + selectedItem.deposit}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating CTA */}
      {/* FIX: rounded-t-[32px] -> rounded-t-4xl */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-app-card rounded-t-4xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-20 flex flex-col gap-3">
        <button onClick={handleNext} className="w-full bg-primary text-white rounded-[22px] p-5 text-[17px] font-bold shadow-[0_6px_16px_rgba(191,74,83,0.25)] active:scale-95 transition-transform">
          {step === 1 ? 'Continue to Customer Info' : step === 2 ? 'Review Summary' : '✓ Confirm & Print Receipt'}
        </button>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="w-full text-[15px] font-semibold text-text-muted p-2 active:text-text-main">
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}