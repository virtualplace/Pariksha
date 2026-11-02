"use client";

import { useEffect, useState, useCallback } from "react";

interface Question {
  id: string;
  number: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  subject: string | null;
  topic: string | null;
  examName: string | null;
  examYear: number | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  difficulty: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  _count: { questions: number };
}

interface FilterOptions {
  subjects: string[];
  topics: string[];
  sourceFiles: string[];
  examNames: string[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY:   "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD:   "bg-red-100 text-red-700",
};

export default function QuizBuilderPage() {
  // ── Quiz metadata ──
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject]       = useState("");
  const [difficulty, setDifficulty] = useState<"EASY"|"MEDIUM"|"HARD">("MEDIUM");
  const [duration, setDuration]     = useState(60);

  // ── Question picker ──
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [filterOpts, setFilterOpts] = useState<FilterOptions>({ subjects: [], topics: [], sourceFiles: [], examNames: [] });
  const [fSubject, setFSubject]     = useState("");
  const [fTopic, setFTopic]         = useState("");
  const [fSourceFile, setFSourceFile] = useState("");
  const [fExamName, setFExamName]   = useState("");
  const [fSearch, setFSearch]       = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [qPage, setQPage]           = useState(1);
  const [qPages, setQPages]         = useState(1);
  const [qTotal, setQTotal]         = useState(0);
  const [qLoading, setQLoading]     = useState(false);

  // ── Selected questions ──
  const [selected, setSelected]     = useState<Question[]>([]);

  // ── Saved quizzes ──
  const [quizzes, setQuizzes]       = useState<Quiz[]>([]);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // ── Delete quiz confirm ──
  const [deletingQuiz, setDeletingQuiz] = useState<string | null>(null);

  // ── View: "builder" | "quizzes" ──
  const [view, setView]             = useState<"builder"|"quizzes">("builder");

