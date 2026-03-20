// src/pages/StaffSettings.jsx
import { useNavigate } from 'react-router-dom';

export default function StaffSettings({ setGlobalRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of RentBook?");
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
          <h1 className="text-4xl md:text-5xl font-black text-[#111010] tracking-[-0.04em] leading-tight">
            Settings
          </h1>
          <p className="text-[15px] font-semibold text-[#8e8e93] mt-2 tracking-tight">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card - Staff Specific */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center gap-5 mb-10 transition-transform active:scale-[0.99]">
          <div className="w-20 h-20 rounded-[22px] bg-linear-to-br from-primary-light to-primary flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-primary/20 shrink-0">
            SA
          </div>
          <div className="grow">
            <h2 className="text-xl font-black text-[#111010] tracking-tight">Staff Associate</h2>
            <p className="text-sm text-[#8e8e93] font-bold tracking-tight mb-2">frontdesk@rentbook.app</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#34c759] rounded-full animate-pulse"></span>
              <span className="text-[#34c759] text-[10px] font-black uppercase tracking-widest">
                Active Shift
              </span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-10 space-y-3">
          <h3 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.15em] ml-5 mb-4">
            App Preferences
          </h3>
          
          <div className="bg-white rounded-[26px] p-5 shadow-sm border border-transparent flex justify-between items-center transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#faf6f6] rounded-2xl text-[#111010]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <div>
                <p className="font-black text-[#111010] tracking-tight">Push Notifications</p>
                <p className="text-[13px] text-[#8e8e93] font-bold tracking-tight">Alerts for overdue items</p>
              </div>
            </div>
            {/* iOS Style Toggle */}
            <div className="w-11 h-6 bg-[#34c759] rounded-full relative transition-colors cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
            </div>
          </div>

          <div className="bg-white rounded-[26px] p-5 shadow-sm border border-transparent active:bg-gray-50 flex justify-between items-center cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#faf6f6] rounded-2xl text-[#111010]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              </div>
              <div>
                <p className="font-black text-[#111010] tracking-tight">Theme</p>
                <p className="text-[13px] text-[#8e8e93] font-bold tracking-tight">System Default (Light)</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-300 stroke-[3px] group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h3 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.15em] ml-5 mb-4">Account Actions</h3>
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