"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMonitorTool = exports.ProcessListTool = exports.SystemInfoTool = void 0;
const Logger_1 = require("../utils/Logger");
const os = __importStar(require("os"));
const fs = __importStar(require("fs/promises"));
class SystemInfoTool {
    constructor() {
        this.name = 'system_info';
        this.description = 'Get system information (CPU, memory, OS)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const infoType = params.infoType || 'all';
            Logger_1.Logger.info(`Getting system information: ${infoType}`);
            const systemInfo = {};
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
                }
                catch (err) {
                    Logger_1.Logger.warn(`Could not get disk info: ${err.message}`);
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
        }
        catch (error) {
            Logger_1.Logger.error(`System info retrieval failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.SystemInfoTool = SystemInfoTool;
class ProcessListTool {
    constructor() {
        this.name = 'process_list';
        this.description = 'List running processes on the system';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const { exec } = await Promise.resolve().then(() => __importStar(require('child_process')));
            const util = await Promise.resolve().then(() => __importStar(require('util')));
            const execAsync = util.promisify(exec);
            Logger_1.Logger.info(`Listing running processes`);
            let command;
            if (os.platform() === 'win32') {
                command = 'tasklist /FO CSV /NH'; // Windows: get CSV output without header
            }
            else {
                command = 'ps -eo pid,ppid,user,%cpu,%mem,comm --no-headers'; // Unix-like
            }
            const { stdout } = await execAsync(command);
            // Parse the output based on platform
            let processes = [];
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
                }).filter(Boolean);
            }
            else {
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
                }).filter(Boolean);
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
        }
        catch (error) {
            Logger_1.Logger.error(`Process list retrieval failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.ProcessListTool = ProcessListTool;
class ResourceMonitorTool {
    constructor() {
        this.name = 'resource_monitor';
        this.description = 'Monitor system resource usage';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const intervalSec = params.intervalSec || 1;
            const count = params.count || 1;
            Logger_1.Logger.info(`Monitoring resources for ${count} times every ${intervalSec}s`);
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
        }
        catch (error) {
            Logger_1.Logger.error(`Resource monitoring failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    getCpuUsage() {
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
exports.ResourceMonitorTool = ResourceMonitorTool;
