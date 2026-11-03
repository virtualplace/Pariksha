"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";


interface Question {
  id: string;
  number: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
}

interface QuizData {
  id: string;
  title: string;
  duration: number;
  questions: { order: number; question: Question }[];
}

interface QuizClientProps {
  quizId: string;
}

type Status = "loading" | "ready" | "running" | "submitting" | "done";

export default function QuizClient({ quizId }: QuizClientProps) {
  const router = useRouter();

  const [quiz, setQuiz]           = useState<QuizData | null>(null);
  const [status, setStatus]       = useState<Status>("loading");
  const [current, setCurrent]     = useState(0);
  const [responses, setResponses] = useState<Record<string, string | null>>({});
  const [flagged, setFlagged]     = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft]   = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes/${quizId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuiz(data);
        setTimeLeft(data.duration * 60);
        setStatus("ready");
      })
      .catch(() => setStatus("ready"));
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (status !== "running") return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  });

  function startQuiz() {
    setStartTime(Date.now());
    setStatus("running");
  }

  const handleSubmit = useCallback(async () => {
    if (status === "submitting" || status === "done") return;
    setStatus("submitting");
    setShowConfirm(false);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const res = await fetch("/api/quiz-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, responses, timeTaken }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/dashboard/quiz/${quizId}/result/${data.attemptId}`);
    }
  }, [status, startTime, quizId, responses, router]);

  function selectOption(questionId: string, opt: string) {
    setResponses((prev) => ({ ...prev, [questionId]: prev[questionId] === opt ? null : opt }));
  }

  function toggleFlag(questionId: string) {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (status === "loading") return <div className="p-20 text-center text-gray-400">Loading quiz…</div>;
  if (!quiz) return <div className="p-20 text-center text-gray-400">Quiz not found.</div>;

  const questions = quiz.questions.map((qq) => qq.question);
  const q = questions[current];
  const answered = Object.values(responses).filter(Boolean).length;
  const options: [string, string][] = [
    ["a", q.optionA], ["b", q.optionB], ["c", q.optionC], ["d", q.optionD],
    ...(q.optionE ? [["e", q.optionE] as [string, string]] : []),
  ];

  // ── Ready screen ──
  if (status === "ready") {
    return (
      <div className="max-w-lg mx-auto mt-16">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2">{quiz.title}</h1>
          <div className="flex justify-center gap-6 text-sm text-gray-500 my-5">
            <span>❓ {questions.length} Questions</span>
            <span>⏱ {quiz.duration} minutes</span>
          </div>
          <p className="text-gray-400 text-sm mb-8">Once started, the timer cannot be paused.</p>
          <button
            onClick={startQuiz}
            className="w-full bg-[#F5A623] text-[#0A1628] py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors"
          >
            Start Quiz
          </button>
          <button
            onClick={() => router.back()}
            className="mt-3 w-full py-3 rounded-full border border-gray-200 text-sm text-gray-500 hover:border-gray-400 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-4rem)]">

      {/* ── Main question area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100 flex items-center justify-between mb-4 shrink-0">
          <span className="font-bold text-[#0A1628] text-sm truncate">{quiz.title}</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{answered}/{questions.length} answered</span>
            <span className={`font-mono font-bold text-sm px-3 py-1 rounded-full ${timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-[#0A1628]/10 text-[#0A1628]"}`}>
              ⏱ {fmt(timeLeft)}
            </span>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={status === "submitting"}
              className="bg-[#0A1628] text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#0A1628]/80 transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400">Question {current + 1} of {questions.length}</span>
            <button
              onClick={() => toggleFlag(q.id)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${flagged.has(q.id) ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"}`}
            >
              {flagged.has(q.id) ? "🚩 Flagged" : "🏳 Flag"}
            </button>
          </div>

          <p className="text-[#0A1628] font-medium text-base leading-relaxed mb-6">{q.questionText}</p>

          <div className="space-y-3">
            {options.map(([key, val]) => {
              const sel = responses[q.id] === key;
              return (
                <button
                  key={key}
                  onClick={() => selectOption(q.id, key)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    sel
                      ? "border-[#F5A623] bg-[#F5A623]/10"
                      : "border-gray-100 hover:border-[#F5A623]/50 hover:bg-gray-50"
                  }`}
                >
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${sel ? "bg-[#F5A623] text-[#0A1628]" : "bg-gray-100 text-gray-500"}`}>
                    {key.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-700 pt-0.5">{val}</span>
                </button>
              );
            })}
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              className="px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 disabled:opacity-30 transition-colors"
            >
              ← Previous
            </button>
            <button
              disabled={current === questions.length - 1}
              onClick={() => setCurrent((c) => c + 1)}
              className="px-5 py-2 rounded-full bg-[#0A1628] text-white text-sm font-bold hover:bg-[#0A1628]/80 disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── Question navigator sidebar ── */}
      <div className="w-56 shrink-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-0">
          <p className="text-xs font-semibold text-gray-500 mb-3">Question Navigator</p>
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {questions.map((qq, idx) => {
              const isAnswered = !!responses[qq.id];
              const isFlagged  = flagged.has(qq.id);
              const isCurrent  = idx === current;
              return (
                <button
                  key={qq.id}
                  onClick={() => setCurrent(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    isCurrent  ? "ring-2 ring-[#F5A623] ring-offset-1" : ""
                  } ${
                    isFlagged  ? "bg-orange-100 text-orange-600" :
                    isAnswered ? "bg-[#0A1628] text-white" :
                                 "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#0A1628] inline-block"></span> Answered</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-100 inline-block"></span> Not answered</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-100 inline-block"></span> Flagged</div>
          </div>
        </div>
      </div>

      {/* ── Submit confirm modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-4">📤</div>
            <h2 className="font-bold text-[#0A1628] text-lg mb-2">Submit Quiz?</h2>
            <p className="text-gray-500 text-sm mb-1">{answered} of {questions.length} questions answered.</p>
            {answered < questions.length && (
              <p className="text-orange-500 text-sm mb-4">{questions.length - answered} unanswered questions will be marked wrong.</p>
            )}
            <div className="flex gap-3 justify-center mt-5">
              <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2.5 rounded-full bg-[#F5A623] text-[#0A1628] text-sm font-bold hover:bg-[#D4891A] transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
