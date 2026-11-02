import { ParsedQuestion } from "./types";
import { normalize } from "./normalize";
import { splitAndParseBlocks } from "./parseBlock";

export function extractPlain(rawText: string): ParsedQuestion[] {
  return splitAndParseBlocks(normalize(rawText), undefined, undefined);
}
