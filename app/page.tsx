import { loadConfig } from "@/lib/hati/config";
import { fetchAllWidgetData } from "@/lib/hati/widgets";
import { Column } from "@/components/Column";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { ErrorCenter } from "@/components/ErrorCenter";
import { ModeToggle } from "@/components/mode-toggle";

export const revalidate = 300;

export default async function Page() {
  const config = await loadConfig("hati.yaml");
  const page = config.pages[0];

  const dataMap = await fetchAllWidgetData(page);

  let widgetIndex = 0;

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
            {col.widgets.map((widget) => {
              const key = `widget-${widgetIndex}`;
              const data = dataMap.get(key);
              widgetIndex++;
              return <DashboardWidgets key={key} widget={widget} data={data} />;
            })}
          </Column>
        ))}
      </div>
    </main>
  );
}
