"use client";

import { useState } from "react";
import Image from "next/image";
import { VideoWidgetConfig, HatiItem } from "@/lib/hati/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { PlayCircle, ChevronDown, ChevronUp, Youtube } from "lucide-react";

const INITIAL_LIMIT = 6;

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function VideoGrid({ items }: { items: HatiItem[] }) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = items.length > INITIAL_LIMIT;
  const displayItems = expanded ? items : items.slice(0, INITIAL_LIMIT);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative rounded-lg overflow-hidden bg-muted border shadow-sm transition-shadow duration-200 group-hover:shadow-md">
              <AspectRatio ratio={16 / 9}>
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <Youtube className="w-8 h-8 opacity-30" />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/30 backdrop-blur-[1px]">
                  <div className="rounded-full bg-background/80 p-1 shadow-md border border-border/60">
                    <PlayCircle className="w-8 h-8 text-foreground" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="absolute bottom-2 right-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-1.5 font-medium bg-background/75 backdrop-blur-sm border border-border/40 text-foreground"
                  >
                    {formatTimeAgo(item.publishedAt)}
                  </Badge>
                </div>
              </AspectRatio>
            </div>

            <div className="flex flex-col gap-0.5 px-0.5">
              <span className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-muted-foreground/40">
                {item.title}
              </span>
              <span className="text-xs text-muted-foreground truncate mt-0.5">
                {item.author}
              </span>
            </div>
          </a>
        ))}
      </div>

      {hasMore && (
        <>
          <Separator className="mt-1" />
          <div className="flex justify-center pt-1 pb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v: boolean) => !v)}
              className="gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {items.length - INITIAL_LIMIT} more
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

interface VideoWidgetClientProps {
  items: HatiItem[];
  config: VideoWidgetConfig;
}

export function VideoWidgetClient({ items, config }: VideoWidgetClientProps) {
  return (
    <>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {config.title || "LATEST VIDEOS"}
      </h2>
      <Card className="h-full flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-5">
        <VideoGrid items={items} />
      </CardContent>
    </Card>
    </>
  );
}
