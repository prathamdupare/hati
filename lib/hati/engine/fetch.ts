export async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Hati-Aggregator/1.0",
      "Connection": "keep-alive"
    },
  })

  if (!res.ok) {
    throw new Error(`Fetch failed: ${url}`)
  }

  return res.text()
}
