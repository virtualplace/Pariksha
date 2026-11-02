"use client";

import { useState, useRef } from "react";
import { ParsedQuestion } from "@/lib/extractors";

const subjects = ["History", "Geography", "Polity", "Economy", "Science", "Environment", "Current Affairs"];

const extractors: { value: string; label: string; hint: string }[] = [
  { value: "plain",          label: "Plain",          hint: "Simple numbered questions, no topic sections" },
  { value: "gc-environment", label: "GC Environment",  hint: "GC book with \\nQuestions\\n section separators" },
  { value: "gc-history",     label: "GC History",      hint: "GC book with INDEX + chapter headings" },
];

type Step = "idle" | "extracting" | "preview" | "saving" | "saved";

function OptionsList({ q }: { q: ParsedQuestion }) {
  const correct = q.answer.toLowerCase().replace(/\s/g, "");
  const opts: [string, string][] = [
    ["a", q.optionA],
    ["b", q.optionB],
    ["c", q.optionC],
    ["d", q.optionD],
    ...(q.optionE ? [["e", q.optionE] as [string, string]] : []),
  ];
  return (
    <ul className="space-y-1 text-xs">
      {opts.map(([key, val]) => {
        const isCorrect = correct.includes(key);
        return (
          <li
            key={key}
            className={`flex gap-1.5 ${isCorrect ? "text-green-700 font-semibold" : "text-gray-500"}`}
          >
            <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isCorrect ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {key}
            </span>
            <span>{val}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject]       = useState(subjects[0]);
  const [extractor, setExtractor]   = useState(extractors[0].value);
  const [step, setStep] = useState<Step>("idle");
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [sourceFile, setSourceFile] = useState("");
  const [error, setError] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleExtract() {
    if (!file) return;
    setStep("extracting");
    setError("");

    const form = new FormData();
    form.append("file", file);
    form.append("extractor", extractor);

    const res = await fetch("/api/upload/extract", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Extraction failed.");
      setStep("idle");
      return;
    }

    setQuestions(data.questions);
    setSourceFile(data.sourceFile);
    setStep("preview");
  }

  async function handleSave() {
    setStep("saving");
    setError("");

    const res = await fetch("/api/upload/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions, sourceFile, subject }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Save failed.");
      setStep("preview");
      return;
    }

    setSavedCount(data.count);
    setStep("saved");
  }

  function handleReset() {
    setFile(null);
    setQuestions([]);
    setSourceFile("");
    setError("");
    setStep("idle");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A1628] mb-6">Upload Question PDF</h1>

      {/* ── Step 1: Upload form ── */}
      {(step === "idle" || step === "extracting") && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl">
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-[#F5A623] transition-colors"
          >
            <div className="text-4xl mb-3">📄</div>
            {file ? (
              <p className="font-semibold text-[#0A1628]">{file.name}</p>
            ) : (
              <p className="text-gray-400">Click to select a PDF file</p>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(""); }}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]"
              >
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Extractor</label>
              <select
                value={extractor}
                onChange={(e) => setExtractor(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5A623]"
              >
                {extractors.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {extractors.find((e) => e.value === extractor)?.hint}
              </p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            onClick={handleExtract}
            disabled={!file || step === "extracting"}
            className="mt-6 w-full bg-[#F5A623] text-[#0A1628] py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors disabled:opacity-50"
          >
            {step === "extracting" ? "Extracting..." : "Extract Questions"}
          </button>
        </div>
      )}

      {/* ── Step 2: Preview + Save ── */}
      {(step === "preview" || step === "saving") && (
        <div>
          {/* Summary bar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <p className="font-bold text-[#0A1628] text-lg">
                {questions.length} questions extracted
                <span className="text-[#F5A623] ml-2">· {sourceFile}</span>
              </p>
              <p className="text-sm text-gray-500 mt-0.5">Subject: {subject} · Review below, then save to database.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors"
              >
                ← Start Over
              </button>
              <button
                onClick={handleSave}
                disabled={step === "saving"}
                className="px-6 py-2.5 rounded-full bg-[#0A1628] text-white text-sm font-bold hover:bg-[#0A1628]/80 transition-colors disabled:opacity-50"
              >
                {step === "saving" ? "Saving..." : `Save ${questions.length} Questions to DB`}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 w-8">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[110px]">Subject</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[110px]">Topic</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[200px]">Theory</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[240px]">Question</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[180px]">Options</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 w-20">Answer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[200px]">Explanation</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 min-w-[110px]">Exam</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 w-16">Year</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.number} className="border-b border-gray-50 hover:bg-gray-50/60 align-top">
                    <td className="px-4 py-4 font-bold text-[#0A1628]">{q.number}</td>

                    {/* Subject — always shown */}
                    <td className="px-4 py-4">
                      <span className="bg-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">{subject}</span>
                    </td>

                    {/* Topic — falls back to subject if empty */}
                    <td className="px-4 py-4">
                      <span className="bg-[#0A1628]/10 text-[#0A1628] text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                        {q.topic ?? subject}
                      </span>
                    </td>

                    {/* Theory */}
                    <td className="px-4 py-4 text-gray-500 text-xs leading-relaxed max-w-[200px]">
                      {q.theory ?? <span className="text-gray-300 italic">—</span>}
                    </td>

                    {/* Full question text */}
                    <td className="px-4 py-4 text-gray-800 text-sm leading-relaxed">
                      {q.questionText}
                    </td>

                    {/* Options with correct answer highlighted */}
                    <td className="px-4 py-4">
                      <OptionsList q={q} />
                    </td>

                    {/* Answer badge */}
                    <td className="px-4 py-4">
                      <span className="bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full text-xs">
                        ({q.answer})
                      </span>
                    </td>

                    {/* Explanation — separate column */}
                    <td className="px-4 py-4 text-gray-500 text-xs leading-relaxed">
                      {q.explanation ?? <span className="text-gray-300 italic">—</span>}
                    </td>

                    <td className="px-4 py-4 text-gray-500 text-xs">{q.examName ?? "—"}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs">{q.examYear ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Step 3: Success ── */}
      {step === "saved" && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 max-w-lg text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-[#0A1628]">{savedCount} Questions Saved!</h2>
          <p className="text-gray-500 mt-2 text-sm">
            All questions from <span className="font-semibold">{sourceFile}</span> have been saved to the database.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 bg-[#F5A623] text-[#0A1628] px-8 py-3 rounded-full font-bold hover:bg-[#D4891A] transition-colors"
          >
            Upload Another PDF
          </button>
        </div>
      )}
    </div>
  );
}
