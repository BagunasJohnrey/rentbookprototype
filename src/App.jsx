// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
  const [isOffline, setIsOffline] = useState(false);

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-app-bg md:bg-gray-100 flex flex-col relative overflow-x-hidden">
        {/* Persistent Navbar appears after login */}
        {globalRole && (
          <Navbar 
            role={globalRole} 
            setRole={setGlobalRole} 
            isOffline={isOffline} 
            setIsOffline={setIsOffline} 
          />
        )}
        
        <main className="grow flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login setGlobalRole={setGlobalRole} />} />
            
            {/* Protected Staff Routes */}
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/catalog" element={<InventoryCatalog />} />
            <Route path="/staff-new-rental" element={<StaffNewRental />} />
            <Route path="/receipt" element={<Receipt />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-add-item" element={<AdminAddItem />} />
            <Route path="/admin-history" element={<AdminHistory />} />
            <Route path="/admin-reports" element={<AdminReports />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}