import { runEngine } from "@/lib/hati/engine";
import { VideoWidgetConfig } from "@/lib/hati/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "New";
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export async function VideoWidget({ config }: { config: VideoWidgetConfig }) {
  const urls = config.channels.map(
    (id) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`
  );

  const items = await runEngine(urls);
  
  // Sort: Newest first
  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const limit = config.limit ?? 4;
  const displayItems = items.slice(0, limit);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {config.title || "Latest Videos"}
        </CardTitle>
        {/* Custom style to match YouTube Red, but using Badge structure */}
        <Badge 
          variant="outline" 
          className="text-[10px] text-red-500 border-red-500/20 bg-red-500/10 font-bold uppercase"
        >
          YouTube
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2"
            >
              {/* Thumbnail with Aspect Ratio */}
              <div className="relative rounded-md overflow-hidden bg-muted border shadow-sm">
                <AspectRatio ratio={16 / 9}>
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </AspectRatio>

                {/* Timestamp Overlay */}
                <div className="absolute bottom-1.5 right-1.5">
                   <Badge 
                     variant="secondary" 
                     className="bg-black/70 hover:bg-black/80 text-white border-white/10 text-[10px] h-5 px-1.5 backdrop-blur-sm"
                   >
                    {formatTimeAgo(item.publishedAt)}
                   </Badge>
                </div>
              </div>

              {/* Video Title & Author */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-tight group-hover:underline decoration-muted-foreground/50 underline-offset-4 line-clamp-2">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.author}
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
