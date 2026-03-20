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
    <div className="flex flex-col h-full relative bg-white font-sans min-h-screen">
      <div className="grow overflow-y-auto px-6 pt-12 pb-32 md:pb-12 md:max-w-2xl md:mx-auto md:w-full">
        
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Management Terminal</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">System Settings</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-50 rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0">
            AD {/* Initials for Administrator */}
          </div>
          <div className="grow">
            <h2 className="text-xl font-black text-gray-900">Administrator</h2>
            <p className="text-sm text-gray-400 font-bold mb-1">admin@rentbook.app</p>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
              Full Access
            </span>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">Store Configuration</h3>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Store Hours</p>
                <p className="text-xs text-gray-400 font-medium">Configure operating times</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-300 stroke-[3px]"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Tax & Fees</p>
                <p className="text-xs text-gray-400 font-medium">Manage platform handling rates</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-300 stroke-[3px]"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">Security</h3>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 text-[#bf4a53] flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-lg border border-red-100 hover:bg-[#bf4a53] hover:text-white transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[3px]"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out Securely
          </button>
        </div>

      </div>
    </div>
  );
}