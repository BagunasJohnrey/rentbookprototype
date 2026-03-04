// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ role, setRole, isOffline, setIsOffline }) {
  const location = useLocation();

  // Helper to determine active desktop link
  const isActive = (path) => location.pathname === path ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary';

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100 flex justify-between items-center px-4 md:px-8 py-3">
      
      {/* Brand & Role */}
      <div className="font-bold text-xl flex items-center gap-2 text-primary">
        📘 RentBook
        {role && (
          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded-md uppercase tracking-wide">
            {role}
          </span>
        )}
      </div>

      {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-6 font-medium text-sm">
        {role === 'admin' ? (
          <>
            <Link to="/admin-dashboard" className={isActive('/admin-dashboard')}>Dashboard</Link>
            <Link to="/catalog" className={isActive('/catalog')}>Catalog</Link>
            <Link to="/admin-add-item" className={isActive('/admin-add-item')}>Add Item</Link>
            <Link to="/admin-history" className={isActive('/admin-history')}>History</Link>
            <Link to="/admin-reports" className={isActive('/admin-reports')}>Reports</Link>
          </>
        ) : role === 'staff' ? (
          <>
            <Link to="/staff-dashboard" className={isActive('/staff-dashboard')}>Dashboard</Link>
            <Link to="/catalog" className={isActive('/catalog')}>Catalog</Link>
            <Link to="/staff-new-rental" className={isActive('/staff-new-rental')}>New Rental</Link>
          </>
        ) : null}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs md:text-sm cursor-pointer select-none text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <input 
            type="checkbox" 
            checked={isOffline} 
            onChange={(e) => setIsOffline(e.target.checked)} 
            className="accent-red-500 w-3.5 h-3.5"
          />
          {isOffline ? '⚠️ Offline' : '🟢 Online'}
        </label>
        
        {role && (
          <button 
            onClick={() => setRole(null)} 
            className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}