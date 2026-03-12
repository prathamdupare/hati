import { loadConfig, getConfig } from "@/lib/hati/config";
import { runEngine } from "@/lib/hati/engine";
import { Column } from "@/components/Column";
import { VideoWidgetClient } from "@/components/widgets/VideoWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { RSSWidget } from "@/components/widgets/RSSWidget";
import { HackerNewsWidget } from "@/components/widgets/HackerNewsWidget";
import { LobstersWidget } from "@/components/widgets/LobstersWidget";
import { RedditWidget } from "@/components/widgets/RedditWidget";
import { ReleasesWidget } from "@/components/widgets/ReleasesWidget";
import { ModeToggle } from "@/components/mode-toggle";
import {
  CalendarWidgetConfig,
  RSSWidgetConfig,
  VideoWidgetConfig,
  WeatherWidgetConfig,
  HackerNewsWidgetConfig,
  LobstersWidgetConfig,
  RedditWidgetConfig,
  ReleasesWidgetConfig,
  WidgetConfig,
  HatiItem
} from "@/lib/hati/types";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { ErrorCenter } from "@/components/ErrorCenter";

export const revalidate = 300;
export const dynamic = 'force-dynamic';

type WidgetData = HatiItem[];

interface FetchResult {
  widgetKey: string;
  data?: WidgetData;
}

async function fetchVideoData(config: VideoWidgetConfig): Promise<WidgetData> {
  const urls = config.channels.map(
    (id) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`
  );
  const { items } = await runEngine(urls);
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return config.limit ? items.slice(0, config.limit) : items;
}

async function fetchRSSData(config: RSSWidgetConfig): Promise<WidgetData> {
  const urls = config.feeds.map((f) => f.url);
  const { items } = await runEngine(urls);
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return config.limit ? items.slice(0, config.limit) : items;
}

async function fetchHackerNewsData(config: HackerNewsWidgetConfig): Promise<WidgetData> {
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
  return items.filter(Boolean).map((item: any) => ({
    id: String(item.id),
    title: item.title,
    link: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    publishedAt: new Date(item.time * 1000).toISOString(),
    author: item.by,
    platform: 'generic' as const,
  }));
}

async function fetchLobstersData(config: LobstersWidgetConfig): Promise<WidgetData> {
  const limit = config.limit ?? 8;
  const res = await fetch("https://lobste.rs/hottest.json", { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch Lobsters");
  const data = await res.json();
  return data.slice(0, limit).map((item: any) => ({
    id: item.url,
    title: item.title,
    link: item.url,
    publishedAt: item.created_at,
    author: item.submitter,
    platform: 'generic' as const,
  }));
}

async function fetchRedditData(config: RedditWidgetConfig): Promise<WidgetData> {
  const feedUrl = `https://www.reddit.com/r/${config.subreddit}/.rss`;
  const { items } = await runEngine([feedUrl]);
  return items.slice(0, config.limit ?? 8);
}

export default async function Page() {
  const config = await loadConfig("hati.yaml");
  getConfig();
  const page = config.pages[0];

  const fetchPromises: Promise<FetchResult>[] = [];
  const widgetMap = new Map<string, { type: string; config: any }>();

  let widgetIndex = 0;
  for (const col of page.columns) {
    for (const widget of col.widgets) {
      const widgetKey = `widget-${widgetIndex}`;
      widgetMap.set(widgetKey, { type: widget.type, config: widget });
      
      let fetcher: Promise<WidgetData>;
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

  widgetIndex = 0;
  const renderWidget = (widget: any, widIdx: number) => {
    const widgetKey = `widget-${widgetIndex}`;
    const data = dataMap.get(widgetKey);
    widgetIndex++;

    if (widget.type === "calendar") {
      return <CalendarWidget key={widIdx} config={widget as CalendarWidgetConfig} />;
    }
    if (widget.type === "rss") {
      return <RSSWidget key={widIdx} config={widget as RSSWidgetConfig} />;
    }
    if (widget.type === "videos") {
      return <VideoWidgetClient key={widIdx} items={data || []} config={widget as VideoWidgetConfig} />;
    }
    if (widget.type === "weather") {
      return <WeatherWidget key={widIdx} config={widget as WeatherWidgetConfig} />;
    }
    if (widget.type === "hacker-news") {
      return <HackerNewsWidget key={widIdx} config={widget as HackerNewsWidgetConfig} />;
    }
    if (widget.type === "lobsters") {
      return <LobstersWidget key={widIdx} config={widget as LobstersWidgetConfig} />;
    }
    if (widget.type === "reddit") {
      return <RedditWidget key={widIdx} config={widget as RedditWidgetConfig} />;
    }
    if (widget.type === "releases") {
      return <ReleasesWidget key={widIdx} config={widget as ReleasesWidgetConfig} />;
    }
    return (
      <div key={widIdx} className="p-4 rounded-xl border border-dashed border-muted text-muted-foreground text-xs text-center">
        Unknown Widget: {widget.type}
      </div>
    );
  };

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8 px-2 max-w-[1800px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {page.name}
        </h1>
        <div className="flex items-center justify-center gap-2">
          <ErrorCenter initialErrors={[]} />
          <ModeToggle />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto">
        {page.columns.map((col, colIdx) => (
          <Column key={colIdx} size={col.size}>
            {col.widgets.map((widget, widIdx) => renderWidget(widget, widIdx))}
          </Column>
        ))}
      </div>
    </main>
  );
}
