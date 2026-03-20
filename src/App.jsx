// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidenav from './components/SideNav';
import BottomNav from './components/BottomNav';
import AdminBottomNav from './components/AdminBottomNav';
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
import AdminSettings from './pages/AdminSettings';
import StaffSettings from './pages/StaffSettings';
import StaffWeddingOrder from './pages/StaffWeddingOrder';
import Receipt from './pages/Receipt';

function AppContent({ globalRole, setGlobalRole }) {
  const location = useLocation();
  const path = location.pathname;

  const isPublicPage = path === '/' || path === '/login';
  const hideBottomNav = path === '/receipt';

  return (
    // FIX 1: Lock parent to `h-screen` and `overflow-hidden` so the body NEVER scrolls
    <div className="w-full h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden relative">
      
      {globalRole && !isPublicPage && (
        <Sidenav 
          role={globalRole} 
          setRole={setGlobalRole} 
        />
      )}
      
      {/* FIX 2: Make the <main> element handle 100% of the scrolling (`overflow-y-auto`) */}
      <main className="grow flex flex-col h-screen overflow-y-auto relative custom-scrollbar">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setGlobalRole={setGlobalRole} />} />
          
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/catalog" element={<InventoryCatalog globalRole={globalRole} />} />
          <Route path="/staff-new-rental" element={<StaffNewRental />} />
          <Route path="/staff-history" element={<StaffHistory />} />
          <Route path="/staff-settings" element={<StaffSettings setGlobalRole={setGlobalRole} />} />
          <Route path="/staff-wedding-order" element={<StaffWeddingOrder />} />
          <Route path="/receipt" element={<Receipt />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-add-item" element={<AdminAddItem />} />
          <Route path="/admin-history" element={<AdminHistory />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          <Route path="/admin-settings" element={<AdminSettings setGlobalRole={setGlobalRole} />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {globalRole === 'staff' && !isPublicPage && !hideBottomNav && <BottomNav setGlobalRole={setGlobalRole} />}
        {globalRole === 'admin' && !isPublicPage && !hideBottomNav && <AdminBottomNav setGlobalRole={setGlobalRole} />}
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