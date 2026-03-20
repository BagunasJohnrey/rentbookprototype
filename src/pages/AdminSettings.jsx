// src/pages/AdminSettings.jsx
import { useNavigate } from 'react-router-dom';

export default function AdminSettings({ setGlobalRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of the Management Terminal?");
    if (confirmLogout) {
      if (setGlobalRole) setGlobalRole(null);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6] min-h-screen antialiased select-none" 
         style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      
      <div className="grow overflow-y-auto px-6 pt-12 pb-32 md:pb-12 md:max-w-2xl md:mx-auto md:w-full">
        
        {/* Header - Heavy iOS Style */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-2 opacity-80">
            Management Terminal
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#111010] tracking-[-0.04em] leading-tight">
            System Settings
          </h1>
          <p className="text-[15px] font-semibold text-[#8e8e93] mt-2 tracking-tight">
            Configure platform preferences and security
          </p>
        </div>

        {/* Profile Card - iOS Glassmorphism Style */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center gap-5 mb-10 transition-transform active:scale-[0.99]">
          <div className="w-20 h-20 rounded-[22px] bg-[#111010] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-black/20 shrink-0">
            AD
          </div>
          <div className="grow">
            <h2 className="text-xl font-black text-[#111010] tracking-tight">Administrator</h2>
            <p className="text-sm text-[#8e8e93] font-bold tracking-tight mb-2">admin@renttech.app</p>
            <span className="inline-block px-3 py-1 bg-[#34c759]/10 text-[#34c759] text-[10px] font-black uppercase tracking-widest rounded-lg">
              Full Access
            </span>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-10 space-y-3">
          <h3 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.15em] ml-5 mb-4">
            Store Configuration
          </h3>
          
          <div className="bg-white rounded-[26px] p-5 shadow-sm border border-transparent active:bg-gray-50 flex justify-between items-center cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#faf6f6] rounded-2xl text-[#111010]">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <p className="font-black text-[#111010] tracking-tight">Store Hours</p>
                <p className="text-[13px] text-[#8e8e93] font-bold tracking-tight">Configure operating times</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-300 stroke-[3px]"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>

          <div className="bg-white rounded-[26px] p-5 shadow-sm border border-transparent active:bg-gray-50 flex justify-between items-center cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#faf6f6] rounded-2xl text-[#111010]">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div>
                <p className="font-black text-[#111010] tracking-tight">Tax & Fees</p>
                <p className="text-[13px] text-[#8e8e93] font-bold tracking-tight">Manage platform handling rates</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-300 stroke-[3px]"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h3 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.15em] ml-5 mb-4">Security</h3>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#111010] text-white flex items-center justify-center gap-3 py-5 rounded-[26px] font-black text-lg shadow-xl shadow-black/10 hover:brightness-125 transition-all active:scale-[0.97]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[3px]"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out Securely
          </button>
        </div>

      </div>
    </div>
  );
}