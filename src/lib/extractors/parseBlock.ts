import { ParsedQuestion } from "./types";

export function parseQuestionBlock(
  block: string,
  topic: string | undefined,
  theory: string | undefined
): ParsedQuestion | null {
  const numMatch = block.match(/^(\d{1,3})\.\s*/);
  if (!numMatch) return null;
  const number = parseInt(numMatch[1], 10);

  const ansMatch = block.match(/Ans\.\s*\(([^)]+)\)/i);
  if (!ansMatch) return null;
  const answer = ansMatch[1].trim();
  const ansIdx = block.indexOf(ansMatch[0]);

  const firstOptionIdx = block.search(/\(a\)/i);
  if (firstOptionIdx === -1 || firstOptionIdx > ansIdx) return null;

  const questionText = block
    .slice(numMatch[0].length, firstOptionIdx)
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const optionsBlock = block.slice(firstOptionIdx, ansIdx);
  const options: Record<string, string> = {};
  const optMarkers = [...optionsBlock.matchAll(/\(([a-e])\)\s*/gi)];
  for (let i = 0; i < optMarkers.length; i++) {
    const key = optMarkers[i][1].toLowerCase();
    const start = optMarkers[i].index! + optMarkers[i][0].length;
    const end = i + 1 < optMarkers.length ? optMarkers[i + 1].index! : optionsBlock.length;
    options[key] = optionsBlock.slice(start, end).replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  }
  if (!options.a || !options.b || !options.c || !options.d) return null;

  const examLineMatch = optionsBlock.match(
    /\n\s*([A-Z][A-Za-z.\s/()]*(?:P\.C\.S\.|P\.S\.C\.|R\.O\.|A\.R\.O\.|I\.A\.S\.|B\.P\.S\.C\.|P\.P\.S\.|U\.P\.S\.C\.)[A-Za-z.\s()]*)\s+(\d{4})\s*\n/
  );
  const examName = examLineMatch ? examLineMatch[1].trim() : undefined;
  const examYear = examLineMatch ? parseInt(examLineMatch[2], 10) : undefined;

  const afterAns = block
    .slice(ansIdx + ansMatch[0].length)
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    number,
    questionText,
    optionA: options.a,
    optionB: options.b,
    optionC: options.c,
    optionD: options.d,
    optionE: options.e,
    answer,
    examName,
    examYear,
    explanation: afterAns || undefined,
    topic,
    theory,
  };
}

export function splitAndParseBlocks(
  block: string,
  topic: string | undefined,
  theory: string | undefined
): ParsedQuestion[] {
  return block
    .split(/(?=^\s*\d{1,3}\.\s)/m)
    .filter(Boolean)
    .map((c) => parseQuestionBlock(c.trim(), topic, theory))
    .filter((q): q is ParsedQuestion => q !== null);
}
