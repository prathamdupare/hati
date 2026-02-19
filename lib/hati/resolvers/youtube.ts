import { Innertube } from "youtubei.js";

let yt: Innertube | null = null;

export async function youtube(url: string): Promise<string | null> {
  // 1. FAST EXIT: Not a YouTube link?
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    return null;
  }

  // If we already have the XML link. Don't ask the API.
  if (url.includes("/feeds/videos.xml")) {
    return url;
  }

  // 3. Initialize API (Only if needed)
  if (!yt) {
    yt = await Innertube.create();
  }

  try {
    // Check for standard channel URL: youtube.com/channel/UC...
    const match = url.match(/channel\/(UC[\w-]+)/);
    if (match) {
      return `https://www.youtube.com/feeds/videos.xml?channel_id=${match[1]}`;
    }

    // Ask Innertube to resolve custom URLs (e.g. @LinusTechTips)
    const navigation = await yt.resolveURL(url);

    if (!navigation?.payload?.browseId) {
      return null;
    }

    const channelId = navigation.payload.browseId;
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  } catch (err) {
    console.error("Resolver error:", err);
    return null;
  }
}
