const testimonials = [
  { name: "Priya Sharma", rank: "AIR 45, UPSC 2023", text: "Polymath's structured approach and AI evaluation helped me improve my answer writing drastically." },
  { name: "Rahul Verma", rank: "AIR 112, UPSC 2023", text: "The test series and expert faculty guidance were game changers in my UPSC journey." },
  { name: "Anjali Singh", rank: "AIR 78, UPSC 2023", text: "Best platform for UPSC preparation. The study material is comprehensive and well-structured." },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white">
            Our <span className="text-[#F5A623]">Success Stories</span>
          </h2>
          <p className="text-gray-400 mt-4">Hear from our successful students.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <p className="text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-6">
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-[#F5A623] text-sm mt-1">{t.rank}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
