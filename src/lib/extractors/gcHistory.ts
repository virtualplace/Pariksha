import { ParsedQuestion } from "./types";
import { normalize } from "./normalize";
import { splitAndParseBlocks } from "./parseBlock";

interface ChapterEntry {
  num: number;
  name: string;
  // raw page range from index e.g. "B9-B16" — kept for reference, not used for splitting
  pages: string;
}

// Parse the INDEX block into a list of chapter entries
function parseIndex(text: string): ChapterEntry[] {
  const indexStart = text.indexOf("INDEX");
  if (indexStart === -1) return [];

  // Index ends at the first chapter's actual content — heuristic: stop after ~6000 chars
  const indexBlock = text.slice(indexStart, indexStart + 7000);

  // Pattern: "1. Stone AgeB9-B16" or "10. Post-Mauryan PeriodB119-B129"
  // Page refs are like B9-B16, B119-B129, B–9 etc.
  const entries: ChapterEntry[] = [];
  const re = /(\d+)\.\s*([\s\S]+?)([A-Z][-–]?\d+[-–][A-Z][-–]?\d+)/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(indexBlock)) !== null) {
    const name = m[2]
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      // strip trailing roman numerals / section headers that bleed in
      .replace(/\s*(I{1,3}|IV|V|VI|VII|VIII|IX|X)\.\s*$/, "")
      .trim();

    if (name.length > 1 && name.length < 80) {
      entries.push({ num: parseInt(m[1], 10), name, pages: m[3] });
    }
  }

  // Deduplicate by name (index sometimes has duplicate entries across sections)
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });
}

// Extract * bullet theory lines from the top of a chapter block (before first question)
function extractTheory(chapterBlock: string): string | undefined {
  // Take everything before the first numbered question
  const firstQIdx = chapterBlock.search(/\n\s*\d{1,3}\.\s+\S/);
  const preamble = firstQIdx !== -1 ? chapterBlock.slice(0, firstQIdx) : chapterBlock;

  const theory = preamble
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("*"))
    .map((l) => l.replace(/^\*\s*/, "").trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return theory || undefined;
}

// Find the position of a chapter heading in the body text (skip its index occurrence)
function findChapterBodyPos(text: string, chapterName: string, afterPos: number): number {
  let pos = text.indexOf(chapterName, afterPos);
  // The heading in the body is typically on its own line (preceded by a page marker like B–17)
  // Walk forward past any index occurrences until we find one that's followed by theory/question content
  while (pos !== -1) {
    const before = text.slice(Math.max(0, pos - 30), pos);
    const after  = text.slice(pos + chapterName.length, pos + chapterName.length + 200);
    // Body heading: preceded by newline/page-marker, followed by theory (*) or question content
    if (/[\n\r]/.test(before) && /[\n\r]/.test(after)) {
      return pos;
    }
    pos = text.indexOf(chapterName, pos + 1);
  }
  return -1;
}

export function extractGcHistory(rawText: string): ParsedQuestion[] {
  const text = normalize(rawText);
  const chapters = parseIndex(text);

  if (chapters.length === 0) {
    // Fallback: no index found, treat as plain
    return splitAndParseBlocks(text, undefined, undefined);
  }

  // Find body positions for each chapter heading
  // Index ends roughly where the first chapter body starts — skip the index region
  const indexEnd = text.indexOf("INDEX") + 7000;

  const positions: { name: string; pos: number }[] = [];
  for (const ch of chapters) {
    const pos = findChapterBodyPos(text, ch.name, indexEnd);
    if (pos !== -1) positions.push({ name: ch.name, pos });
  }

  // Sort by position in document
  positions.sort((a, b) => a.pos - b.pos);

  if (positions.length === 0) {
    return splitAndParseBlocks(text, undefined, undefined);
  }

  const results: ParsedQuestion[] = [];

  for (let i = 0; i < positions.length; i++) {
    const { name, pos } = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1].pos : text.length;
    const chapterBlock = text.slice(pos + name.length, end);

    const theory = extractTheory(chapterBlock);
    const qs     = splitAndParseBlocks(chapterBlock, name, theory);
    results.push(...qs);
  }

  return results;
}
