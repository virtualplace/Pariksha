const team = [
  { name: "Dr. Rajesh Kumar", role: "Founder & Director", bio: "Former IAS officer with 20+ years of experience in UPSC coaching." },
  { name: "Prof. Meena Iyer", role: "Head of Academics", bio: "PhD in Political Science, UPSC Mains evaluator for 10 years." },
  { name: "Vikram Nair", role: "Lead Faculty - History", bio: "AIR 12 UPSC 2015, passionate about making history accessible." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0A1628] py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-white">About <span className="text-[#F5A623]">Pariksha</span></h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          We are on a mission to democratize UPSC preparation and make quality education accessible to every aspirant across India.
        </p>
      </div>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0A1628]">Our <span className="text-[#F5A623]">Mission</span></h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Pariksha was founded with a singular vision — to bridge the gap between aspiration and achievement for UPSC candidates. We combine expert faculty, cutting-edge technology, and a student-first approach to deliver results.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Our AI-powered evaluation system provides instant, detailed feedback on answer writing, helping students improve faster than traditional methods.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "10,000+", label: "Students Enrolled" },
              { value: "500+", label: "UPSC Selections" },
              { value: "50+", label: "Expert Faculty" },
              { value: "8 Years", label: "Of Excellence" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0A1628] rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#F5A623]">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0A1628] text-center mb-12">Meet Our <span className="text-[#F5A623]">Team</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-[#F5A623]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-bold text-[#0A1628] text-lg">{member.name}</h3>
                <p className="text-[#F5A623] text-sm font-semibold mt-1">{member.role}</p>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
