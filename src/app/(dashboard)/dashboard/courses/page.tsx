import Link from "next/link";

const enrolledCourses = [
  { title: "UPSC CSE Foundation", progress: 45, nextLesson: "Indian Polity - Chapter 8", duration: "12 Months" },
  { title: "Mains Answer Writing", progress: 30, nextLesson: "Essay Writing - Practice 5", duration: "6 Months" },
  { title: "Current Affairs Module", progress: 80, nextLesson: "January 2025 Recap", duration: "1 Month" },
];

export default function CoursesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A1628] mb-6">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#0A1628]">{course.title}</h3>
              <span className="text-xs text-gray-400">{course.duration}</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="font-semibold text-[#0A1628]">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#F5A623] h-2 rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Next: {course.nextLesson}</p>
            <button className="w-full bg-[#0A1628] text-white py-2.5 rounded-full text-sm font-bold hover:bg-[#0A1628]/80 transition-colors">
              Continue Learning
            </button>
          </div>
        ))}
        <Link href="/courses" className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#F5A623] transition-colors group">
          <span className="text-4xl">➕</span>
          <span className="font-semibold text-gray-400 group-hover:text-[#F5A623] transition-colors">Explore More Courses</span>
        </Link>
      </div>
    </div>
  );
}
