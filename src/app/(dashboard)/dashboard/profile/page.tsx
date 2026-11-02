export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A1628] mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 bg-[#F5A623]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="font-bold text-[#0A1628] text-lg">Aspirant Name</h2>
          <p className="text-gray-500 text-sm mt-1">aspirant@example.com</p>
          <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-3 py-1 rounded-full mt-3 inline-block">Active Student</span>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#0A1628] mb-5">Personal Information</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                <input type="text" defaultValue="Aspirant Name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Phone</label>
                <input type="tel" defaultValue="+91 XXXXX XXXXX" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <input type="email" defaultValue="aspirant@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">UPSC Attempt Year</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]">
                <option>2025</option>
                <option>2026</option>
                <option>2027</option>
              </select>
            </div>
            <button type="submit" className="bg-[#F5A623] text-[#0A1628] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#D4891A] transition-colors">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
