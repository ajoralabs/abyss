import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/download')({
	component: DownloadPage,
});

function DownloadPage() {
	return (
		<div className="download-page">
			<section className="download-hero">
				<div className="container">
					<h1 className="page-title">
						Install <span className="text-gradient">Abyss</span>
					</h1>
					<p className="page-description">
						Run the void on any platform. CLI-first, desktop-ready.
					</p>
				</div>
			</section>

			<section className="download-options section">
				<div className="container">
					<div className="download-cards">
						{/* CLI Card - Primary */}
						<div className="download-card primary">
							<div className="card-badge">Start Here</div>
							<div className="os-icon">⚡</div>
							<h2>Abyss CLI</h2>
							<p className="version">Latest (v0.x)</p>
							<p className="requirements">
								Works on macOS, Windows, Linux, & CI/CD
							</p>

							<div className="cli-install-block">
								<code className="cli-command">
									npm install -g @abysslabs/cli
								</code>
								<span className="cli-copy">Run in terminal</span>
							</div>

							<div className="cli-alternatives text-sm text-gray-500 mt-4">
								Also available via <code>bun</code>, <code>pnpm</code>, and{' '}
								<code>homebrew</code>
							</div>
						</div>

						{/* Desktop App Card - Secondary */}
						<div className="download-card">
							<div className="card-badge secondary">Preview</div>
							<div className="os-icon">🍎</div>
							<h2>macOS Desktop</h2>
							<p className="version">Native Preview</p>
							<p className="requirements">
								Requires macOS Big Sur (11) or later
							</p>
							<div className="flex flex-col gap-2">
								<a href="#" className="btn btn-secondary download-btn">
									Download for Intel
								</a>
								<a href="#" className="btn btn-secondary download-btn">
									Download for Apple Silicon
								</a>
							</div>
							<p className="text-xs text-gray-600 mt-4">
								Windows & Linux desktop apps coming in Q3 2026
							</p>
						</div>
					</div>

					<div className="install-instructions">
						<h3>Next Steps</h3>
						<ol>
							<li>
								Run <code>abyss dev</code> to launch the local GUI server
							</li>
							<li>
								Open <code>http://localhost:4567</code> in your browser
							</li>
							<li>Create your first request collection</li>
						</ol>
					</div>
				</div>
			</section>

			<style>{`
        .download-page {
          padding-top: 64px;
        }

        .download-hero {
          text-align: center;
          padding: var(--spacing-3xl) 0;
          background: radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
        }

        .page-title {
          font-size: var(--font-size-4xl);
          font-weight: 800;
          margin-bottom: var(--spacing-md);
        }

        .page-description {
          font-size: var(--font-size-lg);
          color: var(--color-text-secondary);
        }

        .download-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-3xl);
        }

        .download-card {
          position: relative;
          padding: var(--spacing-xl);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .download-card.primary {
          border-color: var(--color-neon-cyan);
          box-shadow: 0 0 30px -10px rgba(0, 240, 255, 0.15);
        }

        .card-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--color-neon-cyan);
          color: var(--color-bg-primary);
          font-size: var(--font-size-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: var(--radius-full);
        }

        .card-badge.secondary {
          background: var(--color-bg-tertiary);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }

        .os-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-md);
        }

        .download-card h2 {
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin-bottom: var(--spacing-sm);
        }

        .version {
          color: var(--color-primary-light);
          font-size: var(--font-size-sm);
          font-weight: 500;
        }

        .requirements {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-lg);
        }

        .download-btn {
          width: 100%;
          margin-bottom: var(--spacing-sm);
        }

        .cli-install-block {
          background: #000;
          border: 1px solid var(--color-border);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin: 1.5rem 0;
          font-family: var(--font-mono);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cli-command {
          color: var(--color-neon-cyan);
          font-size: 1rem;
        }

        .cli-copy {
          font-size: 0.7rem;
          color: var(--color-text-tertiary);
          text-transform: uppercase;
        }

        .install-instructions {
          max-width: 600px;
          margin: 0 auto;
          padding: var(--spacing-xl);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
        }

        .install-instructions h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
        }

        .install-instructions ol {
          list-style: decimal;
          padding-left: var(--spacing-lg);
        }

        .install-instructions li {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .install-instructions code {
          padding: 2px 6px;
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          font-family: var(--font-mono);
          color: var(--color-neon-cyan);
        }
      `}</style>
		</div>
	);
}
