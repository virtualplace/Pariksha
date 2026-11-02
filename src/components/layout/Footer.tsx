import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-[#F5A623] mb-4">Polymath</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empowering aspirants with quality education and expert guidance for competitive exams.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-[#F5A623] mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {["Home", "Courses", "About", "Blog", "Contact"].map((item) => (
              <li key={item}>
                <Link href={`/${item.toLowerCase()}`} className="hover:text-[#F5A623] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[#F5A623] mb-4">Courses</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {["UPSC CSE", "State PSC", "Current Affairs", "Test Series", "Study Material"].map((item) => (
              <li key={item}>
                <Link href="/courses" className="hover:text-[#F5A623] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[#F5A623] mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📧 info@polymath.in</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 New Delhi, India</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Polymath. All rights reserved.
      </div>
    </footer>
  );
}
