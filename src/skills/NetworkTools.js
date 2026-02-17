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
exports.WhoisTool = exports.DnsLookupTool = exports.NetworkTool = void 0;
const Logger_1 = require("../utils/Logger");
const child_process = __importStar(require("child_process"));
const util = __importStar(require("util"));
const dns = __importStar(require("dns"));
const net = __importStar(require("net"));
const exec = util.promisify(child_process.exec);
class NetworkTool {
    constructor() {
        this.name = 'network_operations';
        this.description = 'Perform various network operations (ping, traceroute, port check)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const host = params.host;
            const port = params.port;
            if (!operation) {
                return { success: false, error: 'operation is required (ping, port_check, resolve)' };
            }
            if (!host) {
                return { success: false, error: 'host is required' };
            }
            switch (operation.toLowerCase()) {
                case 'ping':
                    // Ping a host
                    return await this.pingHost(host);
                case 'port_check':
                    if (!port) {
                        return { success: false, error: 'port is required for port_check operation' };
                    }
                    // Check if a port is open on a host
                    return await this.checkPort(host, port);
                case 'resolve':
                    // Resolve hostname to IP
                    return await this.resolveHostname(host);
                case 'traceroute':
                    // Trace route to host (simulated)
                    return {
                        success: true,
                        data: {
                            host,
                            hops: [], // In a real implementation, this would contain hop data
                            message: 'Traceroute operation (simulated for security)'
                        }
                    };
                default:
                    return { success: false, error: 'Invalid operation. Use: ping, port_check, resolve, traceroute' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Network operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async pingHost(host) {
        try {
            // Using Node.js native functionality to check connectivity
            // In a real implementation, we could use ICMP ping or HTTP request
            const isIP = net.isIP(host);
            if (isIP === 0) {
                // Try to resolve hostname first
                try {
                    await this.resolveHostname(host);
                }
                catch (resolveError) {
                    return { success: false, error: `Could not resolve hostname: ${resolveError.message}` };
                }
            }
            // Simulate ping by attempting to connect to common ports
            const portsToTry = [80, 443, 22];
            for (const port of portsToTry) {
                const portResult = await this.checkPort(host, port);
                if (portResult.success) {
                    return {
                        success: true,
                        data: {
                            host,
                            reachable: true,
                            testedPort: port,
                            message: `Host appears reachable (port ${port} is accessible)`
                        }
                    };
                }
            }
            return {
                success: true,
                data: {
                    host,
                    reachable: false,
                    message: 'Host not reachable on common ports'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async checkPort(host, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            const timeout = setTimeout(() => {
                socket.destroy();
                resolve({
                    success: true,
                    data: {
                        host,
                        port,
                        open: false,
                        message: `Port ${port} is closed or filtered`
                    }
                });
            }, 5000); // 5 second timeout
            socket.connect(port, host, () => {
                clearTimeout(timeout);
                socket.end();
                resolve({
                    success: true,
                    data: {
                        host,
                        port,
                        open: true,
                        message: `Port ${port} is open`
                    }
                });
            });
            socket.on('error', () => {
                clearTimeout(timeout);
                socket.destroy();
                resolve({
                    success: true,
                    data: {
                        host,
                        port,
                        open: false,
                        message: `Port ${port} is closed or host is unreachable`
                    }
                });
            });
        });
    }
    async resolveHostname(hostname) {
        return new Promise((resolve) => {
            dns.lookup(hostname, (err, address, family) => {
                if (err) {
                    resolve({ success: false, error: err.message });
                }
                else {
                    resolve({
                        success: true,
                        data: {
                            hostname,
                            ip: address,
                            family: family === 4 ? 'IPv4' : 'IPv6',
                            message: 'Hostname resolved successfully'
                        }
                    });
                }
            });
        });
    }
}
exports.NetworkTool = NetworkTool;
class DnsLookupTool {
    constructor() {
        this.name = 'dns_lookup';
        this.description = 'Perform DNS lookups (A, AAAA, MX, TXT records)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const hostname = params.hostname;
            const recordType = params.recordType || 'A';
            if (!hostname) {
                return { success: false, error: 'hostname is required' };
            }
            switch (recordType.toUpperCase()) {
                case 'A':
                    return await this.lookupARecord(hostname);
                case 'AAAA':
                    return await this.lookupAAAARecord(hostname);
                case 'MX':
                    return await this.lookupMXRecord(hostname);
                case 'TXT':
                    return await this.lookupTXTRecord(hostname);
                case 'CNAME':
                    return await this.lookupCNAMERecord(hostname);
                case 'PTR':
                    return await this.lookupPTRRecord(hostname);
                case 'ALL':
                    // Get all record types
                    const results = {};
                    const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'CNAME'];
                    for (const type of recordTypes) {
                        try {
                            const result = await this.execute({ hostname, recordType: type });
                            if (result.success) {
                                results[type] = result.data;
                            }
                        }
                        catch (subError) {
                            results[type] = { error: subError.message };
                        }
                    }
                    return {
                        success: true,
                        data: {
                            hostname,
                            records: results,
                            message: 'DNS lookup for all record types completed'
                        }
                    };
                default:
                    return { success: false, error: 'Invalid record type. Use: A, AAAA, MX, TXT, CNAME, PTR, ALL' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`DNS lookup failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async lookupARecord(hostname) {
        return new Promise((resolve) => {
            dns.resolve4(hostname, (err, addresses) => {
                if (err) {
                    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                        resolve({
                            success: true,
                            data: {
                                hostname,
                                recordType: 'A',
                                addresses: [],
                                message: 'No A records found'
                            }
                        });
                    }
                    else {
                        resolve({ success: false, error: err.message });
                    }
                }
                else {
                    resolve({
                        success: true,
                        data: {
                            hostname,
                            recordType: 'A',
                            addresses,
                            message: 'A record lookup successful'
                        }
                    });
                }
            });
        });
    }
    async lookupAAAARecord(hostname) {
        return new Promise((resolve) => {
            dns.resolve6(hostname, (err, addresses) => {
                if (err) {
                    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                        resolve({
                            success: true,
                            data: {
                                hostname,
                                recordType: 'AAAA',
                                addresses: [],
                                message: 'No AAAA records found'
                            }
                        });
                    }
                    else {
                        resolve({ success: false, error: err.message });
                    }
                }
                else {
                    resolve({
                        success: true,
                        data: {
                            hostname,
                            recordType: 'AAAA',
                            addresses,
                            message: 'AAAA record lookup successful'
                        }
                    });
                }
            });
        });
    }
    async lookupMXRecord(hostname) {
        return new Promise((resolve) => {
            dns.resolveMx(hostname, (err, addresses) => {
                if (err) {
                    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                        resolve({
                            success: true,
                            data: {
                                hostname,
                                recordType: 'MX',
                                exchanges: [],
                                message: 'No MX records found'
                            }
                        });
                    }
                    else {
                        resolve({ success: false, error: err.message });
                    }
                }
                else {
                    resolve({
                        success: true,
                        data: {
                            hostname,
                            recordType: 'MX',
                            exchanges: addresses,
                            message: 'MX record lookup successful'
                        }
                    });
                }
            });
        });
    }
    async lookupTXTRecord(hostname) {
        return new Promise((resolve) => {
            dns.resolveTxt(hostname, (err, records) => {
                if (err) {
                    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                        resolve({
                            success: true,
                            data: {
                                hostname,
                                recordType: 'TXT',
                                records: [],
                                message: 'No TXT records found'
                            }
                        });
                    }
                    else {
                        resolve({ success: false, error: err.message });
                    }
                }
                else {
                    // Flatten the TXT records array (dns returns array of arrays)
                    const flatRecords = records.flat();
                    resolve({
                        success: true,
                        data: {
                            hostname,
                            recordType: 'TXT',
                            records: flatRecords,
                            message: 'TXT record lookup successful'
                        }
                    });
                }
            });
        });
    }
    async lookupCNAMERecord(hostname) {
        return new Promise((resolve) => {
            dns.resolveCname(hostname, (err, names) => {
                if (err) {
                    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                        resolve({
                            success: true,
                            data: {
                                hostname,
                                recordType: 'CNAME',
                                aliases: [],
                                message: 'No CNAME records found'
                            }
                        });
                    }
                    else {
                        resolve({ success: false, error: err.message });
                    }
                }
                else {
                    resolve({
                        success: true,
                        data: {
                            hostname,
                            recordType: 'CNAME',
                            aliases: names,
                            message: 'CNAME record lookup successful'
                        }
                    });
                }
            });
        });
    }
    async lookupPTRRecord(hostname) {
        // PTR records are typically looked up by IP address, not hostname
        // This is a simplified implementation
        return {
            success: true,
            data: {
                hostname,
                recordType: 'PTR',
                records: [],
                message: 'PTR lookup would normally be performed on IP address, not hostname'
            }
        };
    }
}
exports.DnsLookupTool = DnsLookupTool;
class WhoisTool {
    constructor() {
        this.name = 'whois_lookup';
        this.description = 'Perform WHOIS lookup for domain information';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const domain = params.domain;
            if (!domain) {
                return { success: false, error: 'domain is required' };
            }
            // For security and practicality, we'll simulate the WHOIS lookup
            // In a real implementation, we might use a WHOIS API service
            // or spawn a whois command with proper sanitization
            return {
                success: true,
                data: {
                    domain,
                    registrar: 'Simulated Registrar Inc.',
                    creationDate: 'Simulated creation date',
                    expirationDate: 'Simulated expiration date',
                    updatedDate: 'Simulated last updated date',
                    registrant: 'Simulated Registrant',
                    administrativeContact: 'Simulated Admin Contact',
                    technicalContact: 'Simulated Tech Contact',
                    nameServers: ['ns1.simulated.com', 'ns2.simulated.com'],
                    status: ['Active', 'Client Transfer Prohibited'],
                    message: 'WHOIS lookup (simulated for security)'
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`WHOIS lookup failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.WhoisTool = WhoisTool;
