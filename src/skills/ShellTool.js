"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellTool = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const Logger_1 = require("../utils/Logger");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class ShellTool {
    constructor() {
        this.name = 'shell_execute';
        this.description = 'Execute a shell command';
        this.category = 'shell';
    }
    async execute(params) {
        try {
            const command = params.command;
            if (!command) {
                return { success: false, error: 'command is required' };
            }
            Logger_1.Logger.warn(`Executing shell command: ${command}`);
            const { stdout, stderr } = await execAsync(command, {
                maxBuffer: 1024 * 1024 * 10,
            });
            Logger_1.Logger.info(`Shell command completed`, {
                hasOutput: !!stdout,
                hasError: !!stderr
            });
            return {
                success: true,
                data: {
                    stdout,
                    stderr,
                },
            };
        }
        catch (error) {
            Logger_1.Logger.error(`Shell command failed`, { error: error.message });
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
exports.ShellTool = ShellTool;
