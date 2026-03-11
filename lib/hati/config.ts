import { YAML } from "bun"; 
import { HatiConfig } from "./types";

let loadedConfig: HatiConfig | null = null;

export async function loadConfig(path: string = "hati.yaml"): Promise<HatiConfig> {
  try {
    const file = Bun.file(path);
    const text = await file.text();
    const config = YAML.parse(text) as HatiConfig;
    loadedConfig = config;
    return config;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Failed to load config from ${path}: ${message}`);
    throw err;
  }
}

export function getConfig(): HatiConfig | null {
  return loadedConfig;
}
