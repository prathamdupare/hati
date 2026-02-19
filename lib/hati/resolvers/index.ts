import { youtube } from "./youtube"
import { reddit } from "./reddit"
import { github } from "./github"
import { autodiscovery } from "./autodiscovery"

const resolvers = [youtube, reddit, github, autodiscovery]

export async function resolve(url: string) {
  for (const r of resolvers) {
    const result = await r(url)
    if (result) return result
  }
  return url
}

