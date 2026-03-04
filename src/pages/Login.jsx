// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setGlobalRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setShowToast(true);

    setTimeout(() => {
      setGlobalRole(selectedRole);
      
      if (selectedRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/staff-dashboard');
      }
    }, 1200);
  };

  return (
    // Outer Wrapper: Occupies 100% of the browser viewport
    <div className="min-h-screen w-full bg-white flex overflow-hidden">
      
      {/* Main Container: 
          - Mobile: flex-col (vertical)
          - Desktop: flex-row (horizontal) 
      */}
      <div className="flex flex-col md:flex-row w-full h-screen relative">
        
        {/* Toast Notification - Centered horizontally at the top */}
        <div className={`absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-lg z-[1000] transition-all duration-500 ${showToast ? 'top-8' : '-top-20'}`}>
          <div className="w-6 h-6 bg-[#ff6b76] rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="font-semibold text-sm text-[#111010]">Authenticating...</span>
        </div>

        {/* Branding Panel:
            - Mobile: Occupies the top 35% of the screen
            - Desktop: Occupies the left 40% of the screen
        */}
        <div className="w-full h-[35%] md:h-full md:w-[40%] bg-gradient-to-b from-[#ff6b76] to-[#bf4a53] p-8 md:p-16 flex flex-col justify-center text-white shrink-0">
          <div className="animate-fade-in-down">
            <h1 className="text-[40px] md:text-[64px] font-extrabold tracking-tighter mb-2 leading-none">RentBook</h1>
            <p className="text-[16px] md:text-[20px] opacity-90 leading-relaxed max-w-xs">
              Digital Rental Management with Smart Analytics
            </p>
          </div>
          {/* Decorative accent for desktop */}
          <div className="hidden md:block mt-12 w-20 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        {/* Login Form Panel:
            - Mobile: Pulls up slightly to overlap the branding section (-mt-10)
            - Desktop: Centered horizontally and vertically
        */}
        <div className="grow bg-[#faf6f6] md:bg-white rounded-t-[40px] md:rounded-none px-6 py-10 md:py-0 md:px-0 flex flex-col justify-center items-center z-10 -mt-10 md:mt-0 overflow-y-auto">
          
          {/* Constrain width of internal elements so they don't stretch too far on ultra-wide screens */}
          <div className="w-full max-w-[380px] flex flex-col h-full md:h-auto md:justify-center">
            
            <div className="mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-[#111010]">Welcome Back</h2>
              <p className="text-gray-500 text-sm md:text-base">Please enter your details to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-[#111010] ml-1">Username / Email</label>
                <div className="relative flex items-center">
                  <svg className="absolute left-4 w-5 h-5 text-[#bf4a53] stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-4 pl-12 pr-5 bg-white md:bg-gray-50 border border-gray-100 focus:border-[#bf4a53]/30 rounded-2xl text-base font-medium text-[#111010] shadow-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-[#111010] ml-1">Password</label>
                <div className="relative flex items-center">
                  <svg className="absolute left-4 w-5 h-5 text-[#bf4a53] stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-4 pl-12 pr-5 bg-white md:bg-gray-50 border border-gray-100 focus:border-[#bf4a53]/30 rounded-2xl text-base font-medium text-[#111010] shadow-sm outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="mt-2 bg-[#bf4a53] text-white py-4 md:py-5 rounded-2xl text-lg font-bold shadow-xl shadow-[#bf4a53]/25 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Login
              </button>
            </form>

            {/* Prototype Role Selection: Pushed to bottom on mobile via mt-auto */}
            <div className="mt-auto md:mt-10 pt-8">
              <div className="bg-[#fdf0f1] p-4 rounded-2xl text-center border border-[#f9d8da]">
                <p className="text-[10px] font-bold text-[#bf4a53] mb-2 uppercase tracking-widest">Prototype Environment</p>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white bg-white font-semibold text-xs text-[#111010] outline-none cursor-pointer"
                >
                  <option value="admin">Login as Admin</option>
                  <option value="staff">Login as Staff</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}