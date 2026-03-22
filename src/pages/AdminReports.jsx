// src/pages/AdminReports.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminBottomNav from '../components/AdminBottomNav';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; 

// ==========================================
// REAL LEAFLET HEATMAP COMPONENT
// ==========================================
function BatangasHeatmap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return; 

    const map = L.map(mapRef.current, {
       zoomControl: false 
    }).setView([13.9500, 120.7500], 10);
    
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    const baseData = [
      [13.9388, 120.7323, 1.0], // Balayan 
      [13.8306, 120.6331, 0.8], // Calatagan 
      [13.9317, 120.8146, 0.6], // Calaca 
      [13.8820, 120.9142, 0.3], // Lemery
      [14.0658, 120.6277, 0.2], // Nasugbu
      [13.8812, 120.9255, 0.1], // Taal
      [14.0204, 120.7285, 0.1], // Tuy
      [14.0326, 120.6508, 0.1], // Lian
    ];

    let heatData = [...baseData];
    baseData.forEach(point => {
      for(let i=0; i<5; i++){
        let latOffset = (Math.random() - 0.5) * 0.05;
        let lngOffset = (Math.random() - 0.5) * 0.05;
        heatData.push([point[0] + latOffset, point[1] + lngOffset, point[2] * 0.6]);
      }
    });

    if (typeof L.heatLayer === 'function') {
      L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 12,
        gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
      }).addTo(map);
    }

    const municipalities = [
      {name: "Balayan", coords: [13.9388, 120.7323]},
      {name: "Calatagan", coords: [13.8306, 120.6331]},
      {name: "Calaca", coords: [13.9317, 120.8146]},
      {name: "Lemery", coords: [13.8820, 120.9142]},
      {name: "Nasugbu", coords: [14.0658, 120.6277]},
      {name: "Taal", coords: [13.8812, 120.9255]},
      {name: "Tuy", coords: [14.0204, 120.7285]},
      {name: "Lian", coords: [14.0326, 120.6508]}
    ];

    municipalities.forEach(mun => {
      L.circleMarker(mun.coords, {
        radius: 5,
        color: '#111010',
        weight: 2,
        fillColor: '#ffffff',
        fillOpacity: 1
      }).bindPopup(`<b style="font-family: sans-serif; font-size: 14px;">${mun.name}</b>`).addTo(map);
    });

    // FIX: ResizeObserver automatically invalidates map size continuously 
    // as the modal animates/expands, perfectly fixing the black box cut-off bug.
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
     <div 
       ref={mapRef} 
       style={{ background: 'transparent' }} // FIX: Forces leaflet's grey background to be transparent
       className="absolute inset-0 z-0 rounded-inherit border-none filter contrast-125 saturate-50 bg-transparent" 
     />
  );
}

// ==========================================
// MOCK DATA
// ==========================================
const DATA_SETS = {
  'This Week': {
    stats: { totalRevenue: 24500, monthlyGrowth: 5.2, pendingDeposits: 3200, completedRentals: 85, activeUsers: 210, userGrowth: 2.4 },
    chart: [
      { label: 'Mon', revenue: 3200, rentals: 12, isForecast: false },
      { label: 'Tue', revenue: 4100, rentals: 15, isForecast: false },
      { label: 'Wed', revenue: 2800, rentals: 10, isForecast: false },
      { label: 'Thu', revenue: 5500, rentals: 20, isForecast: false },
      { label: 'Fri', revenue: 8900, rentals: 28, isForecast: true },
      { label: 'Sat', revenue: 12000, rentals: 40, isForecast: true },
    ]
  },
  'This Month': {
    stats: { totalRevenue: 112400, monthlyGrowth: 8.4, pendingDeposits: 15000, completedRentals: 340, activeUsers: 450, userGrowth: 4.1 },
    chart: [
      { label: 'Week 1', revenue: 25000, rentals: 80, isForecast: false },
      { label: 'Week 2', revenue: 28000, rentals: 95, isForecast: false },
      { label: 'Week 3', revenue: 22000, rentals: 70, isForecast: false },
      { label: 'Week 4', revenue: 37400, rentals: 95, isForecast: true },
    ]
  },
  'This Year': {
    stats: { totalRevenue: 845250, monthlyGrowth: 14.2, pendingDeposits: 52000, completedRentals: 1432, activeUsers: 892, userGrowth: 8.5 },
    chart: [
      { label: 'Jan', revenue: 45000, rentals: 120, isForecast: false },
      { label: 'Feb', revenue: 52000, rentals: 145, isForecast: false },
      { label: 'Mar', revenue: 48000, rentals: 130, isForecast: false },
      { label: 'Apr', revenue: 61000, rentals: 180, isForecast: false },
      { label: 'May', revenue: 59000, rentals: 175, isForecast: false },
      { label: 'Jun', revenue: 75000, rentals: 220, isForecast: true },
      { label: 'Jul', revenue: 88000, rentals: 260, isForecast: true },
    ]
  },
  'All Time': {
    stats: { totalRevenue: 2450800, monthlyGrowth: 22.4, pendingDeposits: 85000, completedRentals: 5200, activeUsers: 2400, userGrowth: 15.2 },
    chart: [
      { label: '2022', revenue: 250000, rentals: 600, isForecast: false },
      { label: '2023', revenue: 480000, rentals: 950, isForecast: false },
      { label: '2024', revenue: 650000, rentals: 1400, isForecast: false },
      { label: '2025', revenue: 845000, rentals: 1800, isForecast: false },
      { label: '2026', revenue: 1100000, rentals: 2200, isForecast: true },
    ]
  }
};

