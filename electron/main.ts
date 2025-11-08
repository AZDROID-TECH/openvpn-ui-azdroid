import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import log from 'electron-log/main';
import * as configService from '../src/services/configService';
import * as vpnService from '../src/services/vpnService';

// DÜZƏLİŞ: Gözlənilməz bağlanmanın qarşısını almaq üçün SIGHUP siqnalını görməzdən gəlirik.
// Bu, xüsusilə arxa planda terminal olmadan işləyən paketlənmiş tətbiqlərdə
// sudo-prompt/pkexec kimi alətlərin tətbiqi bağlamasının qarşısını alır.
process.on('SIGHUP', () => {
  log.warn('Received SIGHUP signal. Ignoring to prevent unexpected shutdown.');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DIST = path.join(__dirname, '../dist');
process.env.DIST_ELECTRON = path.join(__dirname, '../dist-electron');

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

log.initialize();
log.info('App starting...');

let win: BrowserWindow | null;
let isQuitting = false;

function createWindow() {
  log.info('Creating main window...');
  win = new BrowserWindow({
    width: 380,
    height: 580,
    resizable: false,
    frame: false,
    icon: path.join(__dirname, '../build/icons/512x512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

// == Lifecycle Events ==
app.on('window-all-closed', async () => {
  isQuitting = true;
  if (process.platform !== 'darwin') {
    log.info('All windows closed. Checking if VPN is running before quit.');
    const isRunning = await vpnService.isVpnRunning();
    if (isRunning) {
        vpnService.killVpnProcess(() => app.quit());
    } else {
        app.quit();
    }
    win = null;
  }
});

app.whenReady().then(createWindow);

// == IPC Handlers ==

// -- App Actions --
ipcMain.on('quit-app', async () => {
  isQuitting = true;
  log.info('Quit app requested. Checking if VPN is running before quit.');
  const isRunning = await vpnService.isVpnRunning();
  if (isRunning) {
    vpnService.killVpnProcess(() => app.quit());
  } else {
    app.quit();
  }
});

ipcMain.on('minimize-app', () => {
  win?.minimize();
});

// -- Config Actions --
ipcMain.handle('get-initial-config', async () => {
  const ovpnConfig = configService.getOvpnConfig();
  const credentials = await configService.getCredentials();
  return {
    hasConfig: !!(ovpnConfig && credentials)
  };
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(win!, {
    properties: ['openFile'],
    filters: [{ name: 'OpenVPN Konfiqurasiyası', extensions: ['ovpn'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    configService.saveOvpnConfig(content);
    return true;
  }
  return false;
});

ipcMain.handle('save-credentials', async (event, credentials) => {
  await configService.saveCredentials(credentials);
  return true;
});

ipcMain.handle('reset-app', async () => {
    log.info('Reset app requested. Checking if VPN is running.');
    const isRunning = await vpnService.isVpnRunning();
    if (isRunning) {
        vpnService.killVpnProcess(async () => {
            await configService.deleteConfig();
        });
    } else {
        await configService.deleteConfig();
    }
    return true;
});

// -- VPN Actions --
ipcMain.on('connect-vpn', async () => {
    const ovpnConfig = configService.getOvpnConfig();
    const credentials = await configService.getCredentials();
    if (ovpnConfig && credentials) {
        vpnService.connect(ovpnConfig, credentials);
    } else {
        log.error('Attempted to connect without full configuration.');
    }
});

ipcMain.on('disconnect-vpn', () => {
    vpnService.disconnect();
});

// == VPN Service Event Listeners ==
vpnService.vpnEmitter.on('vpn-status-changed', (status) => {
    try {
        if (!isQuitting && win && !win.isDestroyed()) {
            win.webContents.send('vpn-status-changed', status);
        }
    } catch (error) {
        log.warn('IPC message "vpn-status-changed" could not be sent. The window was likely destroyed.', error);
    }
});

vpnService.vpnEmitter.on('auth-failed', () => {
    try {
        if (!isQuitting && win && !win.isDestroyed()) {
            win.webContents.send('auth-failed');
        }
    } catch (error) {
        log.warn('IPC message "auth-failed" could not be sent. The window was likely destroyed.', error);
    }
});