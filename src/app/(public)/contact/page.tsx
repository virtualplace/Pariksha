export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0A1628] py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-white">Contact <span className="text-[#F5A623]">Us</span></h1>
        <p className="text-gray-400 mt-4">We&apos;re here to help. Reach out to us anytime.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1628] mb-6">Get in Touch</h2>
          <form className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
              <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F5A623]" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F5A623]" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Subject</label>
              <input type="text" placeholder="How can we help?" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F5A623]" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Message</label>
              <textarea rows={5} placeholder="Your message..." className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F5A623] resize-none" />
            </div>
            <button type="submit" className="bg-[#F5A623] text-[#0A1628] px-8 py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-6">Contact Information</h2>
          {[
            { icon: "📧", label: "Email", value: "info@polymath.in" },
            { icon: "📞", label: "Phone", value: "+91 98765 43210" },
            { icon: "📍", label: "Address", value: "123 Education Hub, Connaught Place, New Delhi - 110001" },
            { icon: "🕐", label: "Office Hours", value: "Mon–Sat: 9:00 AM – 7:00 PM" },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-[#F5A623]/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-[#0A1628]">{item.label}</div>
                <div className="text-gray-500 text-sm mt-1">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
