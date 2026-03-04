import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAddItem() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    baseRate: '',
    deposit: '',
    category: 'gowns'
  });
  
  // AI Tagging State
  const [tags, setTags] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated AI Auto-Tagging Engine (from your app.js logic)
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
    <div className="flex flex-col h-full bg-app-bg relative">
      
      {/* Top Nav */}
      <div className="p-5 flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="text-text-main active:-translate-x-1 transition-transform">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[3px]"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="text-[17px] font-bold text-text-main">Add New Item</div>
        <div className="w-6"></div>
      </div>

      {/* Content Area */}
      <div className="grow overflow-y-auto px-6 pb-8 animate-slide-up">
        
        {/* Upload Area */}
        <div 
          onClick={handleImageClick}
          className="bg-[#f0f0f0] border-2 border-dashed border-[#e5e5ea] rounded-[24px] h-45 flex flex-col justify-center items-center text-text-muted mb-5 cursor-pointer active:scale-95 transition-transform active:bg-[#e5e5ea]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" className="w-10 h-10 mb-2.5 stroke-[2.5px]">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span className="font-bold text-sm">Tap to upload photo</span>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Item Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Red Satin Evening Gown"
              className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none focus:shadow-[0_4px_12px_rgba(191,74,83,0.1)] transition-shadow" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Base Rate (₱)</label>
              <input 
                type="number" 
                value={formData.baseRate}
                onChange={(e) => setFormData({...formData, baseRate: e.target.value})}
                placeholder="3500"
                className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none focus:shadow-[0_4px_12px_rgba(191,74,83,0.1)] transition-shadow" 
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Deposit (₱)</label>
              <input 
                type="number" 
                value={formData.deposit}
                onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                placeholder="1500"
                className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none focus:shadow-[0_4px_12px_rgba(191,74,83,0.1)] transition-shadow" 
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-bold text-text-main mb-2 block ml-1">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-4 rounded-[18px] bg-app-card text-[15px] font-medium text-text-main outline-none focus:shadow-[0_4px_12px_rgba(191,74,83,0.1)] transition-shadow appearance-none"
            >
              <option value="gowns">Gowns</option>
              <option value="suits">Suits</option>
              <option value="barong">Barong</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* AI Auto-Tagging Section */}
        <div className="bg-linear-to-br from-[#fdf0f1] to-white border border-[#f9d8da] rounded-[20px] p-4.5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[13px] font-extrabold text-primary flex items-center gap-2 uppercase tracking-[0.5px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 stroke-[3px]">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
              Smart Tags
            </div>
            <button 
              onClick={handleAutoTag} 
              disabled={isAnalyzing}
              className={`text-white rounded-full px-4 py-2 text-xs font-extrabold transition-transform active:scale-95 ${isAnalyzing ? 'bg-[#ea8c93] cursor-not-allowed' : 'bg-primary'}`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Auto-Generate'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[28px]">
            {isAnalyzing ? (
              <span className="text-primary text-xs font-bold animate-pulse">AI analyzing item attributes...</span>
            ) : tags.length > 0 ? (
              tags.map(tag => (
                <span key={tag} className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
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
          className="w-full bg-text-main text-white rounded-[22px] p-5 text-[17px] font-bold shadow-[0_6px_16px_rgba(0,0,0,0.12)] active:scale-95 active:bg-black transition-all"
        >
          Save to Catalog
        </button>

      </div>
    </div>
  );
}