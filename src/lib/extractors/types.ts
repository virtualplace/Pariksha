export interface ParsedQuestion {
  number: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  answer: string;
  examName?: string;
  examYear?: number;
  explanation?: string;
  topic?: string;
  theory?: string;
}

export type ExtractorType = "plain" | "gc-environment" | "gc-history";
