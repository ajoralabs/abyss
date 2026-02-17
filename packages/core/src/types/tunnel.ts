/**
 * Tunnel adapter interface for exposing local servers to the internet.
 * Supports ngrok, outray.dev, and any BYOK provider.
 */
export interface TunnelAdapter {
  /** Human-readable name of the provider (e.g. 'ngrok', 'outray') */
  readonly name: string;

  /** Connect and start the tunnel, returning the public URL */
  connect(config: TunnelConfig): Promise<TunnelConnection>;

  /** Disconnect and tear down the tunnel */
  disconnect(): Promise<void>;
}

export interface TunnelConfig {
  /** Local port to tunnel */
  port: number;

  /** Protocol to tunnel */
  protocol: 'http' | 'tcp' | 'udp';

  /** Optional subdomain hint (provider-dependent) */
  subdomain?: string;

  /** BYOK: user-provided API key for the tunnel provider */
  apiKey?: string;

  /** Additional provider-specific options */
  options?: Record<string, unknown>;
}

export interface TunnelConnection {
  /** The public URL assigned by the tunnel provider */
  url: string;

  /** Disconnect this specific connection */
  close(): Promise<void>;
}
