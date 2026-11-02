import Link from "next/link";

const posts = [
  { slug: "upsc-2024-strategy", title: "UPSC 2024 Strategy: A Complete Roadmap", date: "Jan 15, 2025", category: "Strategy", excerpt: "A comprehensive guide to planning your UPSC preparation from scratch, covering all stages from Prelims to Interview." },
  { slug: "current-affairs-importance", title: "Why Current Affairs is the Key to UPSC Success", date: "Jan 10, 2025", category: "Tips", excerpt: "Understanding how current affairs integrates with static syllabus and how to prepare effectively." },
  { slug: "answer-writing-tips", title: "10 Answer Writing Tips for UPSC Mains", date: "Jan 5, 2025", category: "Mains", excerpt: "Expert tips to structure your answers, improve presentation, and score higher in UPSC Mains." },
  { slug: "optional-subject-selection", title: "How to Choose Your Optional Subject", date: "Dec 28, 2024", category: "Strategy", excerpt: "A data-driven approach to selecting the right optional subject based on your background and interests." },
  { slug: "prelims-revision-plan", title: "30-Day Prelims Revision Plan", date: "Dec 20, 2024", category: "Prelims", excerpt: "A structured 30-day plan to revise the entire UPSC Prelims syllabus effectively." },
  { slug: "interview-preparation", title: "UPSC Interview: What the Board Really Looks For", date: "Dec 15, 2024", category: "Interview", excerpt: "Insights from successful candidates and board members on what makes a great UPSC interview." },
];

const categories = ["All", "Strategy", "Prelims", "Mains", "Interview", "Tips"];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#0A1628] py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-white">UPSC <span className="text-[#F5A623]">Blog</span></h1>
        <p className="text-gray-400 mt-4">Expert insights, strategies, and tips for UPSC aspirants.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex gap-3 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${cat === "All" ? "bg-[#F5A623] text-[#0A1628]" : "bg-gray-100 text-gray-600 hover:bg-[#F5A623]/20"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-[#0A1628] h-40 flex items-center justify-center">
                <span className="text-5xl">📰</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                  <span className="text-gray-400 text-xs">{post.date}</span>
                </div>
                <h3 className="font-bold text-[#0A1628] text-lg leading-snug group-hover:text-[#F5A623] transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{post.excerpt}</p>
                <span className="text-[#F5A623] text-sm font-semibold mt-4 inline-block">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
