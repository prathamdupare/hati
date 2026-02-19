export async function autodiscovery(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    const html = await res.text()

    const links = [...html.matchAll(
      /<link[^>]*type=["']application\/(rss\+xml|atom\+xml)["'][^>]*href=["']([^"']+)["']/gi
    )]

    if (!links.length) return null

    const feedUrl = links[0][2]

    return new URL(feedUrl, url).href
  } catch {
    return null
  }
}
