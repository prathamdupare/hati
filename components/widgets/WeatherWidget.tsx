import { WeatherWidgetConfig } from "@/lib/hati/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Snowflake, 
  CloudFog, 
  AlertCircle 
} from "lucide-react";

async function getWeather(location: string) {
  try {
    // wttr.in returns JSON with format=j1
    const res = await fetch(`https://wttr.in/${location}?format=j1`, {
      next: { revalidate: 900 }, // Cache for 15 mins
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function WeatherIcon({ condition }: { condition: string }) {
  const c = condition.toLowerCase();
  const className = "h-12 w-12 text-muted-foreground"; // Standard Shadcn muted color

  if (c.includes("sun") || c.includes("clear")) return <Sun className={className} />;
  if (c.includes("rain") || c.includes("drizzle")) return <CloudRain className={className} />;
  if (c.includes("snow") || c.includes("ice")) return <Snowflake className={className} />;
  if (c.includes("fog") || c.includes("mist")) return <CloudFog className={className} />;
  
  return <Cloud className={className} />;
}

export async function WeatherWidget({ config }: { config: WeatherWidgetConfig }) {
  const data = await getWeather(config.location);

  if (!data) {
    return (
      <Card className="h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-6 w-6" />
          <span className="text-sm font-medium">Weather Unavailable</span>
        </div>
      </Card>
    );
  }

  const current = data.current_condition[0];
  const locationName = data.nearest_area[0].areaName[0].value;
  const conditionDesc = current.weatherDesc[0].value;

  return (
    <Card className=" flex flex-col justify-center">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex flex-col gap-1">
          {/* Temperature */}
          <span className="text-4xl font-bold tracking-tighter">
            {current.temp_C}°C
          </span>
          
          {/* Location & Condition */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-muted-foreground">
              {locationName}
            </span>
            <span className="text-xs text-muted-foreground/80 capitalize">
              {conditionDesc}
            </span>
          </div>
        </div>

        {/* Dynamic Icon */}
        <div className="pl-4">
          <WeatherIcon condition={conditionDesc} />
        </div>
      </CardContent>
    </Card>
  );
}
