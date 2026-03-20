// src/pages/AdminReports.jsx
import React, { useState } from 'react';
import AdminBottomNav from '../components/AdminBottomNav';

// ==========================================
// MOCK DATA
// ==========================================
const REVENUE_STATS = {
  totalRevenue: 845250,
  monthlyGrowth: 14.2,
  pendingDeposits: 52000,
  completedRentals: 1432,
  activeUsers: 892,
  userGrowth: 8.5,
};

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 45000, isForecast: false },
  { month: 'Feb', revenue: 52000, isForecast: false },
  { month: 'Mar', revenue: 48000, isForecast: false },
  { month: 'Apr', revenue: 61000, isForecast: false },
  { month: 'May', revenue: 59000, isForecast: false },
  { month: 'Jun', revenue: 75000, isForecast: true }, // Forecast
  { month: 'Jul', revenue: 88000, isForecast: true }, // Forecast
];

const POPULAR_CATEGORIES = [
  { name: 'Formal Suits', count: 420, trend: '+12%' },
  { name: 'Wedding Gowns', count: 315, trend: '+18%' },
  { name: 'Party Dresses', count: 250, trend: '-2%' },
  { name: 'Accessories', count: 180, trend: '+5%' },
];

// REPLACED: Traffic Sources -> Top Rental Occasions
const TOP_OCCASIONS = [
  { source: 'Weddings', percentage: 45, color: 'bg-[#111010]' },
  { source: 'Debuts & Proms', percentage: 35, color: 'bg-[#bf4a53]' },
  { source: 'Corporate/Formal Events', percentage: 15, color: 'bg-gray-400' },
  { source: 'Photo Shoots', percentage: 5, color: 'bg-gray-200' },
];

