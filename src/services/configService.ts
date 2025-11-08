import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import keytar from 'keytar';
import log from 'electron-log/main';
import { Credentials } from '../types/credentials';

const CONFIG_DIR = path.join(app.getPath('home'), '.config', 'openvpn-ui-azdroid');
const OVPN_PATH = path.join(CONFIG_DIR, 'config.ovpn');
const USERNAME_PATH = path.join(CONFIG_DIR, 'username.json');
const SERVICE_NAME = 'openvpn-ui-azdroid';

/**
 * .ovpn faylının məzmununu konfiqurasiya qovluğunda saxlayır.
 * @param ovpnContent - .ovpn faylının məzmunu.
 */
export function saveOvpnConfig(ovpnContent: string): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(OVPN_PATH, ovpnContent);
  log.info('OVPN config content saved.');
}

/**
 * İstifadəçi adı və şifrəni təhlükəsiz şəkildə saxlayır.
 * @param credentials - İstifadəçi adı və şifrə.
 */
export async function saveCredentials(credentials: Credentials): Promise<void> {
  // DÜZƏLİŞ: Şifrənin mövcud olduğunu yoxlayırıq.
  if (typeof credentials.password !== 'string') {
    log.error('Attempted to save credentials without a password.');
    return;
  }
  fs.writeFileSync(USERNAME_PATH, JSON.stringify({ username: credentials.username }));
  await keytar.setPassword(SERVICE_NAME, credentials.username, credentials.password);
  log.info('Username and password saved.');
}

/**
 * Saxlanılmış .ovpn konfiqurasiyasını oxuyur.
 * @returns Konfiqurasiya məzmunu və ya null.
 */
export function getOvpnConfig(): string | null {
  if (fs.existsSync(OVPN_PATH)) {
    log.info('OVPN config found and read.');
    return fs.readFileSync(OVPN_PATH, 'utf-8');
  }
  log.warn('OVPN config not found.');
  return null;
}

/**
 * Saxlanılmış istifadəçi məlumatlarını (istifadəçi adı və şifrə) oxuyur.
 * @returns İstifadəçi məlumatları və ya null.
 */
export async function getCredentials(): Promise<Credentials | null> {
  if (fs.existsSync(USERNAME_PATH)) {
    try {
      const { username } = JSON.parse(fs.readFileSync(USERNAME_PATH, 'utf-8'));
      const password = await keytar.getPassword(SERVICE_NAME, username);
      if (username && password) {
        log.info('Credentials found and retrieved.');
        return { username, password };
      }
    } catch (error) {
      log.error('Could not parse username file or get password.', error);
      return null;
    }
  }
  log.warn('Credentials not found.');
  return null;
}

/**
 * Bütün saxlanılmış konfiqurasiya məlumatlarını silir.
 */
export async function deleteConfig(): Promise<void> {
  log.info('Deleting all saved config...');
  try {
    if (fs.existsSync(OVPN_PATH)) {
      fs.unlinkSync(OVPN_PATH);
      log.info('OVPN config file deleted.');
    }
    if (fs.existsSync(USERNAME_PATH)) {
      const { username } = JSON.parse(fs.readFileSync(USERNAME_PATH, 'utf-8'));
      await keytar.deletePassword(SERVICE_NAME, username);
      log.info('Password deleted from keychain.');
      fs.unlinkSync(USERNAME_PATH);
      log.info('Username file deleted.');
    }
    log.info('Config deleted successfully.');
  } catch (error) {
    log.error('Error deleting config:', error);
  }
}
