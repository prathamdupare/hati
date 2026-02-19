import Parser from "rss-parser";
import { RawFeed } from "../types";

// Configure parser to extract YouTube-specific tags
const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'media'], // Parse the media group (where thumbnails live)
      ['yt:videoId', 'videoId'], // Parse the YouTube Video ID
      ['yt:channelId', 'channelId'],
    ],
  },
});

export function sanitizeXML(xml: string): string {
  return xml.replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, '&amp;');
}

export async function parse(xml: string): Promise<RawFeed> {
  try {
    const cleanXml = sanitizeXML(xml)
    // rss-parser is ASYNC (returns a Promise)
    const feed = await parser.parseString(cleanXml);
    return feed as unknown as RawFeed;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("XML Parse Error:", err.message);
    }

    return { items: [] };
  }
}

