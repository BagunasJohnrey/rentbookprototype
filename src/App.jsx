import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import StaffDashboard from './pages/StaffDashboard';
import StaffNewRental from './pages/StaffNewRental';
import InventoryCatalog from './pages/InventoryCatalog';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddItem from './pages/AdminAddItem';
import AdminHistory from './pages/AdminHistory'; 
import AdminReports from './pages/AdminReports'; 
import Receipt from './pages/Receipt';

export default function App() {
  const [globalRole, setGlobalRole] = useState(null);

  return (
    <BrowserRouter>
      <div className="w-full max-w-107.5 h-full max-h-233 bg-linear-to-b from-app-bg to-white relative flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden mx-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setGlobalRole={setGlobalRole} />} />
          
          {/* FIX: Pass globalRole as a prop so it is actively used by the app */}
          <Route path="/staff-dashboard" element={<StaffDashboard role={globalRole} />} />
          <Route path="/catalog" element={<InventoryCatalog />} />
          <Route path="/staff-new-rental" element={<StaffNewRental />} />
          <Route path="/receipt" element={<Receipt />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboard role={globalRole} />} />
          <Route path="/admin-add-item" element={<AdminAddItem />} />
          <Route path="/admin-history" element={<AdminHistory />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}