import { LobstersWidgetConfig } from "@/lib/hati/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, ArrowUpRight } from "lucide-react";

interface LobstersItem {
  title: string;
  url: string;
  score: number;
  comment_count: number;
  created_at: string;
  comments_url: string;
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (minutes < 1) return "just now";
  if (hours < 1) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function getDomain(url: string) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch {
    return "lobste.rs";
  }
}

async function fetchLobstersItems(limit: number): Promise<LobstersItem[]> {
  try {
    const res = await fetch(
      "https://lobste.rs/hottest.json",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.slice(0, limit);
  } catch {
    return [];
  }
}

export async function LobstersWidget({ config }: { config: LobstersWidgetConfig }) {
  const limit = config.limit ?? 8;
  const items = await fetchLobstersItems(limit);

  return (
    <>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {config.title || "LOBSTERS"}
      </h2>
      <Card className="h-full flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <ul className="flex flex-col py-1">
              {items.map((item, index) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <div className="mt-1.5 shrink-0 w-px self-stretch bg-border group-hover:bg-foreground/20 transition-colors rounded-full" />

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-muted-foreground/40">
                        {item.title}
                      </span>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 shrink-0">
                          <ArrowUpRight className="w-3 h-3" />
                          {item.score}
                        </span>
                        <span className="shrink-0">·</span>
                        <span className="truncate max-w-[100px] text-foreground/70">
                          {getDomain(item.url)}
                        </span>
                        <span className="shrink-0">·</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>
                    </div>

                    <ArrowUpRight className="absolute right-4 top-3.5 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>

                  {index < items.length - 1 && (
                    <Separator className="mx-4 w-auto" />
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
