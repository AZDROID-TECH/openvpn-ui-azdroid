import { ChildProcessWithoutNullStreams, spawn, spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import log from 'electron-log/main';
import { Credentials } from '../../src/types/credentials';
import { ConnectionState } from '../../src/types/ipc';

type ElevatedCommand = 'pkexec' | 'sudo';
type StopSignal = 'SIGTERM' | 'SIGKILL';

const SUCCESS_MESSAGE = 'Initialization Sequence Completed';
const AUTH_FAILED_MESSAGE = 'AUTH_FAILED';

interface TempFiles {
  workDir: string;
  configPath: string;
  authPath: string;
  pidPath: string;
}

/**
 * OpenVPN prosesini başladır, dayandırır və status hadisələrini yayımlayır.
 */
export class VpnManager extends EventEmitter {
  private process: ChildProcessWithoutNullStreams | null = null;
  private tempFiles: TempFiles | null = null;
  private elevationCommand: ElevatedCommand | null = null;

  constructor() {
    super();
    this.elevationCommand = this.detectElevationCommand();
  }

  /**
   * Aktiv proses olub-olmadığını qaytarır.
   */
  public isRunning(): boolean {
    return this.process !== null;
  }

  /**
   * VPN bağlantısını başladır.
   */
  public async connect(ovpnConfig: string, credentials: Credentials): Promise<void> {
    if (this.process) {
      log.warn('VPN artıq işləyir, yeni connect sorğusu ignor edildi.');
      return;
    }

    if (!credentials.username || !credentials.password) {
      throw new Error('Credentials tam deyil.');
    }

    this.tempFiles = await this.prepareTempFiles(ovpnConfig, credentials);
    this.process = this.startOpenVpnProcess(this.tempFiles);
    this.emitStatus('connecting');

    this.process.stdout.on('data', (buffer: Buffer) => {
      const output = buffer.toString();
      log.info(`OpenVPN stdout: ${output}`);

      if (output.includes(SUCCESS_MESSAGE)) {
        this.emitStatus('connected');
      }

      if (output.includes(AUTH_FAILED_MESSAGE)) {
        this.emit('auth-failed');
        void this.disconnect();
      }
    });

    this.process.stderr.on('data', (buffer: Buffer) => {
      const output = buffer.toString();
      log.warn(`OpenVPN stderr: ${output}`);

      if (output.includes(AUTH_FAILED_MESSAGE)) {
        this.emit('auth-failed');
        void this.disconnect();
      }

      if (
        output.toLowerCase().includes('permission denied') ||
        output.toLowerCase().includes('authentication failure') ||
        output.toLowerCase().includes('a terminal is required')
      ) {
        this.emitStatus('error');
      }
    });

    this.process.on('error', async (error) => {
      log.error('OpenVPN spawn xətası:', error);
      this.emitStatus('error');
      await this.cleanupAfterExit();
    });

    this.process.on('close', async (code) => {
      log.info(`OpenVPN prosesi bağlandı. code=${code}`);
      await this.cleanupAfterExit();
      this.emitStatus('disconnected');
    });
  }

  /**
   * VPN prosesini normal şəkildə dayandırır.
   */
  public async disconnect(): Promise<void> {
    await this.stop('SIGTERM');
  }

  /**
   * VPN prosesini məcburi dayandırır.
   */
  public async forceStop(): Promise<void> {
    await this.stop('SIGKILL');
  }

  private emitStatus(status: ConnectionState): void {
    this.emit('status-changed', status);
  }

  private detectElevationCommand(): ElevatedCommand | null {
    const pkexecExists = spawnSync('which', ['pkexec'], { stdio: 'ignore' }).status === 0;
    if (pkexecExists) {
      return 'pkexec';
    }

    const sudoExists = spawnSync('which', ['sudo'], { stdio: 'ignore' }).status === 0;
    if (sudoExists) {
      return 'sudo';
    }

    return null;
  }

  private startOpenVpnProcess(files: TempFiles): ChildProcessWithoutNullStreams {
    const openVpnArgs = [
      'openvpn',
      '--config',
      files.configPath,
      '--auth-user-pass',
      files.authPath,
      '--writepid',
      files.pidPath,
    ];

    if (this.elevationCommand) {
      log.info(`OpenVPN elevated komanda ilə başladılır: ${this.elevationCommand}`);
      return spawn(this.elevationCommand, openVpnArgs, { stdio: 'pipe' });
    }

    // Əgər elevation aləti yoxdursa birbaşa openvpn çağırırıq.
    return spawn('openvpn', openVpnArgs.slice(1), { stdio: 'pipe' });
  }

  private async stop(signal: StopSignal): Promise<void> {
    if (!this.process) {
      return;
    }

    const pid = await this.readOpenVpnPid();
    if (pid) {
      const killArg = signal === 'SIGTERM' ? '-15' : '-9';
      if (this.elevationCommand) {
        spawn(this.elevationCommand, ['kill', killArg, pid], { stdio: 'ignore' });
      } else {
        process.kill(Number(pid), signal);
      }
    }

    try {
      this.process.kill(signal);
    } catch (error) {
      log.warn('Proses kill zamanı xəta baş verdi.', error);
    }
  }

  private async prepareTempFiles(ovpnConfig: string, credentials: Credentials): Promise<TempFiles> {
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'openvpn-ui-'));
    const configPath = path.join(workDir, 'client.ovpn');
    const authPath = path.join(workDir, 'auth.txt');
    const pidPath = path.join(workDir, 'openvpn.pid');

    await fs.writeFile(configPath, ovpnConfig, { encoding: 'utf-8', mode: 0o600 });
    await fs.writeFile(authPath, `${credentials.username}\n${credentials.password}`, { encoding: 'utf-8', mode: 0o600 });

    return { workDir, configPath, authPath, pidPath };
  }

  private async readOpenVpnPid(): Promise<string | null> {
    if (!this.tempFiles) {
      return null;
    }

    try {
      const pid = await fs.readFile(this.tempFiles.pidPath, 'utf-8');
      return pid.trim() || null;
    } catch {
      return null;
    }
  }

  private async cleanupAfterExit(): Promise<void> {
    if (this.tempFiles) {
      await fs.rm(this.tempFiles.workDir, { recursive: true, force: true });
    }
    this.tempFiles = null;
    this.process = null;
  }
}

