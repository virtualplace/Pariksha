import Link from "next/link";

const courses = [
  { title: "UPSC CSE Foundation", duration: "12 Months", price: "₹29,999", tag: "Most Popular", desc: "Complete preparation for UPSC Civil Services Examination." },
  { title: "Prelims Crash Course", duration: "3 Months", price: "₹9,999", tag: "Fast Track", desc: "Intensive preparation for UPSC Prelims with mock tests." },
  { title: "Mains Answer Writing", duration: "6 Months", price: "₹14,999", tag: "New", desc: "Master the art of answer writing for UPSC Mains." },
];

export default function Courses() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#0A1628]">
            Our <span className="text-[#F5A623]">Courses</span>
          </h2>
          <p className="text-gray-500 mt-4">Structured programs designed by UPSC experts.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.title} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-[#0A1628] p-6">
                <span className="bg-[#F5A623] text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                  {course.tag}
                </span>
                <h3 className="text-white text-xl font-bold mt-4">{course.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{course.desc}</p>
              </div>
              <div className="p-6">
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
        <div className="text-center mt-10">
          <Link href="/courses" className="text-[#F5A623] font-semibold hover:underline">View All Courses →</Link>
        </div>
      </div>
    </section>
  );
}
