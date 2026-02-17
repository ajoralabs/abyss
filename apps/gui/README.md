# VoidFlux GUI

The VoidFlux GUI is a cutting-edge, local-first API client designed for minimal friction and maximum productivity. It runs entirely in your browser but leverages a local CLI proxy to bypass CORS and access local networks.

## ✨ Key Features

- **🚀 Instant API Exploration**: Send HTTP requests (GET, POST, PUT, PATCH, DELETE) with ease.
- **📱 Fully Responsive**: Seamlessly adapts from desktop split-view to mobile stacked-view, perfect for testing on any device.
- **💾 Local-First Persistence**: All your history, collections, and settings are stored locally in your browser. No cloud, no login required.
- **⚡️ Fast & Lightweight**: Built with Vite + React + Tailwind for blazing fast load times and interactions.
- **🛡 Secure Design**: Utilizes a local CLI proxy (`@voidflux/cli`) to securely handle requests without exposing credentials to the cloud.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons), Custom Glassmorphism Theme
- **State Management**: React Context + `useReducer` (Redux-like pattern without the boilerplate)
- **Routing**: React Router DOM v7
- **Storage**: `localStorage` (Wrapped with custom hooks/store)

## 📦 Getting Started

### Development

To start the development server:

```bash
cd apps/gui
bun install
bun run dev
```

The app will be available at `http://localhost:5173`. Make sure the CLI proxy is also running locally (usually `http://localhost:4567`) for API requests to work.

### Production Build

To build the static assets for distribution:

```bash
bun run build
```

The output will be in `apps/gui/dist`.

## 🤝 Contributing

We welcome contributions! Check out `ROADMAP.md` for upcoming features and tasks.

## 📄 License

MIT