// REPLACED: Device Usage -> Customer Municipalities
const CUSTOMER_LOCATIONS = [
  { location: 'Balayan', percentage: 65, color: '#111010' },
  { location: 'Tuy', percentage: 20, color: '#bf4a53' },
  { location: 'Calaca & Others', percentage: 15, color: '#9ca3af' },
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
    actionText: "Adjust Pricing"
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

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('This Year');
  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue));

  // Helper string for the CSS doughnut chart
  const conicGradientStr = `conic-gradient(
    ${CUSTOMER_LOCATIONS[0].color} 0% ${CUSTOMER_LOCATIONS[0].percentage}%, 
    ${CUSTOMER_LOCATIONS[1].color} ${CUSTOMER_LOCATIONS[0].percentage}% ${CUSTOMER_LOCATIONS[0].percentage + CUSTOMER_LOCATIONS[1].percentage}%, 
    ${CUSTOMER_LOCATIONS[2].color} ${CUSTOMER_LOCATIONS[0].percentage + CUSTOMER_LOCATIONS[1].percentage}% 100%
  )`;

  const historicalData = MONTHLY_DATA.slice(0, 5); 
  const forecastData = MONTHLY_DATA.slice(4);

  return (
    <div className="flex flex-col min-h-screen md:h-screen relative bg-app-bg">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full scrollbar-hide">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
          <div>
            <p className="text-[10px] font-black text-[#bf4a53] uppercase tracking-[0.25em] mb-2 opacity-80">
            Business Reports
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-[#111010] tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Track your store's revenue, rentals, and user demographics.
            </p>
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-[#bf4a53] cursor-pointer"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>

        {/* Executive Insights & Forecasting Recommendation Card */}
        <div className="mb-8 bg-gradient-to-br from-[#111010] to-[#1a1a1a] rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden border border-gray-800 animate-slide-up">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-black text-xl md:text-2xl tracking-tight flex items-center gap-3">
                  Executive Insights
                  <span className="bg-purple-600/20 border border-purple-500/30 text-purple-300 text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-widest font-black backdrop-blur-sm">Live Model</span>
                </h3>
                <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">Real-time predictive analytics based on current market trends.</p>
              </div>
            </div>
            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Updated 2m ago</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {/* Forecast Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse"></div>
                <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Demand Forecast</h4>
              </div>
              <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                Projected <span className="text-[#34c759] font-bold">+22% spike</span> in demand for <span className="text-white font-bold">Wedding Gowns</span> and <span className="text-white font-bold">Formal Suits</span> in June/July. Ensure inventory is fully maintained and ready.
              </p>
            </div>

            {/* Recommendation Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#ff9f0a]"></div>
                  <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Suggested Optimization</h4>
                </div>
                <p className="text-white text-sm md:text-base font-medium leading-relaxed mb-5">
                  Apply a <span className="text-[#ff9f0a] font-bold">10% promotional discount</span> on underperforming 'Party Dresses' to boost utilization during the off-season.
                </p>
              </div>
              <button className="w-full md:w-auto bg-white text-[#111010] py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors active:scale-95 shadow-lg">
                Apply Promo Automatically
              </button>
            </div>
          </div>
        </div>

        {/* Top KPI Cards (Desktop & Mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 animate-slide-up">
          <div className="bg-white p-5 md:p-6 rounded-[24px] shadow-sm border border-gray-100">
            <p className="text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-wider mb-2">Total Revenue</p>
            <h2 className="text-2xl md:text-3xl font-black text-[#111010]">₱{REVENUE_STATS.totalRevenue.toLocaleString()}</h2>
            <p className="text-[10px] md:text-xs text-green-500 font-bold mt-2">↑ {REVENUE_STATS.monthlyGrowth}%</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-[24px] shadow-sm border border-gray-100">
            <p className="text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-wider mb-2">Rentals</p>
            <h2 className="text-2xl md:text-3xl font-black text-[#111010]">{REVENUE_STATS.completedRentals.toLocaleString()}</h2>
            <p className="text-[10px] md:text-xs text-green-500 font-bold mt-2">↑ 12.4%</p>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-[24px] shadow-sm border border-gray-100 hidden md:block">
            <p className="text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-wider mb-2">Active Users</p>
            <h2 className="text-2xl md:text-3xl font-black text-[#111010]">{REVENUE_STATS.activeUsers}</h2>
            <p className="text-[10px] md:text-xs text-green-500 font-bold mt-2">↑ {REVENUE_STATS.userGrowth}%</p>
          </div>
          <div className="bg-[#111010] text-white p-5 md:p-6 rounded-[24px] shadow-sm hidden md:block">
            <p className="text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-wider mb-2">Pending Deposits</p>
            <h2 className="text-2xl md:text-3xl font-black">₱{REVENUE_STATS.pendingDeposits.toLocaleString()}</h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-2">Awaiting confirmation</p>
          </div>
        </div>

        {/* ==========================================
            CHARTS GRID
        ========================================== */}
        <div className="flex flex-col gap-6 animate-slide-up">
          
          {/* Row 1: Revenue & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chart 1: Revenue Line Chart with Forecasting */}
            <div className="col-span-1 md:col-span-2 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
              
              <div className="flex justify-between items-start mb-8 md:mb-10">
                <h3 className="font-bold text-gray-800">Revenue Overview</h3>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#bf4a53]"></div> Actual</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border-2 border-[#bf4a53]"></div> Forecast</span>
                </div>
              </div>
              
              <div className="relative h-48 w-full mb-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bf4a53" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#bf4a53" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Historical Solid Line */}
                  <path 
                    d={historicalData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (MONTHLY_DATA.length - 1)) * 100} ${100 - (d.revenue / maxRevenue) * 90}`).join(' ')}
                    fill="none" stroke="#bf4a53" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
                  />
                  
                  {/* Forecast Dashed Line */}
                  <path 
                    d={forecastData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${((i + 4) / (MONTHLY_DATA.length - 1)) * 100} ${100 - (d.revenue / maxRevenue) * 90}`).join(' ')}
                    fill="none" stroke="#bf4a53" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5"
                  />
                </svg>

                {/* Interactive Overlay for Dots & Tooltips */}
                {MONTHLY_DATA.map((data, i) => {
                  const xPos = (i / (MONTHLY_DATA.length - 1)) * 100;
                  const yPos = (data.revenue / maxRevenue) * 90;
                  
                  return (
                    <div 
                      key={`dot-${data.month}`} 
                      className="absolute w-6 h-6 -ml-3 -mb-3 group cursor-pointer z-10 flex items-center justify-center"
                      style={{ left: `${xPos}%`, bottom: `${yPos}%` }}
                    >
                      <div className={`w-2.5 h-2.5 bg-white border-2 border-[#bf4a53] rounded-full group-hover:scale-[1.6] group-hover:bg-[#bf4a53] transition-all shadow-sm ${data.isForecast ? 'opacity-70' : ''}`} />
                      
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#111010] text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                        ₱{data.revenue.toLocaleString()} {data.isForecast ? '(Est.)' : ''}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111010]"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative w-full h-4 mt-2">
                {MONTHLY_DATA.map((data, i) => {
                  const xPos = (i / (MONTHLY_DATA.length - 1)) * 100;
                  return (
                    <span 
                      key={`label-${data.month}`} 
                      className={`absolute text-[10px] md:text-xs font-bold -translate-x-1/2 whitespace-nowrap ${data.isForecast ? 'text-purple-400' : 'text-gray-400'}`}
                      style={{ left: `${xPos}%` }}
                    >
                      {data.month}
                    </span>
                  );
                })}
              </div>

            </div>

            {/* Chart 2: Popular Categories List Chart */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-gray-800 mb-6">Top Categories</h3>
              <div className="flex-1 space-y-5">
                {POPULAR_CATEGORIES.map(cat => (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-700">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">{cat.count}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${cat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {cat.trend}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#111010] rounded-full" 
                        style={{ width: `${(cat.count / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 2: Occasions & Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 3: Top Occasions (Horizontal Bars) */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6">Rental Occasions</h3>
              <div className="space-y-6">
                {TOP_OCCASIONS.map((item) => (
                  <div key={item.source}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-600">{item.source}</span>
                      <span className="text-[#111010]">{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full ${item.color} rounded-full`} 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Customer Demographics (CSS Doughnut Chart) */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              <div className="w-full md:w-1/2">
                <h3 className="font-bold text-gray-800 mb-2">Top Municipalities</h3>
                <p className="text-xs text-gray-400 font-medium mb-6">Where your customers are located.</p>
                <div className="space-y-4">
                  {CUSTOMER_LOCATIONS.map((item) => (
                    <div key={item.location} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-sm font-bold text-gray-700">{item.location}</span>
                      <span className="text-sm font-black ml-auto">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Doughnut Graphic */}
              <div className="w-48 h-48 rounded-full relative flex items-center justify-center shadow-inner" style={{ background: conicGradientStr }}>
                <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-black text-[#111010]">{CUSTOMER_LOCATIONS[0].percentage}%</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{CUSTOMER_LOCATIONS[0].location}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Predictive Item Insights */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-slide-up mt-2">
            <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  Predictive Item Optimization
                  <span className="bg-purple-100 text-purple-600 text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-black">Automated</span>
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Specific recommendations to maximize revenue per asset.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Inventory Item</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Est. Utilization</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Recommendation</th>
                    <th className="px-6 md:px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ITEM_INSIGHTS.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 md:px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100" alt={item.name} />
                          <div>
                            <span className="font-bold text-sm text-gray-800 block leading-tight">{item.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.id}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[120px]">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-bold text-gray-700">{item.utilization}%</span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 ${
                              item.trend === 'up' ? 'text-green-600 bg-green-50' : 
                              item.trend === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100'
                            }`}>
                              {item.trend === 'up' ? '↑ ' : item.trend === 'down' ? '↓ ' : '− '}{item.demand}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.utilization > 80 ? 'bg-[#34c759]' : item.utilization > 40 ? 'bg-[#ff9f0a]' : 'bg-[#bf4a53]'}`} 
                              style={{ width: `${item.utilization}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 font-medium max-w-[250px] leading-relaxed">
                          {item.recommendation}
                        </p>
                      </td>
                      
                      <td className="px-6 md:px-8 py-4 text-right">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-[#111010] text-[10px] font-black uppercase tracking-wider rounded-xl hover:border-[#111010] hover:bg-gray-50 transition-all shadow-sm active:scale-95 whitespace-nowrap">
                          {item.actionText}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
      <AdminBottomNav />
    </div>
  );
}