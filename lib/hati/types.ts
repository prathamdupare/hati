export interface HatiItem {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  author?: string;
  content?: string;
  thumbnail?: string;
  feedTitle?: string;
  platform: 'youtube' | 'blog' | 'generic';
}
export interface HatiFeed {
  url: string;
  label: string;
}

export interface RawFeedItem {
  id?: string;
  link?: string;
  title?: string;
  published?: Date | string;
  pubDate?: string;
  created?: number;
  content?: string;
  summary?: string;
  authors?: { name?: string }[];
  
  // ⚡️ NAMESPACE EXTENSIONS
  yt?: {
    videoId?: string;
    channelId?: string;
  };
  media?: {
    thumbnail?: { url: string } | { url: string }[]; // Can be array or object
    group?: {
      thumbnail?: { url: string } | { url: string }[];
      content?: { url: string };
    };
  };
}

export interface RawFeed {
  title?: string;
  items?: RawFeedItem[];
}

