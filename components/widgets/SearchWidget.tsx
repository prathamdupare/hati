"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { SearchWidgetConfig } from "@/lib/hati/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const ENGINES = {
  google: "https://google.com/search?q=",
  brave: "https://search.brave.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
};
export function SearchWidget({ config }: { config: SearchWidgetConfig }) {
  const [query, setQuery] = useState("");
  const engine = config.engine || "google";
  const baseUrl = ENGINES[engine];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(baseUrl + encodeURIComponent(query), "_blank");
      setQuery("")
    }
  };
  return (
    <>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {config.title || "SEARCH"}
      </h2>
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={`Search with ${engine}...`}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
