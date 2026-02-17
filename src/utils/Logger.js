"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config");
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
};
winston_1.default.addColors(colors);
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
}));
exports.logger = winston_1.default.createLogger({
    level: config_1.config.logLevel,
    levels,
    format,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level}]: ${message}`;
            })),
        }),
        new winston_1.default.transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        }),
        new winston_1.default.transports.File({
            filename: './logs/combined.log',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        }),
    ],
});
class Logger {
    static error(message, meta) {
        exports.logger.error(message, meta);
    }
    static warn(message, meta) {
        exports.logger.warn(message, meta);
    }
    static info(message, meta) {
        exports.logger.info(message, meta);
    }
    static debug(message, meta) {
        exports.logger.debug(message, meta);
    }
}
exports.Logger = Logger;
