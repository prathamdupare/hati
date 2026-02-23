import { YAML } from "bun"; 
import { HatiConfig } from "./types";


export async function loadConfig(path: string = "hati.yaml"): Promise<HatiConfig> {
  try {
    const file = Bun.file(path);
    const text = await file.text();
    // Bun's YAML parser returns `any`, so we cast it to our strong type
    return YAML.parse(text) as HatiConfig;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Failed to load config from ${path}: ${message}`);
    throw err;
  }
}
