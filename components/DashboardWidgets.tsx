import {
  CalendarWidgetConfig,
  RSSWidgetConfig,
  VideoWidgetConfig,
  WeatherWidgetConfig,
  HackerNewsWidgetConfig,
  LobstersWidgetConfig,
  RedditWidgetConfig,
  ReleasesWidgetConfig,
  HatiItem,
  WidgetConfig
} from "@/lib/hati/types";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { VideoWidgetClient } from "@/components/widgets/VideoWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { RSSWidget } from "@/components/widgets/RSSWidget";
import { HackerNewsWidget } from "@/components/widgets/HackerNewsWidget";
import { LobstersWidget } from "@/components/widgets/LobstersWidget";
import { RedditWidget } from "@/components/widgets/RedditWidget";
import { ReleasesWidget } from "@/components/widgets/ReleasesWidget";

type WidgetData = HatiItem[];

interface DashboardWidgetsProps {
  widget: WidgetConfig;
  data?: WidgetData;
}

export function DashboardWidgets({ widget, data }: DashboardWidgetsProps) {
  switch (widget.type) {
    case "calendar":
      return <CalendarWidget config={widget as CalendarWidgetConfig} />;
    case "rss":
      return <RSSWidget config={widget as RSSWidgetConfig} />;
    case "videos":
      return <VideoWidgetClient items={data || []} config={widget as VideoWidgetConfig} />;
    case "weather":
      return <WeatherWidget config={widget as WeatherWidgetConfig} />;
    case "hacker-news":
      return <HackerNewsWidget config={widget as HackerNewsWidgetConfig} />;
    case "lobsters":
      return <LobstersWidget config={widget as LobstersWidgetConfig} />;
    case "reddit":
      return <RedditWidget config={widget as RedditWidgetConfig} />;
    case "releases":
      return <ReleasesWidget config={widget as ReleasesWidgetConfig} />;
    default:
      return (
        <div className="p-4 rounded-xl border border-dashed border-muted text-muted-foreground text-xs text-center">
          Unknown Widget: {widget.type}
        </div>
      );
  }
}
