import { createHash } from "crypto"
import { HatiItem } from "../types";

function fingerprint(item: HatiItem) {
  return createHash("sha256")
    .update(item.link + item.title)
    .digest("hex")
}

export function dedupe(items: HatiItem[]) {
  const seen = new Set<string>()
  return items.filter(i => {
    const fp = fingerprint(i)
    if (seen.has(fp)) return false
    seen.add(fp)
    return true
  })
}
