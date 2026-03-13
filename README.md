# Hati

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A self-hosted dashboard that puts all your feeds in one place. Built with Next.js, TypeScript, and Tailwind CSS.

![Hati Dashboard](/content/demo.png)

## Features

Hati fetches and normalizes content from various sources into a unified widget-based interface.

### Supported Widgets

| Widget | Description |
|--------|-------------|
| **RSS** | Aggregate multiple RSS/Atom feeds with per-feed limits |
| **Videos** | YouTube channel videos via RSS feeds |
| **Hacker News** | Top stories from news.ycombinator.com |
| **Lobsters** | Hot stories from lobste.rs |
| **Reddit** | Subreddit posts via RSS feeds |
| **Weather** | Current weather using wttr.in |
| **Calendar** | Simple calendar widget |
| **Search** | Search with Google, Brave, DuckDuckGo, or Bing |

### Tech Stack

- **Framework:** Next.js 16+
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Runtime:** Bun
- **Deployment:** Docker

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (for local development)
- Docker (for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/prathamdupare/hati.git
cd hati

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

Edit `hati.yaml` to customize your dashboard:

```yaml
cache:
  ttl: 300  # Cache duration in seconds

pages:
  - name: My Dashboard
    columns:
      - size: small
        widgets:
          - type: weather
            location: London
          - type: hacker-news
            limit: 10
      - size: medium
        widgets:
          - type: rss
            limit: 10
            feeds:
              - url: https://hnrss.org/frontpage
                title: Hacker News
              - url: https://example.com/feed.xml
      - size: medium
        widgets:
          - type: videos
            limit: 6
            channels:
              - UCsBjURrPoezykLs9EqgamOA  # Fireship
```

#### Widget Configuration

**RSS:**
```yaml
- type: rss
  limit: 10
  feeds:
    - url: https://example.com/feed.xml
      title: My Feed
      limit: 5  # Per-feed limit
```

**Hacker News / Lobsters:**
```yaml
- type: hacker-news
  limit: 10
```

**Reddit:**
```yaml
- type: reddit
  subreddit: programming
  limit: 10
```

**Weather:**
```yaml
- type: weather
  location: Bhopal
  units: metric  # or imperial
```

**Calendar:**
```yaml
- type: calendar
  first-day-of-week: monday  # or sunday
```

**Videos:**
```yaml
- type: videos
  limit: 10
  channels:
    - CHANNEL_ID_1
    - CHANNEL_ID_2
```

**Search:**
```yaml
- type: search
  engine: google  # brave, duckduckgo, bing
```

## Docker Deployment

```bash
# Clone the repository
git clone https://github.com/prathamdupare/hati.git
cd hati

# Build and run
docker-compose up -d --build

# Open in browser
http://localhost:3000
```

The container will:
- Build the Next.js app
- Run on port 3000
- Mount `hati.yaml` for live config changes

## Project Structure

```
hati/
├── app/                    # Next.js app router
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── widgets/           # Dashboard widgets
├── lib/
│   └── hati/
│       ├── engine/        # RSS fetching & parsing
│       ├── config.ts      # Config loading
│       └── types.ts       # TypeScript types
└── hati.yaml              # Dashboard configuration
```

## Contributing

Contributions are welcome! Please open an issue to discuss proposed changes before submitting a PR.

## License

MIT © 2026 Pratham Dupare
