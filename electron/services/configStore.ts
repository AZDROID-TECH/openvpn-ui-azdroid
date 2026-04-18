import { app } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import keytar from 'keytar';
import log from 'electron-log/main';
import { Credentials } from '../../src/types/credentials';

const CONFIG_DIR = path.join(app.getPath('userData'), 'config');
const OVPN_PATH = path.join(CONFIG_DIR, 'client.ovpn');
const USERNAME_PATH = path.join(CONFIG_DIR, 'username.json');
const SERVICE_NAME = 'openvpn-ui-azdroid';

interface UsernamePayload {
  username: string;
}

async function ensureConfigDir(): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
}

async function readUsernamePayload(): Promise<UsernamePayload | null> {
  try {
    const raw = await fs.readFile(USERNAME_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as UsernamePayload;
    if (!parsed.username) {
      return null;
    }
    return parsed;
  } catch (error) {
    log.warn('Username faylı oxunmadı və ya parse edilmədi.', error);
    return null;
  }
}

/**
 * .ovpn fayl məzmununu təhlükəsiz şəkildə saxlayır.
 */
export async function saveOvpnConfig(ovpnContent: string): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(OVPN_PATH, ovpnContent, { encoding: 'utf-8', mode: 0o600 });
  log.info('OVPN konfiqurasiyası saxlanıldı.');
}

/**
 * İstifadəçi məlumatlarını (username + password) saxlayır.
 */
export async function saveCredentials(credentials: Credentials): Promise<void> {
  if (!credentials.username || !credentials.password) {
    throw new Error('Credentials tam deyil.');
  }

  await ensureConfigDir();
  await fs.writeFile(
    USERNAME_PATH,
    JSON.stringify({ username: credentials.username }),
    { encoding: 'utf-8', mode: 0o600 },
  );
  await keytar.setPassword(SERVICE_NAME, credentials.username, credentials.password);
  log.info('Credentials saxlanıldı.');
}

/**
 * Saxlanmış username-ə görə parolu yeniləyir.
 */
export async function updatePassword(newPassword: string): Promise<void> {
  if (!newPassword) {
    throw new Error('Yeni şifrə boş ola bilməz.');
  }

  const usernamePayload = await readUsernamePayload();
  if (!usernamePayload) {
    throw new Error('Saxlanmış username tapılmadı.');
  }

  await keytar.setPassword(SERVICE_NAME, usernamePayload.username, newPassword);
  log.info('Şifrə yeniləndi.');
}

/**
 * Saxlanmış .ovpn məzmununu qaytarır.
 */
export async function getOvpnConfig(): Promise<string | null> {
  try {
    return await fs.readFile(OVPN_PATH, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Saxlanmış username + password məlumatını qaytarır.
 */
export async function getCredentials(): Promise<Credentials | null> {
  const usernamePayload = await readUsernamePayload();
  if (!usernamePayload) {
    return null;
  }

  const password = await keytar.getPassword(SERVICE_NAME, usernamePayload.username);
  if (!password) {
    return null;
  }

  return {
    username: usernamePayload.username,
    password,
  };
}

/**
 * Başlanğıc vəziyyətini qaytarır.
 */
export async function getInitialConfigState(): Promise<{ hasConfig: boolean }> {
  const [config, credentials] = await Promise.all([getOvpnConfig(), getCredentials()]);
  return { hasConfig: Boolean(config && credentials) };
}

/**
 * Saxlanmış bütün məlumatları silir.
 */
export async function deleteConfig(): Promise<void> {
  const usernamePayload = await readUsernamePayload();
  if (usernamePayload) {
    await keytar.deletePassword(SERVICE_NAME, usernamePayload.username);
  }

  await Promise.allSettled([fs.rm(OVPN_PATH, { force: true }), fs.rm(USERNAME_PATH, { force: true })]);
  log.info('Konfiqurasiya və credentials silindi.');
}

