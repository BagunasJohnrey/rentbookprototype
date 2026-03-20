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
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 59000 },
  { month: 'Jun', revenue: 75000 },
  { month: 'Jul', revenue: 88000 },
];

const POPULAR_CATEGORIES = [
  { name: 'Formal Suits', count: 420, trend: '+12%' },
  { name: 'Wedding Gowns', count: 315, trend: '+18%' },
  { name: 'Party Dresses', count: 250, trend: '-2%' },
  { name: 'Accessories', count: 180, trend: '+5%' },
];

const TRAFFIC_SOURCES = [
  { source: 'Organic Search', percentage: 45, color: 'bg-[#111010]' },
  { source: 'Social Media', percentage: 35, color: 'bg-[#bf4a53]' },
  { source: 'Direct', percentage: 15, color: 'bg-gray-400' },
  { source: 'Referral', percentage: 5, color: 'bg-gray-200' },
];

const DEVICE_USAGE = [
  { device: 'Mobile', percentage: 65, color: '#111010' },
  { device: 'Desktop', percentage: 30, color: '#bf4a53' },
  { device: 'Tablet', percentage: 5, color: '#9ca3af' },
];

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('This Year');
  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue));

  // Helper string for the CSS doughnut chart
  const conicGradientStr = `conic-gradient(
    ${DEVICE_USAGE[0].color} 0% ${DEVICE_USAGE[0].percentage}%, 
    ${DEVICE_USAGE[1].color} ${DEVICE_USAGE[0].percentage}% ${DEVICE_USAGE[0].percentage + DEVICE_USAGE[1].percentage}%, 
    ${DEVICE_USAGE[2].color} ${DEVICE_USAGE[0].percentage + DEVICE_USAGE[1].percentage}% 100%
  )`;

  return (
    // Changed here: min-h-screen for mobile, md:h-screen for desktop
    <div className="flex flex-col min-h-screen md:h-screen relative bg-app-bg">
      <div className="grow overflow-y-auto px-4 md:px-12 pt-8 md:pt-12 pb-28 md:pb-12 md:max-w-[1400px] md:mx-auto md:w-full">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-2 opacity-80">
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
            
            {/* Chart 1: Revenue Line Chart */}
            <div className="col-span-1 md:col-span-2 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
              <h3 className="font-bold text-gray-800 mb-8 md:mb-10">Revenue Overview</h3>
              
              <div className="relative h-48 w-full mb-4">
                {/* SVG Line & Area Background */}
                <svg 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none" 
                  className="absolute inset-0 w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bf4a53" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#bf4a53" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area Fill */}
                  <path 
                    d={`${MONTHLY_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (MONTHLY_DATA.length - 1)) * 100} ${100 - (d.revenue / maxRevenue) * 90}`).join(' ')} L 100 100 L 0 100 Z`}
                    fill="url(#lineGrad)"
                  />
                  
                  {/* Line Stroke */}
                  <path 
                    d={MONTHLY_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / (MONTHLY_DATA.length - 1)) * 100} ${100 - (d.revenue / maxRevenue) * 90}`).join(' ')}
                    fill="none"
                    stroke="#bf4a53"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                      {/* The Dot */}
                      <div className="w-2.5 h-2.5 bg-white border-2 border-[#bf4a53] rounded-full group-hover:scale-[1.6] group-hover:bg-[#bf4a53] transition-all shadow-sm" />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#111010] text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                        ₱{data.revenue.toLocaleString()}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111010]"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="relative w-full h-4 mt-2">
                {MONTHLY_DATA.map((data, i) => {
                  const xPos = (i / (MONTHLY_DATA.length - 1)) * 100;
                  return (
                    <span 
                      key={`label-${data.month}`} 
                      className="absolute text-[10px] md:text-xs font-bold text-gray-400 -translate-x-1/2 whitespace-nowrap"
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

          {/* Row 2: Traffic & Devices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 3: Traffic Sources (Horizontal Bars) */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6">Traffic Sources</h3>
              <div className="space-y-6">
                {TRAFFIC_SOURCES.map((source) => (
                  <div key={source.source}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-600">{source.source}</span>
                      <span className="text-[#111010]">{source.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full ${source.color} rounded-full`} 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Device Usage (CSS Doughnut Chart) */}
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              <div className="w-full md:w-1/2">
                <h3 className="font-bold text-gray-800 mb-2">Device Usage</h3>
                <p className="text-xs text-gray-400 font-medium mb-6">Where your users are shopping from.</p>
                <div className="space-y-4">
                  {DEVICE_USAGE.map((item) => (
                    <div key={item.device} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-sm font-bold text-gray-700">{item.device}</span>
                      <span className="text-sm font-black ml-auto">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Doughnut Graphic */}
              <div className="w-48 h-48 rounded-full relative flex items-center justify-center shadow-inner" style={{ background: conicGradientStr }}>
                <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-2xl font-black text-[#111010]">{DEVICE_USAGE[0].percentage}%</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      <AdminBottomNav />
    </div>
  );
}