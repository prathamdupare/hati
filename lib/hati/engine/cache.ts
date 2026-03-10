import { getConfig } from "../config";

const DEFAULT_TTL = 300; // 5 minutes

export async function cachedFetch(url: string, ttlArg?: number) {
  const config = getConfig();
  const ttl = ttlArg ?? config?.cache?.ttl ?? DEFAULT_TTL;
  
  const res = await fetch(url, {
    next: { revalidate: ttl },
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return await res.text();
}
