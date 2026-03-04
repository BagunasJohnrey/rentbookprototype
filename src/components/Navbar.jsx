export default function Navbar({ role, setRole, isOffline, setIsOffline }) {
  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="font-bold text-xl flex items-center gap-2">
        📘 RentBook
        <span className="text-xs bg-blue-700 px-2 py-1 rounded-full uppercase">{role}</span>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={isOffline} 
            onChange={(e) => setIsOffline(e.target.checked)} 
            className="accent-red-500 w-4 h-4"
          />
          {isOffline ? '⚠️ Offline Mode' : '🟢 Online'}
        </label>
        <button onClick={() => setRole(null)} className="text-sm underline hover:text-blue-200 cursor-pointer">Logout</button>
      </div>
    </nav>
  );
}