// src/pages/Receipt.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const txData = location.state?.txData;

  const handleSendSMS = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!txData) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-gray-500 mb-4">No transaction data found.</p>
          <button onClick={() => navigate('/')} className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-app-bg">
      {/* Toast Notification (Shared) */}
      <div className={`fixed left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl z-1000 transition-all duration-500 ${showToast ? 'top-10' : '-top-20'}`}>
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span className="font-bold text-sm text-text-main">SMS Confirmation Sent!</span>
      </div>

      {/* --- MOBILE UI --- */}
      <div className="flex md:hidden flex-col h-screen overflow-hidden">
        <div className="pt-12 px-6 pb-4 flex justify-between items-center shrink-0">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <h1 className="text-[17px] font-bold">Digital Receipt</h1>
          <div className="w-10"></div>
        </div>

        <div className="grow overflow-y-auto px-6 pt-4 pb-48">
          <TicketCard txData={txData} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 bg-white rounded-t-[36px] shadow-[0_-8px_24px_rgba(0,0,0,0.07)] flex flex-col gap-3">
          <button onClick={handleSendSMS} className="w-full bg-primary text-white py-4.5 rounded-[22px] font-extrabold text-[16px] flex items-center justify-center gap-3 active:scale-[0.96] transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Send SMS
          </button>
          <button onClick={() => window.print()} className="w-full bg-text-main text-white py-4.5 rounded-[22px] font-extrabold text-[16px] flex items-center justify-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print
          </button>
        </div>
      </div>

      {/* --- DESKTOP UI --- */}
      <div className="hidden md:flex h-screen w-full bg-white overflow-hidden">
        {/* Left Branding Panel */}
        <div className="w-[40%] bg-linear-to-br from-primary-light to-primary p-16 flex flex-col justify-between text-white relative">
          <div className="z-10">
            <h1 className="text-6xl font-black tracking-tighter mb-4">RentBook</h1>
            <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest border border-white/30">
              Transaction Confirmed
            </div>
          </div>
          
          <div className="z-10 space-y-10">
            <div>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-3">Customer Information</p>
              <p className="text-4xl font-bold leading-tight">{txData.customer}</p>
              <p className="text-white/80 font-medium mt-1">Ref: {txData.id}</p>
            </div>
            
            <div className="flex gap-20">
              <div>
                <p className="text-white/60 font-bold text-xs uppercase mb-1">Issue Date</p>
                <p className="text-xl font-bold">{txData.date}</p>
              </div>
              <div>
                <p className="text-white/60 font-bold text-xs uppercase mb-1">Status</p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                  Active
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="text-[300px] font-black absolute -right-20 -bottom-20 rotate-12">RB</div>
          </div>
        </div>

        {/* Right Invoice Panel */}
        <div className="w-[60%] flex flex-col bg-app-bg p-16 lg:p-24 overflow-y-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Summary Details</h2>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-primary transition-colors p-2 font-bold text-sm uppercase tracking-widest">
              Close Dashboard
            </button>
          </div>

          <div className="space-y-8 max-w-2xl">
            <div className="bg-white p-8 rounded-4xl shadow-sm flex items-center gap-8 border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden">
                 <div className="w-full h-full bg-gray-100 flex items-center justify-center font-black text-gray-300 text-xs">IMG</div>
              </div>
              <div className="grow">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Rented Item</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{txData.item}</p>
                <p className="text-gray-400 font-medium mt-1">Service Provisioning • Daily Rate Applied</p>
              </div>
              <div className="text-2xl font-black text-gray-900">₱{txData.baseRate}</div>
            </div>

            <div className="bg-white rounded-4xl p-8 shadow-sm border border-gray-100 divide-y divide-gray-50">
              <div className="pb-6 space-y-4">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-400">Security Deposit (Refundable)</span>
                  <span className="text-gray-900">₱{txData.deposit}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-400">Platform Handling Fee</span>
                  <span className="text-gray-900">₱0.00</span>
                </div>
              </div>
              
              <div className="pt-8 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount Paid</p>
                  <p className="text-5xl font-black text-primary">₱{txData.baseRate + txData.deposit}</p>
                </div>
                <div className="opacity-40">
                   <div className="w-32 h-12 bg-[url('https://www.scandit.com/wp-content/themes/scandit/assets/img/barcode-hero.png')] bg-contain bg-no-repeat"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleSendSMS} className="flex-1 bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                Send SMS Receipt
              </button>
              <button onClick={() => window.print()} className="flex-1 bg-white text-gray-900 py-5 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 4H8v-4h8v4z"/></svg>
                Print Invoice (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ txData }) {
  return (
    <div className="relative bg-white rounded-4xl p-7 shadow-lg">
      <div className="absolute -left-3.75 top-[53%] -translate-y-1/2 w-7.5 h-7.5 bg-app-bg rounded-full z-10"></div>
      <div className="absolute -right-3.75 top-[53%] -translate-y-1/2 w-7.5 h-7.5 bg-app-bg rounded-full z-10"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-[24px] font-extrabold text-primary">RentBook</h2>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[1.5px]">Rental Record</p>
      </div>

      <div className="space-y-4 mb-6">
        <Drow label="TX ID" value={txData.id} />
        <Drow label="Customer" value={txData.customer} />
        <Drow label="Return" value={txData.returnDate} color="var(--primary)" />
      </div>

      <div className="border-t-2 border-dashed border-gray-100 my-6"></div>

      <div className="flex items-center gap-4 bg-app-bg p-3 rounded-[18px] mb-4">
        <div className="grow">
          <p className="text-[15px] font-extrabold text-text-main">{txData.item}</p>
          <p className="text-[12px] text-gray-400 font-semibold">Rate: ₱{txData.baseRate}</p>
        </div>
      </div>

      <Drow label="Deposit" value={`₱${txData.deposit}`} />
      
      <div className="flex justify-between items-center mt-6">
        <span className="text-[17px] font-bold text-text-main">Total Paid</span>
        <span className="text-[30px] font-black text-primary">₱{txData.baseRate + txData.deposit}</span>
      </div>

      <div className="mt-8 flex justify-center opacity-60">
        <div className="w-full h-12 bg-[url('https://www.scandit.com/wp-content/themes/scandit/assets/img/barcode-hero.png')] bg-contain bg-center bg-no-repeat"></div>
      </div>
    </div>
  );
}

function Drow({ label, value, color }) {
  return (
    <div className="flex justify-between items-center text-[14px]">
      <span className="text-gray-400 font-bold">{label}</span>
      <span className="font-extrabold" style={{ color: color || '#111010' }}>{value}</span>
    </div>
  );
}