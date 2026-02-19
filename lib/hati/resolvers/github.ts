export async function github(url: string): Promise<string | null> {
  // Fast exit
  if (!url.includes("github.com")) return null;
  
  if (url.endsWith(".atom")) return null
  return `${url.replace(/\/$/, "")}/releases.atom`
}
