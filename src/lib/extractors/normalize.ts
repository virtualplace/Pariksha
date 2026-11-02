export function normalize(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/CLICK HERE[^\n]*/gi, "")
    .replace(/Join @\S+/gi, "")
    .replace(/Join-?>?\s*https?:\/\/\S+/gi, "")
    .replace(/[A-Z]-+\d+\s+General Studies[^\n]*/g, "")
    .replace(/General Studies\s*\n/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}
