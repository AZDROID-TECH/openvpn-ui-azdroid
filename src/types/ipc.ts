import { Credentials } from './credentials';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface InitialConfigResponse {
  hasConfig: boolean;
}

export interface RendererApi {
  onVpnStatusChanged(callback: (status: ConnectionState) => void): () => void;
  onAuthFailed(callback: () => void): () => void;
  getInitialConfig(): Promise<InitialConfigResponse>;
  openFileDialog(): Promise<boolean>;
  saveCredentials(credentials: Credentials): Promise<void>;
  retryAuthWithNewPassword(password: string): Promise<void>;
  resetApp(): Promise<void>;
  connectVpn(): void;
  disconnectVpn(): void;
  minimizeWindow(): void;
  closeToTray(): void;
}

