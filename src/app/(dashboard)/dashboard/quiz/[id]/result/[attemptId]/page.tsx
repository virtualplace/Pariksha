"use client";

import { useEffect, useState, use } from "react";
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
  answer: string;
  explanation: string | null;
  theory: string | null;
  subject: string | null;
  topic: string | null;
}

interface QuizResponse {
  id: string;
  questionId: string;
  selected: string | null;
  question: Question;
}

interface AttemptData {
  id: string;
  score: number;
  total: number;
  timeTaken: number;
  submittedAt: string;
  quiz: { id: string; title: string };
  responses: QuizResponse[];
}

interface Note {
  id: string;
  content: string;
  sourceType: string;
  questionId: string | null;
  createdAt: string;
}

type Tab = "analysis" | "review" | "notes";
type Filter = "all" | "correct" | "wrong" | "skipped";

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
}

function SelectableText({ text, onSave }: { text: string; onSave: (t: string) => void }) {
  function handleMouseUp() {
    const sel = window.getSelection()?.toString().trim();
    if (sel && sel.length > 3) onSave(sel);
  }
  return <span onMouseUp={handleMouseUp} className="cursor-text select-text">{text}</span>;
}

export default function ResultPage({ params }: { params: Promise<{ id: string; attemptId: string }> }) {
  const { attemptId } = use(params);
  const router = useRouter();

  const [attempt, setAttempt]   = useState<AttemptData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>("analysis");
  const [filter, setFilter]     = useState<Filter>("all");
  const [notes, setNotes]       = useState<Note[]>([]);
  const [noteToast, setNoteToast] = useState("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/quiz-attempt/${attemptId}`)
      .then((r) => r.json())
      .then((data) => { setAttempt(data); setLoading(false); })
      .catch(() => setLoading(false));
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => setNotes(Array.isArray(data) ? data : []));
  }, [attemptId]);

  async function saveNote(content: string, questionId?: string, sourceType = "explanation") {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        sourceType,
        questionId: questionId ?? null,
        quizId: attempt?.quiz.id ?? null,
        attemptId,
      }),
    });
    if (res.ok) {
      const note = await res.json();
      setNotes((prev) => [note, ...prev]);
      setNoteToast("✅ Saved to notes!");
      setTimeout(() => setNoteToast(""), 2500);
    }
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  if (loading) return <div className="p-20 text-center text-gray-400">Loading results…</div>;
  if (!attempt) return <div className="p-20 text-center text-gray-400">Result not found.</div>;

  const pct     = Math.round((attempt.score / attempt.total) * 100);
  const wrong   = attempt.responses.filter((r) => r.selected && r.selected.toLowerCase() !== r.question.answer.toLowerCase()).length;
  const skipped = attempt.responses.filter((r) => !r.selected).length;

  const filtered = attempt.responses.filter((r) => {
    if (filter === "correct") return r.selected && r.selected.toLowerCase() === r.question.answer.toLowerCase();
    if (filter === "wrong")   return r.selected && r.selected.toLowerCase() !== r.question.answer.toLowerCase();
    if (filter === "skipped") return !r.selected;
    return true;
  });

  const scoreColor = pct >= 70 ? "text-green-600" : pct >= 40 ? "text-yellow-600" : "text-red-600";
  const scoreBg    = pct >= 70 ? "bg-green-50 border-green-200" : pct >= 40 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast */}
      {noteToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0A1628] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-fade-in">
          {noteToast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">{attempt.quiz.title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Submitted {new Date(attempt.submittedAt).toLocaleString()} · Time taken: {fmt(attempt.timeTaken)}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/tests")}
          className="px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
        >
          ← Back to Tests
        </button>
      </div>

      {/* Score card */}
      <div className={`rounded-2xl p-6 border mb-6 ${scoreBg}`}>
        <div className="flex items-center gap-8 flex-wrap">
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>{pct}%</div>
            <div className="text-gray-500 text-sm mt-1">Score</div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{attempt.score}</div>
              <div className="text-xs text-gray-500 mt-0.5">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{wrong}</div>
              <div className="text-xs text-gray-500 mt-0.5">Wrong</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{skipped}</div>
              <div className="text-xs text-gray-500 mt-0.5">Skipped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0A1628]">{attempt.total}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex-1 min-w-[160px]">
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{attempt.score} / {attempt.total} correct</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["analysis", "review", "notes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-[#0A1628] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
          >
            {t === "notes" ? `📌 Notes (${notes.length})` : t === "review" ? "🔍 Review" : "📊 Analysis"}
          </button>
        ))}
      </div>

      {/* ── ANALYSIS TAB ── */}
      {tab === "analysis" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0A1628] mb-4">Performance Breakdown</h2>
            {[
              { label: "Correct",  value: attempt.score,  total: attempt.total, color: "bg-green-500" },
              { label: "Wrong",    value: wrong,           total: attempt.total, color: "bg-red-400" },
              { label: "Skipped",  value: skipped,         total: attempt.total, color: "bg-gray-300" },
            ].map((row) => (
              <div key={row.label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-semibold text-[#0A1628]">{row.value} / {row.total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} rounded-full`} style={{ width: `${(row.value / row.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0A1628] mb-4">Subject-wise Performance</h2>
            {(() => {
              const map: Record<string, { correct: number; total: number }> = {};
              attempt.responses.forEach((r) => {
                const s = r.question.subject ?? "General";
                if (!map[s]) map[s] = { correct: 0, total: 0 };
                map[s].total++;
                if (r.selected && r.selected.toLowerCase() === r.question.answer.toLowerCase()) map[s].correct++;
              });
              return Object.entries(map).map(([subj, { correct, total }]) => (
                <div key={subj} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{subj}</span>
                    <span className="font-semibold text-[#0A1628]">{correct}/{total} ({Math.round((correct/total)*100)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F5A623] rounded-full" style={{ width: `${(correct/total)*100}%` }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* ── REVIEW TAB ── */}
      {tab === "review" && (
        <div>
          {/* Filter pills */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {([
              { key: "all",     label: `All (${attempt.total})` },
              { key: "correct", label: `✅ Correct (${attempt.score})` },
              { key: "wrong",   label: `❌ Wrong (${wrong})` },
              { key: "skipped", label: `⬜ Skipped (${skipped})` },
            ] as { key: Filter; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === key ? "bg-[#0A1628] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-4 italic">💡 Select any text in explanations or theory to save it as a note.</p>

          <div className="space-y-3">
            {filtered.map((r) => {
              const q = r.question;
              const isCorrect = r.selected && r.selected.toLowerCase() === q.answer.toLowerCase();
              const isSkipped = !r.selected;
              const isExpanded = expandedQ === r.questionId;
              const opts: [string, string][] = [
                ["a", q.optionA], ["b", q.optionB], ["c", q.optionC], ["d", q.optionD],
                ...(q.optionE ? [["e", q.optionE] as [string, string]] : []),
              ];

              return (
                <div key={r.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isCorrect ? "border-green-200" : isSkipped ? "border-gray-200" : "border-red-200"}`}>
                  {/* Question header */}
                  <button
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpandedQ(isExpanded ? null : r.questionId)}
                  >
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 ${isCorrect ? "bg-green-100 text-green-600" : isSkipped ? "bg-gray-100 text-gray-400" : "bg-red-100 text-red-500"}`}>
                      {isCorrect ? "✓" : isSkipped ? "—" : "✗"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-gray-400">Q{q.number}</span>
                        {q.subject && <span className="bg-[#F5A623]/20 text-[#F5A623] text-[10px] font-semibold px-2 py-0.5 rounded-full">{q.subject}</span>}
                        {q.topic   && <span className="bg-[#0A1628]/10 text-[#0A1628] text-[10px] font-semibold px-2 py-0.5 rounded-full">{q.topic}</span>}
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">{q.questionText}</p>
                    </div>
                    <span className="text-gray-400 text-xs shrink-0 mt-1">{isExpanded ? "▲" : "▼"}</span>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-5 border-t border-gray-50">
                      {/* Full question */}
                      <p className="text-sm text-gray-800 font-medium mt-4 mb-3">{q.questionText}</p>

                      {/* Options */}
                      <div className="space-y-2 mb-4">
                        {opts.map(([key, val]) => {
                          const isAns = key === q.answer.toLowerCase();
                          const isSel = r.selected?.toLowerCase() === key;
                          return (
                            <div
                              key={key}
                              className={`flex items-start gap-3 p-3 rounded-xl border ${
                                isAns ? "border-green-300 bg-green-50" :
                                isSel && !isAns ? "border-red-300 bg-red-50" :
                                "border-gray-100"
                              }`}
                            >
                              <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAns ? "bg-green-500 text-white" : isSel ? "bg-red-400 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {key.toUpperCase()}
                              </span>
                              <span className={`text-sm ${isAns ? "text-green-800 font-semibold" : isSel ? "text-red-700" : "text-gray-600"}`}>{val}</span>
                              {isAns && <span className="ml-auto text-xs text-green-600 font-semibold shrink-0">✓ Correct</span>}
                              {isSel && !isAns && <span className="ml-auto text-xs text-red-500 font-semibold shrink-0">Your answer</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Your answer summary */}
                      <div className="text-xs text-gray-500 mb-4">
                        Your answer: <span className="font-semibold">{r.selected ? r.selected.toUpperCase() : "Not answered"}</span>
                        {" · "}Correct answer: <span className="font-semibold text-green-600">{q.answer.toUpperCase()}</span>
                      </div>

                      {/* Theory */}
                      {q.theory && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-700">📖 Theory</span>
                            <button
                              onClick={() => saveNote(q.theory!, q.id, "theory")}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 font-semibold transition-colors"
                            >
                              + Save to Notes
                            </button>
                          </div>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            <SelectableText text={q.theory} onSave={(t) => saveNote(t, q.id, "theory")} />
                          </p>
                        </div>
                      )}

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-700">💡 Explanation</span>
                            <button
                              onClick={() => saveNote(q.explanation!, q.id, "explanation")}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 font-semibold transition-colors"
                            >
                              + Save to Notes
                            </button>
                          </div>
                          <p className="text-sm text-amber-900 leading-relaxed">
                            <SelectableText text={q.explanation} onSave={(t) => saveNote(t, q.id, "explanation")} />
                          </p>
                        </div>
                      )}

                      {!q.theory && !q.explanation && (
                        <p className="text-xs text-gray-400 italic">No explanation available for this question.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── NOTES TAB ── */}
      {tab === "notes" && (
        <div>
          {notes.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">📌</div>
              <p className="text-gray-500">No notes yet.</p>
              <p className="text-gray-400 text-sm mt-1">Go to Review tab and select text or click "Save to Notes" to add notes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${note.sourceType === "theory" ? "bg-blue-100 text-blue-600" : note.sourceType === "explanation" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"}`}>
                          {note.sourceType}
                        </span>
                        <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{note.content}</p>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="shrink-0 text-gray-300 hover:text-red-500 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
