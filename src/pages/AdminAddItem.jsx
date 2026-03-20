// src/pages/AdminAddItem.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAddItem() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    baseRate: '',
    downpayment: '',
    category: 'gowns'
  });
  
  // AI Tagging State
  const [tags, setTags] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated AI Auto-Tagging Engine
  const handleAutoTag = () => {
    if (!formData.name) {
      alert('Please enter an Item Name first so the AI can analyze it.');
      return;
    }

    setIsAnalyzing(true);
    setTags([]); // Clear old tags

    // Simulate API network delay
    setTimeout(() => {
      const desc = formData.name.toLowerCase();
      const generatedTags = [];
      
      if (desc.includes("red")) generatedTags.push("#Red");
      if (desc.includes("pink")) generatedTags.push("#Pink");
      if (desc.includes("gold") || desc.includes("sequin")) generatedTags.push("#Gold", "#Glam");
      if (desc.includes("white") || desc.includes("ivory")) generatedTags.push("#White", "#Wedding");
      if (desc.includes("black")) generatedTags.push("#Black");
      if (desc.includes("blue")) generatedTags.push("#Blue");
      if (desc.includes("green") || desc.includes("emerald")) generatedTags.push("#Emerald");
      
      if (desc.includes("gown")) generatedTags.push("#Gown", "#Formal");
      if (desc.includes("suit") || desc.includes("tuxedo")) generatedTags.push("#Suit", "#Modern");
      if (desc.includes("barong")) generatedTags.push("#Barong", "#Filipiniana");
      if (desc.includes("terno")) generatedTags.push("#Terno", "#Filipiniana");
      if (desc.includes("lace")) generatedTags.push("#Vintage", "#Lace");
      if (desc.includes("costume")) generatedTags.push("#Costume", "#Thematic");

      // Random fabric fallback if none specified
      if (generatedTags.length < 3) {
        const fabrics = ["#Satin", "#Silk", "#Velvet", "#Chiffon", "#Tulle"];
        generatedTags.push(fabrics[Math.floor(Math.random() * fabrics.length)]);
      }

      setTags([...new Set(generatedTags)]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleImageClick = () => {
    alert('Accessing device camera... (Simulation)');
  };

  const handleSave = () => {
    if (!formData.name || !formData.baseRate) {
      alert('Item Name and Base Rate are required!');
      return;
    }
    alert('Item successfully saved to Catalog with AI tags!');
    navigate('/catalog'); // Redirect back to inventory
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6f6] relative" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
      
      {/* Top Nav */}
      <div className="p-5 md:px-12 md:pt-12 flex justify-between items-center z-10 w-full max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-text-main hover:text-primary hover:-translate-x-1 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[3px]"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="text-lg md:text-xl font-black text-text-main tracking-tight">Add New Item</div>
        <div className="w-6"></div>
      </div>

      {/* Content Area */}
      <div className="grow overflow-y-auto px-6 pb-24 animate-slide-up w-full max-w-2xl mx-auto">
        
        <div className="md:bg-app-card md:p-8 md:rounded-[40px] md:shadow-sm md:border md:border-border-soft md:mt-4">
          
          {/* Upload Area */}
          <div 
            onClick={handleImageClick}
            className="bg-app-bg border-2 border-dashed border-border-soft rounded-[32px] h-48 md:h-64 flex flex-col justify-center items-center text-text-muted mb-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] transition-all group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 mb-3 stroke-[2px] text-text-muted group-hover:text-primary transition-colors">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="font-bold text-sm group-hover:text-primary transition-colors">Tap to upload photo</span>
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Item Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Red Satin Evening Gown"
                className="w-full p-4 rounded-2xl bg-app-card md:bg-app-bg text-sm font-bold text-text-main border border-border-soft outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/50" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Base Rate (₱)</label>
                <input 
                  type="number" 
                  value={formData.baseRate}
                  onChange={(e) => setFormData({...formData, baseRate: e.target.value})}
                  placeholder="3500"
                  className="w-full p-4 rounded-2xl bg-app-card md:bg-app-bg text-sm font-bold text-text-main border border-border-soft outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/50" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Downpayment (₱)</label>
                <input 
                  type="number" 
                  value={formData.downpayment}
                  onChange={(e) => setFormData({...formData, downpayment: e.target.value})}
                  placeholder="1500"
                  className="w-full p-4 rounded-2xl bg-app-card md:bg-app-bg text-sm font-bold text-text-main border border-border-soft outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/50" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-app-card md:bg-app-bg text-sm font-bold text-text-main border border-border-soft outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="gowns">Gowns</option>
                  <option value="suits">Suits</option>
                  <option value="barong">Barong</option>
                  <option value="costumes">Costumes</option>
                  <option value="accessories">Accessories</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* AI Auto-Tagging Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-5 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[11px] font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 stroke-[3px]">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
                Smart Tags
              </div>
              <button 
                onClick={handleAutoTag} 
                disabled={isAnalyzing}
                className={`text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-primary/20 ${isAnalyzing ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:scale-95'}`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Auto-Generate'}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-8 items-center">
              {isAnalyzing ? (
                <span className="text-primary text-xs font-bold animate-pulse">AI analyzing item attributes...</span>
              ) : tags.length > 0 ? (
                tags.map(tag => (
                  <span key={tag} className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg animate-in zoom-in duration-300">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-text-muted text-xs font-medium">Enter item name then tap Auto-Generate...</span>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl p-4 md:p-5 text-sm md:text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
          >
            Save to Catalog
          </button>
          
        </div>

      </div>
    </div>
  );
}