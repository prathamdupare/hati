import { runEngine } from "@/lib/hati/engine";
import { VideoWidget as VideoConfig } from "@/lib/hati/config";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "New";
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export async function VideoWidget({ config }: { config: VideoConfig }) {
  const urls = config.channels.map(
    id => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`
  );

  const items = await runEngine(urls);
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const limit = config.limit ?? 4;
  const displayItems = items.slice(0, limit);

  return (
    <div className="bg-card text-card-foreground border rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b flex justify-between items-center bg-muted/20">
        <h3 className="font-semibold text-sm">Latest Videos</h3>
        {/* We keep red here as it is platform branding, but rely on 'destructive' or standard colors for the bg */}
        <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wider font-bold">
          YouTube
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {displayItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2"
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted border shadow-sm">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                  <span className="text-xs">No Image</span>
                </div>
              )}

              {/* Timestamp Badge - Keep dark background for contrast over images */}
              <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-1.5 py-0.5 rounded border border-white/10 shadow-lg">
                {timeAgo(item.publishedAt)}
              </div>
            </div>

            {/* Meta Data */}
            <div className="flex flex-col gap-0.5 px-0.5">
              <span className="text-[13px] font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                {item.author}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
