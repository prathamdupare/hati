import { runEngine } from "@/lib/hati/engine";
import { RSSWidgetConfig } from "@/lib/hati/types";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rss, ArrowUpRight, Clock } from "lucide-react";

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (minutes < 1) return "Just now";
  if (hours < 1) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export async function RSSWidget({ config }: { config: RSSWidgetConfig }) {
  const urls = config.feeds.map((f) => f.url);
  const { items } = await runEngine(urls);

  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const displayItems = items.slice(0, config.limit ?? 8);
  const isMultiFeed = config.feeds.length > 1;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold tracking-tight uppercase">
          {config.title ||
            (config.feeds.length === 1 ? config.feeds[0].title : "FEEDS")}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <ul className="flex flex-col py-1">
            {displayItems.map((item, index) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  {/* Left accent line — subtle visual rhythm */}
                  <div className="mt-1.5 shrink-0 w-px self-stretch bg-border group-hover:bg-foreground/20 transition-colors rounded-full" />

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-muted-foreground/40 pr-4">
                      {item.title}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {isMultiFeed && item.feedTitle && (
                        <>
                          <span className="font-medium truncate max-w-[120px] text-foreground/70">
                            {item.feedTitle}
                          </span>
                          <span className="shrink-0">·</span>
                        </>
                      )}
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow icon — only on hover */}
                  <ArrowUpRight className="absolute right-4 top-3.5 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>

                {index < displayItems.length - 1 && (
                  <Separator className="mx-5 w-auto" />
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
