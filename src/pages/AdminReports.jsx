import AdminBottomNav from '../components/AdminBottomNav';

export default function AdminReports() {
  // FIX: Removed unused 'navigate' and 'useNavigate'

  // Mock Bar Chart Data
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const vals = [3, 5, 8, 14, 10, 6];
  const max = Math.max(...vals);

  return (
    <div className="flex flex-col h-full bg-app-bg relative">
      <div className="grow overflow-y-auto px-6 pt-12 pb-28">
        
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <h1 className="text-[32px] font-extrabold text-text-main tracking-tight">Reports</h1>
          <p className="text-sm font-medium text-text-muted mt-1">AI-powered insights & analytics</p>
        </div>

        {/* Predictive Insight Card */}
        {/* FIX: rounded-[24px] -> rounded-3xl */}
        <div className="bg-linear-to-br from-primary to-primary-light rounded-3xl p-6 text-white mb-5 shadow-[0_12px_24px_rgba(191,74,83,0.3)] animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-[13px] font-bold opacity-80 uppercase tracking-[0.5px] mb-2">🔮 Predictive Analytics</h3>
          <div className="text-[28px] font-extrabold mb-1">+50% April</div>
          <p className="text-sm opacity-90 font-medium">Wedding season peak projected. Stock up on gowns before March 25.</p>
        </div>

        {/* Metrics Grid */}
        <div className="text-lg font-bold text-text-main mb-3.5 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>This Month</div>
        <div className="grid grid-cols-2 gap-3.5 mb-6 animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
          <div className="bg-app-card rounded-[20px] p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="text-[24px] font-extrabold text-text-main mb-1">₱38.5k</div>
            <div className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.4px]">Revenue</div>
            <div className="text-[12px] font-bold text-success mt-1.5">↑ 12% vs last month</div>
          </div>
          <div className="bg-app-card rounded-[20px] p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="text-[24px] font-extrabold text-text-main mb-1">8</div>
            <div className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.4px]">Transactions</div>
            <div className="text-[12px] font-bold text-success mt-1.5">↑ 3 from last month</div>
          </div>
          <div className="bg-app-card rounded-[20px] p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="text-[24px] font-extrabold text-text-main mb-1">2</div>
            <div className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.4px]">Overdue</div>
            <div className="text-[12px] font-bold text-[#ff3b30] mt-1.5">↑ 1 from last month</div>
          </div>
          <div className="bg-app-card rounded-[20px] p-4.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="text-[24px] font-extrabold text-text-main mb-1">75%</div>
            <div className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.4px]">Return Rate</div>
            <div className="text-[12px] font-bold text-success mt-1.5">↑ 5% from last month</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-app-card rounded-[22px] p-5 mb-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-[15px] font-bold text-text-main mb-4.5">Monthly Rentals (2026)</h3>
          {/* FIX: h-[100px] -> h-25 */}
          <div className="flex gap-2 items-end h-25">
            {months.map((m, i) => {
              const pct = Math.round((vals[i] / max) * 100);
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                  {/* FIX: ease-[cubic-bezier(0.4,0,0.2,1)] -> ease-in-out */}
                  <div 
                    className="w-full bg-linear-to-b from-primary-light to-primary rounded-t-lg transition-all duration-700 ease-in-out" 
                    style={{ height: `${pct}%` }}
                  ></div>
                  <div className="text-[9px] font-bold text-text-muted text-center">{m}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Retire Alerts */}
        <div className="text-lg font-bold text-text-main mb-3.5 animate-fade-in-down" style={{ animationDelay: '0.5s' }}>💡 Prescriptive Alerts</div>
        <div className="flex flex-col gap-2.5 animate-fade-in-down" style={{ animationDelay: '0.6s' }}>
          
          <div className="bg-app-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-l-4 border-[#ff9f0a]">
            <img src="https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=100&q=80" alt="Item" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="grow">
              <div className="text-[14px] font-bold text-text-main mb-1">Burgundy Velvet Gown</div>
              <div className="text-[12px] font-semibold text-[#ff9f0a]">Apply 20% discount — Idle &gt; 3 months</div>
            </div>
          </div>
          
          <div className="bg-app-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-l-4 border-[#ff9f0a]">
            <img src="https://images.unsplash.com/photo-1611695434398-4f4b330623e0?w=100&q=80" alt="Item" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="grow">
              <div className="text-[14px] font-bold text-text-main mb-1">Navy Blue Suit</div>
              <div className="text-[12px] font-semibold text-[#ff9f0a]">Consider retiring — Low demand season</div>
            </div>
          </div>

        </div>

      </div>
      <AdminBottomNav />
    </div>
  );
}