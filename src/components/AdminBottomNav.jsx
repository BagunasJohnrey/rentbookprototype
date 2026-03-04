import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-app-card h-[85px] rounded-t-[32px] flex justify-between items-center px-6 pb-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-10">
      
      {/* Home */}
      <button onClick={() => navigate('/admin-dashboard')} className={`flex flex-col items-center gap-1 w-12 text-[11px] font-bold transition-colors ${path === '/admin-dashboard' ? 'text-primary' : 'text-text-muted'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-6 h-6 stroke-[2.5px] transition-transform ${path === '/admin-dashboard' ? '-translate-y-0.5' : ''}`}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Home
      </button>

      {/* Catalog */}
      <button onClick={() => navigate('/catalog')} className={`flex flex-col items-center gap-1 w-12 text-[11px] font-bold transition-colors ${path === '/catalog' ? 'text-primary' : 'text-text-muted'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-6 h-6 stroke-[2.5px] transition-transform ${path === '/catalog' ? '-translate-y-0.5' : ''}`}>
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </svg>
        Catalog
      </button>

      {/* FAB - Add Item */}
      <div className="relative -top-6">
        <button 
          onClick={() => navigate('/admin-add-item')}
          className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-full flex justify-center items-center text-white shadow-[0_8px_24px_rgba(191,74,83,0.4)] active:scale-90 transition-transform cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 stroke-[3.5px]"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      {/* History */}
      <button onClick={() => navigate('/admin-history')} className={`flex flex-col items-center gap-1 w-12 text-[11px] font-bold transition-colors ${path === '/admin-history' ? 'text-primary' : 'text-text-muted'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-6 h-6 stroke-[2.5px] transition-transform ${path === '/admin-history' ? '-translate-y-0.5' : ''}`}>
          <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        History
      </button>

      {/* Reports */}
      <button onClick={() => navigate('/admin-reports')} className={`flex flex-col items-center gap-1 w-12 text-[11px] font-bold transition-colors ${path === '/admin-reports' ? 'text-primary' : 'text-text-muted'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-6 h-6 stroke-[2.5px] transition-transform ${path === '/admin-reports' ? '-translate-y-0.5' : ''}`}>
          <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        Reports
      </button>

    </div>
  );
}