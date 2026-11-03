import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A1628] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#F5A623]">
          Pariksha
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-[#F5A623] transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-white hover:text-[#F5A623] text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#F5A623] text-[#0A1628] px-5 py-2 rounded-full text-sm font-bold hover:bg-[#D4891A] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
