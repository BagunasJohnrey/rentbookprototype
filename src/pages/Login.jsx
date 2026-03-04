// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setGlobalRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.includes('admin')) {
      setGlobalRole('admin');
      navigate('/admin-dashboard');
    } else {
      setGlobalRole('staff');
      navigate('/staff-dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:justify-center md:items-center bg-white md:bg-gray-100 p-6">
      <div className="w-full md:max-w-md bg-white md:shadow-2xl md:rounded-4xl p-8 md:p-12 animate-slide-up">
        <div className="flex flex-col items-center mb-10">
          <div className="text-5xl mb-4">📘</div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">RentBook</h1>
          <p className="text-sm font-semibold text-text-muted mt-2 text-center">Enter credentials to access the rental system</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mt-2 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="admin@rentbook.com"
            />
          </div>

          <div>
            <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 mt-2 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}