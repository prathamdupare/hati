import { cachedFetch } from "./cache"
import { parse } from "./parse"
import { normalize } from "./normalize"
import { dedupe } from "./dedupe"
import { EngineError, HatiItem } from "../types"


export interface EngineResult {
  items: HatiItem[];
  errors: EngineError[];
}

export async function runEngine(urls: string[]): Promise<EngineResult> {
  const errors: EngineError[] = [];
  const jobs = urls.map(async (url) => {
    try {
      const xml = await cachedFetch(url);
      const parsed = await parse(xml);
      return normalize(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      errors.push({
        url,
        message,
        timestamp: new Date().toLocaleTimeString(),
      });
      return []
    }
  })

  const results = await Promise.all(jobs)
  return {
    items: dedupe(results.flat()),
    errors: errors

  }

}
