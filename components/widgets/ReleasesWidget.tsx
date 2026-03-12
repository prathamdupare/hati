import { ReleasesWidgetConfig } from "@/lib/hati/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, Tag } from "lucide-react";

interface Release {
  id: number;
  name: string;
  tag_name: string;
  published_at: string;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
  repository: string;
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1d";
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1mo";
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  return `${years}y`;
}

async function fetchReleases(repo: string, token?: string): Promise<Release[]> {
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=1`,
      { next: { revalidate: 3600 }, headers }
    );
    
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];
    
    return {
      ...data[0],
      repository: repo,
    };
  } catch {
    return [];
  }
}

export async function ReleasesWidget({ config }: { config: ReleasesWidgetConfig }) {
  const { repositories, token, cache } = config;
  
  const releases = await Promise.all(
    repositories.map(repo => fetchReleases(repo, token))
  );
  
  const flatReleases = releases
    .flat()
    .filter(r => r !== null)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  return (
    <>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {config.title || "RELEASES"}
      </h2>
      <Card className="h-full flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <ul className="flex flex-col py-1">
              {flatReleases.map((release, index) => (
                <li key={`${release.repository}-${release.id}`}>
                  <a
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <div className="mt-1.5 shrink-0 w-px self-stretch bg-border group-hover:bg-foreground/20 transition-colors rounded-full" />

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {release.repository}
                      </span>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 shrink-0">
                          <Tag className="w-3 h-3" />
                          {release.tag_name}
                        </span>
                        <span className="shrink-0">·</span>
                        <span className="shrink-0">
                          {formatTimeAgo(release.published_at)}
                        </span>
                      </div>
                    </div>

                    <ArrowUpRight className="absolute right-4 top-3.5 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>

                  {index < flatReleases.length - 1 && (
                    <Separator className="mx-4 w-auto" />
                  )}
                </li>
              ))}
              {flatReleases.length === 0 && (
                <li className="px-4 py-6 text-center text-muted-foreground text-sm">
                  No releases found
                </li>
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
