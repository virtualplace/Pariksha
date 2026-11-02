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
  optionE: string | null;
  answer: string;
  examName: string | null;
  examYear: number | null;
  explanation: string | null;
  subject: string | null;
  topic: string | null;
  theory: string | null;
  sourceFile: string | null;
}

interface Filters {
  subjects: string[];
  topics: string[];
  sourceFiles: string[];
  examNames: string[];
}

interface EditForm {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  answer: string;
  examName: string;
  examYear: string;
  explanation: string;
  subject: string;
  topic: string;
  theory: string;
}

function toForm(q: Question): EditForm {
  return {
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    optionE: q.optionE ?? "",
    answer: q.answer,
    examName: q.examName ?? "",
    examYear: q.examYear?.toString() ?? "",
    explanation: q.explanation ?? "",
    subject: q.subject ?? "",
    topic: q.topic ?? "",
    theory: q.theory ?? "",
  };
}

export default function QuestionsPage() {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [filters, setFilters]       = useState<Filters>({ subjects: [], topics: [], sourceFiles: [], examNames: [] });
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [loading, setLoading]       = useState(false);

  // Active filter state
  const [fSubject, setFSubject]         = useState("");
  const [fTopic, setFTopic]             = useState("");
  const [fSourceFile, setFSourceFile]   = useState("");
  const [fExamName, setFExamName]       = useState("");
  const [fSearch, setFSearch]           = useState("");
  const [searchInput, setSearchInput]   = useState("");

  // Edit modal
  const [editing, setEditing]   = useState<Question | null>(null);
  const [form, setForm]         = useState<EditForm | null>(null);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");

  // Delete confirm
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (pg = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: pg.toString() });
    if (fSubject)    params.set("subject", fSubject);
    if (fTopic)      params.set("topic", fTopic);
    if (fSourceFile) params.set("sourceFile", fSourceFile);
    if (fExamName)   params.set("examName", fExamName);
    if (fSearch)     params.set("search", fSearch);

    const res = await fetch(`/api/questions?${params}`);
    const data = await res.json();
    setQuestions(data.questions);
    setTotal(data.total);
    setPage(data.page);
    setPages(data.pages);
    setFilters(data.filters);
    setLoading(false);
  }, [fSubject, fTopic, fSourceFile, fExamName, fSearch]);

  useEffect(() => { fetchQuestions(1); }, [fetchQuestions]);

  function openEdit(q: Question) {
    setEditing(q);
    setForm(toForm(q));
    setSaveError("");
  }

  async function handleSave() {
    if (!editing || !form) return;
    setSaving(true);
    setSaveError("");
    const res = await fetch(`/api/questions/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        examYear: form.examYear ? parseInt(form.examYear) : null,
        optionE: form.optionE || null,
        examName: form.examName || null,
        explanation: form.explanation || null,
        theory: form.theory || null,
        topic: form.topic || null,
        subject: form.subject || null,
      }),
    });
    if (!res.ok) { setSaveError("Save failed."); setSaving(false); return; }
    const updated: Question = await res.json();
    setQuestions((prev) => prev.map((q) => q.id === updated.id ? updated : q));
    setEditing(null);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    setDeleting(null);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setTotal((t) => t - 1);
  }

  const Field = ({ label, name, textarea }: { label: string; name: keyof EditForm; textarea?: boolean }) => (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={form![name]}
          onChange={(e) => setForm((f) => f && ({ ...f, [name]: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623] resize-none"
        />
      ) : (
        <input
          value={form![name]}
          onChange={(e) => setForm((f) => f && ({ ...f, [name]: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">Questions</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total.toLocaleString()} total questions</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <select
            value={fSubject}
            onChange={(e) => { setFSubject(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
          >
            <option value="">All Subjects</option>
            {filters.subjects.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select
            value={fTopic}
            onChange={(e) => { setFTopic(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
          >
            <option value="">All Topics</option>
            {filters.topics.map((t) => <option key={t}>{t}</option>)}
          </select>

          <select
            value={fSourceFile}
            onChange={(e) => { setFSourceFile(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
          >
            <option value="">All Files</option>
            {filters.sourceFiles.map((f) => <option key={f}>{f}</option>)}
          </select>

          <select
            value={fExamName}
            onChange={(e) => { setFExamName(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
          >
            <option value="">All Exams</option>
            {filters.examNames.map((e) => <option key={e}>{e}</option>)}
          </select>

          <div className="flex gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setFSearch(searchInput); setPage(1); } }}
              placeholder="Search questions…"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
            />
            <button
              onClick={() => { setFSearch(searchInput); setPage(1); }}
              className="px-3 py-2 bg-[#F5A623] rounded-lg text-[#0A1628] font-bold text-sm hover:bg-[#D4891A] transition-colors"
            >
              🔍
            </button>
          </div>
        </div>

        {(fSubject || fTopic || fSourceFile || fExamName || fSearch) && (
          <button
            onClick={() => { setFSubject(""); setFTopic(""); setFSourceFile(""); setFExamName(""); setFSearch(""); setSearchInput(""); }}
            className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-16 text-center text-gray-400">Loading…</div>
        ) : questions.length === 0 ? (
          <div className="p-16 text-center text-gray-400">No questions found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 w-10">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[90px]">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[100px]">Topic</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[220px]">Theory</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[260px]">Question</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[200px]">Options</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 w-20">Answer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[220px]">Explanation</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[90px]">Exam</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 w-14">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[110px]">Source File</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50/60 align-top">
                  <td className="px-4 py-3 font-bold text-[#0A1628] text-xs">{q.number}</td>
                  <td className="px-4 py-3">
                    {q.subject && (
                      <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                        {q.subject}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {q.topic && (
                      <span className="bg-[#0A1628]/10 text-[#0A1628] text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                        {q.topic}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed">
                    {q.theory ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-800 leading-relaxed">
                    <p className="line-clamp-3 text-sm">{q.questionText}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-1 text-xs">
                      {(["A","B","C","D"] as const).map((opt) => {
                        const val = q[`option${opt}` as keyof Question] as string;
                        const isCorrect = q.answer.toLowerCase() === opt.toLowerCase();
                        return (
                          <li key={opt} className={`flex gap-1.5 ${isCorrect ? "text-green-700 font-semibold" : "text-gray-500"}`}>
                            <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isCorrect ? "bg-green-100" : "bg-gray-100"}`}>{opt}</span>
                            {val}
                          </li>
                        );
                      })}
                      {q.optionE && (
                        <li className={`flex gap-1.5 ${q.answer.toLowerCase() === "e" ? "text-green-700 font-semibold" : "text-gray-500"}`}>
                          <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${q.answer.toLowerCase() === "e" ? "bg-green-100" : "bg-gray-100"}`}>E</span>
                          {q.optionE}
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full text-xs">
                      ({q.answer})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed">
                    {q.explanation ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{q.examName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{q.examYear ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[110px]">{q.sourceFile ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(q)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#0A1628]/10 text-[#0A1628] hover:bg-[#0A1628]/20 font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(q.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-semibold transition-colors"
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 flex-wrap gap-3">
          <span>Page {page} of {pages} · {total.toLocaleString()} questions</span>
          <div className="flex items-center gap-1 flex-wrap">
            {/* Prev */}
            <button
              disabled={page <= 1}
              onClick={() => fetchQuestions(page - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#F5A623] disabled:opacity-40 transition-colors text-xs font-semibold"
            >← Prev</button>

            {(() => {
              // Build: first 3, ellipsis, last 3, with current window of ±1
              const nums = new Set<number>();
              // first 3
              for (let i = 1; i <= Math.min(3, pages); i++) nums.add(i);
              // window around current
              for (let i = Math.max(1, page - 1); i <= Math.min(pages, page + 1); i++) nums.add(i);
              // last 3
              for (let i = Math.max(1, pages - 2); i <= pages; i++) nums.add(i);

              const sorted = Array.from(nums).sort((a, b) => a - b);
              const items: (number | "...")[] = [];
              sorted.forEach((n, i) => {
                if (i > 0 && n - sorted[i - 1] > 1) items.push("...");
                items.push(n);
              });

              return items.map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-gray-400 text-xs select-none">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => fetchQuestions(item)}
                    className={`min-w-[32px] px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      item === page
                        ? "bg-[#0A1628] text-white border-[#0A1628]"
                        : "border-gray-200 hover:border-[#F5A623] text-gray-600"
                    }`}
                  >
                    {item}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              disabled={page >= pages}
              onClick={() => fetchQuestions(page + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#F5A623] disabled:opacity-40 transition-colors text-xs font-semibold"
            >Next →</button>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && form && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-[#0A1628] text-lg">Edit Question #{editing.number}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Question Text" name="questionText" textarea />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Option A" name="optionA" />
                <Field label="Option B" name="optionB" />
                <Field label="Option C" name="optionC" />
                <Field label="Option D" name="optionD" />
                <Field label="Option E (optional)" name="optionE" />
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Answer</label>
                  <select
                    value={form.answer}
                    onChange={(e) => setForm((f) => f && ({ ...f, answer: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F5A623]"
                  >
                    {["a","b","c","d","e"].map((o) => (
                      <option key={o} value={o}>{o.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Field label="Explanation" name="explanation" textarea />
              <Field label="Theory" name="theory" textarea />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Subject" name="subject" />
                <Field label="Topic" name="topic" />
                <Field label="Exam Name" name="examName" />
                <Field label="Exam Year" name="examYear" />
              </div>
            </div>

            {saveError && <p className="px-6 text-red-500 text-sm">{saveError}</p>}

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-[#F5A623] text-[#0A1628] text-sm font-bold hover:bg-[#D4891A] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleting && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleting(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-4">🗑️</div>
            <h2 className="font-bold text-[#0A1628] text-lg mb-2">Delete Question?</h2>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleting(null)}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleting)}
                className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
