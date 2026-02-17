import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/features')({
  component: FeaturesPage,
});

function FeaturesPage() {
  const featureCategories = [
    {
      title: 'Core Testing',
      features: [
        {
          name: 'All HTTP Methods',
          description: 'Support for GET, POST, PUT, PATCH, DELETE, OPTIONS, and HEAD',
        },
        {
          name: 'Request Headers',
          description: 'Add, edit, and manage custom headers for each request',
        },
        { name: 'Query Parameters', description: 'Visual editor for URL query parameters' },
        {
          name: 'Flexible Body',
          description: 'JSON, Form Data (with file/video uploads), URL Encoded, Raw, and Binary',
        },
        {
          name: 'Response Viewer',
          description: 'Pretty-printed JSON, HTML, XML, Video, Image, and Audio previews',
        },
        { name: 'Timing Info', description: 'Detailed timing breakdown for each request' },
      ],
    },
    {
      title: 'AI & Intelligence',
      features: [
        {
          name: 'OpenRouter Integration',
          description: 'Connect to any LLM via OpenRouter for smart assistance',
        },
        {
          name: 'Auto-Scripting',
          description: 'Generate test scripts and assertions automatically using AI',
        },
        {
          name: 'Response Analysis',
          description: 'One-click AI analysis of complex JSON/XML responses to find anomalies',
        },
        {
          name: 'Smart Collections',
          description: 'Ask the AI to generate a full test suite from an OpenAPI spec',
        },
      ],
    },
    {
      title: 'Security & Protocols',
      features: [
        {
          name: 'Pentesting Tools',
          description: 'Native integration with Nuclei and other open-source security scanners',
        },
        {
          name: 'WebSocket & Socket.io',
          description: 'Real-time bidirectional communication testing',
        },
        {
          name: 'GraphQL',
          description: 'Full schema introspection, query building, and variable support',
        },
        {
          name: 'Git Integration',
          description: 'Version control your collections directly with GitHub/GitLab',
        },
      ],
    },
    {
      title: 'Organization',
      features: [
        { name: 'Collections', description: 'Group related requests into organized collections' },
        { name: 'Folders', description: 'Create nested folder structures within collections' },
        { name: 'Request History', description: 'View and replay previous requests' },
        { name: 'Search', description: 'Quickly find requests across all collections' },
      ],
    },
    {
      title: 'Authentication',
      features: [
        { name: 'Bearer Token', description: 'JWT and bearer token authentication' },
        { name: 'Basic Auth', description: 'Username and password authentication' },
        { name: 'API Key', description: 'Header or query parameter API keys' },
        { name: 'OAuth 2.0', description: 'Full OAuth 2.0 flow support (coming soon)' },
      ],
    },
    {
      title: 'Developer Tools',
      features: [
        {
          name: 'In-built Analytics',
          description: 'Visualize request patterns and failures without external tools',
        },
        {
          name: 'Environment Variables',
          description: 'Manage variables across different environments',
        },
        { name: 'Code Generation', description: 'Generate cURL, JavaScript, Python, and more' },
        {
          name: 'Email Testing',
          description: 'Capture and inspect outgoing emails in local development',
        },
      ],
    },
  ];

  return (
    <div className="features-page">
      <section className="features-hero">
        <div className="container">
          <h1 className="page-title">
            Powerful <span className="text-gradient">Features</span>
          </h1>
          <p className="page-description">
            Everything you need to test, debug, and document your APIs.
          </p>
        </div>
      </section>

      <section className="features-list section">
        <div className="container">
          {featureCategories.map((category, idx) => (
            <div key={idx} className="feature-category">
              <h2 className="category-title">{category.title}</h2>
              <div className="category-features">
                {category.features.map((feature, fIdx) => (
                  <div key={fIdx} className="feature-item">
                    <div className="feature-check">✓</div>
                    <div>
                      <h3 className="feature-name">{feature.name}</h3>
                      <p className="feature-desc">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .features-page {
          padding-top: 64px;
        }

        .features-hero {
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
          max-width: 500px;
          margin: 0 auto;
        }

        .feature-category {
          margin-bottom: var(--spacing-3xl);
        }

        .category-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }

        .category-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-md);
        }

        .feature-item {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .feature-item:hover {
          border-color: var(--color-border-hover);
        }

        .feature-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.2);
          color: var(--color-success);
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          flex-shrink: 0;
        }

        .feature-name {
          font-size: var(--font-size-base);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .feature-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
}
