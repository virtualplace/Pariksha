export { type ParsedQuestion, type ExtractorType } from "./types";
export { extractPlain }        from "./plain";
export { extractGcEnvironment } from "./gcEnvironment";
export { extractGcHistory }    from "./gcHistory";

import { ExtractorType, ParsedQuestion } from "./types";
import { extractPlain }        from "./plain";
import { extractGcEnvironment } from "./gcEnvironment";
import { extractGcHistory }    from "./gcHistory";

export function extract(rawText: string, extractor: ExtractorType): ParsedQuestion[] {
  switch (extractor) {
    case "gc-environment": return extractGcEnvironment(rawText);
    case "gc-history":     return extractGcHistory(rawText);
    case "plain":
    default:               return extractPlain(rawText);
  }
}
