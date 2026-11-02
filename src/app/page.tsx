import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Courses from "@/components/sections/Courses";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Courses />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
