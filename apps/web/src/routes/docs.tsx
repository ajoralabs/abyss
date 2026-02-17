import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/docs')({
  component: DocsPage,
});

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'brew';

const installCommands: Record<PackageManager, { cli: string; sdk: string }> = {
  bun: { cli: 'bun add -g @voidflux/cli', sdk: 'bun add @voidflux/sdk' },
  npm: { cli: 'npm install -g @voidflux/cli', sdk: 'npm install @voidflux/sdk' },
  pnpm: { cli: 'pnpm add -g @voidflux/cli', sdk: 'pnpm add @voidflux/sdk' },
  brew: { cli: 'brew install voidflux', sdk: '— use bun/npm/pnpm for the SDK' },
};

function DocsPage() {
  const [activePm, setActivePm] = useState<PackageManager>('bun');

  const docSections = [
    {
      title: 'Getting Started',
      icon: '⚡',
      items: [
        {
          title: 'Install the CLI',
          description: 'Install @voidflux/cli globally using your preferred package manager',
          code: installCommands[activePm].cli,
        },
        {
          title: 'Quick Start',
          description: 'Launch the GUI server and send your first API request in seconds',
          code: 'voidflux --port 4567',
        },
        {
          title: 'Project Structure',
          description: 'Understand the monorepo layout — apps/cli, apps/web, packages/core',
        },
      ],
    },
    {
      title: 'CLI Reference',
      icon: '▸',
      items: [
        {
          title: 'voidflux',
          description: 'Start the local GUI server and open the web interface',
          code: 'voidflux [--port 4567] [--no-open]',
        },
        {
          title: '--port',
          description: 'Specify a custom port for the GUI server (default: 4567)',
        },
        {
          title: '--no-open',
          description:
            'Start the server without opening a browser window — useful for CI/headless environments',
        },
      ],
    },
    {
      title: 'API Testing',
      icon: '◆',
      items: [
        {
          title: 'HTTP Methods',
          description: 'Full support for GET, POST, PUT, PATCH, DELETE, OPTIONS, and HEAD',
        },
        {
          title: 'Request Builder',
          description:
            'Visual editor for headers, query params, body (JSON / Form Data / Raw), and auth tokens',
        },
        {
          title: 'Response Inspector',
          description:
            'Syntax-highlighted response viewer with timing breakdowns, headers, and status codes',
        },
        {
          title: 'Collections',
          description: 'Organize requests into nested collections with drag-and-drop reordering',
        },
      ],
    },
    {
      title: 'Authentication',
      icon: '⛋',
      items: [
        {
          title: 'Better Auth',
          description:
            'Built-in email/password authentication powered by Better Auth with session management',
        },
        {
          title: 'Organizations',
          description:
            'Multi-tenant workspace support — invite team members and manage access per organization',
        },
        {
          title: 'Request Auth',
          description:
            'Bearer tokens, Basic Auth, API Key (header or query), with OAuth 2.0 coming soon',
        },
      ],
    },
    {
      title: 'Tunneling',
      icon: '◎',
      items: [
        {
          title: 'Adapter System',
          description: 'Pluggable tunnel adapters for exposing local servers to the internet',
        },
        {
          title: 'BYOK',
          description: 'Bring Your Own Key — use your ngrok, Cloudflare, or outray.dev credentials',
        },
        {
          title: 'Custom Adapters',
          description: 'Implement the TunnelAdapter interface to use any tunneling provider',
        },
      ],
    },
    {
      title: '@voidflux/sdk',
      icon: '◈',
      items: [
        {
          title: 'Install the SDK',
          description: 'Add @voidflux/sdk to your project for programmatic API testing',
          code: installCommands[activePm].sdk,
        },
        {
          title: 'Programmatic Requests',
          description: 'Send HTTP requests and assert responses from your test suite or scripts',
        },
        {
          title: 'Collection Runner',
          description: 'Execute an entire collection of requests in sequence with shared variables',
        },
        {
          title: 'CI/CD Integration',
          description: 'Run VoidFlux collections in GitHub Actions, GitLab CI, or any CI pipeline',
        },
      ],
    },
    {
      title: 'Environment & Variables',
      icon: '⬡',
      items: [
        {
          title: 'Environment Variables',
          description: 'Define and switch between dev, staging, and production variable sets',
        },
        {
          title: 'Dynamic Interpolation',
          description: 'Use {{variables}} in URLs, headers, query params, and request bodies',
        },
        {
          title: 'Import & Export',
          description: 'Import collections from Postman/Insomnia, export as JSON or cURL',
        },
      ],
    },
  ];

  return (
    <div className="docs-page">
      <section className="docs-hero">
        <div className="container">
          <div className="docs-hero-badge">DOCUMENTATION</div>
          <h1 className="docs-hero-title">
            Learn <span className="text-gradient">VoidFlux</span>
          </h1>
          <p className="docs-hero-description">
            Everything you need to install, configure, and master the open-source API testing
            toolkit.
          </p>

          <div className="docs-install-tabs">
            <div className="docs-pm-tabs">
              {(['bun', 'npm', 'pnpm', 'brew'] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  className={`docs-pm-tab ${activePm === pm ? 'active' : ''}`}
                  onClick={() => setActivePm(pm)}
                >
                  {pm}
                </button>
              ))}
            </div>
            <div className="docs-install-commands">
              <div className="docs-install-row">
                <span className="docs-install-label">CLI</span>
                <code className="docs-install-code">{installCommands[activePm].cli}</code>
              </div>
              <div className="docs-install-row">
                <span className="docs-install-label">SDK</span>
                <code className="docs-install-code">{installCommands[activePm].sdk}</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="docs-content">
        <div className="container">
          <div className="docs-grid">
            {docSections.map((section) => (
              <div key={section.title} className="docs-section">
                <div className="docs-section-header">
                  <span className="docs-section-icon">{section.icon}</span>
                  <h2 className="docs-section-title">{section.title}</h2>
                </div>
                <div className="docs-items">
                  {section.items.map((item) => (
                    <div key={item.title} className="docs-item">
                      <h3 className="docs-item-title">{item.title}</h3>
                      <p className="docs-item-desc">{item.description}</p>
                      {item.code && <code className="docs-item-code">{item.code}</code>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="docs-cta">
            <div className="docs-cta-inner">
              <h3>Can't find what you need?</h3>
              <p>
                Check the GitHub repository for the latest guides, issues, and community
                discussions.
              </p>
              <div className="docs-cta-actions">
                <a
                  href="https://github.com/your-username/voidflux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-cta-btn primary"
                >
                  <span>View on GitHub</span>
                  <span className="docs-cta-arrow">→</span>
                </a>
                <a
                  href="https://github.com/your-username/voidflux/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-cta-btn"
                >
                  <span>Report an Issue</span>
                  <span className="docs-cta-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .docs-page {
          padding-top: 64px;
        }

        .docs-hero {
          text-align: center;
          padding: 5rem 1.5rem 3rem;
          position: relative;
          overflow: hidden;
        }

        .docs-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(0, 240, 255, 0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .docs-hero-badge {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--color-neon-cyan);
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 0.35rem 1rem;
          border-radius: 9999px;
          margin-bottom: 1.5rem;
        }

        .docs-hero-title {
          font-family: var(--font-brand);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          color: white;
        }

        .docs-hero-description {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.5);
          max-width: 520px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        .docs-install-tabs {
          display: inline-flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          overflow: hidden;
          min-width: 300px;
          text-align: left;
        }

        .docs-pm-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .docs-pm-tab {
          flex: 1;
          padding: 0.6rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .docs-pm-tab:last-child {
          border-right: none;
        }

        .docs-pm-tab:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.02);
        }

        .docs-pm-tab.active {
          color: var(--color-neon-cyan);
          background: rgba(0, 240, 255, 0.05);
          box-shadow: inset 0 -2px 0 0 var(--color-neon-cyan);
        }

        .docs-install-commands {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .docs-install-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .docs-install-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          width: 24px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .docs-install-code {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--color-neon-cyan);
        }

        .docs-content {
          padding: 3rem 1.5rem 5rem;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .docs-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: border-color 0.2s ease;
        }

        .docs-section:hover {
          border-color: rgba(0, 240, 255, 0.15);
        }

        .docs-section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .docs-section-icon {
          font-size: 1.1rem;
          color: var(--color-neon-cyan);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 240, 255, 0.06);
          border-radius: 0.375rem;
        }

        .docs-section-title {
          font-family: var(--font-brand);
          font-size: 1rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.01em;
        }

        .docs-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .docs-item {
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          cursor: default;
        }

        .docs-item:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(3px);
        }

        .docs-item-title {
          font-family: var(--font-brand);
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }

        .docs-item-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.5;
        }

        .docs-item-code {
          display: inline-block;
          margin-top: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-neon-cyan);
          padding: 0.2rem 0.5rem;
          background: rgba(0, 240, 255, 0.05);
          border: 1px solid rgba(0, 240, 255, 0.1);
          border-radius: 0.25rem;
        }

        .docs-cta {
          max-width: 700px;
          margin: 0 auto;
        }

        .docs-cta-inner {
          text-align: center;
          padding: 2.5rem 2rem;
          background: linear-gradient(145deg, rgba(31, 41, 55, 0.4), rgba(17, 24, 39, 0.6));
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          backdrop-filter: blur(12px);
        }

        .docs-cta h3 {
          font-family: var(--font-brand);
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .docs-cta p {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .docs-cta-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .docs-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .docs-cta-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .docs-cta-btn.primary {
          background: rgba(0, 240, 255, 0.08);
          border-color: rgba(0, 240, 255, 0.2);
          color: var(--color-neon-cyan);
        }

        .docs-cta-btn.primary:hover {
          background: rgba(0, 240, 255, 0.14);
          border-color: rgba(0, 240, 255, 0.35);
        }

        .docs-cta-arrow {
          transition: transform 0.2s ease;
        }

        .docs-cta-btn:hover .docs-cta-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 680px) {
          .docs-grid {
            grid-template-columns: 1fr;
          }

          .docs-hero-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
