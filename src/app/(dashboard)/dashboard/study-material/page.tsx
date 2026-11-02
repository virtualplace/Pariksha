const materials = [
  { title: "Indian Polity - Complete Notes", type: "PDF", size: "4.2 MB", subject: "Polity", icon: "📄" },
  { title: "Modern History - Spectrum Summary", type: "PDF", size: "6.1 MB", subject: "History", icon: "📄" },
  { title: "Indian Economy - Ramesh Singh Notes", type: "PDF", size: "5.8 MB", subject: "Economy", icon: "📄" },
  { title: "Geography - NCERT Compilation", type: "PDF", size: "8.3 MB", subject: "Geography", icon: "📄" },
  { title: "Environment & Ecology Notes", type: "PDF", size: "3.1 MB", subject: "Environment", icon: "📄" },
  { title: "Science & Technology Updates 2024", type: "PDF", size: "2.4 MB", subject: "Science", icon: "📄" },
];

const subjects = ["All", "Polity", "History", "Economy", "Geography", "Environment", "Science"];

export default function StudyMaterialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A1628] mb-6">Study Material</h1>

      <div className="flex gap-2 flex-wrap mb-6">
        {subjects.map((s) => (
          <button
            key={s}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${s === "All" ? "bg-[#F5A623] text-[#0A1628]" : "bg-gray-100 text-gray-600 hover:bg-[#F5A623]/20"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map((m) => (
          <div key={m.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5A623]/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#0A1628] text-sm truncate">{m.title}</h3>
              <div className="flex gap-3 mt-1">
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{m.subject}</span>
                <span className="text-gray-400 text-xs">{m.type} · {m.size}</span>
              </div>
            </div>
            <button className="bg-[#0A1628] text-white text-xs px-4 py-2 rounded-full font-semibold hover:bg-[#0A1628]/80 transition-colors flex-shrink-0">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
