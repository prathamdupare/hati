import { runEngine } from "@/lib/hati/engine";
import { loadConfig } from "@/lib/hati/config";
import { initCache } from "@/lib/hati/engine/cache";

async function test() {
  // 1. Load Cache from disk (Instant speed for run 2)
  await initCache();

  // 2. Load Config
  const config = await loadConfig("hati.yaml");
  
  // 3. Extract URLs (Simple flattener for now)
  const urls: string[] = [];
  
  for (const page of config.pages) {
    for (const col of page.columns) {
      for (const widget of col.widgets) {
        if (widget.type === "rss") {
          urls.push(...widget.feeds.map(f => f.url));
        }
        // Add video/github logic here later
      }
    }
  }

  console.time("Run Engine");
  const items = await runEngine(urls);
  console.timeEnd("Run Engine");

  console.log(`Found ${items.length} items.`);
}

test();
