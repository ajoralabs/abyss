# Abyss ⚡

**API testing from your terminal (and browser).**

Abyss is a modern, privacy-focused API client that runs in your terminal and renders a beautiful GUI in your browser. All your data stays local.

## Features
- **Local-First**: Your data never leaves your machine.
- **CLI & GUI**: Use the terminal for speed, or the GUI for complex workflows.
- **No Login Required**: Just run `abyss dev` and start testing.
- **Team Sync**: Optional P2P syncing across devices on your local network.

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) v1.0+ (`curl -fsSL https://bun.sh/install | bash`)

### Running Locally
```bash
# Clone the repo
git clone https://github.com/ajoralabs/abyss.git
cd abyss

# Install dependencies
bun install

# Start the dev server (CLI + GUI)
bun dev
```

The GUI will open at `http://localhost:4567`.

## Architecture
- **apps/cli**: The core server and terminal interface. Handles API proxying and local data persistence.
- **apps/gui**: The React frontend. Connects to the CLI server for state management.
- **apps/web**: The marketing website (abyss.dev).

## Distribution
Don't have Bun installed? We provide standalone binaries for macOS, Linux, and Windows. See [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) for instructions on how to build and use them.

## Security
We take security seriously. See our [Security Audit](./SECURITY_AUDIT.md) for details on our architecture and practices.

## License
MIT
