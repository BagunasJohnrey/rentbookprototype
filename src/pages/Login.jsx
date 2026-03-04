import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setGlobalRole }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (!username) {
      alert('Please enter a username'); // We will replace this with your custom Toast later
      return;
    }
    setGlobalRole(role);
    navigate(role === 'admin' ? '/admin-dashboard' : '/staff-dashboard');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary-light via-primary to-app-bg">
      <div className="pt-16 pb-10 px-8 text-white animate-fade-in-down">
        <h1 className="text-[32px] font-extrabold mb-2 tracking-tight">RentBook</h1>
        <p className="text-[15px] opacity-90 leading-snug">Digital Rental Management with Smart Analytics</p>
      </div>

      <div className="bg-app-bg flex-grow rounded-t-[40px] px-7 pt-11 pb-10 flex flex-col gap-5 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] animate-slide-up">
        
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-text-main ml-1">Username</label>
          <div className="relative flex items-center">
            <svg className="absolute left-4 w-5 h-5 text-primary stroke-[2.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-5 pr-5 pl-12 border-none rounded-[20px] text-base font-medium text-text-main bg-app-card shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none focus:shadow-[0_8px_16px_rgba(191,74,83,0.1)] focus:-translate-y-[2px] transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-text-main ml-1">Password</label>
          <div className="relative flex items-center">
            <svg className="absolute left-4 w-5 h-5 text-primary stroke-[2.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full py-5 pr-5 pl-12 border-none rounded-[20px] text-base font-medium text-text-main bg-app-card shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none focus:shadow-[0_8px_16px_rgba(191,74,83,0.1)] focus:-translate-y-[2px] transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleLogin}
          className="bg-primary text-white rounded-[24px] p-5 text-lg font-bold shadow-[0_8px_16px_rgba(191,74,83,0.25)] mt-2 active:scale-95 transition-transform"
        >
          Login
        </button>

        <div className="mt-auto text-center bg-[#fdf0f1] p-4 rounded-[20px]">
          <p className="text-xs font-bold text-primary mb-2 uppercase tracking-[0.5px]">Prototype Role Selection</p>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#f9d8da] bg-white font-semibold text-text-main outline-none text-sm"
          >
            <option value="admin">Admin (Owner / Manager)</option>
            <option value="staff">Staff (Front Desk)</option>
          </select>
        </div>
      </div>
    </div>
  );
}