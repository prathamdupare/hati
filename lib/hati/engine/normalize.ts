import { HatiItem, RawFeed, RawFeedItem } from "../types";

// Helper: Deterministic Hash
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
};

export function normalize(feed: RawFeed): HatiItem[] {
  const feedTitle = feed.title ?? "Unknown Feed";

  // Use RawFeedItem for rss-parser structure
  return (feed.items ?? []).map((item: RawFeedItem) => {
    const title = item.title ?? "Untitled";
    const link = item.link ?? "";

    // ID Logic (Prefer YouTube Video ID)
    const id = item.videoId ?? item.guid ?? item.id ?? simpleHash(title + link);

    const publishedAt = item.isoDate ?? item.pubDate ?? new Date().toISOString();

    let thumbnail = undefined;

    if (item.media && item.media['media:thumbnail']) {
      const thumbs = item.media['media:thumbnail'];
      const firstThumb = thumbs && (Array.isArray(thumbs) ? thumbs[0] : thumbs);
      if (firstThumb) {
        thumbnail = firstThumb.$?.url ?? firstThumb.url;
      }
    }

    // 4. Platform Detection
    const isYouTube = !!item.videoId || link.includes("youtube.com");

    return {
      id: id,
      title: title,
      link: link,
      publishedAt: publishedAt,
      author: item.creator ?? item.author ?? feedTitle,
      content: item.contentSnippet ?? item.content ?? "",
      thumbnail: thumbnail,
      feedTitle: feedTitle,
      platform: isYouTube ? "youtube" : "generic"
    };
  })
}
