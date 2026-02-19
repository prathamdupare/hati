import { loadConfig } from "@/lib/hati/config";
import { initCache } from "@/lib/hati/engine/cache";
import { Column } from "@/components/Column";
import { VideoWidget } from "@/components/widgets/VideoWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { RSSWidget } from "@/components/widgets/RSSWidget";
import { ModeToggle } from "@/components/mode-toggle";

export const revalidate = 60;

export default async function Page() {
  await initCache();
  const config = await loadConfig("hati.yaml");
  const page = config.pages[0];

  return (
    <main className="min-h-screen bg-background text-primary p-6 md:p-8">
    <div className="flex">

      <h1 className="text-2xl font-bold mb-8 px-2 tracking-tight text-neutral-100">
        {page.name}
      </h1>
      <ModeToggle/>

    </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto">
        {page.columns.map((col, colIdx) => (
          <Column key={colIdx} size={col.size}>
            {col.widgets.map((widget, widIdx) => {

              if (widget.type === "rss") {
                return <RSSWidget key={widIdx} config={widget} />;
              }

              if (widget.type === "videos") {
                return <VideoWidget key={widIdx} config={widget} />;
              }

              if (widget.type === "weather") {
                return <WeatherWidget key={widIdx} config={widget} />;
              }

              const unknownWidget = widget as { type: string };
              return (
                <div key={widIdx} className="p-4 rounded-xl border border-dashed border-neutral-800 text-neutral-600 text-xs text-center">
                  Unknown Widget: {unknownWidget.type}
                </div>
              );
            })}
          </Column>
        ))}
      </div>
    </main>
  );
}
