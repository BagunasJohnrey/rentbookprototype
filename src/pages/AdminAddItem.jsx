// src/pages/AdminAddItem.jsx refactored
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAddItem() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    baseRate: '',
    deposit: '',
    category: 'gowns'
  });
  
  const [tags, setTags] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAutoTag = () => {
    if (!formData.name) {
      alert('Please enter an Item Name first so the AI can analyze it.');
      return;
    }
    setIsAnalyzing(true);
    setTags([]);
    setTimeout(() => {
      const desc = formData.name.toLowerCase();
      const generatedTags = [];
      if (desc.includes("red")) generatedTags.push("#Red");
      if (desc.includes("white") || desc.includes("ivory")) generatedTags.push("#White", "#Wedding");
      if (desc.includes("gown")) generatedTags.push("#Gown", "#Formal");
      if (generatedTags.length < 3) {
        const fabrics = ["#Satin", "#Silk", "#Chiffon"];
        generatedTags.push(fabrics[Math.floor(Math.random() * fabrics.length)]);
      }
      setTags([...new Set(generatedTags)]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!formData.name || !formData.baseRate) return alert('Name and Rate required!');
    alert('Item saved to Catalog!');
    navigate('/catalog');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 md:py-10">
      {/* Constraints for Desktop: Centered card container */}
      <div className="w-full md:max-w-2xl md:mx-auto bg-white md:shadow-2xl md:rounded-4xl flex flex-col h-full md:h-auto overflow-hidden">
        
        {/* Top Nav */}
        <div className="p-5 flex justify-between items-center border-b border-gray-50">
          <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 stroke-[2.5px]"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="text-lg font-black text-gray-800">Add New Inventory</div>
          <div className="w-10"></div>
        </div>

        <div className="grow overflow-y-auto px-6 md:px-10 py-8 pb-32">
          {/* Upload Area */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl h-48 flex flex-col justify-center items-center text-gray-400 mb-8 cursor-pointer hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 mb-2 stroke-2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span className="font-bold text-sm">Upload Item Photo</span>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 mt-1.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="e.g. Red Satin Evening Gown"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Rate (₱)</label>
                <input 
                  type="number" 
                  value={formData.baseRate}
                  onChange={(e) => setFormData({...formData, baseRate: e.target.value})}
                  className="w-full p-4 mt-1.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="3500"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Deposit (₱)</label>
                <input 
                  type="number" 
                  value={formData.deposit}
                  onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                  className="w-full p-4 mt-1.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="1500"
                />
              </div>
            </div>

            {/* Smart Tagging Component */}
            <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10">
              <div className="flex justify-between items-center mb-4">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  AI Smart Tags
                </div>
                <button 
                  onClick={handleAutoTag} 
                  disabled={isAnalyzing}
                  className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md shadow-primary/20"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Generate'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-8">
                {tags.map(tag => (
                  <span key={tag} className="bg-white text-primary text-[11px] font-black px-3 py-1.5 rounded-lg shadow-sm border border-primary/5">
                    {tag}
                  </span>
                ))}
                {!isAnalyzing && tags.length === 0 && <p className="text-[11px] text-gray-400 font-medium">No tags generated yet</p>}
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-gray-900 text-white rounded-2xl py-5 text-lg font-black shadow-xl hover:bg-black transition-all active:scale-[0.98]"
            >
              Save to Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}