// src/pages/AdminSettings.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings({ setGlobalRole }) {
  const navigate = useNavigate();

  // Automation State
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [smsTemplate, setSmsTemplate] = useState("Hi {Name}, your rental is due on {Date}. Please return it to avoid late fees.");
  
  // Configuration State
  const [storeHours, setStoreHours] = useState("9:00 AM - 6:00 PM");
  const [rentalDuration, setRentalDuration] = useState("7 Days");
  
  // Policy State
  const [securityDeposit, setSecurityDeposit] = useState("₱500.00 / item");
  const [gracePeriod, setGracePeriod] = useState("24 Hours");

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'hours', 'sms', 'duration', 'deposit', 'grace'
  const [tempValue, setTempValue] = useState("");

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event for PWA installation
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Fallback message for devices that don't support the prompt (e.g., iOS Safari) or already installed
      alert("App installation may already be complete, or it's not supported by this browser. \n\nOn iOS, tap the 'Share' icon and select 'Add to Home Screen'.");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of the Management Terminal?");
    if (confirmLogout) {
      if (setGlobalRole) setGlobalRole(null);
      navigate('/login');
    }
  };

  // Modal Handlers
  const openModal = (type, currentValue) => {
    setActiveModal(type);
    setTempValue(currentValue);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTempValue("");
  };

  const handleSave = () => {
    if (activeModal === 'hours') setStoreHours(tempValue);
    if (activeModal === 'sms') setSmsTemplate(tempValue);
    if (activeModal === 'duration') setRentalDuration(tempValue);
    if (activeModal === 'deposit') setSecurityDeposit(tempValue);
    if (activeModal === 'grace') setGracePeriod(tempValue);
    closeModal();
  };

  return (
    <div className="flex flex-col h-full relative bg-[#faf6f6] min-h-screen antialiased select-none" 
         style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      <div className="grow overflow-y-auto px-6 pt-12 pb-32 md:pb-12 md:max-w-2xl md:mx-auto md:w-full scrollbar-hide">
        
        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            Management Terminal
          </p>
          <h1 className="text-[32px] md:text-5xl font-black text-text-main tracking-tight leading-tight">
            System Settings
          </h1>
          <p className="text-sm md:text-base font-medium text-text-muted mt-2 tracking-tight">
            Configure platform preferences and security
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-app-card rounded-[32px] p-6 shadow-sm border border-border-soft flex items-center gap-5 mb-10 transition-transform active:scale-[0.99]">
          <div className="w-20 h-20 rounded-[22px] bg-app-bg border border-border-soft flex items-center justify-center text-text-main text-2xl font-black shadow-sm shrink-0">
            AD
          </div>
          <div className="grow">
            <h2 className="text-xl font-black text-text-main tracking-tight">Administrator</h2>
            <p className="text-sm text-text-muted font-bold tracking-tight mb-2">admin@renttech.app</p>
            <span className="inline-block px-3 py-1 bg-success/10 text-success text-[10px] font-black uppercase tracking-widest rounded-lg">
              Full Access
            </span>
          </div>
        </div>

        {/* Notifications & Automation Section */}
        <div className="mb-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] ml-5 mb-4">
            Automation
          </h3>
          
          <div className="bg-app-card rounded-[26px] p-5 shadow-sm border border-border-soft flex flex-col gap-4 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 text-success rounded-2xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-text-main tracking-tight">Auto SMS Reminders</p>
                  <p className="text-[13px] text-text-muted font-bold tracking-tight">Send due date texts automatically</p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setAutoSmsEnabled(!autoSmsEnabled)}
                className={`w-14 h-8 rounded-full transition-colors duration-300 relative focus:outline-none ${autoSmsEnabled ? 'bg-primary' : 'bg-border-soft'}`}
              >
                <div className={`w-7 h-7 bg-white rounded-full absolute top-0.5 shadow-md transition-transform duration-300 ${autoSmsEnabled ? 'translate-x-[26px]' : 'translate-x-0.5'}`}></div>
              </button>
            </div>

            {/* Edit Message Template Button */}
            <div 
              onClick={() => openModal('sms', smsTemplate)}
              className="pt-4 border-t border-border-soft flex justify-between items-center cursor-pointer group"
            >
              <div className="pr-4">
                <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1">Message Template</p>
                <p className="text-[13px] text-text-main font-bold tracking-tight line-clamp-1">"{smsTemplate}"</p>
              </div>
              <div className="p-2 bg-app-bg border border-border-soft rounded-xl group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-colors text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 stroke-[2.5px]"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Store Configuration Section */}
        <div className="mb-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-75">
          <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] ml-5 mb-4">
            Store Configuration
          </h3>
          
          <div 
            onClick={() => openModal('hours', storeHours)}
            className="bg-app-card rounded-[26px] p-5 shadow-sm border border-border-soft hover:border-primary/30 flex justify-between items-center cursor-pointer transition-all group mb-3"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-app-bg border border-border-soft rounded-2xl text-text-main">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <p className="font-black text-text-main tracking-tight">Store Hours</p>
                <p className="text-[13px] text-primary font-bold tracking-tight">{storeHours}</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-text-muted/50 stroke-[3px] group-hover:text-primary transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>

          <div 
            onClick={() => openModal('duration', rentalDuration)}
            className="bg-app-card rounded-[26px] p-5 shadow-sm border border-border-soft hover:border-primary/30 flex justify-between items-center cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-app-bg border border-border-soft rounded-2xl text-text-main">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <p className="font-black text-text-main tracking-tight">Standard Rental Duration</p>
                <p className="text-[13px] text-primary font-bold tracking-tight">{rentalDuration}</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-text-muted/50 stroke-[3px] group-hover:text-primary transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* Rental Policies Section */}
        <div className="mb-10 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] ml-5 mb-4">
            Rental Policies
          </h3>
          
          <div 
            onClick={() => openModal('deposit', securityDeposit)}
            className="bg-app-card rounded-[26px] p-5 shadow-sm border border-border-soft hover:border-primary/30 flex justify-between items-center cursor-pointer transition-all group mb-3"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-app-bg border border-border-soft rounded-2xl text-text-main">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <p className="font-black text-text-main tracking-tight">Security Downpayment</p>
                <p className="text-[13px] text-primary font-bold tracking-tight">{securityDeposit}</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-text-muted/50 stroke-[3px] group-hover:text-primary transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>

          <div 
            onClick={() => openModal('grace', gracePeriod)}
            className="bg-app-card rounded-[26px] p-5 shadow-sm border border-border-soft hover:border-primary/30 flex justify-between items-center cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-app-bg border border-border-soft rounded-2xl text-text-main">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <p className="font-black text-text-main tracking-tight">Return Period</p>
                <p className="text-[13px] text-primary font-bold tracking-tight">{gracePeriod}</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-text-muted/50 stroke-[3px] group-hover:text-primary transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* App Configuration Section (New) */}
        <div className="mb-10 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[200ms]">
          <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] ml-5 mb-4">
            App Configuration
          </h3>
          
          <div 
            onClick={handleInstallApp}
            className="bg-app-card rounded-[26px] p-5 shadow-sm border border-border-soft hover:border-primary/30 flex justify-between items-center cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-app-bg border border-border-soft rounded-2xl text-text-main">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <div>
                <p className="font-black text-text-main tracking-tight">Install to Home Screen</p>
                <p className="text-[13px] text-text-muted font-bold tracking-tight">Get quick access from your device</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-text-muted/50 stroke-[3px] group-hover:text-primary transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[250ms]">
          <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] ml-5 mb-4">Security</h3>
          <button 
            onClick={handleLogout}
            className="w-full bg-text-main text-white flex items-center justify-center gap-3 py-5 rounded-[26px] font-black text-lg shadow-xl shadow-black/10 hover:brightness-125 transition-all active:scale-[0.97]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[3px]"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out Securely
          </button>
        </div>

      </div>

      {/* POPUP MODAL OVERLAY */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 transition-all"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content Card */}
          <div className="relative w-full max-w-sm bg-app-card border border-border-soft rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-300 slide-in-from-bottom-4">
            
            <h2 className="text-2xl font-black text-text-main tracking-tight mb-1">
              {activeModal === 'hours' && "Edit Store Hours"}
              {activeModal === 'duration' && "Rental Duration"}
              {activeModal === 'deposit' && "Security Deposit"}
              {activeModal === 'grace' && "Grace Period"}
              {activeModal === 'sms' && "Edit SMS Template"}
            </h2>
            
            <p className="text-[13px] font-bold text-text-muted mb-5">
              {activeModal === 'sms' ? "Use {Name} and {Date} as placeholders." : "Update the system-wide value below."}
            </p>

            {activeModal === 'sms' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-4 bg-app-bg border border-border-soft focus:ring-2 focus:ring-primary/20 rounded-2xl text-sm font-bold text-text-main outline-none transition-all resize-none h-32 placeholder:text-text-muted/50"
                placeholder="Enter message template..."
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-4 bg-app-bg border border-border-soft focus:ring-2 focus:ring-primary/20 rounded-2xl text-sm font-bold text-text-main outline-none transition-all placeholder:text-text-muted/50"
                placeholder="Enter value..."
              />
            )}

            <div className="flex gap-3 mt-6">
              <button 
                onClick={closeModal}
                className="flex-1 py-4 bg-app-bg border border-border-soft text-text-muted rounded-2xl font-black text-sm uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}