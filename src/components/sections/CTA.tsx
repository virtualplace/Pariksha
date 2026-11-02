import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-[#F5A623]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0A1628]">Ready to Start Your UPSC Journey?</h2>
        <p className="text-[#0A1628]/70 mt-4 text-lg">
          Join 10,000+ aspirants already preparing with Polymath.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/register" className="bg-[#0A1628] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0A1628]/80 transition-colors">
            Get Started Free
          </Link>
          <Link href="/contact" className="border-2 border-[#0A1628] text-[#0A1628] px-8 py-3 rounded-full font-bold hover:bg-[#0A1628] hover:text-white transition-colors">
            Talk to Counsellor
          </Link>
        </div>
      </div>
    </section>
  );
}
