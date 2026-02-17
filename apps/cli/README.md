# VoidFlux CLI

VoidFlux CLI is a versatile API development tool that serves both as a local proxy server and a static asset server for the VoidFlux GUI. It empowers you to interact with local and remote APIs safely and securely from a modern web interface.

## ✨ Key Features

- **🚀 Instant API Exploration**: Acts as a proxy, bypassing CORS restrictions and allowing you to test any endpoint (including `http://localhost`).
- **🛡 Secure**: Runs locally on your machine, keeping your credentials and requests private.
- **⚡️ Fast & Simple**: Written in TypeScript/Bun, designed for speed and simplicity. No complex configuration required.
- **🖥 Interactive GUI**: Serves the VoidFlux GUI (React app) directly from the CLI. Just run `voidflux` and open your browser.
- **🚪 Tunneling (Coming Soon)**: Expose your local servers to the internet with secure tunneling.

## 🛠 Tech Stack

- **Runtime**: Bun (or Node.js via compatibility layer)
- **Framework**: Hono (Lightweight web framework)
- **Command Line Parsing**: Commander.js / CAC
- **Features**:
  - `GET /api/proxy`: Proxies HTTP requests to target URLs.
  - `GET /`: Serves the static GUI assets from `dist` folder.
  - `open-browser`: Utilities to automatically launch your default browser.

## 📦 Getting Started

### Installation

```bash
# Global installation (recommended)
npm install -g @voidflux/cli
# OR
bun add -g @voidflux/cli

# Run the CLI
voidflux
```

Wait for the output:
```
✔ Interface Active at http://localhost:4567
✔ Visual Interface Launched
```

### Development

To start the CLI in development mode (watcher enabled):

```bash
cd apps/cli
bun install
bun run dev
```

The server will start on port `4567` by default.

### Configuration

You can configure the port via environment variables or flags (TBD).
Default Port: `4567`
Proxy Route: `/api/proxy`

## 🤝 Contributing

Check out `apps/gui/ROADMAP.md` for overall project goals.

## 📄 License

MIT
