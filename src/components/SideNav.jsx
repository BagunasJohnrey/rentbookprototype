// src/components/SideNav.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidenav({ role, setRole }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to determine active link styles for the sidebar
  const isActive = (path) => 
    location.pathname === path 
      ? 'bg-red-50/50 text-primary border-r-2 border-primary shadow-sm' 
      : 'text-text-muted hover:bg-red-50/30 hover:text-primary hover:border-r hover:border-primary/30';

  // Safe logout handler matching mobile behavior
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      if (setRole) setRole(null);
      navigate('/login');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen bg-app-card sticky top-0 self-start border-r border-border-soft shadow-sm/50 backdrop-blur-sm z-50">
      
      {/* Brand & Role Section */}
      <div className="p-6 border-b border-border-soft shrink-0">
        <div className="font-bold text-2xl flex flex-col gap-3 text-primary tracking-tight">
          <div className="flex items-center gap-3 h-12">
            <span>RenTech</span>
          </div>
          {role && (
            <span className="w-fit text-xs bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-semibold border border-primary/20">
              {role}
            </span>
          )}
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-grow py-6 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2">Main</div>
        </div>
        
        {role === 'admin' ? (
          <>
            <Link to="/admin-dashboard" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/admin-dashboard')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
            <Link to="/catalog" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/catalog')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Catalog
            </Link>
            <Link to="/admin-history" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/admin-history')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </Link>
            <Link to="/admin-reports" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/admin-reports')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Reports
            </Link>
            <Link to="/admin-settings" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/admin-settings')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </>
        ) : role === 'staff' ? (
          <>
            <Link to="/staff-dashboard" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/staff-dashboard')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
            <Link to="/catalog" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/catalog')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Catalog
            </Link>
            <Link to="/staff-new-rental" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/staff-new-rental')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Rental
            </Link>
            <Link to="/staff-history" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/staff-history')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </Link>
            <Link to="/staff-settings" className={`flex items-center px-6 py-3 transition-all duration-200 ${isActive('/staff-settings')}`}>
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </>
        ) : null}
      </nav>

      {/* Logout / Bottom Controls */}
      <div className="p-6 border-t border-border-soft shrink-0">
        {role && (
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-3 py-3 text-sm font-semibold text-text-muted hover:text-primary-dark hover:bg-red-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-primary/20 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}