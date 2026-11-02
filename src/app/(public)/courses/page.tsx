import Link from "next/link";

const courses = [
  { title: "UPSC CSE Foundation", duration: "12 Months", price: "₹29,999", tag: "Most Popular", desc: "Complete preparation for UPSC Civil Services Examination covering Prelims, Mains, and Interview.", subjects: ["History", "Geography", "Polity", "Economy", "Science"] },
  { title: "Prelims Crash Course", duration: "3 Months", price: "₹9,999", tag: "Fast Track", desc: "Intensive preparation for UPSC Prelims with daily mock tests and revision sessions.", subjects: ["GS Paper I", "CSAT", "Current Affairs", "Mock Tests"] },
  { title: "Mains Answer Writing", duration: "6 Months", price: "₹14,999", tag: "New", desc: "Master the art of answer writing for UPSC Mains with expert evaluation.", subjects: ["Essay", "GS I-IV", "Optional", "Ethics"] },
  { title: "State PSC Complete", duration: "8 Months", price: "₹19,999", tag: "Popular", desc: "Comprehensive preparation for State Public Service Commission examinations.", subjects: ["State History", "State Polity", "GS", "Current Affairs"] },
  { title: "Current Affairs Module", duration: "1 Month", price: "₹1,999", tag: "Monthly", desc: "Stay updated with curated current affairs analysis for UPSC.", subjects: ["National", "International", "Economy", "Environment"] },
  { title: "Optional Subject: History", duration: "6 Months", price: "₹12,999", tag: "Specialized", desc: "In-depth coverage of History optional for UPSC Mains.", subjects: ["Ancient", "Medieval", "Modern", "World History"] },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0A1628] py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-white">Our <span className="text-[#F5A623]">Courses</span></h1>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">Structured programs designed by UPSC experts to maximize your chances of success.</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.title} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-[#0A1628] p-6">
                <span className="bg-[#F5A623] text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">{course.tag}</span>
                <h3 className="text-white text-xl font-bold mt-4">{course.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{course.desc}</p>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.subjects.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">⏱ {course.duration}</span>
                  <span className="text-2xl font-bold text-[#0A1628]">{course.price}</span>
                </div>
                <Link href="/register" className="block text-center bg-[#F5A623] text-[#0A1628] py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors">
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
