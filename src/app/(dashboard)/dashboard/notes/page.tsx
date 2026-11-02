"use client";

import { useEffect, useState } from "react";

interface Note {
  id: string;
  content: string;
  sourceType: string;
  questionId: string | null;
  quizId: string | null;
  attemptId: string | null;
  createdAt: string;
}

const SOURCE_STYLE: Record<string, string> = {
  theory:      "bg-blue-100 text-blue-600",
  explanation: "bg-amber-100 text-amber-600",
  manual:      "bg-gray-100 text-gray-500",
};

export default function NotesPage() {
  const [notes, setNotes]     = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => { setNotes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  const types = ["all", ...Array.from(new Set(notes.map((n) => n.sourceType)))];
  const filtered = filter === "all" ? notes : notes.filter((n) => n.sourceType === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1628]">My Notes</h1>
        <p className="text-gray-500 text-sm mt-0.5">All notes saved from quiz reviews</p>
      </div>

      {/* Filter pills */}
      {notes.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${filter === t ? "bg-[#0A1628] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >
              {t === "all" ? `All (${notes.length})` : `${t} (${notes.filter((n) => n.sourceType === t).length})`}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading notes…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">📌</div>
          <p className="text-gray-500">No notes yet.</p>
          <p className="text-gray-400 text-sm mt-1">Attempt a quiz and save highlights from explanations and theory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SOURCE_STYLE[note.sourceType] ?? "bg-gray-100 text-gray-500"}`}>
                      {note.sourceType}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{note.content}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
