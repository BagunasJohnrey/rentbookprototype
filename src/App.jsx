// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidenav from './components/Sidenav';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StaffDashboard from './pages/StaffDashboard';
import StaffNewRental from './pages/StaffNewRental';
import StaffHistory from './pages/StaffHistory';
import InventoryCatalog from './pages/InventoryCatalog';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddItem from './pages/AdminAddItem';
import AdminHistory from './pages/AdminHistory';
import AdminReports from './pages/AdminReports';
import Receipt from './pages/Receipt';

function AppContent({ globalRole, setGlobalRole }) {
  const location = useLocation();
  const path = location.pathname;

  // Helper to check if we are on a "Public" page
  const isPublicPage = path === '/' || path === '/login';
  
  // Logic to hide BottomNav on specific pages (like the New Rental form)
  const hideBottomNav = path === '/staff-new-rental' || path === '/receipt';

  return (
    <div className="w-full min-h-screen bg-gray-50 md:flex md:flex-row relative overflow-x-hidden">
      
      {/* Only show Sidenav if logged in AND not on a public page */}
      {globalRole && !isPublicPage && (
        <Sidenav 
          role={globalRole} 
          setRole={setGlobalRole} 
        />
      )}
      
      <main className="grow flex flex-col min-h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setGlobalRole={setGlobalRole} />} />
          
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/catalog" element={<InventoryCatalog />} />
          <Route path="/staff-new-rental" element={<StaffNewRental />} />
          <Route path="/staff-history" element={<StaffHistory />} />
          <Route path="/receipt" element={<Receipt />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-add-item" element={<AdminAddItem />} />
          <Route path="/admin-history" element={<AdminHistory />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Show BottomNav only if logged in, not public, and NOT on the hidden list */}
        {globalRole && !isPublicPage && !hideBottomNav && <BottomNav />}
      </main>
    </div>
  );
}

export default function App() {
  const [globalRole, setGlobalRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });
  
  useEffect(() => {
    if (globalRole) {
      localStorage.setItem('userRole', globalRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [globalRole]);

  return (
    <BrowserRouter>
      <AppContent globalRole={globalRole} setGlobalRole={setGlobalRole} />
    </BrowserRouter>
  );
}