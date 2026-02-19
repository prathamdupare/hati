import { youtube } from "@/lib/hati/resolvers/youtube"

async function run() {
  const input = process.argv[2]

  if (!input) {
    console.log("Usage:")
    console.log("bun run test-youtube.ts <url>")
    process.exit(1)
  }

  const result = await youtube(input)

  console.log("\nINPUT:")
  console.log(input)

  console.log("\nRESOLVED FEED:")
  console.log(result)
}

run()

