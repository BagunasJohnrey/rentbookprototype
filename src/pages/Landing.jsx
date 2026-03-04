// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <div className="grow flex flex-col md:flex-row items-center justify-center px-8 md:px-20 gap-12">
        
        {/* Text Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 animate-slide-up">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Philippines' #1 Gown Rental System
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main leading-[1.1] tracking-tighter mb-6">
            Manage Your <br /> 
            <span className="text-primary">Inventory Better.</span>
          </h1>
          <p className="text-lg text-text-muted font-medium mb-10 max-w-md leading-relaxed">
            A specialized POS and inventory system designed specifically for formal wear rental businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-text-main text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-black transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Visual Decoration (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 justify-center relative">
          <div className="w-full max-w-lg aspect-square bg-app-bg rounded-4xl border-2 border-dashed border-primary/20 flex items-center justify-center">
             <span className="text-[200px] opacity-20">👗</span>
          </div>
        </div>
      </div>
    </div>
  );
}