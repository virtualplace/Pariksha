"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  duration: number;
  _count: { questions: number };
}

const DIFF: Record<string, string> = {
  EASY:   "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD:   "bg-red-100 text-red-700",
};

export default function TestsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/quizzes")
      .then((r) => r.json())
      .then((data) => { setQuizzes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1628]">Test Series</h1>
        <p className="text-gray-500 text-sm mt-0.5">Attempt quizzes and track your performance</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading quizzes…</div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500">No quizzes available yet.</p>
          <p className="text-gray-400 text-sm mt-1">Ask your admin to create quizzes in the Quiz Builder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFF[quiz.difficulty]}`}>
                    {quiz.difficulty}
                  </span>
                  {quiz.subject && (
                    <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {quiz.subject}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-[#0A1628] mb-1">{quiz.title}</h3>
              {quiz.description && (
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{quiz.description}</p>
              )}

              <div className="flex gap-4 text-sm text-gray-500 mt-auto mb-4">
                <span>❓ {quiz._count.questions} Questions</span>
                <span>⏱ {quiz.duration} min</span>
              </div>

              <button
                onClick={() => router.push(`/dashboard/quiz/${quiz.id}`)}
                className="w-full bg-[#F5A623] text-[#0A1628] py-2.5 rounded-full text-sm font-bold hover:bg-[#D4891A] transition-colors"
              >
                Start Quiz →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
