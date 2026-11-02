const results = [
  { name: "GS Paper I Mock Test 5", date: "Jan 14, 2025", score: 78, total: 100, category: "Prelims" },
  { name: "CSAT Practice Test 3", date: "Jan 12, 2025", score: 65, total: 80, category: "Prelims" },
  { name: "Current Affairs Quiz", date: "Jan 10, 2025", score: 18, total: 25, category: "Current Affairs" },
  { name: "Indian Polity Test", date: "Jan 8, 2025", score: 42, total: 50, category: "GS" },
  { name: "GS Paper I Mock Test 4", date: "Jan 5, 2025", score: 71, total: 100, category: "Prelims" },
];

export default function ResultsPage() {
  const avg = Math.round(results.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / results.length);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A1628] mb-6">My Results</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Tests Taken", value: results.length },
          { label: "Average Score", value: `${avg}%` },
          { label: "Best Score", value: `${Math.max(...results.map((r) => Math.round((r.score / r.total) * 100)))}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-[#F5A623]">{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Test Name", "Category", "Date", "Score", "Percentage"].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <tr key={r.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#0A1628]">{r.name}</td>
                  <td className="px-6 py-4"><span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-2 py-1 rounded-full">{r.category}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#0A1628]">{r.score}/{r.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div className="bg-[#F5A623] h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-[#0A1628]">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
