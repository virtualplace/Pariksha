const features = [
  { icon: "📚", title: "Comprehensive Study Material", desc: "Curated notes, books, and resources for all UPSC subjects." },
  { icon: "🤖", title: "AI-Powered Evaluation", desc: "Get instant feedback on your answers with our AI evaluator." },
  { icon: "📝", title: "Test Series", desc: "Regular mock tests with detailed performance analysis." },
  { icon: "👨‍🏫", title: "Expert Faculty", desc: "Learn from experienced educators and UPSC toppers." },
  { icon: "📊", title: "Performance Tracking", desc: "Track your progress with detailed analytics and insights." },
  { icon: "💬", title: "Doubt Resolution", desc: "Get your doubts cleared by experts within 24 hours." },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#0A1628]">
            Why Choose <span className="text-[#F5A623]">Pariksha?</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Everything you need to crack UPSC in one platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
