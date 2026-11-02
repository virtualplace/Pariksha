import { ParsedQuestion } from "./types";
import { normalize } from "./normalize";
import { splitAndParseBlocks } from "./parseBlock";

function isTopicLine(t: string): boolean {
  return (
    t.length >= 3 &&
    t.length <= 45 &&
    !t.startsWith("*") &&
    !t.startsWith("'") &&
    !t.startsWith('"') &&
    !/^[a-z(]/.test(t) &&
    !/^[A-Z]-+\d+/.test(t) &&
    !/^\d+[.)]\s/.test(t) &&
    !/[.!?,;:]$/.test(t) &&
    !/\d{4}/.test(t) &&
    !/^\d+$/.test(t) &&
    !/\d+%/.test(t) &&
    !/^[A-Z]{3,}\s*$/.test(t) &&
    !t.includes(",") &&
    !/ - /.test(t) &&
    !/\(\d+\)/.test(t) &&
    !/^(Figure|Table|th|nd|rd|st)/.test(t) &&
    !t.includes("&")
  );
}

function extractTopicAndTheory(afterLastAns: string): {
  topic: string | undefined;
  theory: string | undefined;
} {
  const lines = afterLastAns.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const lastLine = lines[lines.length - 1];
  const topic = lastLine && isTopicLine(lastLine) ? lastLine : undefined;

  const theory =
    lines
      .filter((l) => l.startsWith("*"))
      .map((l) => l.replace(/^\*\s*/, "").trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || undefined;

  return { topic, theory };
}

export function extractGcEnvironment(rawText: string): ParsedQuestion[] {
  const text = normalize(rawText).replace(/Environment & Ecology\s*\n/g, "");
  const results: ParsedQuestion[] = [];
  const parts = text.split(/\nQuestions\n/i);

  for (let i = 0; i < parts.length - 1; i++) {
    const block = parts[i];
    const allAnsMatches = [...block.matchAll(/Ans\.\s*\([^)]+\)/gi)];
    const lastAns = allAnsMatches[allAnsMatches.length - 1];
    const afterLastAns = lastAns ? block.slice(lastAns.index! + lastAns[0].length) : block;

    const { topic, theory } = extractTopicAndTheory(afterLastAns);
    results.push(...splitAndParseBlocks(parts[i + 1], topic, theory));
  }

  return results;
}
