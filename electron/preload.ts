import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Credentials } from '../src/types/credentials';
import { ConnectionState, InitialConfigResponse, RendererApi } from '../src/types/ipc';

const CHANNELS = {
  config: {
    getInitial: 'config:get-initial',
    openFileDialog: 'config:open-file-dialog',
    saveCredentials: 'config:save-credentials',
    retryAuthWithNewPassword: 'config:retry-auth-with-new-password',
    reset: 'config:reset',
  },
  vpn: {
    connect: 'vpn:connect',
    disconnect: 'vpn:disconnect',
    statusChanged: 'vpn:status-changed',
    authFailed: 'vpn:auth-failed',
  },
  app: {
    minimizeWindow: 'app:minimize-window',
    closeToTray: 'app:close-to-tray',
  },
} as const;

function onEvent<T>(channel: string, callback: (payload: T) => void): () => void {
  const listener = (_event: IpcRendererEvent, payload: T) => {
    callback(payload);
  };

  ipcRenderer.on(channel, listener);
  return () => {
    ipcRenderer.removeListener(channel, listener);
  };
}

/**
 * Renderer prosesinə yalnız whitelist edilmiş, tipli API təqdim edilir.
 */
const api: RendererApi = {
  onVpnStatusChanged: (callback) => onEvent<ConnectionState>(CHANNELS.vpn.statusChanged, callback),
  onAuthFailed: (callback) => {
    const listener = () => callback();
    ipcRenderer.on(CHANNELS.vpn.authFailed, listener);
    return () => {
      ipcRenderer.removeListener(CHANNELS.vpn.authFailed, listener);
    };
  },
  getInitialConfig: () => ipcRenderer.invoke(CHANNELS.config.getInitial) as Promise<InitialConfigResponse>,
  openFileDialog: () => ipcRenderer.invoke(CHANNELS.config.openFileDialog) as Promise<boolean>,
  saveCredentials: (credentials: Credentials) => ipcRenderer.invoke(CHANNELS.config.saveCredentials, credentials) as Promise<void>,
  retryAuthWithNewPassword: (password: string) =>
    ipcRenderer.invoke(CHANNELS.config.retryAuthWithNewPassword, password) as Promise<void>,
  resetApp: () => ipcRenderer.invoke(CHANNELS.config.reset) as Promise<void>,
  connectVpn: () => {
    ipcRenderer.send(CHANNELS.vpn.connect);
  },
  disconnectVpn: () => {
    ipcRenderer.send(CHANNELS.vpn.disconnect);
  },
  minimizeWindow: () => {
    ipcRenderer.send(CHANNELS.app.minimizeWindow);
  },
  closeToTray: () => {
    ipcRenderer.send(CHANNELS.app.closeToTray);
  },
};

contextBridge.exposeInMainWorld('api', api);
