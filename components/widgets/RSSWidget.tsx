
import { runEngine } from "@/lib/hati/engine";
import { RSSWidget as RSSConfig } from "@/lib/hati/config";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Just now";
  if (hours < 1) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return Math.floor(hours / 24) + "d ago";
}

export async function RSSWidget({ config }: { config: RSSConfig }) {
  const urls = config.feeds.map(f => f.url);
  const items = await runEngine(urls);

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const displayItems = items.slice(0, config.limit ?? 5);

  return (
    // bg-card / text-card-foreground handles the theme background
    <div className="bg-card text-card-foreground border rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b flex justify-between items-center bg-muted/20">
        <h3 className="font-semibold text-sm">
          {config.feeds.length === 1 ? config.feeds[0].title : "Feeds"}
        </h3>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold border px-1.5 rounded">
          RSS
        </span>
      </div>

      {/* Content List */}
      <div className="divide-y">
        {displayItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            className="group block px-5 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-1">
              {/* Primary Text */}
              <span className="text-[13px] font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </span>

              {/* Meta Data (Muted) */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {item.feedTitle?.slice(0, 20)}
                </span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground">
                  {timeAgo(item.publishedAt)}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