const POPULAR_CATEGORIES = [
  { name: 'Formal Suits', count: 420, trend: '+12%' },
  { name: 'Wedding Gowns', count: 315, trend: '+18%' },
  { name: 'Party Dresses', count: 250, trend: '-2%' },
  { name: 'Accessories', count: 180, trend: '+5%' },
  { name: 'Barongs', count: 145, trend: '+8%' },
  { name: 'Filipiniana', count: 90, trend: '+15%' },
];

const TOP_OCCASIONS = [
  { source: 'Weddings', percentage: 45, colorClass: 'bg-primary' },
  { source: 'Debuts & Proms', percentage: 35, colorClass: 'bg-text-main' },
  { source: 'Corporate/Formal Events', percentage: 15, colorClass: 'bg-text-muted' },
  { source: 'Photo Shoots', percentage: 5, colorClass: 'bg-border-soft' },
];

const CUSTOMER_LOCATIONS = [
  { location: 'Balayan', percentage: 45 },
  { location: 'Calatagan', percentage: 25 },
  { location: 'Calaca', percentage: 15 },
  { location: 'Lemery', percentage: 7 },
  { location: 'Nasugbu', percentage: 4 },
  { location: 'Taal', percentage: 2 },
  { location: 'Tuy', percentage: 1 },
  { location: 'Lian', percentage: 1 },
];

const ITEM_INSIGHTS = [
  {
    id: "ITEM-1006",
    name: "Crimson Red Debutante Ball Gown",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&q=80",
    utilization: 88,
    demand: "Surging",
    trend: "up",
    recommendation: "Increase base rate by 15% for upcoming prom season.",
    actionText: "Apply AI Pricing"
  },
  {
    id: "ITEM-1003",
    name: "Classic Black Tuxedo",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    utilization: 92,
    demand: "Stable",
    trend: "neutral",
    recommendation: "High wear-and-tear detected. Schedule deep maintenance.",
    actionText: "Flag for Maintenance"
  },
  {
    id: "ITEM-1009",
    name: "Champagne Bridesmaid Dress",
    imageUrl: "https://images.unsplash.com/photo-1583391733958-d25e07fac04f?w=150&q=80",
    utilization: 24,
    demand: "Declining",
    trend: "down",
    recommendation: "Bundle with Wedding Gowns for a 20% ensemble discount.",
    actionText: "Create Promo Bundle"
  }
];

