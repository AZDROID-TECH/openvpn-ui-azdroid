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

interface StopOptions {
  allowInteractiveElevation: boolean;
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
      if ((error as NodeJS.ErrnoException).code === 'EPERM') {
        log.warn('OpenVPN prosesinə birbaşa siqnal üçün icazə yoxdur (EPERM).');
        return;
      }

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
    await this.stop('SIGTERM', { allowInteractiveElevation: true });
  }

  /**
   * VPN prosesini məcburi dayandırır.
   */
  public async forceStop(): Promise<void> {
    await this.stop('SIGKILL', { allowInteractiveElevation: false });
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
      const runAsUser = os.userInfo().username;
      const elevatedArgs = [...openVpnArgs, '--user', runAsUser];
      log.info(`OpenVPN elevated komanda ilə başladılır: ${this.elevationCommand}`);
      return spawn(this.elevationCommand, elevatedArgs, { stdio: 'pipe' });
    }

    // Əgər elevation aləti yoxdursa birbaşa openvpn çağırırıq.
    return spawn('openvpn', openVpnArgs.slice(1), { stdio: 'pipe' });
  }

  private async stop(signal: StopSignal, options: StopOptions): Promise<void> {
    if (!this.process) {
      return;
    }

    const processRef = this.process;
    const canSignalDirectly = await this.canSignalDirectly(processRef.pid);

    if (canSignalDirectly) {
      try {
        processRef.kill(signal);
      } catch (error) {
        log.warn('Proses kill zamanı xəta baş verdi.', error);
      }
    } else {
      log.info('OpenVPN root istifadəçi ilə işlədiyi üçün birbaşa kill skip edildi.');
    }

    const exitedBySignal = await this.waitForProcessExit(1200);
    if (exitedBySignal) {
      return;
    }

    const pid = await this.readOpenVpnPid();
    const targetPid = pid ?? (processRef.pid ? String(processRef.pid) : null);
    if (!targetPid) {
      return;
    }

    const killArg = signal === 'SIGTERM' ? '-15' : '-9';

    if (this.elevationCommand === 'sudo') {
      // `-n` interaktiv parol soruşmur; beləliklə tətbiq bağlanışında ilişmə olmur.
      spawn('sudo', ['-n', 'kill', killArg, targetPid], { stdio: 'ignore' });
      return;
    }

    if (this.elevationCommand === 'pkexec') {
      const timeoutMs = options.allowInteractiveElevation ? 15000 : 1200;
      const exitCode = await this.spawnAndWait('pkexec', ['kill', killArg, targetPid], timeoutMs);
      if (exitCode !== 0) {
        log.warn(`PKEXEC kill fallback uğursuz oldu. exitCode=${String(exitCode)}`);
      }
      return;
    }

    try {
      process.kill(Number(targetPid), signal);
    } catch (error) {
      log.warn('PID üzrə kill zamanı xəta baş verdi.', error);
    }
  }

  private async canSignalDirectly(pid: number | undefined): Promise<boolean> {
    if (!pid || typeof process.getuid !== 'function') {
      return true;
    }

    try {
      const stats = await fs.stat(`/proc/${pid}`);
      return stats.uid === process.getuid();
    } catch {
      // /proc oxunmazsa mövcud davranışı qoruyub birbaşa kill cəhd edirik.
      return true;
    }
  }

  private async spawnAndWait(command: string, args: string[], timeoutMs: number): Promise<number | null> {
    return new Promise((resolve) => {
      let settled = false;
      const child = spawn(command, args, { stdio: 'ignore' });

      const finish = (code: number | null): void => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(code);
      };

      const timer = setTimeout(() => {
        try {
          child.kill('SIGKILL');
        } catch {
          // noop
        }
        finish(null);
      }, timeoutMs);

      child.on('error', () => {
        clearTimeout(timer);
        finish(-1);
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        finish(code ?? 0);
      });
    });
  }

  private async waitForProcessExit(timeoutMs: number): Promise<boolean> {
    const startedAt = Date.now();
    while (this.process && Date.now() - startedAt < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return this.process === null;
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
