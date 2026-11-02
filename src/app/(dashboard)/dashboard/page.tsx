import Link from "next/link";

const stats = [
  { label: "Courses Enrolled", value: "3", icon: "📚" },
  { label: "Tests Attempted", value: "24", icon: "📝" },
  { label: "Average Score", value: "72%", icon: "📊" },
  { label: "Study Streak", value: "12 days", icon: "🔥" },
];

const recentTests = [
  { name: "GS Paper I Mock Test 5", date: "Jan 14, 2025", score: "78/100", status: "Completed" },
  { name: "CSAT Practice Test 3", date: "Jan 12, 2025", score: "65/80", status: "Completed" },
  { name: "Current Affairs Quiz", date: "Jan 10, 2025", score: "18/25", status: "Completed" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628]">Welcome back, Aspirant! 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s your preparation overview.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold text-[#0A1628]">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A1628] mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {recentTests.map((test) => (
              <div key={test.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-[#0A1628]">{test.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{test.date}</div>
                </div>
                <span className="text-sm font-bold text-[#F5A623]">{test.score}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/results" className="text-[#F5A623] text-sm font-semibold mt-4 inline-block hover:underline">View All Results →</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A1628] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Take a Test", href: "/dashboard/tests", icon: "📝" },
              { label: "Study Material", href: "/dashboard/study-material", icon: "📖" },
              { label: "My Courses", href: "/dashboard/courses", icon: "📚" },
              { label: "View Results", href: "/dashboard/results", icon: "📊" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-[#F5A623]/10 transition-colors text-center"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-semibold text-[#0A1628]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
