import { loadConfig, getConfig } from "@/lib/hati/config";
import { fetchVideoData, fetchRSSData, fetchHackerNewsData, fetchLobstersData, fetchRedditData } from "@/lib/hati/widgets";
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

export default async function Page() {
  const config = await loadConfig("hati.yaml");
  getConfig();
  const page = config.pages[0];

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

      <div className="flex flex-wrap gap-6 max-w-[1800px] mx-auto px-2">
        {page.columns.map((col, colIdx) => (
          <Column key={colIdx} size={col.size}>
            {col.widgets.map((widget, widIdx) => renderWidget(widget, widIdx))}
          </Column>
        ))}
      </div>
    </main>
  );
}
