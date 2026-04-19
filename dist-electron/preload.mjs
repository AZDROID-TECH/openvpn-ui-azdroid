"use strict";
const electron = require("electron");
const CHANNELS = {
  config: {
    getInitial: "config:get-initial",
    openFileDialog: "config:open-file-dialog",
    saveCredentials: "config:save-credentials",
    retryAuthWithNewPassword: "config:retry-auth-with-new-password",
    reset: "config:reset"
  },
  vpn: {
    connect: "vpn:connect",
    disconnect: "vpn:disconnect",
    statusChanged: "vpn:status-changed",
    authFailed: "vpn:auth-failed"
  },
  app: {
    minimizeWindow: "app:minimize-window",
    closeToTray: "app:close-to-tray"
  }
};
function onEvent(channel, callback) {
  const listener = (_event, payload) => {
    callback(payload);
  };
  electron.ipcRenderer.on(channel, listener);
  return () => {
    electron.ipcRenderer.removeListener(channel, listener);
  };
}
const api = {
  onVpnStatusChanged: (callback) => onEvent(CHANNELS.vpn.statusChanged, callback),
  onAuthFailed: (callback) => {
    const listener = () => callback();
    electron.ipcRenderer.on(CHANNELS.vpn.authFailed, listener);
    return () => {
      electron.ipcRenderer.removeListener(CHANNELS.vpn.authFailed, listener);
    };
  },
  getInitialConfig: () => electron.ipcRenderer.invoke(CHANNELS.config.getInitial),
  openFileDialog: () => electron.ipcRenderer.invoke(CHANNELS.config.openFileDialog),
  saveCredentials: (credentials) => electron.ipcRenderer.invoke(CHANNELS.config.saveCredentials, credentials),
  retryAuthWithNewPassword: (password) => electron.ipcRenderer.invoke(CHANNELS.config.retryAuthWithNewPassword, password),
  resetApp: () => electron.ipcRenderer.invoke(CHANNELS.config.reset),
  connectVpn: () => {
    electron.ipcRenderer.send(CHANNELS.vpn.connect);
  },
  disconnectVpn: () => {
    electron.ipcRenderer.send(CHANNELS.vpn.disconnect);
  },
  minimizeWindow: () => {
    electron.ipcRenderer.send(CHANNELS.app.minimizeWindow);
  },
  closeToTray: () => {
    electron.ipcRenderer.send(CHANNELS.app.closeToTray);
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
