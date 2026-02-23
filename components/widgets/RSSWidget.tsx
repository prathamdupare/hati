import { runEngine } from "@/lib/hati/engine";
import { RSSWidgetConfig } from "@/lib/hati/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Just now";
  if (hours < 1) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function RSSWidget({ config }: { config: RSSWidgetConfig }) {
  const urls = config.feeds.map((f) => f.url);
  const items = await runEngine(urls);

  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const displayItems = items.slice(0, config.limit ?? 5);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm">
          {config.title ||
            (config.feeds.length === 1 ? config.feeds[0].title : "Feeds")}
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">RSS</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {displayItems.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator />}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block px-6 py-4 hover:bg-accent"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium leading-none group-hover:underline underline-offset-4">
                      {item.title}
                    </span>

                    <CardDescription className="flex items-center gap-2 text-xs">
                      <span className="max-w-32 truncate font-semibold">
                        {item.feedTitle}
                      </span>
                      <span>{"•"}</span>
                      <span>{formatTimeAgo(item.publishedAt)}</span>
                    </CardDescription>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
