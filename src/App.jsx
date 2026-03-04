// src/App.jsx
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
      {/* Refactored Wrapper: 
        Removed fixed w-107.5 and max-h-233.
        Added min-h-screen and responsive background colors.
      */}
      <div className="w-full min-h-screen bg-app-bg md:bg-gray-100 flex flex-col relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login setGlobalRole={setGlobalRole} />} />
          
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