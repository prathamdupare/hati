export async function reddit(url: string): Promise<string | null> {
  // Fast exit
  if (!url.includes("reddit.com")) return null;

  if (url.includes("/r/")) {
    return url.endsWith("/")
      ? `${url.slice(0, -1)}.rss`
      : `${url}.rss`
  }
  return null
}
