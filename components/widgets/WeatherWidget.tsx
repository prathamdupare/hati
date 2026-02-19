import { WeatherWidget as WeatherConfig } from "@/lib/hati/config";

async function getWeather(location: string) {
  try {
    const res = await fetch(`https://wttr.in/${location}?format=j1`, {
      next: { revalidate: 900 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function WeatherWidget({ config }: { config: WeatherConfig }) {
  const data = await getWeather(config.location);

  if (!data) {
    return (
      <div className="bg-card text-muted-foreground border rounded-xl p-6 text-sm shadow-sm">
        Weather Unavailable
      </div>
    );
  }

  const current = data.current_condition[0];
  const locationName = data.nearest_area[0].areaName[0].value;

  const condition = current.weatherDesc[0].value.toLowerCase();
  let icon = "☁️";
  if (condition.includes("sun") || condition.includes("clear")) icon = "☀️";
  else if (condition.includes("rain")) icon = "🌧️";
  else if (condition.includes("snow")) icon = "❄️";
  else if (condition.includes("cloud")) icon = "☁️";
  else if (condition.includes("fog") || condition.includes("mist")) icon = "🌫️";

  return (
    <div className="bg-card text-card-foreground border rounded-xl p-6 flex items-center justify-between shadow-sm">
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight">
          {current.temp_C}°C
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {locationName}
        </span>
        <span className="text-xs text-muted-foreground capitalize mt-1">
          {current.weatherDesc[0].value}
        </span>
      </div>

      <div className="text-4xl filter drop-shadow-sm">
        {icon}
      </div>
    </div>
  );
}
