// src/pages/Receipt.jsx refactored
import { useLocation, useNavigate } from 'react-router-dom';

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const txData = location.state?.txData;

  if (!txData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-gray-500 mb-4">No transaction data found.</p>
        <button onClick={() => navigate('/')} className="text-primary font-bold">Return Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 md:py-12">
      <div className="grow overflow-y-auto px-6 md:px-8 pb-32 flex flex-col items-center">
        
        {/* Success Header */}
        <div className="flex flex-col items-center mt-8 mb-8 animate-slide-up">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 stroke-[3px]"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Rental Confirmed!</h1>
          <p className="text-sm text-gray-400 font-medium">Transaction {txData.id}</p>
        </div>

        {/* Receipt Card */}
        <div className="w-full md:max-w-md bg-white rounded-4xl shadow-xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Top Notch for Ticket look on Mobile */}
          <div className="bg-primary h-3 w-full"></div>
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                <p className="font-bold text-gray-800">{txData.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store</p>
                <p className="font-bold text-gray-800">RentBook Main</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <ReceiptDetail label="Customer" value={txData.customer} />
              <ReceiptDetail label="Item Rented" value={txData.item} />
              <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Rental Rate</span>
                  <span className="text-gray-800 font-bold">₱{txData.baseRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Security Deposit</span>
                  <span className="text-gray-800 font-bold">₱{txData.deposit}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center">
              <p className="text-xs font-bold text-gray-400 uppercase">Total Paid</p>
              <p className="text-3xl font-black text-primary">₱{txData.baseRate + txData.deposit}</p>
            </div>

            <div className="mt-8 flex flex-col items-center">
               <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 italic mb-2">
                  [QR Code]
               </div>
               <p className="text-[10px] font-bold text-gray-400 uppercase">Scan to verify return</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:max-w-md mt-8 flex flex-col gap-3">
          <button className="w-full bg-white text-gray-800 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 4H8v-4h8v4z"/></svg>
            Print Receipt
          </button>
          <button onClick={() => navigate('/')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptDetail({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800 leading-tight">{value}</p>
    </div>
  );
}