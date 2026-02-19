import path from "path";

// Feed Content Cache
interface CacheEntry {
  ts: number;
  data: string;
}
const contentCache = new Map<string, CacheEntry>();

// Resolution Cache
const resolutionCache = new Map<string, string>();

const CACHE_FILE = path.resolve(process.cwd(), ".hati-cache.json");

export async function initCache() {
  try {
    const file = Bun.file(CACHE_FILE);
    if (await file.exists()) {
      const json = await file.json();

      if (json.content) {
        for (const [k, v] of Object.entries(json.content)) {
          contentCache.set(k, v as CacheEntry);
        }
      }

      if (json.resolutions) {
        for (const [k, v] of Object.entries(json.resolutions)) {
          resolutionCache.set(k, v as string);
        }
      }
      console.log(`⚡️ Loaded ${contentCache.size} feeds & ${resolutionCache.size} resolutions.`);
    }
  } catch (e) {
    console.warn("Could not load disk cache, starting fresh.");
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null; // Use 'any' to avoid type conflicts

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const data = {
      content: Object.fromEntries(contentCache),
      resolutions: Object.fromEntries(resolutionCache)
    };
    try {
      await Bun.write(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (err) { console.warn("Cache write failed:", err); }
  }, 1000);
}

export async function cachedFetch(url: string, ttlArg: number = 5 * 60 * 1000) {
  const hit = contentCache.get(url);
  const now = Date.now();

  if (hit && now - hit.ts < ttlArg) {
    return hit.data;
  }

  console.log(`🌐 Fetching fresh content: ${url}`);
  try {
    // 🎭 SPOOFED HEADERS: Look like Chrome on Mac
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();

    contentCache.set(url, { ts: now, data: text });
    scheduleSave();
    return text;
  } catch (e) {
    if (hit) return hit.data;
    throw e;
  }
}

export function getCachedResolution(url: string): string | undefined {
  return resolutionCache.get(url);
}

export function setCachedResolution(originalUrl: string, resolvedUrl: string) {
  resolutionCache.set(originalUrl, resolvedUrl);
  scheduleSave();
}
