import { spawn, ChildProcess, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { EventEmitter } from 'events';
import log from 'electron-log/main';
import sudo from 'sudo-prompt';
import { Credentials } from '../types/credentials';

export const vpnEmitter = new EventEmitter();

const SUCCESS_MESSAGE = 'Initialization Sequence Completed';
const AUTH_FAILED_MESSAGE = 'AUTH_FAILED';
const PID_FILE = path.join(os.tmpdir(), 'openvpn.pid');

let vpnProcess: ChildProcess | null = null;

const sudoPromptOptions = {
  name: 'OpenVPN UI',
};

// Clean up leftover PID file on startup
if (fs.existsSync(PID_FILE)) {
    sudo.exec(`rm ${PID_FILE}`, sudoPromptOptions, (error) => {
        if (error) {
            log.warn(`Could not remove leftover PID file on startup: ${error.message}`);
        } else {
            log.info('Removed leftover PID file on startup.');
        }
    });
}

export function isVpnRunning(): Promise<boolean> {
    return new Promise((resolve) => {
        exec('pgrep -x openvpn', (error, stdout) => {
            if (error || !stdout) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

export function connect(ovpnConfig: string, credentials: Credentials): void {
  if (vpnProcess) {
    log.warn('Connect called while a VPN process is already running.');
    return;
  }

  const { username, password } = credentials;
  const authFilePath = path.join(os.tmpdir(), 'ovpn-auth.txt');
  fs.writeFileSync(authFilePath, `${username}\n${password}`, { mode: 0o600 });

  const ovpnPath = path.join(os.tmpdir(), 'config.ovpn');
  fs.writeFileSync(ovpnPath, ovpnConfig);

  const args = ['openvpn', '--config', ovpnPath, '--auth-user-pass', authFilePath, '--writepid', PID_FILE];

  try {
    vpnProcess = spawn('sudo', args, { detached: false });
    vpnEmitter.emit('vpn-status-changed', 'connecting');

    vpnProcess.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      log.info(`VPN Stdout: ${output}`);
      if (output.includes(AUTH_FAILED_MESSAGE)) {
        log.warn('Authentication failed.');
        vpnEmitter.emit('auth-failed');
        killVpnProcess();
      }
      if (output.includes(SUCCESS_MESSAGE)) {
        log.info('VPN connection sequence completed.');
        vpnEmitter.emit('vpn-status-changed', 'connected');
      }
    });

    vpnProcess.stderr?.on('data', (data: Buffer) => {
        const output = data.toString();
        log.error(`VPN Stderr: ${output}`);
        // Handle sudo password prompt cancellation
        if (output.includes('sudo: a password is required')) {
            vpnEmitter.emit('vpn-status-changed', 'disconnected');
        }
    });

    vpnProcess.on('error', (err) => {
      log.error('VPN spawn error:', err);
      vpnEmitter.emit('vpn-status-changed', 'error');
      vpnProcess = null;
    });

    vpnProcess.on('close', (code) => {
      log.info(`VPN process spontaneously closed with code: ${code}`);
      if (fs.existsSync(authFilePath)) fs.unlinkSync(authFilePath);
      if (fs.existsSync(ovpnPath)) fs.unlinkSync(ovpnPath);
      // OpenVPN should remove the PID file on clean exit.
      // If it's a forced kill, we'll clean it on next startup.
      vpnEmitter.emit('vpn-status-changed', 'disconnected');
      vpnProcess = null;
    });
  } catch (error) {
    log.error('Error in connect function:', error);
    vpnEmitter.emit('vpn-status-changed', 'error');
  }
}

function executeKill(signal: '-9' | '-15', onComplete?: () => void) {
    if (!fs.existsSync(PID_FILE)) {
        log.warn('PID file not found. Falling back to pkill.');
        const pkillCommand = `pkill ${signal} openvpn`;
        sudo.exec(pkillCommand, sudoPromptOptions, (error) => {
            if (error) {
                log.error(`sudo-prompt fallback error for command "${pkillCommand}":`, error);
            } else {
                log.info(`Successfully executed fallback "${pkillCommand}".`);
            }
            if (onComplete) onComplete();
        });
        return;
    }

    const pid = fs.readFileSync(PID_FILE, 'utf-8').trim();
    const killCommand = `kill ${signal} ${pid}`;
    log.info(`Executing: ${killCommand} via sudo-prompt...`);
    
    sudo.exec(killCommand, sudoPromptOptions, (error) => {
        if (error) {
            log.error(`sudo-prompt error for command "${killCommand}":`, error);
        } else {
            log.info(`Successfully executed "${killCommand}".`);
        }
        // The 'close' event of vpnProcess will handle the status update and cleanup.
        if (onComplete) {
            onComplete();
        }
    });
}

export function killVpnProcess(onComplete?: () => void): void {
    executeKill('-9', onComplete);
}

export function disconnect(): void {
    executeKill('-15');
}