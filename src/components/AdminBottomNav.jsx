// src/components/AdminBottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white h-20 rounded-t-3xl flex justify-around items-center px-2 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 border-t border-gray-100">
      
      {/* Home */}
      <button onClick={() => navigate('/admin-dashboard')} className={`flex flex-col items-center gap-1 w-12 text-[10px] font-bold transition-colors ${path === '/admin-dashboard' ? 'text-primary' : 'text-gray-400'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 stroke-[2.5px] transition-transform ${path === '/admin-dashboard' ? '-translate-y-1' : ''}`}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Home
      </button>

      {/* Catalog */}
      <button onClick={() => navigate('/catalog')} className={`flex flex-col items-center gap-1 w-12 text-[10px] font-bold transition-colors ${path === '/catalog' ? 'text-primary' : 'text-gray-400'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 stroke-[2.5px] transition-transform ${path === '/catalog' ? '-translate-y-1' : ''}`}>
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </svg>
        Catalog
      </button>

      {/* History */}
      <button onClick={() => navigate('/admin-history')} className={`flex flex-col items-center gap-1 w-12 text-[10px] font-bold transition-colors ${path === '/admin-history' ? 'text-primary' : 'text-gray-400'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 stroke-[2.5px] transition-transform ${path === '/admin-history' ? '-translate-y-1' : ''}`}>
          <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        History
      </button>

      {/* Reports */}
      <button onClick={() => navigate('/admin-reports')} className={`flex flex-col items-center gap-1 w-12 text-[10px] font-bold transition-colors ${path === '/admin-reports' ? 'text-primary' : 'text-gray-400'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 stroke-[2.5px] transition-transform ${path === '/admin-reports' ? '-translate-y-1' : ''}`}>
          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        Reports
      </button>

      {/* Settings / Profile */}
      <button onClick={() => navigate('/admin-settings')} className={`flex flex-col items-center gap-1 w-12 text-[10px] font-bold transition-colors ${path === '/admin-settings' ? 'text-primary' : 'text-gray-400'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 stroke-[2.5px] transition-transform ${path === '/admin-settings' ? '-translate-y-1' : ''}`}>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Settings
      </button>
    </div>
  );
}