// ==========================================
// REUSABLE COMPONENT
// ==========================================
const ResponsiveInsights = ({ items, isModal = false, onAdjustClick, onActionClick }) => (
  <div className="w-full">
    {/* DESKTOP VIEW */}
    <div className="hidden md:block overflow-x-auto scrollbar-hide">
      <table className="w-full text-left border-collapse min-w-200">
        <thead>
          <tr className={isModal ? "bg-app-card border-b border-border-soft" : "bg-app-bg border-b border-border-soft"}>
            <th className="px-6 py-5 text-[10px] font-black uppercase text-text-muted tracking-widest">Inventory Asset</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase text-text-muted tracking-widest">Metrics & Trend</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase text-text-muted tracking-widest">System Recommendation</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase text-text-muted tracking-widest text-right">Direct Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {items.map((item) => (
            <tr key={item.id} className={isModal ? "hover:bg-app-card transition-colors group" : "hover:bg-app-bg/80 transition-colors"}>
              <td className="px-6 py-5 pointer-events-none">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-border-soft bg-app-bg" alt={item.name} />
                  <div>
                    <span className="font-bold text-sm text-text-main block leading-tight mb-1">{item.name}</span>
                    <span className="text-[10px] text-text-muted font-black bg-app-card border border-border-soft px-2 py-0.5 rounded uppercase tracking-wider">{item.id}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 pointer-events-none">
                <div className="w-full max-w-35">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-bold text-text-main">Util: {item.utilization}%</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                      item.trend === 'up' ? 'text-success bg-success/10 border-success/20' : 
                      item.trend === 'down' ? 'text-red-600 bg-red-50 border-red-100' : 'text-text-muted bg-app-bg border-border-soft'
                    }`}>
                      {item.trend === 'up' ? '↑ ' : item.trend === 'down' ? '↓ ' : '− '}{item.demand}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden border border-border-soft">
                    <div className={`h-full rounded-full ${item.utilization > 80 ? 'bg-success' : item.utilization > 40 ? 'bg-[#ff9f0a]' : 'bg-red-500'}`} style={{ width: `${item.utilization}%` }} />
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 pointer-events-none">
                <p className="text-xs text-text-muted font-bold max-w-70 leading-relaxed bg-app-card p-3 rounded-xl border border-border-soft">
                  {item.recommendation}
                </p>
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAdjustClick(item); }}
                    className="px-3 py-3 bg-app-card border border-border-soft text-text-main text-[10px] font-black uppercase tracking-wider rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    title="Manually Adjust Pricing"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => onActionClick(item.actionText, e)}
                    className="px-5 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    {item.actionText}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!isModal && (
            <tr className="bg-app-bg/50 pointer-events-none">
              <td colSpan="4" className="text-center py-3 text-xs font-bold text-primary uppercase tracking-widest">
                Click Card to View Full List
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* MOBILE VIEW */}
    <div className="md:hidden flex flex-col divide-y divide-border-soft">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-4 p-4 hover:bg-app-bg/50 transition-colors">
          <div className="flex items-start gap-3 pointer-events-none">
            <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-border-soft bg-app-bg shrink-0" alt={item.name} />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm text-text-main block truncate">{item.name}</span>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[9px] text-text-muted font-black bg-app-card border border-border-soft px-1.5 py-0.5 rounded uppercase tracking-wider">{item.id}</span>
                <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                    item.trend === 'up' ? 'text-success bg-success/10 border-success/20' : 
                    item.trend === 'down' ? 'text-red-600 bg-red-50 border-red-100' : 'text-text-muted bg-app-bg border-border-soft'
                }`}>
                  {item.trend === 'up' ? '↑ ' : item.trend === 'down' ? '↓ ' : '− '}{item.demand}
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full pointer-events-none">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-text-muted">Utilization</span>
              <span className="text-[10px] font-bold text-text-main">{item.utilization}%</span>
            </div>
            <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden border border-border-soft">
              <div className={`h-full rounded-full ${item.utilization > 80 ? 'bg-success' : item.utilization > 40 ? 'bg-[#ff9f0a]' : 'bg-red-500'}`} style={{ width: `${item.utilization}%` }} />
            </div>
          </div>
          
          <p className="text-xs text-text-muted font-medium leading-relaxed bg-app-card p-3 rounded-xl border border-border-soft pointer-events-none">
            {item.recommendation}
          </p>
          
          <div className="flex gap-2">
             <button 
               onClick={(e) => { e.stopPropagation(); onAdjustClick(item); }}
               className="px-4 py-3 bg-app-card border border-border-soft text-text-main text-[10px] font-black uppercase tracking-wider rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95 flex items-center justify-center"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
             </button>
             <button 
               onClick={(e) => onActionClick(item.actionText, e)}
               className="flex-1 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-sm active:scale-95"
             >
               {item.actionText}
             </button>
          </div>
        </div>
      ))}
      {!isModal && (
        <div className="p-4 text-center text-[10px] font-bold text-primary uppercase tracking-widest bg-app-bg/50 pointer-events-none">
          Click Card to View Full List
        </div>
      )}
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('This Year');
  const [activeModal, setActiveModal] = useState(null); 
  const [actionSuccess, setActionSuccess] = useState(null); 
  const [manualAdjustItem, setManualAdjustItem] = useState(null);

  // Dynamic AI State
  const [insightsConfig, setInsightsConfig] = useState({
    spikePercent: 22,
    spikeCategory1: 'Wedding Gowns',
    spikeCategory2: 'Formal Suits',
    spikeTimeline: 'June/July',
    discountPercent: 10,
    discountCategory: 'Party Dresses'
  });
  
  const [tempInsights, setTempInsights] = useState(insightsConfig);

  const currentData = DATA_SETS[timeRange] || DATA_SETS['This Year'];
  const maxRevenue = Math.max(...currentData.chart.map(d => d.revenue));

  const actualDataPoints = currentData.chart.filter(d => !d.isForecast);
  const forecastDataPoints = currentData.chart.filter(d => d.isForecast);
  const splitIndex = currentData.chart.findIndex(d => d.isForecast);
  const forecastLinePoints = splitIndex > 0 ? [currentData.chart[splitIndex - 1], ...forecastDataPoints] : forecastDataPoints;

  const buildPath = (pts) => {
    return pts.map((d, index) => {
      const absIndex = currentData.chart.indexOf(d);
      const x = (absIndex / (currentData.chart.length - 1)) * 100;
      const y = 100 - (d.revenue / maxRevenue) * 90;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const pathActual = buildPath(actualDataPoints);
  const pathForecast = buildPath(forecastLinePoints);

  const handleActionClick = (actionName, e) => {
    if (e) e.stopPropagation(); 
    setActionSuccess(`Successfully executed: ${actionName}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const openConfigModal = () => {
    setTempInsights(insightsConfig);
    setActiveModal('configureInsights');
  };

  const saveInsightsConfig = () => {
    setInsightsConfig(tempInsights);
    setActiveModal(null);
    handleActionClick('Model Configuration Updated');
  };

  return (
    <div className="flex flex-col min-h-screen md:h-screen relative bg-app-bg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-200 bg-success text-white px-4 md:px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 md:gap-3 animate-slide-up text-sm md:text-base w-max max-w-[90vw]">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span className="truncate">{actionSuccess}</span>
        </div>
      )}

      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-350 md:mx-auto md:w-full scrollbar-hide">
        
        {/* Header Section */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-1 md:mb-2">Business Reports</p>
            <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Analytics Overview</h1>
            <p className="text-sm font-medium text-text-muted mt-1 md:mt-2">Track your store's revenue, rentals, and user demographics.</p>
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full md:w-auto bg-app-card border border-border-soft text-text-main text-sm rounded-xl px-4 py-3 md:py-2 font-bold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm transition-all"
          >
            {Object.keys(DATA_SETS).map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Executive Insights Card */}
        <div className="mb-8 bg-app-card rounded-3xl md:rounded-4xl p-5 md:p-8 shadow-sm relative overflow-hidden border border-primary/20 animate-slide-up group">
          <div className="absolute top-0 right-0 w-75 md:w-100 h-75 md:h-100 bg-primary/5 rounded-full blur-[60px] md:blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-5 md:mb-8 gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-text-main font-black text-lg md:text-2xl tracking-tight flex items-center gap-2 md:gap-3 flex-wrap">
                  Executive Insights
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-widest font-black">Live Model</span>
                </h3>
                <p className="text-text-muted text-xs md:text-sm font-medium mt-0.5 md:mt-1">Real-time predictive analytics based on current market trends.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-text-muted text-[9px] md:text-[10px] uppercase font-bold tracking-widest hidden md:inline-block">Updated Just Now</span>
               <button 
                 onClick={openConfigModal}
                 className="p-2 md:p-2.5 bg-app-bg border border-border-soft rounded-lg md:rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
                 title="Configure Model"
               >
                 <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 relative z-10">
            <div className="bg-app-bg border border-border-soft rounded-2xl p-4 md:p-6 shadow-sm transition-all hover:border-primary/30">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <h4 className="text-text-muted text-[9px] md:text-[10px] font-black uppercase tracking-widest">Demand Forecast</h4>
              </div>
              <p className="text-text-main text-sm md:text-base font-medium leading-relaxed">
                Projected <span className="text-success font-bold">+{insightsConfig.spikePercent}% spike</span> in demand for <span className="font-bold">{insightsConfig.spikeCategory1}</span> and <span className="font-bold">{insightsConfig.spikeCategory2}</span> in {insightsConfig.spikeTimeline}. Ensure inventory is fully maintained.
              </p>
            </div>

            <div className="bg-app-bg border border-border-soft rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-between gap-4 transition-all hover:border-[#ff9f0a]/30">
              <div>
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#ff9f0a]"></div>
                  <h4 className="text-text-muted text-[9px] md:text-[10px] font-black uppercase tracking-widest">Suggested Optimization</h4>
                </div>
                <p className="text-text-main text-sm md:text-base font-medium leading-relaxed">
                  Apply a <span className="text-[#ff9f0a] font-bold">{insightsConfig.discountPercent}% discount</span> on underperforming '{insightsConfig.discountCategory}' to boost utilization.
                </p>
              </div>
              <button 
                onClick={(e) => handleActionClick('Promo Automation Executed', e)}
                className="w-full md:w-auto bg-text-main text-white py-3 md:py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black transition-colors active:scale-95 shadow-md"
              >
                Apply Promo Automatically
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 animate-slide-up cursor-pointer group" onClick={() => setActiveModal('revenue')}>
          <div className="bg-app-card p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-border-soft group-hover:border-primary/50 transition-colors">
            <p className="text-text-muted font-bold uppercase text-[8px] md:text-[10px] tracking-wider mb-1 md:mb-2 truncate">Revenue</p>
            <h2 className="text-xl md:text-3xl font-black text-text-main truncate">₱{currentData.stats.totalRevenue.toLocaleString()}</h2>
            <p className="text-[9px] md:text-xs text-success font-bold mt-1 md:mt-2 truncate">↑ {currentData.stats.monthlyGrowth}%</p>
          </div>
          <div className="bg-app-card p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-border-soft group-hover:border-primary/50 transition-colors">
            <p className="text-text-muted font-bold uppercase text-[8px] md:text-[10px] tracking-wider mb-1 md:mb-2 truncate">Rentals</p>
            <h2 className="text-xl md:text-3xl font-black text-text-main truncate">{currentData.stats.completedRentals.toLocaleString()}</h2>
            <p className="text-[9px] md:text-xs text-success font-bold mt-1 md:mt-2 truncate">↑ 12.4%</p>
          </div>
          <div className="bg-app-card p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm border border-border-soft group-hover:border-primary/50 transition-colors">
            <p className="text-text-muted font-bold uppercase text-[8px] md:text-[10px] tracking-wider mb-1 md:mb-2 truncate">Active Users</p>
            <h2 className="text-xl md:text-3xl font-black text-text-main truncate">{currentData.stats.activeUsers.toLocaleString()}</h2>
            <p className="text-[9px] md:text-xs text-success font-bold mt-1 md:mt-2 truncate">↑ {currentData.stats.userGrowth}%</p>
          </div>
          <div className="bg-primary text-white p-4 md:p-6 rounded-[20px] md:rounded-3xl shadow-sm group-hover:bg-primary-dark transition-colors">
            <p className="text-white/80 font-bold uppercase text-[8px] md:text-[10px] tracking-wider mb-1 md:mb-2 truncate">Pending</p>
            <h2 className="text-xl md:text-3xl font-black truncate">₱{(currentData.stats.pendingDeposits / 1000).toFixed(1)}k</h2>
            <p className="text-[9px] md:text-xs text-white/70 font-medium mt-1 md:mt-2 truncate">Awaiting confirm</p>
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="flex flex-col gap-4 md:gap-6 animate-slide-up">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            {/* Chart 1: Revenue Line Chart */}
            <div 
              onClick={() => setActiveModal('revenue')}
              className="col-span-1 md:col-span-2 bg-app-card p-5 md:p-8 rounded-3xl shadow-sm border border-border-soft flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6 md:mb-10">
                <h3 className="font-bold text-text-main group-hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base">
                  Revenue Overview
                  <svg className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </h3>
                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-text-muted">
                  <span className="flex items-center gap-1 text-primary"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></div> Actual</span>
                  <span className="flex items-center gap-1 text-primary"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border-2 border-primary"></div> Forecast</span>
                </div>
              </div>
              
              <div className="relative h-40 md:h-48 w-full mb-4 text-primary">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {actualDataPoints.length > 0 && <path d={pathActual} fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />}
                  {forecastLinePoints.length > 0 && <path d={pathForecast} fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" />}
                </svg>

                {currentData.chart.map((data, i) => {
                  const xPos = (i / (currentData.chart.length - 1)) * 100;
                  const yPos = (data.revenue / maxRevenue) * 90;
                  return (
                    <div key={`dot-${data.label}`} className="absolute w-5 h-5 md:w-6 md:h-6 -ml-2.5 -mb-2.5 md:-ml-3 md:-mb-3 group/dot z-10 flex items-center justify-center" style={{ left: `${xPos}%`, bottom: `${yPos}%` }}>
                      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 bg-app-card border-2 border-primary rounded-full group-hover/dot:scale-[1.6] group-hover/dot:bg-primary transition-all shadow-sm ${data.isForecast ? 'opacity-70' : ''}`} />
                      <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] md:text-xs py-1 px-2 md:py-1.5 md:px-3 rounded-lg opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20 font-bold">
                        ₱{data.revenue.toLocaleString()} {data.isForecast ? '(Est.)' : ''}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-main"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative w-full h-4 mt-1 md:mt-2">
                {currentData.chart.map((data, i) => {
                  const xPos = (i / (currentData.chart.length - 1)) * 100;
                  return (
                    <span key={`label-${data.label}`} className={`absolute text-[8px] md:text-[10px] font-bold -translate-x-1/2 whitespace-nowrap ${data.isForecast ? 'text-primary opacity-80' : 'text-text-muted'}`} style={{ left: `${xPos}%` }}>
                      {data.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Popular Categories */}
            <div 
              onClick={() => setActiveModal('categories')}
              className="bg-app-card p-5 md:p-8 rounded-3xl shadow-sm border border-border-soft flex flex-col cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-text-main mb-4 md:mb-6 group-hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base">
                Top Categories
                <svg className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </h3>
              <div className="flex-1 space-y-4 md:space-y-5">
                {POPULAR_CATEGORIES.slice(0,4).map(cat => (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-1.5 md:mb-2">
                      <span className="font-bold text-xs md:text-sm text-text-main truncate pr-2">{cat.name}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                        <span className="text-[10px] md:text-xs font-bold text-text-muted">{cat.count}</span>
                        <span className={`text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded font-bold ${cat.trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-red-50 text-red-600'}`}>
                          {cat.trend}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 md:h-1.5 w-full bg-app-bg rounded-full overflow-hidden border border-border-soft">
                      <div className="h-full bg-text-main rounded-full" style={{ width: `${(cat.count / 500) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Chart 3: Top Occasions */}
            <div 
              onClick={() => setActiveModal('occasions')}
              className="bg-app-card p-5 md:p-8 rounded-3xl shadow-sm border border-border-soft cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-text-main mb-4 md:mb-6 group-hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base">
                Rental Occasions
                <svg className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </h3>
              <div className="space-y-4 md:space-y-6">
                {TOP_OCCASIONS.map((item) => (
                  <div key={item.source}>
                    <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                      <span className="text-text-muted">{item.source}</span>
                      <span className="text-text-main">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 md:h-2 w-full bg-app-bg rounded-full overflow-hidden flex border border-border-soft">
                      <div className={`h-full ${item.colorClass} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Customer Demographics (Real Leaflet Map) */}
            <div 
              onClick={() => setActiveModal('heatmap')}
              className="bg-app-card p-5 md:p-8 rounded-3xl shadow-sm border border-border-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 relative overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="w-full md:w-1/2 z-10 pointer-events-none">
                <h3 className="font-bold text-text-main mb-1 md:mb-2 group-hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base">
                  Top Municipalities
                  <svg className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </h3>
                <p className="text-[10px] md:text-xs text-text-muted font-medium mb-4 md:mb-6">Batangas 1st District Heatmap</p>
                <div className="space-y-3 md:space-y-4">
                  {CUSTOMER_LOCATIONS.slice(0, 4).map((item) => (
                    <div key={item.location} className="flex items-center gap-2 md:gap-3">
                      <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary" style={{ opacity: Math.max(0.4, item.percentage / 45) }}></span>
                      <span className="text-xs md:text-sm font-bold text-text-main">{item.location}</span>
                      <span className="text-xs md:text-sm font-black ml-auto text-text-muted">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-1/2 h-62.5 md:h-full min-h-62.5 flex items-center justify-center relative pointer-events-none rounded-2xl overflow-hidden border border-border-soft group-hover:border-primary/30 transition-colors shadow-inner">
                 <BatangasHeatmap />
                 <div className="absolute inset-0 bg-transparent z-10"></div>
              </div>
            </div>

          </div>

          {/* Predictive Item Insights */}
          <div 
            onClick={() => setActiveModal('insights')}
            className="bg-app-card rounded-3xl md:rounded-4xl shadow-sm border border-border-soft overflow-hidden animate-slide-up mt-2 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="px-5 md:px-8 py-4 md:py-6 border-b border-border-soft flex justify-between items-center bg-app-bg/50 pointer-events-none">
              <div>
                <h3 className="font-bold text-text-main flex items-center gap-2 group-hover:text-primary transition-colors text-sm md:text-base">
                  Predictive Item Optimization
                  <svg className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span className="bg-primary/10 text-primary border border-primary/20 text-[8px] md:text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-black ml-1 md:ml-2">Automated</span>
                </h3>
                <p className="text-[10px] md:text-xs text-text-muted font-medium mt-1">Recommendations to maximize revenue.</p>
              </div>
            </div>
            
            <ResponsiveInsights 
              items={ITEM_INSIGHTS.slice(0, 2)} 
              isModal={false} 
              onAdjustClick={setManualAdjustItem} 
              onActionClick={handleActionClick} 
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          SHARED FULL-SCREEN MODALS
      ========================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setActiveModal(null)} />
          
          <div className={`relative bg-app-card border border-border-soft w-full ${activeModal === 'configureInsights' ? 'max-w-2xl' : 'max-w-5xl'} rounded-3xl sm:rounded-4xl overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl animate-scale-in z-10`}>
            
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 md:top-6 md:right-6 bg-app-bg/90 backdrop-blur-md p-2 md:p-3 rounded-full text-text-muted hover:bg-primary hover:text-white border border-border-soft transition-all z-20 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className={`flex flex-col h-full overflow-y-auto scrollbar-hide ${activeModal === 'configureInsights' ? 'p-5 sm:p-8 pt-12 md:pt-8' : 'p-4 sm:p-6 md:p-10 pt-12 md:pt-10'}`}>
              
              {/* MODAL: CONFIGURE INSIGHTS */}
              {activeModal === 'configureInsights' && (
                <div className="space-y-6 animate-fade-in pb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight pr-8">Configure Model</h2>
                    <p className="text-sm text-text-muted font-medium mt-1">Adjust the parameters for the real-time AI Insights.</p>
                  </div>
                  
                  {/* Forecast Adjustments */}
                  <div className="bg-app-bg p-5 rounded-2xl border border-border-soft">
                     <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        Demand Forecast Parameters
                     </h3>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 block">Projected Spike (%)</label>
                           <input 
                             type="number" 
                             value={tempInsights.spikePercent}
                             onChange={e => setTempInsights({...tempInsights, spikePercent: e.target.value})}
                             className="w-full bg-app-card border border-border-soft rounded-xl px-4 py-3 font-bold text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                           />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 block">Primary Category</label>
                              <select 
                                value={tempInsights.spikeCategory1}
                                onChange={e => setTempInsights({...tempInsights, spikeCategory1: e.target.value})}
                                className="w-full bg-app-card border border-border-soft rounded-xl px-4 py-3 font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                              >
                                {POPULAR_CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 block">Secondary Category</label>
                              <select 
                                value={tempInsights.spikeCategory2}
                                onChange={e => setTempInsights({...tempInsights, spikeCategory2: e.target.value})}
                                className="w-full bg-app-card border border-border-soft rounded-xl px-4 py-3 font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                              >
                                {POPULAR_CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                              </select>
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 block">Timeline Target</label>
                           <input 
                             type="text" 
                             value={tempInsights.spikeTimeline}
                             onChange={e => setTempInsights({...tempInsights, spikeTimeline: e.target.value})}
                             placeholder="e.g. June/July"
                             className="w-full bg-app-card border border-border-soft rounded-xl px-4 py-3 font-bold text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                           />
                        </div>
                     </div>
                  </div>

                  {/* Optimization Adjustments */}
                  <div className="bg-app-bg p-5 rounded-2xl border border-border-soft">
                     <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff9f0a]"></div>
                        Suggested Optimization Parameters
                     </h3>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 block">Proposed Discount (%)</label>
                           <input 
                             type="number" 
                             value={tempInsights.discountPercent}
                             onChange={e => setTempInsights({...tempInsights, discountPercent: e.target.value})}
                             className="w-full bg-app-card border border-border-soft rounded-xl px-4 py-3 font-bold text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                           />
                        </div>
                        
                        <div>
                           <label className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 block">Target Category</label>
                           <select 
                             value={tempInsights.discountCategory}
                             onChange={e => setTempInsights({...tempInsights, discountCategory: e.target.value})}
                             className="w-full bg-app-card border border-border-soft rounded-xl px-4 py-3 font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                           >
                             {POPULAR_CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                     <button onClick={() => setActiveModal(null)} className="w-full sm:flex-1 py-3.5 bg-app-bg border border-transparent hover:border-border-soft text-text-muted font-bold rounded-xl transition-colors">Discard</button>
                     <button onClick={saveInsightsConfig} className="w-full sm:flex-2 py-3.5 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-colors shadow-lg active:scale-95">Save Configuration</button>
                  </div>

                </div>
              )}

              {/* MODAL 1: REVENUE DETAILS */}
              {activeModal === 'revenue' && (
                <div className="space-y-6 md:space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-text-main tracking-tight pr-8">Comprehensive Revenue</h2>
                    <p className="text-xs md:text-sm text-text-muted font-medium mt-1 md:mt-2">Historical financial data for <span className="font-bold">{timeRange}</span>.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                     <div className="bg-app-bg p-4 md:p-5 rounded-2xl border border-border-soft">
                        <p className="text-[9px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mb-1 truncate">Total Revenue</p>
                        <p className="text-lg md:text-2xl font-black text-text-main truncate">₱{currentData.stats.totalRevenue.toLocaleString()}</p>
                     </div>
                     <div className="bg-app-bg p-4 md:p-5 rounded-2xl border border-border-soft">
                        <p className="text-[9px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mb-1 truncate">Total Rentals</p>
                        <p className="text-lg md:text-2xl font-black text-text-main truncate">{currentData.stats.completedRentals.toLocaleString()}</p>
                     </div>
                     <div className="bg-primary/10 p-4 md:p-5 rounded-2xl border border-primary/20">
                        <p className="text-[9px] md:text-[10px] text-primary font-black uppercase tracking-widest mb-1 truncate">Forecast Peak</p>
                        <p className="text-lg md:text-2xl font-black text-primary truncate">₱{maxRevenue.toLocaleString()}</p>
                     </div>
                     <div className="bg-success/10 p-4 md:p-5 rounded-2xl border border-success/20">
                        <p className="text-[9px] md:text-[10px] text-success font-black uppercase tracking-widest mb-1 truncate">Growth</p>
                        <p className="text-lg md:text-2xl font-black text-success truncate">+{currentData.stats.monthlyGrowth}%</p>
                     </div>
                  </div>

                  <div className="bg-app-bg border border-border-soft rounded-2xl md:rounded-3xl overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-125">
                      <thead>
                        <tr className="border-b border-border-soft bg-app-card">
                          <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-text-muted tracking-widest">Period</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-text-muted tracking-widest">Rentals</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-text-muted tracking-widest">Revenue</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase text-text-muted tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft">
                        {currentData.chart.map((data, idx) => (
                          <tr key={idx} className="hover:bg-app-card transition-colors text-xs md:text-sm">
                            <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-text-main">{data.label}</td>
                            <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-text-muted">{data.rentals}</td>
                            <td className="px-4 md:px-6 py-3 md:py-4 font-black text-text-main">₱{data.revenue.toLocaleString()}</td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                               <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${data.isForecast ? 'bg-primary/10 text-primary border-primary/20' : 'bg-app-card text-text-muted border-border-soft'}`}>
                                 {data.isForecast ? 'Forecast' : 'Actual'}
                               </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODAL 2: TOP CATEGORIES */}
              {activeModal === 'categories' && (
                <div className="space-y-6 md:space-y-8 animate-fade-in flex flex-col h-full">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-text-main tracking-tight pr-8">Catalog Performance</h2>
                    <p className="text-xs md:text-sm text-text-muted font-medium mt-1 md:mt-2">Breakdown of the most popular rental categories.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 grow">
                    {POPULAR_CATEGORIES.map(cat => (
                      <div key={cat.name} className="bg-app-bg p-4 md:p-6 rounded-[20px] md:rounded-3xl border border-border-soft flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-4 md:mb-6">
                            <div>
                               <h3 className="text-base md:text-xl font-black text-text-main tracking-tight">{cat.name}</h3>
                               <p className="text-xs md:text-sm font-bold text-text-muted mt-1">{cat.count} rentals</p>
                            </div>
                            <span className={`text-[10px] md:text-xs px-2 md:px-2.5 py-1 rounded-lg font-black border tracking-wider ${cat.trend.startsWith('+') ? 'bg-success/10 text-success border-success/20' : 'bg-red-50 text-red-600 border-red-100'}`}>
                              {cat.trend} MoM
                            </span>
                         </div>
                         <div className="h-1.5 md:h-2 w-full bg-app-card rounded-full overflow-hidden border border-border-soft">
                           <div className="h-full bg-text-main rounded-full" style={{ width: `${(cat.count / 500) * 100}%` }} />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODAL 3: OCCASIONS */}
              {activeModal === 'occasions' && (
                <div className="space-y-6 md:space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-text-main tracking-tight pr-8">Demand by Occasion</h2>
                    <p className="text-xs md:text-sm text-text-muted font-medium mt-1 md:mt-2">What events are driving your business?</p>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    {TOP_OCCASIONS.map((item) => (
                      <div key={item.source} className="bg-app-bg p-4 md:p-6 rounded-[20px] md:rounded-3xl border border-border-soft">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <span className="text-sm md:text-lg font-black text-text-main">{item.source}</span>
                          <span className="text-xl md:text-2xl font-black text-primary">{item.percentage}%</span>
                        </div>
                        <div className="h-2 md:h-3 w-full bg-app-card rounded-full overflow-hidden flex border border-border-soft">
                          <div className={`h-full ${item.colorClass} rounded-full`} style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODAL 4: FULL LEAFLET HEATMAP */}
              {activeModal === 'heatmap' && (
                <div className="space-y-6 md:space-y-8 animate-fade-in flex flex-col min-h-full">
                  <div className="shrink-0">
                    <h2 className="text-xl md:text-3xl font-black text-text-main tracking-tight pr-8">Geographic Distribution</h2>
                    <p className="text-xs md:text-sm text-text-muted font-medium mt-1 md:mt-2">Customer municipalities in 1st District Batangas.</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 min-h-0 pb-6 md:pb-0">
                     <div className="w-full md:w-2/3 h-[300px] md:h-full md:min-h-[500px] bg-app-bg rounded-[20px] md:rounded-4xl border border-border-soft relative overflow-hidden shadow-inner shrink-0 md:shrink md:order-2">
                        <BatangasHeatmap />
                     </div>
                     <div className="w-full md:w-1/3 space-y-2 md:space-y-3 overflow-y-auto scrollbar-hide pr-1 md:pr-2 md:order-1">
                       {CUSTOMER_LOCATIONS.map((item) => (
                         <div key={item.location} className="bg-app-bg p-3 md:p-5 rounded-xl md:rounded-2xl border border-border-soft flex items-center gap-3 md:gap-4 shrink-0">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                             <span className="text-primary font-black text-[10px] md:text-xs">{item.percentage}%</span>
                           </div>
                           <span className="text-sm md:text-base font-bold text-text-main grow">{item.location}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              )}

              {/* MODAL 5: PREDICTIVE INSIGHTS */}
              {activeModal === 'insights' && (
                <div className="space-y-6 md:space-y-8 animate-fade-in flex flex-col h-full">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-text-main tracking-tight flex items-center gap-2 md:gap-3 flex-wrap pr-8">
                      Automated Insights
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[8px] md:text-[10px] px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-widest font-black shrink-0">AI Generated</span>
                    </h2>
                    <p className="text-xs md:text-sm text-text-muted font-medium mt-1 md:mt-2">Item-level recommendations.</p>
                  </div>

                  <div className="bg-app-bg border border-border-soft rounded-2xl md:rounded-3xl overflow-hidden grow flex flex-col">
                    <ResponsiveInsights 
                      items={ITEM_INSIGHTS} 
                      isModal={true} 
                      onAdjustClick={setManualAdjustItem} 
                      onActionClick={handleActionClick} 
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Manual Price Adjustment Focus Modal */}
      {manualAdjustItem && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setManualAdjustItem(null)}>
           <div className="bg-app-card p-6 md:p-8 rounded-3xl md:rounded-4xl w-full max-w-md shadow-2xl animate-scale-in border border-border-soft" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg md:text-xl font-black text-text-main tracking-tight">Manual Adjustment</h3>
                <div className="bg-app-bg border border-border-soft text-text-muted text-[9px] md:text-[10px] font-black uppercase px-2 py-1 rounded-md">{manualAdjustItem.id}</div>
              </div>
              <p className="text-xs md:text-sm text-text-muted font-medium mb-5 md:mb-6">Set a new base rate for <span className="font-bold text-text-main">{manualAdjustItem.name}</span>.</p>
              
              <div className="mb-6 relative">
                 <label className="text-[9px] md:text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 md:mb-2 block">New Base Rate</label>
                 <span className="absolute left-4 bottom-3 md:bottom-3.25 text-text-main font-black">₱</span>
                 <input 
                   type="number" 
                   placeholder="e.g. 2500" 
                   className="w-full bg-app-bg border border-border-soft rounded-xl pl-8 pr-4 py-3 font-bold text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/50 text-sm md:text-base" 
                 />
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                 <button onClick={() => setManualAdjustItem(null)} className="w-full sm:flex-1 py-3.5 bg-app-bg border border-transparent hover:border-border-soft text-text-muted font-bold rounded-xl transition-colors text-sm">Cancel</button>
                 <button 
                   onClick={(e) => { 
                     setManualAdjustItem(null); 
                     handleActionClick(`Updated Pricing for ${manualAdjustItem.id}`, e); 
                   }} 
                   className="w-full sm:flex-2 py-3.5 bg-text-main text-white font-black rounded-xl hover:bg-black transition-colors shadow-lg active:scale-95 text-sm"
                 >
                   Confirm Update
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}