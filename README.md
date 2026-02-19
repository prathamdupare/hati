# Hati

![Version](https://img.shields.io/badge/version-v0.1.0--beta-blue.svg)
![Status](https://img.shields.io/badge/status-skeleton-orange.svg)

**Hati** is a modular dashboard and content aggregation engine built with Next.js. It features a custom resolver engine to fetch and normalize data from various sources (GitHub, Reddit, YouTube, RSS) into a unified widget interface.

> **Note:** This project is currently in **Beta (v0.1.0)**. The core engine ("Skeleton") is stable, but features are actively being added.

## 🚀 Features (v0.1.0)

* **Core Engine:** Custom data fetching and deduplication logic (`lib/hati/engine`).
* **Resolvers:** Built-in support for:
    * GitHub
    * Reddit
    * YouTube
    * RSS Feeds
* **Widgets:** Pre-built UI components for Video, Weather, and RSS feeds.
* **Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Bun, Docker.

## 🛠️ Installation

### Prerequisites
* [Bun](https://bun.sh) (Recommended) or Node.js
* Docker (Optional, for containerized deployment)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/prathamdupare/hati.git](https://github.com/prathamdupare/hati.git)
    cd hati
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Configure the app:**
    Create a `.env` file based on your needs, or modify `hati.yaml` for engine configuration.

4.  **Run the development server:**
    ```bash
    bun dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🐳 Docker Deployment

A `Dockerfile` and `docker-compose.yml` are included for easy deployment.

```bash
docker-compose up -d --build

```

## 🗺️ Roadmap

We are currently in the **Skeleton Phase (v0.1.0)**.

* [x] Core Engine & Caching
* [x] Basic Resolvers (GitHub, YT, Reddit)
* [ ] User Authentication
* [ ] Plugin System for 3rd party widgets
* [ ] Customizable Layouts

## 🤝 Contributing

This project follows Semantic Versioning.

* **Current Branch:** `main` (Development)
* **Current Release:** `v0.1.0`

Please open an issue to discuss proposed changes before submitting a PR.