  const fetchQuestions = useCallback(async (pg = 1) => {
    setQLoading(true);
    try {
      const p = new URLSearchParams({ page: pg.toString() });
      if (fSubject)    p.set("subject", fSubject);
      if (fTopic)      p.set("topic", fTopic);
      if (fSourceFile) p.set("sourceFile", fSourceFile);
      if (fExamName)   p.set("examName", fExamName);
      if (fSearch)     p.set("search", fSearch);
      const res  = await fetch(`/api/questions?${p}`);
      if (!res.ok) return;
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setQPage(data.page ?? 1);
      setQPages(data.pages ?? 1);
      setQTotal(data.total ?? 0);
      setFilterOpts(data.filters ?? { subjects: [], topics: [], sourceFiles: [], examNames: [] });
    } catch {
      // ignore
    } finally {
      setQLoading(false);
    }
  }, [fSubject, fTopic, fSourceFile, fExamName, fSearch]);

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch("/api/quizzes");
      if (!res.ok) return;
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch {
      // ignore fetch errors
    }
  }, []);

  useEffect(() => { fetchQuestions(1); }, [fetchQuestions]);
  useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

  function toggleSelect(q: Question) {
    setSelected((prev) =>
      prev.find((s) => s.id === q.id)
        ? prev.filter((s) => s.id !== q.id)
        : [...prev, q]
    );
  }

  function removeSelected(id: string) {
    setSelected((prev) => prev.filter((q) => q.id !== id));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx: number) {
    setSelected((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  async function handleSave() {
    if (!title.trim())      { setSaveError("Quiz title is required."); return; }
    if (!selected.length)   { setSaveError("Select at least one question."); return; }
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    const res = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || undefined,
        subject: subject || undefined,
        difficulty,
        duration,
        questionIds: selected.map((q) => q.id),
      }),
    });
    if (!res.ok) { setSaveError("Failed to save quiz."); setSaving(false); return; }
    setSaveSuccess(`Quiz "${title}" created with ${selected.length} questions!`);
    setTitle(""); setDescription(""); setSubject(""); setDifficulty("MEDIUM"); setDuration(60);
    setSelected([]);
    setSaving(false);
    fetchQuizzes();
  }

  async function handleDeleteQuiz(id: string) {
    await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
    setDeletingQuiz(null);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }

  async function toggleActive(quiz: Quiz) {
    const res = await fetch(`/api/quizzes/${quiz.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !quiz.isActive }),
    });
    const updated = await res.json();
    setQuizzes((prev) => prev.map((q) => q.id === updated.id ? updated : q));
  }

  const isSelected = (id: string) => selected.some((q) => q.id === id);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">Quiz Builder</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create quizzes from your question bank</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("builder")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${view === "builder" ? "bg-[#0A1628] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
          >
            ✏️ Builder
          </button>
          <button
            onClick={() => setView("quizzes")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${view === "quizzes" ? "bg-[#0A1628] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
          >
            📋 Saved Quizzes ({quizzes.length})
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          VIEW: BUILDER
      ══════════════════════════════════════════ */}
      {view === "builder" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* ── Left: Quiz metadata + Question picker ── */}
          <div className="space-y-5">

            {/* Quiz metadata card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0A1628] mb-4">Quiz Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Environment & Ecology Mock Test"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623] resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
                  >
                    <option value="">— None —</option>
                    {filterOpts.subjects.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "EASY"|"MEDIUM"|"HARD")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Duration (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
                  />
                </div>
              </div>
            </div>

            {/* Question picker */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-[#0A1628] mb-3">Pick Questions <span className="text-gray-400 font-normal text-sm">({qTotal.toLocaleString()} available)</span></h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                  <select value={fSubject} onChange={(e) => { setFSubject(e.target.value); setQPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#F5A623]">
                    <option value="">All Subjects</option>
                    {filterOpts.subjects.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <select value={fTopic} onChange={(e) => { setFTopic(e.target.value); setQPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#F5A623]">
                    <option value="">All Topics</option>
                    {filterOpts.topics.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <select value={fSourceFile} onChange={(e) => { setFSourceFile(e.target.value); setQPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#F5A623]">
                    <option value="">All Files</option>
                    {filterOpts.sourceFiles.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  <select value={fExamName} onChange={(e) => { setFExamName(e.target.value); setQPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#F5A623]">
                    <option value="">All Exams</option>
                    {filterOpts.examNames.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { setFSearch(searchInput); setQPage(1); } }}
                    placeholder="Search question text…"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#F5A623]"
                  />
                  <button onClick={() => { setFSearch(searchInput); setQPage(1); }} className="px-3 py-2 bg-[#F5A623] rounded-lg text-[#0A1628] font-bold text-xs hover:bg-[#D4891A] transition-colors">🔍</button>
                  {(fSubject || fTopic || fSourceFile || fExamName || fSearch) && (
                    <button onClick={() => { setFSubject(""); setFTopic(""); setFSourceFile(""); setFExamName(""); setFSearch(""); setSearchInput(""); }} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-400 hover:text-red-500 transition-colors">✕</button>
                  )}
                </div>
              </div>

              {/* Question list */}
              <div className="divide-y divide-gray-50">
                {qLoading ? (
                  <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
                ) : questions.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No questions found.</div>
                ) : questions.map((q) => {
                  const sel = isSelected(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleSelect(q)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${sel ? "bg-[#F5A623]/8 border-l-4 border-[#F5A623]" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                    >
                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${sel ? "bg-[#F5A623] border-[#F5A623]" : "border-gray-300"}`}>
                        {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-[#0A1628]">#{q.number}</span>
                          {q.subject && <span className="bg-[#F5A623]/20 text-[#F5A623] text-[10px] font-semibold px-2 py-0.5 rounded-full">{q.subject}</span>}
                          {q.topic   && <span className="bg-[#0A1628]/10 text-[#0A1628] text-[10px] font-semibold px-2 py-0.5 rounded-full">{q.topic}</span>}
                          {q.examName && <span className="text-[10px] text-gray-400">{q.examName} {q.examYear ?? ""}</span>}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{q.questionText}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {qPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>Page {qPage} of {qPages}</span>
                  <div className="flex gap-2">
                    <button disabled={qPage <= 1} onClick={() => fetchQuestions(qPage - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#F5A623] disabled:opacity-40 transition-colors">← Prev</button>
                    <button disabled={qPage >= qPages} onClick={() => fetchQuestions(qPage + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#F5A623] disabled:opacity-40 transition-colors">Next →</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Selected questions + Save ── */}
          <div className="xl:sticky xl:top-6 xl:self-start space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[#0A1628]">Selected <span className="text-[#F5A623]">{selected.length}</span></h2>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear all</button>
                )}
              </div>

              {selected.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <div className="text-3xl mb-2">☑️</div>
                  Click questions on the left to add them
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                  {selected.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-2 px-4 py-3">
                      <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                        <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-xs leading-none">▲</button>
                        <button onClick={() => moveDown(idx)} disabled={idx === selected.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-xs leading-none">▼</button>
                      </div>
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[#0A1628] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
                      <p className="flex-1 text-xs text-gray-700 line-clamp-2">{q.questionText}</p>
                      <button onClick={() => removeSelected(q.id)} className="shrink-0 text-gray-300 hover:text-red-500 transition-colors text-sm leading-none mt-0.5">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {saveError   && <p className="text-red-500 text-sm px-1">{saveError}</p>}
            {saveSuccess && <p className="text-green-600 text-sm px-1">✅ {saveSuccess}</p>}

            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || selected.length === 0}
              className="w-full bg-[#F5A623] text-[#0A1628] py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? "Saving…" : `Save Quiz (${selected.length} questions)`}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          VIEW: SAVED QUIZZES
      ══════════════════════════════════════════ */}
      {view === "quizzes" && (
        <div>
          {quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500">No quizzes yet. Go to Builder to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[quiz.difficulty]}`}>{quiz.difficulty}</span>
                      {quiz.subject && <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-2.5 py-1 rounded-full">{quiz.subject}</span>}
                    </div>
                    <button
                      onClick={() => toggleActive(quiz)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${quiz.isActive ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"}`}
                    >
                      {quiz.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <h3 className="font-bold text-[#0A1628] mb-1">{quiz.title}</h3>
                  {quiz.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2">{quiz.description}</p>}

                  <div className="flex gap-4 text-xs text-gray-500 mb-4">
                    <span>❓ {quiz._count.questions} questions</span>
                    <span>⏱ {quiz.duration} min</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#F5A623] text-[#0A1628] py-2 rounded-full text-xs font-bold hover:bg-[#D4891A] transition-colors">
                      Start Quiz
                    </button>
                    <button
                      onClick={() => setDeletingQuiz(quiz.id)}
                      className="px-3 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-colors"
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

      {/* ── Delete Quiz Confirm ── */}
      {deletingQuiz && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeletingQuiz(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-4">🗑️</div>
            <h2 className="font-bold text-[#0A1628] text-lg mb-2">Delete Quiz?</h2>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete the quiz and all its question links.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeletingQuiz(null)} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteQuiz(deletingQuiz)} className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
