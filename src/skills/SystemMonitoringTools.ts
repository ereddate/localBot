import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as os from 'os';
import * as fs from 'fs/promises';

export class SystemInfoTool implements Tool {
  name = 'system_info';
  description = 'Get system information (CPU, memory, OS)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const infoType = params.infoType as string || 'all';

      Logger.info(`Getting system information: ${infoType}`);

      const systemInfo: any = {};

      if (infoType === 'all' || infoType === 'os') {
        systemInfo.os = {
          platform: os.platform(),
          arch: os.arch(),
          release: os.release(),
          hostname: os.hostname(),
          uptime: os.uptime(),
          type: os.type()
        };
      }

      if (infoType === 'all' || infoType === 'cpu') {
        systemInfo.cpu = {
          model: os.cpus()[0].model,
          cores: os.cpus().length,
          speed: os.cpus()[0].speed,
          loadAverage: os.loadavg()
        };
      }

      if (infoType === 'all' || infoType === 'memory') {
        systemInfo.memory = {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
        };
      }

      if (infoType === 'all' || infoType === 'disk') {
        // Get basic disk information (for the current working directory)
        try {
          const stats = await fs.stat('.');
          // Note: We can't get full disk space info with fs.stat, we'd need a different approach
          systemInfo.disk = {
            currentDirectory: process.cwd(),
            // On Windows, we'd need to use different methods to get disk space
            note: 'Detailed disk space requires platform-specific tools'
          };
        } catch (err) {
          Logger.warn(`Could not get disk info: ${(err as Error).message}`);
        }
      }

      return {
        success: true,
        data: {
          infoType,
          systemInfo,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      Logger.error(`System info retrieval failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class ProcessListTool implements Tool {
  name = 'process_list';
  description = 'List running processes on the system';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const { exec } = await import('child_process');
      const util = await import('util');
      const execAsync = util.promisify(exec);

      Logger.info(`Listing running processes`);

      let command: string;
      if (os.platform() === 'win32') {
        command = 'tasklist /FO CSV /NH'; // Windows: get CSV output without header
      } else {
        command = 'ps -eo pid,ppid,user,%cpu,%mem,comm --no-headers'; // Unix-like
      }

      const { stdout } = await execAsync(command);

      // Parse the output based on platform
      let processes: any[] = [];
      
      if (os.platform() === 'win32') {
        // Parse Windows tasklist CSV output
        const lines = stdout.trim().split('\n');
        processes = lines.map(line => {
          // Remove quotes and split by comma
          const parts = line.replace(/"/g, '').split(',');
          if (parts.length >= 4) {
            return {
              name: parts[0],
              pid: parts[1],
              status: parts[3]
            };
          }
          return null;
        }).filter(Boolean) as any[];
      } else {
        // Parse Unix ps output
        const lines = stdout.trim().split('\n');
        processes = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 6) {
            return {
              pid: parts[0],
              ppid: parts[1],
              user: parts[2],
              cpu: parts[3],
              mem: parts[4],
              command: parts.slice(5).join(' ')
            };
          }
          return null;
        }).filter(Boolean) as any[];
      }

      return {
        success: true,
        data: {
          processes: processes.slice(0, 50), // Limit to first 50 processes
          count: processes.length,
          platform: os.platform(),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      Logger.error(`Process list retrieval failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class ResourceMonitorTool implements Tool {
  name = 'resource_monitor';
  description = 'Monitor system resource usage';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const intervalSec = (params.intervalSec as number) || 1;
      const count = (params.count as number) || 1;

      Logger.info(`Monitoring resources for ${count} times every ${intervalSec}s`);

      const measurements = [];
      for (let i = 0; i < count; i++) {
        const measurement = {
          timestamp: new Date().toISOString(),
          cpuUsage: this.getCpuUsage(),
          memory: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
            usagePercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
          },
          loadAverage: os.loadavg(),
          uptime: os.uptime()
        };
        
        measurements.push(measurement);
        
        // Wait for the specified interval, except on the last iteration
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, intervalSec * 1000));
        }
      }

      return {
        success: true,
        data: {
          measurements,
          intervalSec,
          count,
          avgCpuUsage: measurements.reduce((sum, m) => sum + (m.cpuUsage || 0), 0) / measurements.length,
          avgMemoryUsage: measurements.reduce((sum, m) => sum + m.memory.usagePercent, 0) / measurements.length
        }
      };
    } catch (error) {
      Logger.error(`Resource monitoring failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private getCpuUsage(): number {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        // @ts-ignore
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    }

    const usage = 100 - (totalIdle / totalTick) * 100;
    return Number(usage.toFixed(2));
  }
}