
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/courses", label: "My Courses", icon: "📚" },
  { href: "/dashboard/tests", label: "Tests", icon: "📝" },
  { href: "/dashboard/results", label: "Results", icon: "📊" },
  { href: "/dashboard/notes", label: "My Notes", icon: "📌" },
  { href: "/dashboard/study-material", label: "Study Material", icon: "📖" },
  {
    href: "/dashboard/questions",
    label: "Questions",
    icon: "❓",
    adminOnly: true,
  },
  {
    href: "/dashboard/quiz-builder",
    label: "Quiz Builder",
    icon: "🧩",
    adminOnly: true,
  },
  {
    href: "/dashboard/upload",
    label: "Upload PDF",
    icon: "⬆️",
    adminOnly: true,
  },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];


// Keep your existing navItems array above this component.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

async function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#0A1628] min-h-screen fixed top-0 left-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-bold text-[#F5A623]">
            Pariksha
          </Link>
          <p className="text-gray-400 text-xs mt-1">
            {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white text-sm transition-colors"
          >
            <span>🚪</span> Logout
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
