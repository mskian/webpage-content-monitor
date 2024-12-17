# 📡 Webpage Content Monitor: Track Changes Instantly

A simple and efficient tool to monitor any webpage and receive instant alerts when content changes.  

**Note**  

I primarily built this tool for personal use, and I mostly run it on my home server or localhost. I use Tasker to trigger the URL monitor. This tool is not recommended for production use, as it lacks additional security layers such as header authentication, API keys, or token methods to prevent unauthorized access. However, you are welcome to fork the project and make any changes as needed.  

## Setup

- Download or Clone the repo
- install dependencies

```sh
pnpm install
```

- Development

```sh
pnpm dev
```

- Build a Project

```sh
pnpm build
```

- Start the server

```sh
pnpm start
```

## Routes

- `/` - Static Home Page
- `/api` - API

## Database

- Create Folder Named `data` and create a JSON file to store the URL and Content to Monitor the changes

```sh
mkdir -p data
touch monitored_urls.json
```

## API Usage

- Add URL

```sh
curl -X POST http://localhost:6026/api/monitor \
-H "Content-Type: application/json" \
-d '{"url": "https://example.com"}'
```

- Trigger URL to watch the content update

```sh
curl -X POST http://localhost:6026/api/monitor/trigger \
-H "Content-Type: application/json" \
-d '{"url": "https://example.com"}'
```

- View All Monitored URLS

```sh
curl http://localhost:6026/api/monitor
```

## LICENSE

MIT
