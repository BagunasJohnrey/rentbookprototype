export default function Login({ setRole }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">📘 RentBook</h1>
        <p className="text-gray-500 mb-8 text-sm">Smart Rental Management</p>
        <div className="space-y-4">
          <button 
            onClick={() => setRole('staff')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            Login as Staff
          </button>
          <button 
            onClick={() => setRole('admin')}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}