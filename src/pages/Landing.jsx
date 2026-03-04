import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col justify-center items-center px-6 py-10 text-center">
      <div className="w-[100px] h-[100px] bg-gradient-to-br from-primary to-primary-light rounded-[28px] flex justify-center items-center mb-6 shadow-[0_12px_24px_rgba(191,74,83,0.25)] text-white animate-float">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[50px] h-[50px] stroke-2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </div>
      <h1 className="text-[36px] font-extrabold text-text-main mb-2 tracking-tight">RentBook</h1>
      <p className="text-[15px] text-text-muted leading-relaxed mb-9 px-5">
        The intelligent, offline-capable digital rental system for your gown & suit business.
      </p>
      
      <div className="flex flex-col gap-3.5 w-full text-left mb-auto">
        <FeatureItem 
          icon={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>} 
          text="Photo Evidence Tracking" 
        />
        <FeatureItem 
          icon={<><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></>} 
          text="AI Smart Inventory Search" 
        />
        <FeatureItem 
          icon={<><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></>} 
          text="Predictive Analytics Dashboard" 
        />
      </div>

      <div className="w-full mt-8">
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-primary text-white rounded-[24px] p-5 text-lg font-bold shadow-[0_8px_16px_rgba(191,74,83,0.25)] active:scale-95 transition-transform"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3.5 bg-app-card p-4 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div className="text-primary-light bg-[#fdf0f1] p-2.5 rounded-xl flex">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
          {icon}
        </svg>
      </div>
      <div className="text-[15px] font-semibold text-text-main">{text}</div>
    </div>
  );
}