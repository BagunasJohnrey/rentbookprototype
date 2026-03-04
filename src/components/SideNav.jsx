// src/components/SideNav.jsx
import { Link, useLocation } from 'react-router-dom';

export default function Sidenav({ role, setRole }) {
  const location = useLocation();

  // Helper to determine active link styles for the sidebar
  const isActive = (path) => 
    location.pathname === path 
      ? 'bg-blue-50 text-primary border-r-4 border-primary' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-primary';

  return (
    // ADDED `shrink-0` HERE to prevent the charts from squishing the sidebar
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen bg-white sticky top-0 border-r border-gray-100 shadow-sm z-50">
      
      {/* Brand & Role Section */}
      <div className="p-6 border-b border-gray-50">
        <div className="font-bold text-2xl flex flex-col gap-2 text-primary">
          <div className="flex items-center gap-2">
            📘 <span className="tracking-tight">RentBook</span>
          </div>
          {role && (
            <span className="w-fit text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded-md uppercase tracking-widest font-bold">
              {role}
            </span>
          )}
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-grow py-6 flex flex-col gap-1">
        {role === 'admin' ? (
          <>
            <Link to="/admin-dashboard" className={`flex items-center px-6 py-3 transition-all ${isActive('/admin-dashboard')}`}>Dashboard</Link>
            <Link to="/catalog" className={`flex items-center px-6 py-3 transition-all ${isActive('/catalog')}`}>Catalog</Link>
            <Link to="/admin-add-item" className={`flex items-center px-6 py-3 transition-all ${isActive('/admin-add-item')}`}>Add Item</Link>
            <Link to="/admin-history" className={`flex items-center px-6 py-3 transition-all ${isActive('/admin-history')}`}>History</Link>
            <Link to="/admin-reports" className={`flex items-center px-6 py-3 transition-all ${isActive('/admin-reports')}`}>Reports</Link>
          </>
        ) : role === 'staff' ? (
          <>
            <Link to="/staff-dashboard" className={`flex items-center px-6 py-3 transition-all ${isActive('/staff-dashboard')}`}>Dashboard</Link>
            <Link to="/catalog" className={`flex items-center px-6 py-3 transition-all ${isActive('/catalog')}`}>Catalog</Link>
            <Link to="/staff-new-rental" className={`flex items-center px-6 py-3 transition-all ${isActive('/staff-new-rental')}`}>New Rental</Link>
            <Link to="/staff-history" className={`flex items-center px-6 py-3 transition-all ${isActive('/staff-history')}`}>History</Link>
          </>
        ) : null}
      </nav>

      {/* Logout / Bottom Controls */}
      <div className="p-6 border-t border-gray-50">
        {role && (
          <button 
            onClick={() => setRole(null)} 
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}