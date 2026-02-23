import { loadConfig } from "@/lib/hati/config";
import { initCache } from "@/lib/hati/engine/cache";
import { Column } from "@/components/Column";
import { VideoWidget } from "@/components/widgets/VideoWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { RSSWidget } from "@/components/widgets/RSSWidget";
import { ModeToggle } from "@/components/mode-toggle";
import { 
  RSSWidgetConfig, 
  VideoWidgetConfig, 
  WeatherWidgetConfig 
} from "@/lib/hati/types";

export const revalidate = 60;

export default async function Page() {
  await initCache();
  const config = await loadConfig("hati.yaml");
  const page = config.pages[0];

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8 px-2 max-w-[1800px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {page.name}
        </h1>
        <ModeToggle />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto">
        {page.columns.map((col, colIdx) => (
          <Column key={colIdx} size={col.size}>
            {col.widgets.map((widget, widIdx) => {
              
              // 1. Explicit Type Guard for RSS
              if (widget.type === "rss") {
                return <RSSWidget key={widIdx} config={widget as RSSWidgetConfig} />;
              }

              // 2. Explicit Type Guard for Videos
              if (widget.type === "videos") {
                return <VideoWidget key={widIdx} config={widget as VideoWidgetConfig} />;
              }

              // 3. Explicit Type Guard for Weather
              if (widget.type === "weather") {
                return <WeatherWidget key={widIdx} config={widget as WeatherWidgetConfig} />;
              }

              // 4. Fallback for unhandled types
              return (
                <div key={widIdx} className="p-4 rounded-xl border border-dashed border-muted text-muted-foreground text-xs text-center">
                  Unknown Widget: {widget.type}
                </div>
              );
            })}
          </Column>
        ))}
      </div>
    </main>
  );
}
