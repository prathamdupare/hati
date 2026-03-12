
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

// Used by the RSS Parser engine
export interface RawFeedItem {
  id?: string;
  guid?: string;
  link?: string;
  title?: string;
  published?: Date | string;
  isoDate?: string;
  pubDate?: string;
  created?: number;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  creator?: string;
  author?: string;
  authors?: { name?: string }[];
  
  // rss-parser flattens these from namespaces
  videoId?: string;
  
  // NAMESPACE EXTENSIONS
  yt?: {
    videoId?: string;
    channelId?: string;
  };
  media?: {
    thumbnail?: { url: string } | { url: string }[]; 
    group?: {
      thumbnail?: { url: string } | { url: string }[];
      content?: { url: string };
    };
    // rss-parser uses this format for media:thumbnail
    'media:thumbnail'?: { $?: { url: string }; url?: string } | { $?: { url: string }; url?: string }[];
  };
}

export interface RawFeed {
  title?: string;
  items?: RawFeedItem[];
}

export type WidgetType = 
  | "calendar" 
  | "rss" 
  | "twitch-channels" 
  | "group" 
  | "hacker-news" 
  | "lobsters" 
  | "videos" 
  | "reddit" 
  | "weather" 
  | "markets" 
  | "releases";

export type ColumnSize = "small" | "medium" | "large" | "full";

export interface BaseWidget {
  type: WidgetType;
  title?: string;
  cache?: string; 
}


export interface CalendarWidgetConfig extends BaseWidget {
  type: "calendar";
  "first-day-of-week"?: "monday" | "sunday";
}

export interface RSSWidgetConfig extends BaseWidget {
  type: "rss";
  limit?: number;
  "collapse-after"?: number;
  feeds: { 
    url: string; 
    title?: string; 
    limit?: number 
  }[];
}

export interface TwitchChannelsWidgetConfig extends BaseWidget {
  type: "twitch-channels";
  channels: string[];
}

export interface VideoWidgetConfig extends BaseWidget {
  type: "videos";
  channels: string[]; 
  limit?: number;
}

export interface RedditWidgetConfig extends BaseWidget {
  type: "reddit";
  subreddit: string;
  "show-thumbnails"?: boolean;
  limit?: number;
}

export interface WeatherWidgetConfig extends BaseWidget {
  type: "weather";
  location: string;
  units?: "metric" | "imperial";
  "hour-format"?: "12h" | "24h";
  "hide-location"?: boolean;
}

export interface MarketsWidgetConfig extends BaseWidget {
  type: "markets";
  markets: { 
    symbol: string; 
    name?: string 
  }[];
}

export interface ReleasesWidgetConfig extends BaseWidget {
  type: "releases";
  token?: string;
  repositories: string[]; 
}

export interface HackerNewsWidgetConfig extends BaseWidget {
  type: "hacker-news";
  limit?: number;
}

export interface LobstersWidgetConfig extends BaseWidget {
  type: "lobsters";
  limit?: number;
}

export interface GroupWidgetConfig extends BaseWidget {
  type: "group";
  widgets: WidgetConfig[]; 
}

// Union of all possible widget configurations
export type WidgetConfig = 
  | CalendarWidgetConfig
  | RSSWidgetConfig
  | TwitchChannelsWidgetConfig
  | VideoWidgetConfig
  | RedditWidgetConfig
  | WeatherWidgetConfig
  | MarketsWidgetConfig
  | ReleasesWidgetConfig
  | HackerNewsWidgetConfig
  | LobstersWidgetConfig
  | GroupWidgetConfig
  | BaseWidget; 

export interface ColumnConfig {
  size: ColumnSize;
  widgets: WidgetConfig[];
}

export interface PageConfig {
  name: string;
  "hide-desktop-navigation"?: boolean;
  columns: ColumnConfig[];
}

export interface HatiConfig {
  pages: PageConfig[];
  theme?: {
    "background-image"?: string;
  };
  cache?: {
    ttl?: number; // in seconds, default 300 (5 min)
  };
}

export interface EngineError {
  url: string;
  message: string;
  timestamp: string;
}

export interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  time: number;
  by: string;
}

export interface LobstersItem {
  url: string;
  title: string;
  created_at: string;
  submitter: string;
}
