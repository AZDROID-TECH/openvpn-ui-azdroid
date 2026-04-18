import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import log from 'electron-log/main';
import { Credentials } from '../src/types/credentials';
import { ConnectionState } from '../src/types/ipc';
import * as configStore from './services/configStore';
import { VpnManager } from './services/vpnManager';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DIST = path.join(__dirname, '../dist');
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

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

const vpnManager = new VpnManager();

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

function getIconPath(): string {
  return path.join(__dirname, '../build/icons/512x512.png');
}

function showMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.focus();
}

function createTray(): void {
  if (tray) {
    return;
  }

  try {
    tray = new Tray(getIconPath());
  } catch (error) {
    log.error('Tray yaradıla bilmədi, tray funksiyası deaktiv edildi.', error);
    return;
  }
  tray.setToolTip('OpenVPN UI');

  tray.on('double-click', () => {
    showMainWindow();
  });

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Open OpenVPN UI',
        click: () => showMainWindow(),
      },
      {
        label: 'Quit',
        click: async () => {
          await quitApplication();
        },
      },
    ]),
  );
}

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 580,
    resizable: false,
    frame: false,
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(path.join(process.env.DIST ?? '', 'index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function emitToRenderer(channel: string, payload?: unknown): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  if (typeof payload === 'undefined') {
    mainWindow.webContents.send(channel);
    return;
  }

  mainWindow.webContents.send(channel, payload);
}

function assertCredentials(payload: unknown): asserts payload is Credentials {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('username' in payload) ||
    !('password' in payload) ||
    typeof payload.username !== 'string' ||
    typeof payload.password !== 'string'
  ) {
    throw new Error('Yanlış credentials payload.');
  }
}

async function quitApplication(): Promise<void> {
  isQuitting = true;
  try {
    await vpnManager.forceStop();
  } catch (error) {
    log.warn('VPN dayandırılarkən xəta oldu.', error);
  } finally {
    app.quit();
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle(CHANNELS.config.getInitial, async () => configStore.getInitialConfigState());

  ipcMain.handle(CHANNELS.config.openFileDialog, async () => {
    if (!mainWindow) {
      return false;
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'OpenVPN Configuration', extensions: ['ovpn'] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return false;
    }

    const content = await fs.readFile(result.filePaths[0], 'utf-8');
    await configStore.saveOvpnConfig(content);
    return true;
  });

  ipcMain.handle(CHANNELS.config.saveCredentials, async (_event, payload: unknown) => {
    assertCredentials(payload);
    await configStore.saveCredentials(payload);
  });

  ipcMain.handle(CHANNELS.config.retryAuthWithNewPassword, async (_event, newPassword: unknown) => {
    if (typeof newPassword !== 'string') {
      throw new Error('Yanlış password payload.');
    }

    await configStore.updatePassword(newPassword);
    const [ovpnConfig, credentials] = await Promise.all([
      configStore.getOvpnConfig(),
      configStore.getCredentials(),
    ]);

    if (!ovpnConfig || !credentials) {
      throw new Error('Konfiqurasiya və ya credentials tapılmadı.');
    }

    await vpnManager.forceStop();
    await vpnManager.connect(ovpnConfig, credentials);
  });

  ipcMain.handle(CHANNELS.config.reset, async () => {
    await vpnManager.forceStop();
    await configStore.deleteConfig();
  });

  ipcMain.on(CHANNELS.vpn.connect, async () => {
    const [ovpnConfig, credentials] = await Promise.all([
      configStore.getOvpnConfig(),
      configStore.getCredentials(),
    ]);

    if (!ovpnConfig || !credentials) {
      log.warn('VPN qoşulması üçün lazım olan məlumatlar tam deyil.');
      return;
    }

    await vpnManager.connect(ovpnConfig, credentials);
  });

  ipcMain.on(CHANNELS.vpn.disconnect, async () => {
    await vpnManager.disconnect();
  });

  ipcMain.on(CHANNELS.app.minimizeWindow, () => {
    mainWindow?.minimize();
  });

  ipcMain.on(CHANNELS.app.closeToTray, () => {
    mainWindow?.hide();
  });

}

function registerVpnEvents(): void {
  vpnManager.on('status-changed', (status: ConnectionState) => {
    emitToRenderer(CHANNELS.vpn.statusChanged, status);
  });

  vpnManager.on('auth-failed', () => {
    emitToRenderer(CHANNELS.vpn.authFailed);
  });
}

async function bootstrap(): Promise<void> {
  log.initialize();
  log.info('OpenVPN UI başladılır...');

  // Renderer yüklənməzdən əvvəl IPC handler-ları hazır olmalıdır.
  registerIpcHandlers();
  registerVpnEvents();
  createMainWindow();
  createTray();
}

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('activate', () => {
  if (!mainWindow) {
    createMainWindow();
    return;
  }

  showMainWindow();
});

app.on('window-all-closed', () => {
  // Tray əsaslı davranış üçün tətbiqi açıq saxlayırıq.
});

app.whenReady().then(() => {
  void bootstrap().catch((error) => {
    log.error('Bootstrap zamanı gözlənilməz xəta baş verdi.', error);
  });
});
