import { resolve } from "../resolvers"
import { cachedFetch, getCachedResolution, setCachedResolution } from "./cache"
import { parse } from "./parse"
import { normalize } from "./normalize"
import { dedupe } from "./dedupe"
import { HatiItem } from "../types"

export async function runEngine(urls: string[]): Promise<HatiItem[]> {
  const jobs = urls.map(async (url) => {
    try {
      // 1. Resolve & Cache Check
      let feedUrl = getCachedResolution(url);
      if (!feedUrl) {
        if (url.includes("/feeds/videos.xml")) {
          feedUrl = url;
        } else {
          feedUrl = await resolve(url);
        }
        if (feedUrl) setCachedResolution(url, feedUrl);
      }

      // 2. Fetch
      const xml = await cachedFetch(feedUrl || url);

      // 3. Parse (MUST BE AWAITED NOW)
      const parsed = await parse(xml);

      // 4. Normalize
      return normalize(parsed);

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Engine error for ${url}: ${err.message}`);
      } else {
        console.error(`Unexpected error for ${url}:`, err);
      }
      return []
    }
  })

  const results = await Promise.all(jobs)
  return dedupe(results.flat())
}
