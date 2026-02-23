import { loadConfig } from "@/lib/hati/config";
import { initCache } from "@/lib/hati/engine/cache";
import { Column } from "@/components/Column";
import { VideoWidget } from "@/components/widgets/VideoWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { RSSWidget } from "@/components/widgets/RSSWidget";
import { ModeToggle } from "@/components/mode-toggle";
import {
  CalendarWidgetConfig,
  EngineError,
  RSSWidgetConfig,
  VideoWidgetConfig,
  WeatherWidgetConfig
} from "@/lib/hati/types";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { ErrorCenter } from "@/components/ErrorCenter";

export const dynamic = "force-dynamic"; // ✅ Add this
export default async function Page() {
  await initCache();
  const config = await loadConfig("hati.yaml");
  const page = config.pages[0];

  const allErrors: EngineError[] = [];
  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8 px-2 max-w-[1800px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {page.name}
        </h1>
        <div className="flex items-center justify-center gap-2">
          <ErrorCenter initialErrors={allErrors} />
          <ModeToggle />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto">
        {page.columns.map((col, colIdx) => (
          <Column key={colIdx} size={col.size}>
            {col.widgets.map((widget, widIdx) => {

              if (widget.type === "calendar") {
                return <CalendarWidget key={widIdx} config={widget as CalendarWidgetConfig} />;
              }
              if (widget.type === "rss") {
                return <RSSWidget key={widIdx} config={widget as RSSWidgetConfig} />;
              }

              if (widget.type === "videos") {
                return <VideoWidget key={widIdx} config={widget as VideoWidgetConfig} />;
              }

              if (widget.type === "weather") {
                return <WeatherWidget key={widIdx} config={widget as WeatherWidgetConfig} />;
              }

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
