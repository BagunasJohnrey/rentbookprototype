// src/components/DesktopSidebar.jsx
import { useNavigate, useLocation } from 'react-router-dom';

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { name: 'Dashboard', path: '/staff-dashboard', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path> },
    { name: 'Inventory Catalog', path: '/catalog', icon: <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path> },
    { name: 'Transaction History', path: '/staff/history', icon: <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></> },
  ];

  return (
    <div className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-gray-100 p-8 sticky top-0 shrink-0">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-[#bf4a53] tracking-tighter">RentBook</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Staff Terminal</p>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
              path === item.path 
                ? 'bg-[#bf4a53] text-white shadow-lg shadow-[#bf4a53]/20' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              {item.icon}
            </svg>
            {item.name}
          </button>
        ))}
      </nav>

      {/* Bottom FAB for Desktop */}
      <button 
        onClick={() => navigate('/staff-new-rental')}
        className="mt-auto w-full bg-[#111010] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
          <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Rental
      </button>
    </div>
  );
}