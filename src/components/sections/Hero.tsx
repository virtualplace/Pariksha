import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#0A1628] min-h-screen flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-[#F5A623]/20 text-[#F5A623] text-sm font-semibold px-4 py-1 rounded-full">
            #1 UPSC Coaching Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-6 leading-tight">
            Achieve Your <span className="text-[#F5A623]">Civil Services</span> Dream
          </h1>
          <p className="text-gray-400 mt-6 text-lg leading-relaxed">
            Join thousands of successful aspirants who cracked UPSC with Pariksha's expert guidance, comprehensive study material, and AI-powered evaluation.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/register"
              className="bg-[#F5A623] text-[#0A1628] px-8 py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/courses"
              className="border border-white text-white px-8 py-3 rounded-full font-bold hover:border-[#F5A623] hover:text-[#F5A623] transition-colors"
            >
              View Courses
            </Link>
          </div>
          <div className="flex gap-8 mt-12">
            {[
              { value: "10,000+", label: "Students" },
              { value: "500+", label: "Selections" },
              { value: "50+", label: "Expert Faculty" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[#F5A623]">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex justify-center">
          <div className="w-96 h-96 bg-[#F5A623]/10 rounded-full flex items-center justify-center border border-[#F5A623]/20">
            <div className="w-72 h-72 bg-[#F5A623]/20 rounded-full flex items-center justify-center">
              <span className="text-8xl">🎓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
