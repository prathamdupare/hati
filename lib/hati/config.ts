import { YAML } from "bun"; 

// --- Configuration Types ---

export interface HatiConfig {
  pages: Page[];
}

export interface Page {
  name: string;
  columns: Column[];
}

export interface Column {
  size: "small" | "full" | "medium";
  widgets: Widget[];
}

export interface RSSWidget {
  type: "rss";
  limit?: number;
  cache?: string; 
  feeds: {
    url: string;
    title?: string;
  }[];
}

export interface VideoWidget {
  type: "videos";
  channels: string[]; 
  limit?: number;
}

export interface WeatherWidget {
  type: "weather";
  location: string;
}

export type Widget =
  | RSSWidget
  | VideoWidget
  | WeatherWidget;

// --- Engine & Parser Types ---

/**
 * Represents the final normalized item used by the UI
 */
export interface HatiItem {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  author?: string;
  content?: string;
  thumbnail?: string;
  feedTitle: string;
  platform: "youtube" | "generic";
}

/**
 * Matches the structure returned by rss-parser with our customFields
 */
export interface CustomItem {
  title?: string;
  link?: string;
  id?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
  contentSnippet?: string;
  content?: string;
  // Custom fields defined in parse.ts
  videoId?: string; 
  media?: {
    'media:thumbnail'?: { $: { url: string } } | { $: { url: string } }[];
  };
}

/**
 * The top-level structure from rss-parser
 */
export interface RawFeed {
  title?: string;
  items?: CustomItem[];
}

// --- Loader ---

export async function loadConfig(path: string = "hati.yaml"): Promise<HatiConfig> {
  try {
    const file = Bun.file(path);
    const text = await file.text();
    return YAML.parse(text) as HatiConfig;
  } catch (err: unknown) {
    // Strict error handling
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Failed to load config from ${path}: ${message}`);
    throw err;
  }
}
