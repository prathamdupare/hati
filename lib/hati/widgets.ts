import { runEngine } from "./engine";
import {
  RSSWidgetConfig,
  VideoWidgetConfig,
  HackerNewsWidgetConfig,
  LobstersWidgetConfig,
  RedditWidgetConfig,
  HatiItem,
  HackerNewsItem,
  LobstersItem,
  PageConfig
} from "./types";

type WidgetData = HatiItem[];

interface FetchResult {
  widgetKey: string;
  data?: WidgetData;
}

export async function fetchAllWidgetData(page: PageConfig): Promise<Map<string, WidgetData>> {
  const fetchPromises: Promise<FetchResult>[] = [];
  let widgetIndex = 0;

  for (const col of page.columns) {
    for (const widget of col.widgets) {
      const widgetKey = `widget-${widgetIndex}`;
      
      let fetcher: Promise<HatiItem[]>;
      switch (widget.type) {
        case "videos":
          fetcher = fetchVideoData(widget as VideoWidgetConfig);
          break;
        case "rss":
          fetcher = fetchRSSData(widget as RSSWidgetConfig);
          break;
        case "hacker-news":
          fetcher = fetchHackerNewsData(widget as HackerNewsWidgetConfig);
          break;
        case "lobsters":
          fetcher = fetchLobstersData(widget as LobstersWidgetConfig);
          break;
        case "reddit":
          fetcher = fetchRedditData(widget as RedditWidgetConfig);
          break;
        default:
          fetcher = Promise.resolve([]);
      }
      
      fetchPromises.push(
        fetcher.then(data => ({ widgetKey, data })).catch(() => ({ widgetKey, data: [] as WidgetData }))
      );
      widgetIndex++;
    }
  }

  const results = await Promise.all(fetchPromises);
  const dataMap = new Map<string, WidgetData>();
  for (const result of results) {
    dataMap.set(result.widgetKey, result.data || []);
  }

  return dataMap;
}

export async function fetchVideoData(config: VideoWidgetConfig): Promise<HatiItem[]> {
  const urls = config.channels.map(
    (id) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`
  );
  const { items } = await runEngine(urls);
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return config.limit ? items.slice(0, config.limit) : items;
}

export async function fetchRSSData(config: RSSWidgetConfig): Promise<HatiItem[]> {
  const urls = config.feeds.map((f) => f.url);
  const { items } = await runEngine(urls);
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return config.limit ? items.slice(0, config.limit) : items;
}

export async function fetchHackerNewsData(config: HackerNewsWidgetConfig): Promise<HatiItem[]> {
  const limit = config.limit ?? 5;
  const topStoriesRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { next: { revalidate: 300 } }
  );
  if (!topStoriesRes.ok) throw new Error("Failed to fetch Hacker News");
  const topStories = await topStoriesRes.json();
  const limitedIds = topStories.slice(0, limit);
  const items = await Promise.all(
    limitedIds.map(async (id: number) => {
      const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return itemRes.json();
    })
  );
  return items.filter(Boolean).map((item: HackerNewsItem) => ({
    id: String(item.id),
    title: item.title,
    link: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    publishedAt: new Date(item.time * 1000).toISOString(),
    author: item.by,
    platform: 'generic' as const,
  }));
}

export async function fetchLobstersData(config: LobstersWidgetConfig): Promise<HatiItem[]> {
  const limit = config.limit ?? 8;
  const res = await fetch("https://lobste.rs/hottest.json", { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch Lobsters");
  const data = await res.json();
  return data.slice(0, limit).map((item: LobstersItem) => ({
    id: item.url,
    title: item.title,
    link: item.url,
    publishedAt: item.created_at,
    author: item.submitter,
    platform: 'generic' as const,
  }));
}

export async function fetchRedditData(config: RedditWidgetConfig): Promise<HatiItem[]> {
  const feedUrl = `https://www.reddit.com/r/${config.subreddit}/.rss`;
  const { items } = await runEngine([feedUrl]);
  return items.slice(0, config.limit ?? 8);
}
